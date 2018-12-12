"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const jsonschema_1 = require("jsonschema");
const schema_1 = require("./schema");
var SidecarErrors;
(function (SidecarErrors) {
    SidecarErrors[SidecarErrors["userNotAuthorized"] = 0] = "userNotAuthorized";
    SidecarErrors[SidecarErrors["invalidObjectBody"] = 1] = "invalidObjectBody";
    SidecarErrors[SidecarErrors["resourceNotAvailable"] = 2] = "resourceNotAvailable";
    SidecarErrors[SidecarErrors["dependencyError"] = 3] = "dependencyError";
    SidecarErrors[SidecarErrors["configurationNotAvailable"] = 4] = "configurationNotAvailable";
})(SidecarErrors || (SidecarErrors = {}));
class Sidecar {
    constructor() {
        this.trail = [];
    }
    validateRights(event) {
        const trace = new OperationBuilder().withAction('validateRights');
        return new Promise((resolve, reject) => {
            if (this.matchPermissions()) {
                this.trail.push(trace.build());
                resolve(true);
            }
            else {
                const error = { error: SidecarErrors.userNotAuthorized };
                this.trail.push(trace.withError(error).build());
                reject(error);
            }
        });
    }
    parseAPIGatewayEvent(event) {
        const trace = new OperationBuilder().withAction('parseAPIGatewayEvent').withPayload(event.body);
        return new Promise((resolve, reject) => {
            const validator = new jsonschema_1.Validator();
            const payload = event.body;
            if (validator.validate(payload, schema_1.instituto)) {
                this.trail.push(trace.build());
                resolve(true);
            }
            else {
                const error = { error: SidecarErrors.userNotAuthorized };
                this.trail.push(trace.withError(error).build());
                reject(error);
            }
        });
    }
    persistOnLake(bucketName, eventId, event) {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }
    persistInTable(tableName, key, object) {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }
    publishEvent(businessEvent, event) {
        const trace = new OperationBuilder().withAction('publishEvent').withParameters(businessEvent);
        return new Promise((resolve, reject) => {
            if (!businessEvent.topicArn) {
                reject("[Error] No Topic ARN specified");
            }
            const region = this.validateTopicArn(businessEvent.topicArn);
            if (region) {
                reject("[Error] Invalid Topic ARN");
            }
            const sns = new aws_sdk_1.SNS({ region: region });
            const snsEvent = { Message: JSON.stringify(businessEvent.body), TopicArn: businessEvent.topicArn };
            sns.publish(snsEvent, (err, data) => { err ? reject(err) : resolve(data.MessageId); });
        });
    }
    publishMetric(metricName) {
        return new Promise((resolve, reject) => {
            resolve(metricName);
        });
    }
    createResponse(event) {
        return new Promise((resolve, reject) => {
            resolve({ statusCode: 200, message: 'worked' });
        });
    }
    matchPermissions() { return true; }
    validateTopicArn(topicArn) {
        let splitedTopicArn = topicArn.split(":");
        if (splitedTopicArn.length < 7) {
            return undefined;
        }
        return splitedTopicArn[3];
    }
}
exports.Sidecar = Sidecar;
class SidecarOperation {
    constructor(builder) {
        this.timestamp = builder.timestamp;
        this.durationInMillis = builder.durationInMillis;
        this.action = builder.action;
        this.success = builder.success;
        this.parameters = builder.parameters;
        this.payload = builder.payload;
        this.error = builder.error;
    }
}
exports.SidecarOperation = SidecarOperation;
class OperationBuilder {
    constructor() { this.timestamp = new Date(); }
    withAction(name) { this.action = name; return this; }
    withParameters(object) { this.parameters = object; return this; }
    withPayload(object) { this.payload = object; return this; }
    withError(error) { this.error = error; return this; }
    build() {
        const now = new Date();
        this.durationInMillis = (now.getTime() - this.timestamp.getTime());
        if (this.error === null || this.error === undefined) {
            this.success = true;
        }
        else {
            this.success = false;
        }
        return new SidecarOperation(this);
    }
}
