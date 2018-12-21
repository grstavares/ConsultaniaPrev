import { Context, APIGatewayProxyEvent, Callback, APIGatewayProxyResult } from 'aws-lambda';
import { BusinessEvent, InfrastructureMetric, ProxyResolver, ServiceError, ServiceParameter } from './types.d';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { ResponseBuilder, MetricBuilder } from './utilities';

const isLambda = !!(process.env.LAMBDA_TASK_ROOT || false);

export enum SidecarError {
    UserNotAuthorized = 'UserNotAuthorized',
    ResourceNotFound = 'ResourceNotFound',
    InvalidObjectBody = 'InvalidObjectBody',
    InvalidOperation = 'InvalidOperation',
    InvalidConfiguration = 'InvalidConfiguration',
    DependencyError = 'DependencyError',
    ConfigurationNotAvailable = 'ConfigurationNotAvailable',
    undefined = 'undefined'
}

export const SidecarMetric = {
    DependencyError: 'DependencyError',
    undefined: 'undefined'
}

export class Sidecar {

    traceId: string;
    operation: string;
    trail: SidecarOperation[] = [];

    constructor(private dependencyResolver: ProxyResolver, private lambdaContext: Context, traceId: string, operation: string) { this.traceId = traceId; this.operation = operation }

    /**
     * @param parameter ServiceParameter
     * @return Promise<string>
     * @description
     * Return Parameter from System
     */
    getParameter(parameter: ServiceParameter): string {
        if (parameter.type === 'ENV') {
            return process.env[parameter.name]
        } else { return ''; }
    }

    /**
     * @param event APIGatewayProxyEvent
     * @return Promise<boolean>
     * @description
     * Verify UserRights to execute the operation!
     * This verification is related to application specific code that can not
     * be verified by AWS Security Services.
     */
    userIsAuthorizedToPerformOperation(event: APIGatewayProxyEvent): Promise<boolean> {

        const trace = new OperationBuilder(this.traceId, this.operation).withAction('userIsAuthorizedToPerformOperation');

        return new Promise((resolve: Function, reject: Function) => {

            if (this.matchPermissions()) {

                this.trail.push(trace.build());
                resolve(true);

            } else {

                const error = {
                    error: SidecarError.UserNotAuthorized,
                    payload: 'empty',
                    parameters: {
                        userId: event.requestContext.identity.userArn,
                        checkedPolicies: JSON.stringify(['policA', 'policyB'])
                    }
                }

                this.trail.push(trace.withError(error).build())
                reject(error);

            }

        });
    }

    /**
     * @param bucketName string
     * @param eventId string
     * @param event APIGatewayProxyEvent
     * @return Promise<boolean>
     * @description
     * Persist Event in Data Lake
     * The eventId must be provided already using the prefixes.
     */
    persistOnLake(bucketName: string, eventId: string, event: APIGatewayProxyEvent): Promise<boolean> {

        const parameters = { bucketName: bucketName, eventId: eventId };
        const trace = new OperationBuilder(this.traceId, this.operation).withAction('persistOnLake').withPayload(event.body).withParameters(parameters);

        const bucket = this.dependencyResolver.bucket('region', bucketName);
        return new Promise((resolve: Function, reject: Function) => {

            if (bucket) {

                bucket.putObject(eventId + '.json', JSON.stringify(event)).then(success => {
                    this.trail.push(trace.build());
                    resolve(true);
                }).catch(error => {

                    const parameters = { resourceType: 'bucket', resourceName: bucketName }
                    this.trail.push(trace.withError(error).withParameters(parameters).build());

                    const metric = new MetricBuilder(SidecarMetric.DependencyError, 1).withResourceType('bucket').withResource(bucketName).build()
                    this.publishMetric(metric)
                        .then(value => reject(error))
                        .catch(publishingError => {
                            this.publishErrorInContingence(JSON.stringify(error));
                            this.publishErrorInContingence(publishingError);
                            reject(error);
                        })

                });

            } else {

                const parameters = { resourceType: 'bucket', resourceName: bucketName }
                const error: ServiceError = { code: SidecarError.DependencyError, httpStatusCode: 500, resource: bucketName, payload: event };
                this.trail.push(trace.withError(error).withParameters(parameters).build());

                const metric = new MetricBuilder(SidecarMetric.DependencyError, 1).withResourceType('bucket').withResource(bucketName).build()
                this.publishMetric(metric)
                    .then(value => reject(error))
                    .catch(publishingError => {
                        this.publishErrorInContingence(JSON.stringify(error));
                        this.publishErrorInContingence(publishingError);
                        reject(error);
                    })

            }

        });

    }

