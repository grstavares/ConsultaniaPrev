import { ProxyTable, ProxyS3Bucket, ProxySnsTopic, ProxyMetric, ProxyResolver, ProxySnsMessage, ServiceError, InfrastructureMetric } from './types';
import { SNS, DynamoDB, CloudWatch, config, AWSError, S3 } from 'aws-sdk';
import { AwsHelper } from './aws-helper';

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

    constructor(private config: AWSConfiguration) { }

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

        const docClient = new DynamoDB.DocumentClient()

        const objectKey = 'table_' + arn
        const cached = this.tablesCache.filter((value) => { value.key === objectKey })
        if (cached.length > 0) {
            return cached[0].object
        } else { return new AWSTable(docClient, arn) }

    }

}

export class AWSTopic implements ProxySnsTopic {

    private Errors = {
        invalidArn: 'invalidConfiguration'
    }

    constructor(private arn: string) { }

    publish(message: ProxySnsMessage): Promise<string> {

        return new Promise((resolve: Function, reject: Function) => {

            const region: string | undefined = this.validateArnAndReturnRegion(message.TopicArn);
            if (!region) { reject({ code: this.Errors.invalidArn, resource: this.arn }) }

            const sns = new SNS({ region: region });
            const snsEvent: SNS.PublishInput = { Message: JSON.stringify(message), TopicArn: this.arn };

            sns.publish(snsEvent, (error: AWS.AWSError, data: AWS.SNS.PublishResponse) => {

                if (error) { reject(AwsHelper.parseAWSError(error))
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

    s3 = new S3();

    constructor(private region: string, private name: string) { }

    getObject(key: string): Promise<Object> {
        
        const getObjectParams = { Bucket: this.name,  Key: key };
        return new Promise((resolve: Function, reject: Function) => {
            
            this.s3.getObject(getObjectParams, (error: AWSError, data: S3.GetObjectOutput) => {

                if (error) { reject(AwsHelper.parseAWSError(error))
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

                if (error) { reject(AwsHelper.parseAWSError(error))
                } else { resolve(data); }

            })

            resolve(null); 
        
        });
    
    }

}

export class AWSMetric implements ProxyMetric {

    cloudwatch: CloudWatch
    defaultDimensions: {Name: string; Value: string}[]

    constructor(private configuration: AWSConfiguration) {

        this.cloudwatch = new CloudWatch();
        this.defaultDimensions.push({ Name: 'function', Value: configuration.functionName })
        this.defaultDimensions.push({ Name: 'stage', Value: configuration.functionStage })
        this.defaultDimensions.push({ Name: 'version', Value: configuration.functionVersion })

    }

    publish(metric: InfrastructureMetric): Promise<boolean> {

        return new Promise((resolve: Function, reject: Function) => {

            const newDimensions = Object.assign(metric.dimensions, this.defaultDimensions)

            const metricData: CloudWatch.PutMetricDataInput = {
                Namespace: this.configuration.appName,
                MetricData: [{
                    MetricName: metric.name,
                    Dimensions: newDimensions,
                    Timestamp: metric.timestamp,
                    Value: metric.value,
                    Unit: 'Count',
                    StorageResolution: this.configuration.metricStorage
                }]
            }

            this.cloudwatch.putMetricData(metricData, (error: AWSError, data) => {

                if (error) {reject(AwsHelper.parseAWSError(error))
                } else {resolve(true);}

            })

        });

    }
}

export class AWSTable implements ProxyTable {

    constructor(private docClient: DynamoDB.DocumentClient, private tableName: string) { }

    getItem(keys: { [key: string]: any }): Promise<Object> {

        var getItemParams: DynamoDB.DocumentClient.GetItemInput = { Key: keys, TableName: this.tableName, ReturnConsumedCapacity: 'TOTAL' };

        return new Promise((resolve: Function, reject: Function) => {

            this.docClient.get(getItemParams, function (err, data: DynamoDB.DocumentClient.GetItemOutput) {

                if (!err) {
                    const result = data.Item ? data.Item : null
                    resolve(result);
                } else { reject(AwsHelper.parseAWSError(err)); }

            });

        });

    }

    putItem(keys: { [key: string]: any }, object: Object): Promise<boolean> {

        var putItemParams: DynamoDB.DocumentClient.PutItemInput = { TableName: this.tableName, Item: object, ReturnConsumedCapacity: 'TOTAL' };

        return new Promise((resolve: Function, reject: Function) => {

            this.docClient.put(putItemParams, function (err, data: DynamoDB.DocumentClient.PutItemOutput) {

                if (!err) {
                    resolve(true);
                } else { reject(AwsHelper.parseAWSError(err)); }

            });

        });

    }

    deleteItem(keys: { [key: string]: any }): Promise<boolean> {

        var deleteItemParams: DynamoDB.DocumentClient.DeleteItemInput = { TableName: this.tableName, Key: keys, ReturnConsumedCapacity: 'TOTAL' };

        return new Promise((resolve: Function, reject: Function) => {

            this.docClient.delete(deleteItemParams, function (err, data: DynamoDB.DocumentClient.DeleteItemOutput) {

                if (!err) {
                    resolve(true);
                } else { reject(AwsHelper.parseAWSError(err)); }

            });

        });

    }

}