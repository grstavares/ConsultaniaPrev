import { Context, APIGatewayProxyEvent, Callback, APIGatewayProxyResult } from 'aws-lambda';
import { BusinessEvent, InfrastructureMetric, ProxyResolver, ServiceError } from './types.d';
import { AwsHelper } from  './aws-helper';
import { DynamoDB } from 'aws-sdk';

enum SidecarError {
    UserNotAuthorized = 'UserNotAuthorized',
    InvalidObjectBody = 'InvalidObjectBody',
    InvalidOperation = 'InvalidOperation',
    ResourceNotAvailable = 'ResourceNotAvailable',
    DependencyError = 'DependencyError',
    ConfigurationNotAvailable = 'ConfigurationNotAvailable',
    InvalidConfiguration = 'InvalidConfiguration',
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

        const parameters = {bucketName: bucketName, eventId: eventId};
        const trace = new OperationBuilder().withAction('persistOnLake').withPayload(event.body).withParameters(parameters);

        const bucket = this.dependencyResolver.bucket('region', bucketName);
        return new Promise((resolve: Function, reject: Function) => {

            bucket.putObject(eventId, JSON.stringify(event)).then(success => {
    
                this.trail.push(trace.build());
                resolve(true);            
    
            }).catch(error => {

                this.trail.push(trace.withError(error).build());
                reject(error);

            });

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

        const parameters = {tableName: tableName, key: key};
        const trace = new OperationBuilder().withAction('getInTable').withParameters(parameters);

        const table = this.dependencyResolver.table('region', tableName);
        return new Promise((resolve: Function, reject: Function) => {

            table.getItem(key).then((object: DynamoDB.AttributeMap) => {
                const result = AwsHelper.unmarshalObject(object);
                this.trail.push(trace.build());
                resolve(result);
            }).catch((error: ServiceError) => {
                const parameters = { itemId: key }
                this.trail.push(trace.withParameters(parameters).withError(error).build());
                reject(error);
            });

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
        const parameters = {tableName: tableName, key: key, operation: operation};
        const trace = new OperationBuilder().withAction('persistInTable').withPayload(event.body).withParameters(parameters);

        const table = this.dependencyResolver.table('region', tableName);
        return new Promise((resolve: Function, reject: Function) => {

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
                const error = SidecarError.InvalidOperation;
                this.trail.push(trace.withParameters(parameters).withError(error).build());
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

            topic.publish(businessEvent.body).then(messageId => {

                const parameters = { messageId: messageId }
                this.trail.push(trace.withParameters(parameters).build());
                resolve(true);

            }).catch(error => {

                this.trail.push(trace.withError(error).build());
                reject(error);

            });

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

            metric.publish(metricValue.metricArn, JSON.stringify(metricValue.value))
            .then(success => {

                this.trail.push(trace.build());
                resolve(true);

            }).catch(error => {

                this.trail.push(trace.withError(error).build());
                reject(error);

            });

        });

    }

    /**
     * @param event APIGatewayProxyEvent
     * @returns APIGatewayProxyResult
     * @description
     * Create Response Object based on event received
     */
    createResponse(event: APIGatewayProxyEvent, operation: string, content: Object): APIGatewayProxyResult {
        
        const result = {statusCode: 200, body: JSON.stringify(event)}
        return result;
    
    }

    /**
     * @param error SidecarError
     * @returns APIGatewayProxyResult
     * @description
     * Create Response Object based on throwed error
     */
    createErrorResponse(error: ServiceError): APIGatewayProxyResult {
        
        const result = {statusCode: error.httpStatusCode, body: ''}
        return result;
    
    }

    /**
     * @param event APIGatewayProxyEvent
     * @returns Promise<boolean>
     * @description
     * Publish Error in Configured Metric/LogGroup/LogStream/LogConcentrator
     */
    publishError(error: ServiceError, payload: string): Promise<ServiceError> {
        
        return new Promise((resolve: Function, reject: Function) => {

            resolve(error);

        });
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
    private matchPermissions(): boolean {return true;}

    /**
     * @param error SidecarError
     * @return InfrastructureMetric
     * @description
     * Create a Metric Object based on Error
     */
    private createMetricFromError(error: SidecarError): InfrastructureMetric {

        const metric: InfrastructureMetric = {
            metricArn: '',
            value: { value: 1 }
        }

        return metric;

    }

    private gerErrorCode(error: SidecarError): number {

        switch (error) {
            case SidecarError.UserNotAuthorized:return 403;
            case SidecarError.InvalidObjectBody: return 400;
            case SidecarError.InvalidOperation: return 400;
            case SidecarError.ResourceNotAvailable: return 500;
            case SidecarError.DependencyError: return 500;
            case SidecarError.ConfigurationNotAvailable: return 500;
            case SidecarError.InvalidConfiguration: return 500;
            default: return 500;
        }

    }


    /**
     * @param message Error message
     * @return void
     * @description
     * Publish Error messages in situations where the defined loggroup, logstream and
     * error metric could not be instantiated.
     */
    private publishOperationTrail(): void {
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
        console.error('Publishing Error in Contigence!')
        console.error(message);
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

    constructor() {this.timestamp = new Date();}

    withAction(name: string): OperationBuilder { this.action = name; return this }
    withParameters(object: Object): OperationBuilder { this.parameters = object; return this }
    withPayload(object: string): OperationBuilder { this.payload = object; return this }
    withError(error: Object): OperationBuilder { this.error = error; return this }

    build(): SidecarOperation {

        const now = new Date();
        this.durationInMillis = (now.getTime() - this.timestamp.getTime());

        if (this.error === null || this.error === undefined) {this.success = true;
        } else { this.success = false; }

        return new SidecarOperation(this);

    }

}