    /**
     * @param tableName string
     * @param objectKey string
     * @return Promise<Object>
     * @description
     * Get Object Value on noSQLTable
     */
    getInTable(tableName: string, keys: { [key: string]: any }): Promise<Object> {

        const parameters = { tableName: tableName, key: keys };
        const trace = new OperationBuilder(this.traceId, this.operation).withAction('getInTable').withParameters(parameters);

        const table = this.dependencyResolver.table(tableName);
        return new Promise((resolve: Function, reject: Function) => {

            if (table) {

                table.getItem(keys).then((object: Object) => {

                    if (object) {

                        this.trail.push(trace.build());
                        resolve(object);
                        
                    } else {
                        const error: ServiceError = { code: SidecarError.ResourceNotFound, httpStatusCode: 404, resource: tableName + '/' + JSON.stringify(keys) };
                        this.trail.push(trace.withError(error).withParameters(parameters).build());
                        reject(error);
                    }

                }).catch((error: ServiceError) => {

                    const parameters = { resourceType: 'table', resourceName: tableName }
                    this.trail.push(trace.withError(error).withParameters(parameters).build());

                    const metric = new MetricBuilder(SidecarMetric.DependencyError, 1).withResourceType('table').withResource(tableName).build()
                    this.publishMetric(metric)
                        .then(value => reject(error))
                        .catch(publishingError => {
                            this.publishErrorInContingence(JSON.stringify(error));
                            this.publishErrorInContingence(publishingError);
                            reject(error);
                        })

                });

            } else {

                const parameters = { resourceType: 'table', resourceName: tableName }
                const error: ServiceError = { code: SidecarError.DependencyError, httpStatusCode: 500, resource: tableName, payload: null };
                this.trail.push(trace.withError(error).withParameters(parameters).build());

                const metric = new MetricBuilder(SidecarMetric.DependencyError, 1).withResourceType('table').withResource(tableName).build()
                this.publishMetric(metric)
                    .then(value => reject(error))
                    .catch(publishingError => {
                        this.publishErrorInContingence(JSON.stringify(error));
                        this.publishErrorInContingence(publishingError);
                        reject(error);
                    })

            }

        });

    }

