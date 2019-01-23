import { Context, Callback, APIGatewayProxyEvent } from 'aws-lambda';
import { UUID, ResponseBuilder } from '../../common'
import { APIGatewayEventValidator } from './serviceValidator'

enum AllowedOperation {
    GetNewsReport = 'GetNewsReport',
    CreateNewsReport = 'CreateNewsReport',
    UpdateNewsReport = 'UpdateNewsReport',
    DeleteNewsReport = "DeleteNewsReport"
}

enum HandlerError {
    DependencyResolverNotAvailable = 'DependencyResolverNotAvailable',
    OperationNotAllowed = 'OperationNotAllowed',
    ObjectIdNotAvailable = 'ObjectIdNotAvailable',
    InvalidEventBody = 'InvalidEventBody',
    InvalidObjectBody = 'InvalidObjectBody',
}

function getOperation(event: APIGatewayProxyEvent): AllowedOperation {
    
    const operation = event.httpMethod;
    if (operation.toLowerCase() === 'get') {return AllowedOperation.GetNewsReport;
    } else if (operation.toLowerCase() === 'post') {return AllowedOperation.CreateNewsReport;
    } else if (operation.toLowerCase() === 'put') {return AllowedOperation.UpdateNewsReport;
    } else if (operation.toLowerCase() === 'delete') { return AllowedOperation.DeleteNewsReport;
    } else { return null; }

}

function getObjectId(event: APIGatewayProxyEvent): string {
    
    const operation = getOperation(event);
    if (operation === AllowedOperation.CreateNewsReport) {

        const generated = UUID.newUUID();
        return generated;

    } else if (operation === AllowedOperation.DeleteNewsReport || operation === AllowedOperation.UpdateNewsReport || operation === AllowedOperation.GetNewsReport) {
        
        const objectPath = event.path.split('/')
        const objectId = objectPath[objectPath.length-1];
        return objectId;

    } else { return null;}

}

export function handler (event: APIGatewayProxyEvent, context: Context, callback: Callback): void {

    const traceId = context.awsRequestId;

    const isValidEvent = APIGatewayEventValidator.validate(event)
    if (!isValidEvent) {

        const response = ResponseBuilder.badRequest("", traceId)
        callback(null, response)
        return

    }

    const tableName = process.env.TABLE_NAME
    const operation = getOperation(event)
    const objectId = getObjectId(event)



}