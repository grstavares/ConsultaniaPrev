import { ProxyTable, ProxyS3Bucket, ProxySnsTopic, ProxyMetric, ProxyResolver } from './types';

export class MockProxyResolver implements ProxyResolver {
    snsTopic(topicArn: string): ProxySnsTopic {return null; }
    objectBucket(region: string, name: string): ProxySnsTopic  {return null; }
    metric(region: string, name: string): ProxySnsTopic  {return null; }
    table(region: string, name: string): ProxySnsTopic  {return null; }
}

export class MockTopic implements ProxySnsTopic {
    constructor(private region: string, private arn: string) {}
    publish(): Promise<string> { return new Promise((resolve: Function, reject: Function) => { resolve(''); }); }
}

export class MockBucket implements ProxyS3Bucket {
    putObject(prefix: string, key: string, content: Object): Promise<boolean> { return new Promise((resolve: Function, reject: Function) => { resolve(true); }); }
}

export class MockMetric implements ProxyMetric {
    publish(name: string, value: string): Promise<boolean> { return new Promise((resolve: Function, reject: Function) => { resolve(true); }); }
}

export class MockTable implements ProxyTable {
    putItem(object: Object): Promise<boolean> { return new Promise((resolve: Function, reject: Function) => { resolve(true); }); }
    deleteItem(object: Object): Promise<boolean> { return new Promise((resolve: Function, reject: Function) => { resolve(true); }); }
}