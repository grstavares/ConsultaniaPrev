import { SNS, Response } from 'aws-sdk';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { BusinessEvent, InfrastructureMetric } from './types.d';
import { Validator } from 'jsonschema';
import { instituto } from './schema';

enum SidecarErrors {
    userNotAuthorized,
    invalidObjectBody,
    resourceNotAvailable,
    dependencyError,
    configurationNotAvailable,

}

export class Sidecar {

    trail: SidecarOperation[] = []

    /**
     * @param event APIGatewayProxyEvent
     * @return Promise<boolean>
     * @description
     * Verify UserRights to execute the operation!
     * This verification is related to application specific code that can not
     * be verified by AWS Security Services.
     */
    validateRights(event: APIGatewayProxyEvent): Promise<boolean> {
        
        const trace = new OperationBuilder().withAction('validateRights');

        return new Promise((resolve: Function, reject: Function) => {

            if (this.matchPermissions()) {

                this.trail.push(trace.build());
                resolve(true);

            } else {

                const error = { error: SidecarErrors.userNotAuthorized }
                this.trail.push(trace.withError(error).build())
                reject(error);

            }

        });
    }

    /**
     * @param event APIGatewayProxyEvent
     * @return Promise<boolean>
     * @description
     * Verify Event Object!
     * This verification is provided to sanitize values received in Event Object
     * to minimize chances of Event Injection or Event mal processing.
     */
    parseAPIGatewayEvent(event: APIGatewayProxyEvent): Promise<boolean> {

        const trace = new OperationBuilder().withAction('parseAPIGatewayEvent').withPayload(event.body);

        return new Promise((resolve: Function, reject: Function) => {

            const validator = new Validator();
            const payload = event.body
            if (validator.validate(payload, instituto)) {
                this.trail.push(trace.build());
                resolve(true);
            } else {
                const error = { error: SidecarErrors.userNotAuthorized }
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

        return new Promise((resolve: Function, reject: Function) => {

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

        return new Promise((resolve: Function, reject: Function) => {

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
    publishEvent(businessEvent: BusinessEvent, event: APIGatewayProxyEvent): Promise<string> {

        const trace = new OperationBuilder().withAction('publishEvent').withParameters(businessEvent);

        return new Promise((resolve: Function, reject: Function) => {

            if (!businessEvent.topicArn) { reject("[Error] No Topic ARN specified"); }
            
            const region: string|undefined = this.validateTopicArn(businessEvent.topicArn);
            if (region) { reject("[Error] Invalid Topic ARN"); }

            const sns = new SNS({region: region});
            const snsEvent: SNS.PublishInput = { Message: JSON.stringify(businessEvent.body), TopicArn: businessEvent.topicArn };
            sns.publish(snsEvent, (err: AWS.AWSError, data: AWS.SNS.PublishResponse) => { err ? reject(err) : resolve(data.MessageId); });

        });

    }

    /**
     * @param metricName InfrastructureMetric
     * @returns Promise<any>
     * @description
     * Publish Metric Value
     */
    publishMetric(metricName: InfrastructureMetric): Promise<any> { 

        return new Promise((resolve: Function, reject: Function) => {

            resolve(metricName);

        });

    }

    /**
     * @param event APIGatewayProxyEvent
     * @returns Promise<any>
     * @description
     * Create Response Object based on event received
     */
    createResponse(event: APIGatewayProxyEvent): Promise<any> {
        
        return new Promise((resolve: Function, reject: Function) => {

            resolve( {statusCode: 200, message: 'worked'} );

        });
    }

    /**
     * @param {string} topicArn
     * @return boolean if permissions whas matched!
     * @description
     * Match permissions of user with resource permissions
     */
    private matchPermissions(): boolean {return true;}

    /**
     * @param {string} topicArn
     * @return {string|undefined} if valid then return region
     * @description
     * Check wheaterh specified TopicARN is valid or not
     * https://docs.aws.amazon.com/ja_jp/general/latest/gr/aws-arns-and-namespaces.html#arn-syntax-sns
     */
    private validateTopicArn(topicArn: string): string | undefined {
        let splitedTopicArn: string[] = topicArn.split(":");
        if (splitedTopicArn.length < 7) { return undefined; }
        return splitedTopicArn[3];
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