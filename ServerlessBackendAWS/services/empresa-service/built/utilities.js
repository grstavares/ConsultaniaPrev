"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpStatusCode = {
    ok: 200,
    created: 201,
    badRequest: 400,
    forbidden: 403,
    notFound: 404,
    internalServerError: 500,
};
class ResponseBuilder {
    static ok(result) { return ResponseBuilder.parseResponse(result, exports.HttpStatusCode.ok); }
    static created(url, result) { return ResponseBuilder.parseResponse(result, exports.HttpStatusCode.created); }
    static badRequest(reason, traceId) {
        const error = ResponseBuilder.parseError(exports.HttpStatusCode.badRequest, reason, traceId);
        return ResponseBuilder.parseResponse(error, exports.HttpStatusCode.badRequest);
    }
    static forbidden(reason, traceId) {
        const error = ResponseBuilder.parseError(exports.HttpStatusCode.forbidden, 'REDACTED', traceId);
        return ResponseBuilder.parseResponse(error, exports.HttpStatusCode.forbidden);
    }
    static notFound(reason, traceId) {
        const error = ResponseBuilder.parseError(exports.HttpStatusCode.notFound, reason, traceId);
        return ResponseBuilder.parseResponse(error, exports.HttpStatusCode.notFound);
    }
    static internalError(reason, traceId) {
        const error = ResponseBuilder.parseError(exports.HttpStatusCode.internalServerError, 'REDACTED', traceId);
        return ResponseBuilder.parseResponse(error, exports.HttpStatusCode.internalServerError);
    }
    static parseError(statusCode, message, traceId) {
        const messageBody = message + (traceId ? ':TraceId -> ${traceId}' : '');
        return { error: { statusCode: statusCode, message: messageBody } };
    }
    static parseResponse(result, statusCode) {
        const responseBody = result ? JSON.stringify(result) : null;
        const response = {
            statusCode: statusCode,
            headers: {},
            body: responseBody
        };
        return response;
    }
}
exports.ResponseBuilder = ResponseBuilder;
