import { ProxyTable, ProxyS3Bucket, ProxySnsTopic, ProxyMetric, ProxyResolver } from './types';

export class AWSProxyResolver implements ProxyResolver {
    snsTopic(topicArn: string): ProxySnsTopic {return null; }
    objectBucket(region: string, name: string): ProxySnsTopic  {return null; }
    metric(region: string, name: string): ProxySnsTopic  {return null; }
    table(region: string, name: string): ProxySnsTopic  {return null; }
}

export class AWSTopic implements ProxySnsTopic {
    constructor(private region: string, private arn: string) {}
    publish(): Promise<string> { return new Promise((resolve: Function, reject: Function) => { resolve(''); }); }
}

export class AWSBucket implements ProxyS3Bucket {
    putObject(prefix: string, key: string, content: Object): Promise<boolean> { return new Promise((resolve: Function, reject: Function) => { resolve(true); }); }
}

export class AWSMetric implements ProxyMetric {
    publish(name: string, value: string): Promise<boolean> { return new Promise((resolve: Function, reject: Function) => { resolve(true); }); }
}

export class AWSTable implements ProxyTable {
    putItem(object: Object): Promise<boolean> { return new Promise((resolve: Function, reject: Function) => { resolve(true); }); }
    deleteItem(object: Object): Promise<boolean> { return new Promise((resolve: Function, reject: Function) => { resolve(true); }); }
}