import { Context, Callback, APIGatewayProxyEvent } from 'aws-lambda';
import { BusinessEvent, ProxyResolver } from './types.d';
import { ResponseBuilder } from './utilities';
import { AWSProxyResolver } from './aws-proxy';
import { Sidecar } from './sidecar';
import  * as uuid from './utils';
import { Validators } from './validators';

const lakeName = 'thisBucket';
const tableName = 'thisTable';
const topicArn = 'thisTopic';
const isLambda = !!(process.env.LAMBDA_TASK_ROOT || false);

var mockResolver: ProxyResolver;

function parseObject(apiEvent: APIGatewayProxyEvent): Promise<string> {

    return new Promise((resolve: Function, reject: Function) => {

        const object = { key: 'value' };
        resolve(JSON.stringify(object));

    });

}

export function injetResolver(resolver: ProxyResolver) { mockResolver = resolver  }

export function handler (event: APIGatewayProxyEvent, context: Context, callback: Callback): void {

    const objectKey = uuid();
    const successEvent: BusinessEvent = {topicArn: topicArn, body: JSON.stringify(event) };

    const resolver: ProxyResolver = isLambda ? new AWSProxyResolver() : mockResolver;
    if (resolver === null || resolver === undefined) {

        const traceId = context.awsRequestId;
        const message = 'Function not Configured: Resource Dispatcher not Found! TraceId:${traceId}';
        publishErrorInContingence(message)

        const response = ResponseBuilder.internalError(message, traceId);
        
        callback(null, response);
        return

    }

    const sidecar = new Sidecar(resolver, context);

    Validators.isValidAPIGatewayEvent(event)
    .then(eventIsValid => sidecar.userIsAuthorizedToPerformOperation(event))
    .then(userIsAuthorized => parseObject(event))
    .then(parsedObject => Promise.all([
        sidecar.persistInTable(tableName, objectKey, parsedObject),
        sidecar.persistOnLake(lakeName, objectKey, event)
    ]))
    .then(persisted => sidecar.publishEvent(successEvent, event))
    .then(eventPublished => sidecar.createResponse(event))
    .then(response => sidecar.sendResponse(response, callback))
    .catch(sidecarError => {
        const response = sidecar.createErrorResponse(sidecarError);
        sidecar.sendResponse(response, callback);
    })

}

/**
 * @param message Error message
 * @return void
 * @description
 * Publish Error messages in situations where the defined loggroup, logstream and
 * error metric could not be instantiated.
 */
function publishErrorInContingence(message: string): void {
    console.error('Publishing Error in Contigence!')
    console.error(message);
}