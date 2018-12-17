import { SNS } from 'aws-sdk';
import { Context, APIGatewayProxyEvent, Callback, APIGatewayProxyResult } from 'aws-lambda';
import { BusinessEvent, InfrastructureMetric, ProxyResolver, ProxySnsMessage } from './types.d';
import { ResponseBuilder } from './utilities';
import { instituto } from './schema';

enum SidecarError {
    userNotAuthorized,
    invalidObjectBody,
    resourceNotAvailable,
    dependencyError,
    dependencyErrorSns,
    configurationNotAvailable,
    invalidConfiguration,
    undefined
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

                const error = { error: SidecarError.userNotAuthorized }
                this.trail.push(trace.withError(error).build())
                const response = ResponseBuilder.forbidden('Auth Failed!', this.lambdaContext.awsRequestId)
                reject(response);

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

        return new Promise((resolve: Function, reject: Function) => {

            this.trail.push(trace.build());
            resolve(true);

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
    persistInTable(tableName: string, key: string, object: string): Promise<boolean> {

        const parameters = {tableName: tableName, key: key};
        const trace = new OperationBuilder().withAction('persistInTable').withPayload(object).withParameters(parameters);

        return new Promise((resolve: Function, reject: Function) => {

            this.trail.push(trace.build());
            resolve(true);

        });
    
    }

    /**
     * @param businessEvent BusinessEvent
     * @param event APIGatewayProxyEvent
     * @returns Promise<string>
     * @description
     * Publish Event in SNS Topic
     */
    publishEvent(businessEvent: BusinessEvent, event: APIGatewayProxyEvent): Promise<boolean> {

        const trace = new OperationBuilder().withAction('publishEvent')

        return new Promise((resolve: Function, reject: Function) => {

            this.trail.push(trace.build());
            resolve(true);

            // if (!businessEvent.topicArn) {
                
            //     const metric = this.createMetricFromError(SidecarError.configurationNotAvailable);
            //     this.publishMetric(metric)
            //     .then(reject(SidecarError.configurationNotAvailable))
            //     .catch(reject(SidecarError.configurationNotAvailable))
            //     return

            // }
            
            // const sns = this.dependencyResolver.topic('unecessary parameter');
            // const msg: ProxySnsMessage = { Message: JSON.stringify(businessEvent.body), TopicArn: businessEvent.topicArn };
            // sns.publish(msg).then(messageId => {

            //     const tracePayload:Object = Object.assign({ messageId: messageId }, businessEvent);
            //     const stringfyPayload = JSON.stringify(tracePayload);
            //     this.trail.push(trace.withPayload(stringfyPayload).build());
            //     resolve(true);

            // }).catch(publishError => {

            //     const stringfyPayload = JSON.stringify(businessEvent);
            //     this.trail.push(trace.withPayload(stringfyPayload).withError(publishError).build());

            //     const metric = this.createMetricFromError(SidecarError.dependencyErrorSns);
            //     this.publishMetric(metric);

            //     reject(SidecarError.dependencyErrorSns);

            // })

        });

    }

    /**
     * @param metricValue InfrastructureMetric
     * @returns Promise<any>
     * @description
     * Publish Metric Value
     */
    publishMetric(metricValue: InfrastructureMetric): Promise<boolean> { 

        return new Promise((resolve: Function, reject: Function) => {

            resolve(true);

        });

    }

    /**
     * @param event APIGatewayProxyEvent
     * @returns APIGatewayProxyResult
     * @description
     * Create Response Object based on event received
     */
    createResponse(event: APIGatewayProxyEvent): APIGatewayProxyResult {
        
        const result = {statusCode: 200, body: JSON.stringify(event)}
        return result;
    
    }

    /**
     * @param error SidecarError
     * @returns APIGatewayProxyResult
     * @description
     * Create Response Object based on throwed error
     */
    createErrorResponse(error: SidecarError): APIGatewayProxyResult {
        
        const result = {statusCode: 200, body: JSON.stringify(error)}
        return result;
    
    }

    /**
     * @param event APIGatewayProxyEvent
     * @returns Promise<boolean>
     * @description
     * Publish Error in Configured Metric/LogGroup/LogStream/LogConcentrator
     */
    publishError(error: SidecarError, payload: string): Promise<SidecarError> {
        
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