import { Context, Callback, APIGatewayProxyEvent } from 'aws-lambda';
import { BusinessEvent, ProxyResolver, ServiceError } from './types.d';
import { ResponseBuilder, UUID, ErrorHelper, HttpStatusCode } from './utilities';
import { AWSProxyResolver, AWSConfiguration } from './aws-proxy';
import { Sidecar } from './sidecar';
import { Validators } from './validators';
import { Instituto } from './schema';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

enum AllowedOperation {
    GetInstituto = 'GetInstituto',
    CreateInstituto = 'CreateInstituto',
    UpdateInstituto = 'UpdateInstituto',
    DeleteInstituto = 'DeleteInstituto'
}

enum HandlerError {
    DependencyResolverNotAvailable = 'DependencyResolverNotAvailable',
    OperationNotAllowed = 'OperationNotAllowed',
    ObjectIdNotAvailable = 'ObjectIdNotAvailable',
    InvalidEventBody = 'InvalidEventBody',
    InvalidObjectBody = 'InvalidObjectBody',
}

const lakeName = process.env.SERVICE_LAKE_ARN || 'thisBucket';
const tableName = process.env.SERVICE_TABLE_ARN || 'thisTable';
const topicArn = process.env.SERVICE_TOPIC_ARN || 'thisTopic';
const isLambda = !!(process.env.LAMBDA_TASK_ROOT || false);

// var mockResolver: ProxyResolver;
var mockResolver: ProxyResolver;

function getObjectId(event: APIGatewayProxyEvent): string {
    
    const operation = getOperation(event);
    if (operation === AllowedOperation.CreateInstituto) {

        const generated = UUID.newUUID();
        return generated;

    } else if (operation === AllowedOperation.DeleteInstituto || operation === AllowedOperation.UpdateInstituto || operation === AllowedOperation.GetInstituto) {
        
        const objectPath = event.path.split('/')
        const objectId = objectPath[objectPath.length-1];
        return objectId;

    } else { return null;}

}

function parseObjectKey(objectId: string): {[key:string]: any} { return { id : objectId }; }

function getOperation(event: APIGatewayProxyEvent): AllowedOperation {
    
    const operation = event.httpMethod;
    if (operation.toLowerCase() === 'get') {return AllowedOperation.GetInstituto;
    } else if (operation.toLowerCase() === 'post') {return AllowedOperation.CreateInstituto;
    } else if (operation.toLowerCase() === 'put') {return AllowedOperation.UpdateInstituto;
    } else if (operation.toLowerCase() === 'delete') { return AllowedOperation.DeleteInstituto;
    } else { return null; }

}

function getDependencyResolver(context: Context): Promise<ProxyResolver> {
    
    const awsConfig: AWSConfiguration = {
        appName: process.env.APP_NAME || 'TemporaryAppName',
        metricStorage: 60 * 5,  //five minutes
        functionName: context.functionName,
        functionStage: context.invokedFunctionArn,
        functionVersion: context.functionVersion
    }

    const resolver: ProxyResolver = isLambda ? new AWSProxyResolver(awsConfig) : mockResolver;
    return new Promise((resolve: Function, reject: Function) => {

        if (resolver === null || resolver === undefined) {
            const error = ErrorHelper.newError(HandlerError.DependencyResolverNotAvailable, '', context );
            reject(error)
            
        } else { resolve(resolver); }

    })

}

export function injetResolver(resolver: ProxyResolver) { mockResolver = resolver  }