    /**
     * @param tableName string
     * @param objectKey string
     * @param object string
     * @return Promise<boolean>
     * @description
     * Persist Event in noSQLTable
     * The object must be provided as DynamoDB record.
     */
    persistInTable(tableName: string, operation: string, keys: { [key: string]: any }, content: Object): Promise<boolean> {

        const parameters = { tableName: tableName, key: keys, operation: operation };
        const trace = new OperationBuilder(this.traceId, this.operation).withAction('persistInTable').withPayload(JSON.stringify(content)).withParameters(parameters);

        const table = this.dependencyResolver.table(tableName);
        return new Promise((resolve: Function, reject: Function) => {

            if (table) {

                if (operation.toLowerCase() === 'post' || operation.toLowerCase() === 'put') {

                    table.putItem(keys, content).then(success => {

                        this.trail.push(trace.build());
                        resolve(true);

                    }).catch(error => {

                        const parameters = { resourceType: 'table', resourceName: tableName }
                        this.trail.push(trace.withError(error).withParameters(parameters).build());

                        const metric = new MetricBuilder(SidecarMetric.DependencyError, 1).withResourceType('table').withResource(tableName).build()
                        this.publishMetric(metric)
                            .then(value => reject(error))
                            .catch(publishingError => {
                                this.publishErrorInContingence(JSON.stringify(error));
                                this.publishErrorInContingence(publishingError);
                                reject(error);
                            })

                    });

                } else if (operation.toLowerCase() === 'delete') {

                    table.deleteItem(keys).then(success => {

                        this.trail.push(trace.build());
                        resolve(true);

                    }).catch(error => {

                        const parameters = { resourceType: 'table', resourceName: tableName }
                        this.trail.push(trace.withError(error).withParameters(parameters).build());

                        const metric = new MetricBuilder(SidecarMetric.DependencyError, 1).withResourceType('table').withResource(tableName).build()
                        this.publishMetric(metric)
                            .then(value => reject(error))
                            .catch(publishingError => {
                                this.publishErrorInContingence(JSON.stringify(error));
                                this.publishErrorInContingence(publishingError);
                                reject(error);
                            })

                    });

                } else {

                    const parameters = { resourceType: 'table', resourceName: tableName }
                    const error: ServiceError = { code: SidecarError.InvalidOperation, httpStatusCode: 500, resource: tableName, payload: content };
                    this.trail.push(trace.withError(error).withParameters(parameters).build());

                    const metric = new MetricBuilder(SidecarMetric.DependencyError, 1).withResourceType('table').withResource(tableName).build()
                    this.publishMetric(metric)
                        .then(value => reject(error))
                        .catch(publishingError => {
                            this.publishErrorInContingence(JSON.stringify(error));
                            this.publishErrorInContingence(publishingError);
                            reject(error);
                        })

                }

            } else {

                const parameters = { resourceType: 'table', resourceName: tableName }
                const error: ServiceError = { code: SidecarError.DependencyError, httpStatusCode: 500, resource: tableName, payload: content };
                this.trail.push(trace.withError(error).withParameters(parameters).build());

                const metric = new MetricBuilder(SidecarMetric.DependencyError, 1).withResourceType('table').withResource(tableName).build()
                this.publishMetric(metric)
                    .then(value => reject(error))
                    .catch(publishingError => {
                        this.publishErrorInContingence(JSON.stringify(error));
                        this.publishErrorInContingence(publishingError);
                        reject(error);
                    })

            }

        });

    }

    /**
     * @param businessEvent BusinessEvent
     * @param event APIGatewayProxyEvent
     * @returns Promise<string>
     * @description
     * Publish Event in SNS Topic
     */
    publishEvent(topicArn: string, businessEvent: BusinessEvent, event: APIGatewayProxyEvent): Promise<boolean> {

        const trace = new OperationBuilder(this.traceId, this.operation).withAction('publishEvent').withPayload(JSON.stringify(businessEvent))
        const topic = this.dependencyResolver.topic(topicArn);

        return new Promise((resolve: Function, reject: Function) => {

            if (topic) {

                topic.publish(businessEvent.body).then(messageId => {

                    const parameters = { messageId: messageId }
                    this.trail.push(trace.withParameters(parameters).build());
                    resolve(true);

                }).catch(error => {

                    const parameters = { resourceType: 'topic', resourceName: topicArn }
                    this.trail.push(trace.withError(error).withParameters(parameters).build());

                    const metric = new MetricBuilder(SidecarMetric.DependencyError, 1).withResourceType('topic').withResource(topicArn).build()
                    this.publishMetric(metric)
                        .then(value => reject(error))
                        .catch(publishingError => {
                            this.publishErrorInContingence(JSON.stringify(error));
                            this.publishErrorInContingence(publishingError);
                            reject(error);
                        })

                });

            } else {

                const parameters = { resourceType: 'topic', resourceName: topicArn }
                const error: ServiceError = { code: SidecarError.DependencyError, httpStatusCode: 500, resource: topicArn, payload: event };
                this.trail.push(trace.withError(error).withParameters(parameters).build());

                const metric = new MetricBuilder(SidecarMetric.DependencyError, 1).withResourceType('topic').withResource(topicArn).build()
                this.publishMetric(metric)
                    .then(value => reject(error))
                    .catch(publishingError => {
                        this.publishErrorInContingence(JSON.stringify(error));
                        this.publishErrorInContingence(publishingError);
                        reject(error);
                    })

            }

        });

    }

