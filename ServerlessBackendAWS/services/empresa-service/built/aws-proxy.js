"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
class AWSProxyResolver {
    constructor() {
        this.topicsCache = [];
        this.bucketCache = [];
        this.metricCache = [];
        this.tablesCache = [];
    }
    topic(topicArn) {
        const objectKey = 'topic_' + topicArn;
        const cached = this.topicsCache.filter((value) => { value.key === objectKey; });
        if (cached.length > 0) {
            return cached[0].object;
        }
        else {
            return new AWSTopic(topicArn);
        }
    }
    bucket(region, name) {
        const objectKey = 'bucket_' + region + name;
        const cached = this.bucketCache.filter((value) => { value.key === objectKey; });
        if (cached.length > 0) {
            return cached[0].object;
        }
        else {
            return new AWSBucket(region, name);
        }
    }
    metric(region, name) {
        const objectKey = 'metric_' + region + name;
        const cached = this.metricCache.filter((value) => { value.key === objectKey; });
        if (cached.length > 0) {
            return cached[0].object;
        }
        else {
            return new AWSMetric(region, name);
        }
    }
    table(region, name) {
        const objectKey = 'table_' + region + name;
        const cached = this.tablesCache.filter((value) => { value.key === objectKey; });
        if (cached.length > 0) {
            return cached[0].object;
        }
        else {
            return new AWSTable(region, name);
        }
    }
}
exports.AWSProxyResolver = AWSProxyResolver;
class AWSTopic {
    constructor(arn) {
        this.arn = arn;
        this.Errors = {
            invalidArn: 'invalidConfiguration'
        };
    }
    publish(message) {
        return new Promise((resolve, reject) => {
            const region = this.validateArnAndReturnRegion(message.TopicArn);
            if (!region) {
                reject({ code: this.Errors.invalidArn, resource: this.arn });
            }
            const sns = new aws_sdk_1.SNS({ region: region });
            const snsEvent = { Message: JSON.stringify(message), TopicArn: this.arn };
            sns.publish(snsEvent, (err, data) => {
                if (err) {
                    reject(AWSHelper.parseAWSError(err));
                }
                else {
                    resolve(data.MessageId);
                }
            });
        });
    }
    validateArnAndReturnRegion(arn) {
        let splitedTopicArn = arn.split(":");
        if (splitedTopicArn.length < 7) {
            return undefined;
        }
        return splitedTopicArn[3];
    }
}
exports.AWSTopic = AWSTopic;
class AWSBucket {
    constructor(region, name) {
        this.region = region;
        this.name = name;
    }
    getObject(key) { return new Promise((resolve, reject) => { resolve(null); }); }
    putObject(key, content) { return new Promise((resolve, reject) => { resolve(true); }); }
}
exports.AWSBucket = AWSBucket;
class AWSMetric {
    constructor(region, name) {
        this.region = region;
        this.name = name;
    }
    publish(name, value) { return new Promise((resolve, reject) => { resolve(true); }); }
}
exports.AWSMetric = AWSMetric;
class AWSTable {
    constructor(region, name) {
        this.region = region;
        this.name = name;
    }
    marshalObject(object) {
        const marshsalled = aws_sdk_1.DynamoDB.Converter.marshall(object, { convertEmptyValues: true, wrapNumbers: true });
        return marshsalled;
    }
    unmarshalObject(object) {
        const unmarshsalled = aws_sdk_1.DynamoDB.Converter.unmarshall(object, { convertEmptyValues: true, wrapNumbers: true });
        return unmarshsalled;
    }
    putItem(object) {
        return new Promise((resolve, reject) => {
            const input = aws_sdk_1.DynamoDB.Converter.input(object, { convertEmptyValues: true, wrapNumbers: true });
            const marshsalled = aws_sdk_1.DynamoDB.Converter.marshall(object, { convertEmptyValues: true, wrapNumbers: true });
            resolve(true);
        });
    }
    deleteItem(object) { return new Promise((resolve, reject) => { resolve(true); }); }
}
exports.AWSTable = AWSTable;
class AWSHelper {
    static parseAWSError(error) {
        return { code: 'invalid', resource: '', payload: '' };
    }
}
