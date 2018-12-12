"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MockProxyResolver {
    snsTopic(topicArn) { return null; }
    objectBucket(region, name) { return null; }
    metric(region, name) { return null; }
    table(region, name) { return null; }
}
exports.MockProxyResolver = MockProxyResolver;
class MockTopic {
    constructor(region, arn) {
        this.region = region;
        this.arn = arn;
    }
    publish() { return new Promise((resolve, reject) => { resolve(''); }); }
}
exports.MockTopic = MockTopic;
class MockBucket {
    putObject(prefix, key, content) { return new Promise((resolve, reject) => { resolve(true); }); }
}
exports.MockBucket = MockBucket;
class MockMetric {
    publish(name, value) { return new Promise((resolve, reject) => { resolve(true); }); }
}
exports.MockMetric = MockMetric;
class MockTable {
    putItem(object) { return new Promise((resolve, reject) => { resolve(true); }); }
    deleteItem(object) { return new Promise((resolve, reject) => { resolve(true); }); }
}
exports.MockTable = MockTable;
