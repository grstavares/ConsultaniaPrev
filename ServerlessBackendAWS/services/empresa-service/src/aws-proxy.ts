import { ProxyTable, ProxyS3Bucket, ProxySnsTopic, ProxyMetric, ProxyResolver, ProxySnsMessage, ProxyError } from './types';
import { SNS, DynamoDB } from 'aws-sdk';

interface CachedObject<T> {
    type: string;
    key: string;
    object: T
}

export class AWSProxyResolver implements ProxyResolver {

    topicsCache: CachedObject<ProxySnsTopic>[] = [];
    bucketCache: CachedObject<ProxyS3Bucket>[] = [];
    metricCache: CachedObject<ProxyMetric>[] = [];
    tablesCache: CachedObject<ProxyTable>[] = [];

    topic(topicArn: string): ProxySnsTopic {
        
        const objectKey = 'topic_' + topicArn
        const cached = this.topicsCache.filter((value) => { value.key === objectKey })
        if (cached.length > 0) { return cached[0].object
        } else { return new AWSTopic(topicArn) }
    
    }

    bucket(region: string, name: string): ProxyS3Bucket  {
        
        const objectKey = 'bucket_' + region + name
        const cached = this.bucketCache.filter((value) => { value.key === objectKey })
        if (cached.length > 0) { return cached[0].object
        } else { return new AWSBucket(region, name) }
    
    }

    metric(region: string, name: string): ProxyMetric  {
        
        const objectKey = 'metric_' + region + name
        const cached = this.metricCache.filter((value) => { value.key === objectKey })
        if (cached.length > 0) { return cached[0].object
        } else { return new AWSMetric(region, name) }
    
    }
    
    table(region: string, name: string): ProxyTable  {
        
        const objectKey = 'table_' + region + name
        const cached = this.tablesCache.filter((value) => { value.key === objectKey })
        if (cached.length > 0) { return cached[0].object
        } else { return new AWSTable(region, name) }
    
    }

}

export class AWSTopic implements ProxySnsTopic {

    private Errors = {
        invalidArn: 'invalidConfiguration'
    }

    constructor(private arn: string) {}

    publish(message: ProxySnsMessage): Promise<string> {

        return new Promise((resolve: Function, reject: Function) => {

            const region: string|undefined = this.validateArnAndReturnRegion(message.TopicArn);
            if (!region) { reject({ code: this.Errors.invalidArn, resource: this.arn }) }

            const sns = new SNS({region: region});
            const snsEvent: SNS.PublishInput = { Message: JSON.stringify(message), TopicArn: this.arn };

            sns.publish(snsEvent, (err: AWS.AWSError, data: AWS.SNS.PublishResponse) => {

                if (err) {reject(AWSHelper.parseAWSError(err))
                } else { resolve( data.MessageId); }

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
    constructor(private region: string, private name: string) { }
    getObject<T>(key: string): Promise<T> { return new Promise((resolve: Function, reject: Function) => { resolve(null); }); }
    putObject(key: string, content: Object): Promise<boolean> { return new Promise((resolve: Function, reject: Function) => { resolve(true); }); }
}

export class AWSMetric implements ProxyMetric {
    constructor(private region: string, private name: string) { }
    publish(name: string, value: string): Promise<boolean> { return new Promise((resolve: Function, reject: Function) => { resolve(true); }); }
}

export class AWSTable implements ProxyTable {

    constructor(private region: string, private name: string) { }
    
    marshalObject(object: Object): DynamoDB.AttributeMap {
        
        const marshsalled = DynamoDB.Converter.marshall(object, { convertEmptyValues: true, wrapNumbers: true })
        return marshsalled;

    }

    unmarshalObject(object: DynamoDB.AttributeMap): Object {

        const unmarshsalled = DynamoDB.Converter.unmarshall(object, { convertEmptyValues: true, wrapNumbers: true })
        return unmarshsalled;

    }

    putItem(object: Object): Promise<boolean> { return new Promise((resolve: Function, reject: Function) => { 
        
        const input = DynamoDB.Converter.input(object, { convertEmptyValues: true, wrapNumbers: true })
        const marshsalled = DynamoDB.Converter.marshall(object, { convertEmptyValues: true, wrapNumbers: true })

        resolve(true); });
    
    }

    deleteItem(object: Object): Promise<boolean> { return new Promise((resolve: Function, reject: Function) => { resolve(true); }); }
}

class AWSHelper {

    public static parseAWSError(error: AWS.AWSError): ProxyError {
        return { code: 'invalid', resource: '', payload: '' }
    }

}