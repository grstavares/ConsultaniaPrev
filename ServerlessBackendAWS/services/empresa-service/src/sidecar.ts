import { Context, APIGatewayProxyEvent, Callback, APIGatewayProxyResult } from 'aws-lambda';
import { BusinessEvent, InfrastructureMetric, ProxyResolver, ServiceError } from './types.d';
import { AwsHelper } from './aws-helper';
import { DynamoDB } from 'aws-sdk';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { ResponseBuilder } from './utilities';

const isLambda = !!(process.env.LAMBDA_TASK_ROOT || false);

enum SidecarError {
    UserNotAuthorized = 'UserNotAuthorized',
    ResourceNotFound = 'ResourceNotFound',
    InvalidObjectBody = 'InvalidObjectBody',
    InvalidOperation = 'InvalidOperation',
    InvalidConfiguration = 'InvalidConfiguration',
    DependencyNotAvailable = 'DependencyNotAvailable',
    DependencyError = 'DependencyError',
    ConfigurationNotAvailable = 'ConfigurationNotAvailable',
    undefined = 'undefined'
}

export class Sidecar {

    trail: SidecarOperation[] = []

    constructor(private dependencyResolver: ProxyResolver, private lambdaContext: Context) { }

    /**
     * @param event APIGatewayProxyEvent
     * @return Promise<boolean>
     * @description
     * Verify UserRights to execute the operation!
     * This verification is related to application specific code that can not
     * be verified by AWS Security Services.
     */
    userIsAuthorizedToPerformOperation(event: APIGatewayProxyEvent): Promise<boolean> {

        const trace = new OperationBuilder().withAction('userIsAuthorizedToPerformOperation');

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

    // /**
    //  * @param event APIGatewayProxyEvent
    //  * @return Promise<boolean>
    //  * @description
    //  * Verify Event Object!
    //  * This verification is provided to sanitize values received in Event Object
    //  * to minimize chances of Event Injection or Event mal processing.
    //  */
    // parseAPIGatewayEvent(event: APIGatewayProxyEvent): Promise<boolean> {

    //     const trace = new OperationBuilder().withAction('parseAPIGatewayEvent').withPayload(event.body);

    //     return new Promise((resolve: Function, reject: Function) => {

    //         // const validator = new Validator();
    //         // const payload = event.body
    //         // if (validator.validate(payload, instituto)) {
    //             this.trail.push(trace.build());
    //             resolve(true);
    //         // } else {
    //         //     const error = { error: SidecarError.userNotAuthorized }
    //         //     this.trail.push(trace.withError(error).build())
    //         //     reject(error);
    //         // }

    //     });
    // }

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
        const trace = new OperationBuilder().withAction('persistOnLake').withPayload(event.body).withParameters(parameters);

        const bucket = this.dependencyResolver.bucket('region', bucketName);
        return new Promise((resolve: Function, reject: Function) => {

            if (bucket) {

                bucket.putObject(eventId, JSON.stringify(event)).then(success => {
                    this.trail.push(trace.build());
                    resolve(true);
                }).catch(error => {
                    this.trail.push(trace.withError(error).build());
                    reject(error);
                });

            } else {

                const parameters = { resourceType: 'bucket', resourceName: bucketName }
                const error: ServiceError = {code: SidecarError.DependencyNotAvailable, httpStatusCode: 500, resource: bucketName, payload: event};
                this.publishMetric({ metricArn: error.code, value: 1 })
                this.trail.push(trace.withError(error).withParameters(parameters).build());
                reject(error);

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
    getInTable(tableName: string, key: string): Promise<Object> {

        const parameters = { tableName: tableName, key: key };
        const trace = new OperationBuilder().withAction('getInTable').withParameters(parameters);

        const table = this.dependencyResolver.table('region', tableName);
        return new Promise((resolve: Function, reject: Function) => {

            if (table) {

                table.getItem(key).then((object: DynamoDB.AttributeMap) => {

                    if (object) {
                        const result = AwsHelper.unmarshalObject(object);
                        this.trail.push(trace.build());
                        resolve(result);
                    } else {
                        const error: ServiceError = {code: SidecarError.ResourceNotFound, httpStatusCode: 404, resource: tableName + '/' + key};
                        this.trail.push(trace.withError(error).withParameters(parameters).build());
                        reject(error);
                    }

                }).catch((error: ServiceError) => {
                    const parameters = { itemId: key }
                    this.trail.push(trace.withParameters(parameters).withError(error).build());
                    reject(error);
                });

            } else {

                const parameters = { resourceType: 'table', resourceName: tableName }
                const error: ServiceError = {code: SidecarError.DependencyNotAvailable, httpStatusCode: 500, resource: tableName, payload: event};
                this.publishMetric({ metricArn: error.code, value: 1 })
                this.trail.push(trace.withError(error).withParameters(parameters).build());
                reject(error);

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
    persistInTable(tableName: string, key: string, event: APIGatewayProxyEvent): Promise<boolean> {

        const operation = event.httpMethod;
        const parameters = { tableName: tableName, key: key, operation: operation };
        const trace = new OperationBuilder().withAction('persistInTable').withPayload(event.body).withParameters(parameters);

        const table = this.dependencyResolver.table('region', tableName);
        return new Promise((resolve: Function, reject: Function) => {

            if (table) {

                if (operation.toLowerCase() === 'post' || operation.toLowerCase() === 'put') {

                    const payload = AwsHelper.marshalObject(event.body);
                    table.putItem(key, payload).then(success => {
                        this.trail.push(trace.build());
                        resolve(true);
                    }).catch(error => {
                        this.trail.push(trace.withError(error).build());
                        reject(error);
                    });

                } else if (operation.toLowerCase() === 'delete') {

                    table.deleteItem(key).then(success => {
                        this.trail.push(trace.build());
                        resolve(true);
                    }).catch(error => {
                        this.trail.push(trace.withError(error).build());
                        reject(error);
                    });

                } else {

                    const parameters = { requestedOperation: operation }
                    const error: ServiceError = {code: SidecarError.InvalidOperation, httpStatusCode: 405, resource: tableName, payload: event};
                    this.trail.push(trace.withParameters(parameters).withError(error).build());
                    reject(error);

                }

            } else {

                const parameters = { resourceType: 'table', resourceName: tableName }
                const error: ServiceError = {code: SidecarError.DependencyNotAvailable, httpStatusCode: 500, resource: tableName, payload: event};
                this.publishMetric({ metricArn: error.code, value: 1 })
                this.trail.push(trace.withError(error).withParameters(parameters).build());
                reject(error);

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

        const trace = new OperationBuilder().withAction('publishEvent').withPayload(JSON.stringify(businessEvent))
        const topic = this.dependencyResolver.topic(topicArn);

        return new Promise((resolve: Function, reject: Function) => {

            if (topic) {

                topic.publish(businessEvent.body).then(messageId => {

                    const parameters = { messageId: messageId }
                    this.trail.push(trace.withParameters(parameters).build());
                    resolve(true);

                }).catch(error => {

                    this.trail.push(trace.withError(error).build());
                    reject(error);

                });

            } else {

                const parameters = { resourceType: 'topic', resourceName: topicArn }
                const error: ServiceError = {code: SidecarError.DependencyNotAvailable, httpStatusCode: 500, resource: topicArn, payload: event};
                this.publishMetric({ metricArn: error.code, value: 1 })
                this.trail.push(trace.withError(error).withParameters(parameters).build());
                reject(error);

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

        const trace = new OperationBuilder().withAction('publishMetric').withPayload(JSON.stringify(metricValue))
        const metric = this.dependencyResolver.metric('region', metricValue.metricArn);
        return new Promise((resolve: Function, reject: Function) => {

            if (metric) {

                metric.publish(metricValue.metricArn, JSON.stringify(metricValue.value))
                    .then(success => {

                        this.trail.push(trace.build());
                        resolve(true);

                    }).catch(error => {

                        this.trail.push(trace.withError(error).build());
                        reject(error);

                    });

            } else {

                const parameters = { resourceType: 'metric', resourceName: metricValue.metricArn }
                const error: ServiceError = {code: SidecarError.DependencyNotAvailable, httpStatusCode: 500, resource: metricValue.metricArn, payload: event};
                this.publishErrorInContingence(JSON.stringify(error))
                this.publishErrorInContingence(JSON.stringify({ metricArn: error.code, value: 1 }))
                this.trail.push(trace.withError(error).withParameters(parameters).build());
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

        console.log('publishing error')

        let e = new Error();
        let frame = e.stack.split("\n")[2];
        let lineNumber = frame.split(":")[1];
        let functionName = frame.split(" ")[5];

        const parameters = { function: functionName, line: lineNumber, error: error }
        const trace = new OperationBuilder().withAction('publishError').withParameters(parameters).withPayload(JSON.stringify(payload))
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

        var result:APIGatewayProxyResult
        const operation = event.httpMethod.toLowerCase()

        if (operation == 'post') { 

            const url = event.path + '/' + objectId;
            result = ResponseBuilder.created(url, content)

        } else if (operation == 'delete') {result = ResponseBuilder.ok(null);
        } else if (operation == 'put' || operation == 'get') {result = ResponseBuilder.ok(content);}

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
            case 'UserNotAuthorized': return ResponseBuilder.forbidden(error.resource, ''); 
            case 'ResourceNotFound': return ResponseBuilder.notFound(error.resource, ''); 
            case 'InvalidObjectBody': return ResponseBuilder.badRequest(error.resource, '');
            case 'InvalidOperation' : return ResponseBuilder.badRequest(error.resource, '');
            case 'InvalidConfiguration': return ResponseBuilder.internalError(error.resource, '');
            case 'DependencyNotAvailable': return ResponseBuilder.internalError(error.resource, '');
            case 'DependencyError': return ResponseBuilder.internalError(error.resource, '');
            case 'ConfigurationNotAvailable': return ResponseBuilder.internalError(error.resource, '');
            default: return ResponseBuilder.internalError(error.resource, '');
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
            if (!existsSync('./testreports')) {mkdirSync('./testreports')}
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

            const filename = new Date().getTime() + '.json'
            writeFileSync('./console_' + filename, JSON.stringify(this.trail, null, 2), 'utf-8');

        } else {
            console.error('Publishing Error in Contigence!')
            console.error(message);
        }

    }

}

export class SidecarOperation {
    timestamp: Date;
    durationInMillis: number;
    action: string;
    success: boolean;
    parameters?: Object;
    payload?: string;
    error?: Object;

    constructor(builder: OperationBuilder) {
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

    timestamp: Date;
    durationInMillis: number;
    action: string;
    success: boolean;
    parameters?: Object;
    payload?: string;
    error?: Object;

    constructor() { this.timestamp = new Date(); }

    withAction(name: string): OperationBuilder { this.action = name; return this }
    withParameters(object: Object): OperationBuilder { this.parameters = object; return this }
    withPayload(object: string): OperationBuilder { this.payload = object; return this }
    withError(error: Object): OperationBuilder { this.error = error; return this }

    build(): SidecarOperation {

        const now = new Date();
        this.durationInMillis = (now.getTime() - this.timestamp.getTime());

        if (this.error === null || this.error === undefined) {
            this.success = true;
        } else { this.success = false; }

        return new SidecarOperation(this);

    }

}