"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("./utilities");
const aws_proxy_1 = require("./aws-proxy");
const sidecar_1 = require("./sidecar");
const uuid = require("./utils");
const validators_1 = require("./validators");
const lakeName = 'thisBucket';
const tableName = 'thisTable';
const topicArn = 'thisTopic';
const isLambda = !!(process.env.LAMBDA_TASK_ROOT || false);
var mockResolver;
function parseObject(apiEvent) {
    return new Promise((resolve, reject) => {
        const object = { key: 'value' };
        resolve(JSON.stringify(object));
    });
}
function injetResolver(resolver) { mockResolver = resolver; }
exports.injetResolver = injetResolver;
function handler(event, context, callback) {
    const objectKey = uuid();
    const successEvent = { topicArn: topicArn, body: JSON.stringify(event) };
    const resolver = isLambda ? new aws_proxy_1.AWSProxyResolver() : mockResolver;
    if (resolver === null || resolver === undefined) {
        const traceId = context.awsRequestId;
        const message = 'Function not Configured: Resource Dispatcher not Found! TraceId:${traceId}';
        publishErrorInContingence(message);
        const response = utilities_1.ResponseBuilder.internalError(message, traceId);
        callback(null, response);
        return;
    }
    const sidecar = new sidecar_1.Sidecar(resolver, context);
    validators_1.Validators.isValidAPIGatewayEvent(event)
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
    });
}
exports.handler = handler;
function publishErrorInContingence(message) {
    console.error('Publishing Error in Contigence!');
    console.error(message);
}
