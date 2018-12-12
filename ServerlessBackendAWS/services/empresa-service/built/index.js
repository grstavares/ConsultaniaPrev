"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sidecar_1 = require("./sidecar");
const uuid = require("./utils");
const lakeName = 'thisBucket';
const tableName = 'thisTable';
const topicArn = 'thisTopic';
const isLambda = !!(process.env.LAMBDA_TASK_ROOT || false);
function parseObject(apiEvent) {
    return new Promise((resolve, reject) => {
        const object = { key: 'value' };
        resolve(JSON.stringify(object));
    });
}
function handler(event, context, callback) {
    const objectKey = uuid();
    const successEvent = { topicArn: topicArn, body: JSON.stringify(event) };
    const sidecar = new sidecar_1.Sidecar();
    sidecar.parseAPIGatewayEvent(event)
        .then(validated => sidecar.validateRights(event))
        .then(authorized => sidecar.persistOnLake(lakeName, objectKey, event))
        .then(persistedOnLake => parseObject(event))
        .then(parsed => sidecar.persistInTable(tableName, objectKey, parsed))
        .then(persistedOnTable => sidecar.publishEvent(successEvent, event))
        .then(published => sidecar.createResponse(event))
        .then(response => callback(null, response))
        .catch(err => callback(err, null))
        .catch(callBackError => console.log);
}
exports.handler = handler;