    /**
     * @param metricValue InfrastructureMetric
     * @returns Promise<any>
     * @description
     * Publish Metric Value
     */
    publishMetric(metricValue: InfrastructureMetric): Promise<boolean> {

        const trace = new OperationBuilder(this.traceId, this.operation).withAction('publishMetric').withPayload(JSON.stringify(metricValue))
        const metric = this.dependencyResolver.metric();
        return new Promise((resolve: Function, reject: Function) => {

            if (metric) {

                metric.publish(metricValue)
                    .then(success => {

                        this.trail.push(trace.build());
                        resolve(true);

                    }).catch(error => {

                        const parameters = { resourceType: 'metric', resourceName: metricValue.name }
                        this.trail.push(trace.withError(error).withParameters(parameters).build());

                        const metric = new MetricBuilder(SidecarMetric.DependencyError, 1).withResourceType('metric').withResource(metricValue.name).build()
                        this.publishErrorInContingence(JSON.stringify(metric))
                        reject(error);

                    });

            } else {

                const parameters = { resourceType: 'metric', resourceName: metricValue.name }
                const error: ServiceError = { code: SidecarError.DependencyError, httpStatusCode: 500, resource: metricValue.name, payload: event };
                this.trail.push(trace.withError(error).withParameters(parameters).build());

                const metric = new MetricBuilder(SidecarMetric.DependencyError, 1).withResourceType('metric').withResource(metricValue.name).build()
                this.publishErrorInContingence(JSON.stringify(metric))
                reject(error);

            }

        });

    }

    /**
     * @param event APIGatewayProxyEvent
     * @returns Promise<boolean>
     * @description
     * Publish Error in Configured Metric/LogGroup/LogStream/LogConcentrator
     */
    publishError(error: ServiceError, payload: string): Promise<ServiceError> {

        let e = new Error();
        let frame = e.stack.split("\n")[2];
        let lineNumber = frame.split(":")[1];
        let functionName = frame.split(" ")[5];

        const parameters = { function: functionName, line: lineNumber, error: error }
        const trace = new OperationBuilder(this.traceId, this.operation).withAction('publishError').withParameters(parameters).withPayload(JSON.stringify(payload))
        return new Promise((resolve: Function, reject: Function) => {

            this.trail.push(trace.build());
            resolve(error);

        });
    }

    /**
     * @param event APIGatewayProxyEvent
     * @returns APIGatewayProxyResult
     * @description
     * Create Response Object based on event received
     */
    createResponse(event: APIGatewayProxyEvent, content: Object, objectId: string): APIGatewayProxyResult {

        var result: APIGatewayProxyResult
        const operation = event.httpMethod.toLowerCase()

        if (operation == 'post') {

            const url = event.path + '/' + objectId;
            result = ResponseBuilder.created(url, content)

        } else if (operation == 'delete') {
            result = ResponseBuilder.ok(null);
        } else if (operation == 'put' || operation == 'get') { result = ResponseBuilder.ok(content); }

        return result;

    }

