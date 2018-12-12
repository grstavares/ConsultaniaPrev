export interface BusinessEvent {
    topicArn: string;
    body: string;
}

export interface InfrastructureMetric {
    metricArn: string;
    value: JSON;
}

export interface ProxyResolver {
    snsTopic:(topicArn: string) => ProxySnsTopic;
    objectBucket:(region: string, name: string) => ProxySnsTopic;
    metric:(region: string, name: string) => ProxySnsTopic;
    table:(region: string, name: string) => ProxySnsTopic;
}

export interface ProxySnsTopic {
    // region: string;
    // arn: string;
    publish: () => Promise<string>;
}

export interface ProxyS3Bucket {
    // region: string;
    // bucketName: string;
    putObject: (prefix: string, key: string, content: Object) => Promise<boolean>; 
}

export interface ProxyMetric {
    // region: string;
    // table: string;
    publish: (name: string, value: string) => Promise<boolean>;
}

export interface ProxyTable {
    // region: string;
    putItem: (key: string, object: Object) => Promise<boolean>;
    deleteItem: (key: string, object: Object) => Promise<boolean>;
}