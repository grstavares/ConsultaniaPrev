import { APIResponse, ServiceError } from './types';

export const HttpStatusCode = {
    ok: 200,
    created: 201,
    badRequest: 400,
    forbidden: 403,
    notFound: 404,
    internalServerError: 500,
  };

export class UUID {

    static newUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

}

export class ResponseBuilder {

    public static ok<T>(result: T): APIResponse { return ResponseBuilder.parseResponse(result, HttpStatusCode.ok); }
    
    public static created<T>(url: string, result: T): APIResponse {
        const headers = { Location: url }
        return ResponseBuilder.parseResponse(result, HttpStatusCode.created, headers);
    }

    public static badRequest(reason: string, traceId: string): APIResponse {
        
        const error = ResponseBuilder.parseError(HttpStatusCode.badRequest, reason, traceId);
        return ResponseBuilder.parseResponse(error, HttpStatusCode.badRequest);
        
    }
    
    public static forbidden(reason: string, traceId: string): APIResponse {
        
        const error = ResponseBuilder.parseError(HttpStatusCode.forbidden, 'REDACTED', traceId);
        return ResponseBuilder.parseResponse(error, HttpStatusCode.forbidden);
        
    }
    
    public static notFound(reason: string, traceId: string): APIResponse {

        const error = ResponseBuilder.parseError(HttpStatusCode.notFound, reason, traceId);
        return ResponseBuilder.parseResponse(error, HttpStatusCode.notFound);

    }

    public static internalError(reason: string, traceId: string): APIResponse {

        const error = ResponseBuilder.parseError(HttpStatusCode.internalServerError, 'REDACTED', traceId);
        return ResponseBuilder.parseResponse(error, HttpStatusCode.internalServerError);

    }
    
    private static parseError(statusCode: number, message: string, traceId: string): Object {

        const messageBody = message + (traceId ? ':TraceId -> ${traceId}' : '' );
        return { error : { statusCode: statusCode, message: messageBody } }

    }

    private static parseResponse<T>(result: T, statusCode: number, headers?: {[key: string]: string}) {

        const responseBody = result ? JSON.stringify(result) : null;
        const parsedHeaders = headers ? headers : {};
        const response: APIResponse = {
            statusCode: statusCode,
            headers: parsedHeaders,
            body: responseBody
        }

        return response;

    }

}

export class ErrorHelper {

    public static newError(errorCode: string, resource: string, payload: Object): ServiceError {

        const error: ServiceError = { code: errorCode, httpStatusCode: 500,  resource: resource, payload: payload }
        return error;

    }

}