    /**
     * @param error SidecarError
     * @returns APIGatewayProxyResult
     * @description
     * Create Response Object based on throwed error
     */
    createErrorResponse(error: ServiceError): APIGatewayProxyResult {

        switch (error.code) {
            case 'UserNotAuthorized': return ResponseBuilder.forbidden(error.code, this.traceId);
            case 'ResourceNotFound': return ResponseBuilder.notFound(error.code, this.traceId);
            case 'InvalidObjectBody': return ResponseBuilder.badRequest(error.code, this.traceId);
            case 'InvalidOperation': return ResponseBuilder.badRequest(error.code, this.traceId);
            case 'InvalidConfiguration': return ResponseBuilder.internalError(error.code, this.traceId);
            case 'DependencyNotAvailable': return ResponseBuilder.internalError(error.code, this.traceId);
            case 'DependencyError': return ResponseBuilder.internalError(error.code, this.traceId);
            case 'ConfigurationNotAvailable': return ResponseBuilder.internalError(error.code, this.traceId);
            default: return ResponseBuilder.internalError(error.code, this.traceId);
        }

    }

    /**
     * @param event APIGatewayProxyEvent
     * @returns Promise<boolean>
     * @description
     * Publish Error in Configured Metric/LogGroup/LogStream/LogConcentrator
     */
    sendResponse(response: APIGatewayProxyResult, callback: Callback): void {

        this.publishOperationTrail()
        callback(null, response);

    }

    /**
     * @param {string} topicArn
     * @return boolean if permissions whas matched!
     * @description
     * Match permissions of user with resource permissions
     */
    private matchPermissions(): boolean { return true; }

    /**
     * @param message Error message
     * @return void
     * @description
     * Publish Error messages in situations where the defined loggroup, logstream and
     * error metric could not be instantiated.
     */
    private publishOperationTrail(): void {

        if (!isLambda) {
            if (!existsSync('./testreports')) { mkdirSync('./testreports') }
            const filename = new Date().getTime() + '.json'
            writeFileSync('./testreports/lambdaexecution' + filename, JSON.stringify(this.trail, null, 2), 'utf-8');

        }

        //console.log(this.trail);
    }

    /**
     * @param message Error message
     * @return void
     * @description
     * Publish Error messages in situations where the defined loggroup, logstream and
     * error metric could not be instantiated.
     */
    private publishErrorInContingence(message: string): void {

        if (!isLambda) {

            if (!existsSync('./testreports')) { mkdirSync('./testreports') }
            const filename = new Date().getTime() + '.txt'
            writeFileSync('./testreports/console_' + filename, `Publishing Error in Contigence! -> ${message}`, 'utf-8');

        } else {
            console.error('Publishing Error in Contigence!')
            console.error(message);
        }

    }

}

export class SidecarOperation {
    traceId: string;
    operation: string;
    timestamp: Date;
    durationInMillis: number;
    action: string;
    success: boolean;
    parameters?: Object;
    payload?: string;
    error?: Object | SidecarError;

    constructor(builder: OperationBuilder) {
        this.traceId = builder.traceId;
        this.operation = builder.operation;
        this.timestamp = builder.timestamp;
        this.durationInMillis = builder.durationInMillis;
        this.action = builder.action;
        this.success = builder.success;
        this.parameters = builder.parameters;
        this.payload = builder.payload;
        this.error = builder.error;
    }

}

class OperationBuilder {
    traceId: string;
    operation: string;
    timestamp: Date;
    durationInMillis: number;
    action: string;
    success: boolean;
    parameters?: Object;
    payload?: string;
    error?: Object | SidecarError;

    constructor(traceId: string, operation: string) { this.traceId = traceId; this.operation = operation; this.timestamp = new Date(); }

    withAction(name: string): OperationBuilder { this.action = name; return this }
    withParameters(object: Object): OperationBuilder { this.parameters = object; return this }
    withPayload(object: string): OperationBuilder { this.payload = object; return this }
    withError(error: Object | SidecarError): OperationBuilder { this.error = error; return this }

    build(): SidecarOperation {

        const now = new Date();
        this.durationInMillis = (now.getTime() - this.timestamp.getTime());

        if (this.error === null || this.error === undefined) {
            this.success = true;
        } else { this.success = false; }

        return new SidecarOperation(this);

    }

}