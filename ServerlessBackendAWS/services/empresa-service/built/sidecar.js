"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("./utilities");
var SidecarError;
(function (SidecarError) {
    SidecarError[SidecarError["userNotAuthorized"] = 0] = "userNotAuthorized";
    SidecarError[SidecarError["invalidObjectBody"] = 1] = "invalidObjectBody";
    SidecarError[SidecarError["resourceNotAvailable"] = 2] = "resourceNotAvailable";
    SidecarError[SidecarError["dependencyError"] = 3] = "dependencyError";
    SidecarError[SidecarError["dependencyErrorSns"] = 4] = "dependencyErrorSns";
    SidecarError[SidecarError["configurationNotAvailable"] = 5] = "configurationNotAvailable";
    SidecarError[SidecarError["invalidConfiguration"] = 6] = "invalidConfiguration";
    SidecarError[SidecarError["undefined"] = 7] = "undefined";
})(SidecarError || (SidecarError = {}));
class Sidecar {
    constructor(dependencyResolver, lambdaContext) {
        this.dependencyResolver = dependencyResolver;
        this.lambdaContext = lambdaContext;
        this.trail = [];
    }
    userIsAuthorizedToPerformOperation(event) {
        const trace = new OperationBuilder().withAction('userIsAuthorizedToPerformOperation');
        return new Promise((resolve, reject) => {
            if (this.matchPermissions()) {
                this.trail.push(trace.build());
                resolve(true);
            }
            else {
                const error = { error: SidecarError.userNotAuthorized };
                this.trail.push(trace.withError(error).build());
                const response = utilities_1.ResponseBuilder.forbidden('Auth Failed!', this.lambdaContext.awsRequestId);
                reject(response);
            }
        });
    }
    persistOnLake(bucketName, eventId, event) {
        const parameters = { bucketName: bucketName, eventId: eventId };
        const trace = new OperationBuilder().withAction('persistOnLake').withPayload(event.body).withParameters(parameters);
        return new Promise((resolve, reject) => {
            this.trail.push(trace.build());
            resolve(true);
        });
    }
    persistInTable(tableName, key, object) {
        const parameters = { tableName: tableName, key: key };
        const trace = new OperationBuilder().withAction('persistInTable').withPayload(object).withParameters(parameters);
        return new Promise((resolve, reject) => {
            this.trail.push(trace.build());
            resolve(true);
        });
    }
    publishEvent(businessEvent, event) {
        const trace = new OperationBuilder().withAction('publishEvent');
        return new Promise((resolve, reject) => {
            this.trail.push(trace.build());
            resolve(true);
        });
    }
    publishMetric(metricValue) {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }
    createResponse(event) {
        const result = { statusCode: 200, body: JSON.stringify(event) };
        return result;
    }
    createErrorResponse(error) {
        const result = { statusCode: 200, body: JSON.stringify(error) };
        return result;
    }
    publishError(error, payload) {
        return new Promise((resolve, reject) => {
            resolve(error);
        });
    }
    sendResponse(response, callback) {
        this.publishOperationTrail();
        callback(null, response);
    }
    matchPermissions() { return true; }
    createMetricFromError(error) {
        const metric = {
            metricArn: '',
            value: { value: 1 }
        };
        return metric;
    }
    publishOperationTrail() {
    }
    publishErrorInContingence(message) {
        console.error('Publishing Error in Contigence!');
        console.error(message);
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
