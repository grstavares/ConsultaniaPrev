import { ProxyTable, ProxyS3Bucket, ProxySnsTopic, ProxyMetric, ProxyResolver, ProxySnsMessage, ServiceError, InfrastructureMetric, InfrastructureMetricDimension } from './types';
import { SNS, DynamoDB, CloudWatch, AWSError, S3 } from 'aws-sdk';
import { AwsHelper } from './aws-helper';

var AWSXRay = require('aws-xray-sdk');

interface CachedObject<T> {
    type: string;
    key: string;
    object: T
}

export interface AWSConfiguration {
    appName: string;
    metricStorage: number;
    functionName: string;
    functionStage: string;
    functionVersion: string;
}

export class AWSProxyResolver implements ProxyResolver {

    topicsCache: CachedObject<ProxySnsTopic>[] = [];
    bucketCache: CachedObject<ProxyS3Bucket>[] = [];
    metricCache: CachedObject<ProxyMetric>[] = [];
    tablesCache: CachedObject<ProxyTable>[] = [];

    constructor(private config: AWSConfiguration) { AWSXRay.enableManualMode(); }

    topic(arn): ProxySnsTopic {

        const objectKey = 'topic_' + arn
        const cached = this.topicsCache.filter((value) => { value.key === objectKey })
        if (cached.length > 0) {
            return cached[0].object
        } else { return new AWSTopic(arn) }

    }

    bucket(region: string, name: string): ProxyS3Bucket {

        const objectKey = 'bucket_' + region + name
        const cached = this.bucketCache.filter((value) => { value.key === objectKey })
        if (cached.length > 0) {
            return cached[0].object
        } else { return new AWSBucket(region, name) }

    }

    metric(): ProxyMetric {

        const objectKey = 'metric_' + this.config.appName
        const cached = this.metricCache.filter((value) => { value.key === objectKey })
        if (cached.length > 0) {
            return cached[0].object
        } else { return new AWSMetric(this.config) }

    }

    table(arn: string): ProxyTable {

        const dynamoClient = AWSXRay.captureAWSClient(new DynamoDB());
        const documentClient = new DynamoDB.DocumentClient()

        const objectKey = 'table_' + arn
        const cached = this.tablesCache.filter((value) => { value.key === objectKey })
        if (cached.length > 0) {
            return cached[0].object
        } else { return new AWSTable(dynamoClient, documentClient, arn) }

    }

}

export class AWSTopic implements ProxySnsTopic {

    private Errors = {
        invalidArn: 'invalidConfiguration'
    }

    constructor(private arn: string) { }

    publish(message: ProxySnsMessage): Promise<string> {

        return new Promise((resolve: Function, reject: Function) => {

            const sns = AWSXRay.captureAWSClient(new SNS());
            const snsEvent: SNS.PublishInput = { Message: JSON.stringify(message), TopicArn: this.arn };

            sns.publish(snsEvent, (error: AWS.AWSError, data: AWS.SNS.PublishResponse) => {

                if (error) { reject(AwsHelper.parseAWSError(error, {type: 'topic', name: this.arn}))
                } else { resolve(data.MessageId); }

            });

        })

    }

    /**
     * @param {string} topicArn
     * @return {string|undefined} if valid then return region
     * @description
     * Check wheaterh specified TopicARN is valid or not
     * https://docs.aws.amazon.com/ja_jp/general/latest/gr/aws-arns-and-namespaces.html#arn-syntax-sns
     */
    private validateArnAndReturnRegion(arn: string): string | undefined {
        let splitedTopicArn: string[] = arn.split(":");
        if (splitedTopicArn.length < 7) { return undefined; }
        return splitedTopicArn[3];
    }

}

export class AWSBucket implements ProxyS3Bucket {

    s3 = AWSXRay.captureAWSClient(new S3());

    constructor(private region: string, private name: string) { }

