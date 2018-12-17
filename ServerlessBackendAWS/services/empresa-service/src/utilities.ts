import { APIResponse } from './types';

export const HttpStatusCode = {
    ok: 200,
    created: 201,
    badRequest: 400,
    forbidden: 403,
    notFound: 404,
    internalServerError: 500,
  };

export class ResponseBuilder {

    public static ok<T>(result: T): APIResponse { return ResponseBuilder.parseResponse(result, HttpStatusCode.ok); }
    
    public static created<T>(url: string, result: T): APIResponse { return ResponseBuilder.parseResponse(result, HttpStatusCode.created); }

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

    private static parseResponse<T>(result: T, statusCode: number) {

        const responseBody = result ? JSON.stringify(result) : null;

        const response: APIResponse = {
            statusCode: statusCode,
            headers: {},
            body: responseBody
        }

        return response;

    }

}