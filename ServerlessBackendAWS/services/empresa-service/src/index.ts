import { Context, Callback, APIGatewayProxyEvent } from 'aws-lambda';
import { BusinessEvent, ProxyResolver, ServiceError } from './types.d';
import { ResponseBuilder, UUID, ErrorHelper, HttpStatusCode } from './utilities';
import { AWSProxyResolver } from './aws-proxy';
import { Sidecar } from './sidecar';
import { Validators } from './validators';
import { Instituto } from './schema';

enum AllowedOperation {
    GetInstituto,
    CreateInstituto,
    UpdateInstituto,
    DeleteInstituto
}

enum HandlerError {
    DependencyResolverNotAvailable = 'DependencyResolverNotAvailable',
    OperationNotAllowed = 'OperationNotAllowed',
    ObjectIdNotAvailable = 'ObjectIdNotAvailable',
    InvalidEventBody = 'InvalidEventBody',
    InvalidObjectBody = 'InvalidObjectBody',
}

const lakeName = 'thisBucket';
const tableName = 'thisTable';
const topicArn = 'thisTopic';
const isLambda = !!(process.env.LAMBDA_TASK_ROOT || false);

var mockResolver: ProxyResolver;

function getObjectId(event: APIGatewayProxyEvent): string {
    
    const operation = getOperation(event);
    if (operation === AllowedOperation.CreateInstituto) {

        const generated = UUID.newUUID();
        return generated;

    } else if (operation === AllowedOperation.DeleteInstituto || operation === AllowedOperation.UpdateInstituto || operation === AllowedOperation.GetInstituto) {
        
        const object = JSON.parse(event.body)
        const objectId = object.get('id');
        return objectId;

    } else { return null;}

}

function getOperation(event: APIGatewayProxyEvent): AllowedOperation {
    
    const operation = event.httpMethod;
    if (operation.toLowerCase() === 'get') {return AllowedOperation.GetInstituto;
    } else if (operation.toLowerCase() === 'post') {return AllowedOperation.CreateInstituto;
    } else if (operation.toLowerCase() === 'put') {return AllowedOperation.UpdateInstituto;
    } else if (operation.toLowerCase() === 'delete') { return AllowedOperation.DeleteInstituto;
    } else { return null; }

}

function getDependencyResolver(context: Context): Promise<ProxyResolver> {
    
    const resolver: ProxyResolver = isLambda ? new AWSProxyResolver() : mockResolver;
    return new Promise((resolve: Function, reject: Function) => {

        if (resolver === null || resolver === undefined) {
            resolve(resolver);
        } else { 
            const error = ErrorHelper.newError(HandlerError.DependencyResolverNotAvailable, '', context );
            reject(error)
        }

    })

}

export function injetResolver(resolver: ProxyResolver) { mockResolver = resolver  }

export function handler (event: APIGatewayProxyEvent, context: Context, callback: Callback): void {

    const operation = getOperation(event);
    if (operation === null || operation === undefined) {

        const error = HandlerError.OperationNotAllowed;
        const traceId = context.awsRequestId;
        const message = `${JSON.stringify(error)}! TraceId:${traceId}`;
        publishErrorInContingence(message, event, context)

        const response = ResponseBuilder.internalError(message, traceId);
        callback(null, response);
        return

    }

    const objectId = getObjectId(event);
    if (operation === null || operation === undefined) {

        const error = HandlerError.ObjectIdNotAvailable;
        const traceId = context.awsRequestId;
        const message = `${JSON.stringify(error)}! TraceId:${traceId}`;
        publishErrorInContingence(message, event, context)

        const response = ResponseBuilder.internalError(message, traceId);
        callback(null, response);
        return

    }

    getDependencyResolver(context).then(resolver => {

        const sidecar = new Sidecar(resolver, context);

        const isValidAPIGatewayEvent = Validators.isValidAPIGatewayEvent(event);
        if (!isValidAPIGatewayEvent) {
            const error: ServiceError = { code: HandlerError.InvalidEventBody, httpStatusCode: HttpStatusCode.badRequest }
            const response = sidecar.createErrorResponse(error);
            sidecar.publishError(error, JSON.stringify(event));
            sidecar.sendResponse(response, callback);
            return new Promise((resolve: Function, reject: Function) => {reject(error) });
        }

        if (operation === AllowedOperation.GetInstituto) {

            return sidecar.getInTable(tableName, objectId)
            .then(object => sidecar.createResponse(event, operation.toString(), object))
            .catch(sidecarError => {
                const response = sidecar.createErrorResponse(sidecarError);
                sidecar.sendResponse(response, callback);
            });

        } else {

            const isValidEventBody = Validators.isValidObject(Instituto.schema, event.body)
            if (!isValidEventBody) {
                const error: ServiceError = { code: HandlerError.InvalidEventBody, httpStatusCode: HttpStatusCode.badRequest }
                const response = sidecar.createErrorResponse(error);
                sidecar.publishError(error, JSON.stringify(event.body));
                sidecar.sendResponse(response, callback);
                return new Promise((resolve: Function, reject: Function) => {reject(error) });

            }

            const businessEvent = { default: `${operation}:${objectId}`, operation: operation, objectId: objectId }
            const successEvent: BusinessEvent = {
                topicArn: topicArn,
                body: { TopicArn: topicArn, MessageStructure: 'json', Message : JSON.stringify(businessEvent) }
            };

            return sidecar.userIsAuthorizedToPerformOperation(event)
            .then(userIsAuthorized => Promise.all([
                sidecar.persistInTable(tableName, objectId, event),
                sidecar.persistOnLake(lakeName, objectId, event)
            ]))
            .then(persisted => sidecar.publishEvent(topicArn, successEvent, event))
            .then(eventPublished => sidecar.createResponse(event, operation.toString(), event.body))
            .then(response => sidecar.sendResponse(response, callback))
            .catch(sidecarError => {
                const response = sidecar.createErrorResponse(sidecarError);
                sidecar.sendResponse(response, callback);
            })

        }

    }).catch(error => {
        
        const traceId = context.awsRequestId;
        const message = `${JSON.stringify(error)}! TraceId:${traceId}`;
        publishErrorInContingence(message, event, context)

        const response = ResponseBuilder.internalError(message, traceId);
        callback(null, response);
        return

    }).catch(error => {console.log('reach the last catch block')});

}

/**
 * @param message Error message
 * @return void
 * @description
 * Publish Error messages in situations where the defined loggroup, logstream and
 * error metric could not be instantiated.
 */
function publishErrorInContingence(message: string, payload: APIGatewayProxyEvent, context: Context): void {
    
    // if (isLambda) {
        console.error('Publishing Error in Contigence!')
        console.error(message);
        // console.error(payload);
        // console.error(context);
    // }

}