    getObject(key: string): Promise<Object> {
        
        const getObjectParams = { Bucket: this.name,  Key: key };
        return new Promise((resolve: Function, reject: Function) => {
            
            this.s3.getObject(getObjectParams, (error: AWSError, data: S3.GetObjectOutput) => {

                if (error) { reject(AwsHelper.parseAWSError(error, {type: 'bucket', name: this.name}))
                } else { resolve(data); }

            })

            resolve(null); 
        
        });
    
    }

    putObject(key: string, content: Object): Promise<boolean> {
        
        const putObjectParams:S3.PutObjectRequest = {
            Bucket: this.name,
            Key: key,
            Body: JSON.stringify(content),
            ContentType: 'application/json',
        };
        return new Promise((resolve: Function, reject: Function) => {
            
            this.s3.putObject(putObjectParams, (error: AWSError, data: S3.PutObjectOutput) => {

                if (error) { reject(AwsHelper.parseAWSError(error, {type: 'bucket', name: this.name}))
                } else { resolve(data); }

            })

            resolve(null); 
        
        });
    
    }

}

export class AWSMetric implements ProxyMetric {

    cloudwatch: CloudWatch
    dimensions: InfrastructureMetricDimension[] = []

    constructor(private configuration: AWSConfiguration) {

        this.cloudwatch = new CloudWatch();
        this.dimensions.push({ Name: 'function', Value: configuration.functionName })
        this.dimensions.push({ Name: 'stage', Value: configuration.functionStage })
        this.dimensions.push({ Name: 'version', Value: configuration.functionVersion })

    }

    publish(metric: InfrastructureMetric): Promise<boolean> {

        return new Promise((resolve: Function, reject: Function) => {

            const newDimensions = metric.dimensions;
            for(var i = 0; i < newDimensions.length; i++) { this.dimensions.push(newDimensions[i]) }

            const metricData: CloudWatch.PutMetricDataInput = {
                Namespace: this.configuration.appName,
                MetricData: [{
                    MetricName: metric.name,
                    Dimensions: this.dimensions,
                    Timestamp: metric.timestamp,
                    Value: metric.value,
                    Unit: 'Count',
                    StorageResolution: 60
                }]
            }

            this.cloudwatch.putMetricData(metricData, (error: AWSError, data) => {

                if (error) {reject(AwsHelper.parseAWSError(error, {type: 'metric', name: metric.name}))
                } else {resolve(true);}

            })

        });

    }
}

export class AWSTable implements ProxyTable {

    constructor(private dynamo: DynamoDB, private docClient: DynamoDB.DocumentClient, private tableName: string) { }

    getItem(keys: { [key: string]: any }): Promise<Object> {

        var getItemParams: DynamoDB.GetItemInput = { Key: keys, TableName: this.tableName, ReturnConsumedCapacity: 'TOTAL' };

        return new Promise((resolve: Function, reject: Function) => {

            this.dynamo.getItem(getItemParams).promise()
            .then(result => resolve(result.Item ? AwsHelper.unmarshalObject(result.Item) : null))
            .catch(error => reject(AwsHelper.parseAWSError(error, {type: 'table', name: this.tableName} )))

        });

    }

    putItem(keys: { [key: string]: any }, object: Object): Promise<boolean> {

        const payload = AwsHelper.marshalObject(object);
        const putObject:DynamoDB.PutItemInput = { 'TableName': this.tableName, 'Item': payload, ReturnConsumedCapacity: 'TOTAL' }

        return new Promise((resolve: Function, reject: Function) => {

            this.dynamo.putItem(putObject).promise()
            .then(result => {
                resolve(true)
            })
            .catch(error => {
                reject(AwsHelper.parseAWSError(error, {type: 'table', name: this.tableName} ))
            })

        });

    }

    deleteItem(keys: { [key: string]: any }): Promise<boolean> {

        var deleteItemParams: DynamoDB.DeleteItemInput = { TableName: this.tableName, Key: keys, ReturnConsumedCapacity: 'TOTAL' };

        return new Promise((resolve: Function, reject: Function) => {

            this.dynamo.deleteItem(deleteItemParams).promise()
            .then(result => resolve(true))
            .catch(error => reject(AwsHelper.parseAWSError(error, {type: 'table', name: this.tableName} )))

        });

    }

}