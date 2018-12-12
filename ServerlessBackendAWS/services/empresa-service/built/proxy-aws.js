"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AWSProxyResolver {
    snsTopic(topicArn) { return null; }
    objectBucket(region, name) { return null; }
    metric(region, name) { return null; }
    table(region, name) { return null; }
}
exports.AWSProxyResolver = AWSProxyResolver;
class AWSTopic {
    constructor(region, arn) {
        this.region = region;
        this.arn = arn;
    }
    publish() { return new Promise((resolve, reject) => { resolve(''); }); }
}
exports.AWSTopic = AWSTopic;
class AWSBucket {
    putObject(prefix, key, content) { return new Promise((resolve, reject) => { resolve(true); }); }
}
exports.AWSBucket = AWSBucket;
class AWSMetric {
    publish(name, value) { return new Promise((resolve, reject) => { resolve(true); }); }
}
exports.AWSMetric = AWSMetric;
class AWSTable {
    putItem(object) { return new Promise((resolve, reject) => { resolve(true); }); }
    deleteItem(object) { return new Promise((resolve, reject) => { resolve(true); }); }
}
exports.AWSTable = AWSTable;