export function handler (event: APIGatewayProxyEvent, context: Context, callback: Callback): void {

    process.on('unhandledRejection', (reason, p) => {
        console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
        // application specific logging, throwing an error, or other logic here
      });

    const traceId = context.awsRequestId;

    const operation = getOperation(event);
    if (operation === null || operation === undefined) {

        const error = HandlerError.OperationNotAllowed;
        const message = `${JSON.stringify(error)}! TraceId:${traceId}`;
        publishErrorInContingence(message, event, context)

        const response = ResponseBuilder.internalError(message, traceId);
        callback(null, response);
        return

    }

    const objectId = getObjectId(event);
    if (objectId === null || objectId === undefined) {

        const error = HandlerError.ObjectIdNotAvailable;
        const message = `${JSON.stringify(error)}! TraceId:${traceId}`;
        publishErrorInContingence(message, event, context)

        const response = ResponseBuilder.internalError(message, traceId);
        callback(null, response);
        return

    }

    getDependencyResolver(context).then(resolver => {

        const sidecar = new Sidecar(resolver, context, traceId, operation.toString());

        const isValidAPIGatewayEvent = Validators.isValidAPIGatewayEvent(event);

        if (!isValidAPIGatewayEvent) {
            const error: ServiceError = { code: HandlerError.InvalidEventBody, httpStatusCode: HttpStatusCode.badRequest }
            const response = sidecar.createErrorResponse(error);
            return sidecar.publishError(error, JSON.stringify(event))
            .then(serviceError => sidecar.sendResponse(response, callback));
        }

        const businessEvent = { default: `${operation}:${objectId}`, operation: operation, objectId: objectId }
        const successEvent: BusinessEvent = {
            topicArn: topicArn,
            body: { TopicArn: topicArn, MessageStructure: 'json', Message : JSON.stringify(businessEvent) }
        };

        if (operation === AllowedOperation.GetInstituto) {

            return sidecar.getInTable(tableName, parseObjectKey(objectId))
            .then(object => sidecar.createResponse(event, object, objectId))
            .then(response => sidecar.sendResponse(response, callback))
            .catch(sidecarError => {
                const response = sidecar.createErrorResponse(sidecarError);
                sidecar.sendResponse(response, callback);
            });

        } else if (operation == AllowedOperation.DeleteInstituto) {

            return sidecar.userIsAuthorizedToPerformOperation(event)
            .then(userIsAuthorized => sidecar.persistOnLake(lakeName, objectId, event))
            .then(persistedInLake => sidecar.persistInTable(tableName, event.httpMethod, {id: { S: objectId} }, JSON.parse(event.body)))
            .then(persisted => sidecar.publishEvent(topicArn, successEvent, event))
            .then(eventPublished => sidecar.createResponse(event, event.body, objectId))
            .then(response => sidecar.sendResponse(response, callback))
            .catch(sidecarError => {
                const response = sidecar.createErrorResponse(sidecarError);
                sidecar.sendResponse(response, callback);
            })

        } else {

            var updatedId = Object.assign({}, JSON.parse(event.body));
            updatedId = Object.assign(updatedId, {id: objectId})

            return Validators.isValidObject(Instituto, updatedId)
            .then(objectIsValid => sidecar.userIsAuthorizedToPerformOperation(event))
            .then(userIsAuthorized => sidecar.persistOnLake(lakeName, traceId, event))
            .then(persistedOnLake => {
                const newObject = Object.assign(JSON.parse(event.body), { id: objectId })
                sidecar.persistInTable(tableName, event.httpMethod, parseObjectKey(objectId), newObject)
            })
            .then(persisted => sidecar.publishEvent(topicArn, successEvent, event))
            .then(eventPublished => sidecar.createResponse(event, event.body, objectId))
            .then(response => sidecar.sendResponse(response, callback))
            .catch(sidecarError => {

                const response = sidecar.createErrorResponse(sidecarError);
                sidecar.sendResponse(response, callback);

            }).catch(error => {console.log('reach the last catch block')});

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

    if (!isLambda) {

        if (!existsSync('./testreports')) {mkdirSync('./testreports')}
        const filename = new Date().getTime() + '.txt'
        writeFileSync('./testreports/console_' + filename, `Publishing Error in Contigence! -> ${message}`, 'utf-8');

    } else {
        console.error(`Publishing Error in Contigence! -> ${message}`)
        console.error(message);
    }

}