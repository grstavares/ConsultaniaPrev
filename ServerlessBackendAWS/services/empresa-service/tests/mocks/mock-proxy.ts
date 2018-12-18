import { ProxyTable, ProxyS3Bucket, ProxySnsTopic, ProxyMetric, ProxyResolver, ProxySnsMessage } from '../../src/types';
import { UUID } from '../../src/utilities';

export class MockProxyResolver implements ProxyResolver {

    constructor(private _topic: ProxySnsTopic, private _bucket: ProxyS3Bucket, private _metric: ProxyMetric, private _table: ProxyTable) {}

    topic(topicArn: string): ProxySnsTopic {return this._topic; }
    bucket(region: string, name: string): ProxyS3Bucket  {return this._bucket; }
    metric(region: string, name: string): ProxyMetric  {return this._metric; }
    table(region: string, name: string): ProxyTable  {return this._table; }

}

export class MockTable implements ProxyTable {

    public tableItems: Dictionary = {};

    getItem(key: string): Promise<Object> {

        return new Promise((resolve: Function, reject: Function) => {
            const found = this.tableItems[key]
            resolve(found);
        });

    }

    putItem(key: string, object: Object): Promise<boolean> {
        return new Promise((resolve: Function, reject: Function) => {

            delete this.tableItems[key]
            this.tableItems[key] = object
            resolve(true);

        });
    }

    deleteItem(key: string): Promise<boolean> {
        return new Promise((resolve: Function, reject: Function) => {
            delete this.tableItems[key]
            resolve(true);
        });
    }
}

export class MockBucket implements ProxyS3Bucket {

    public bucketItems: Dictionary = {};

    getObject(key: string): Promise<Object> {

        return new Promise((resolve: Function, reject: Function) => {
            const found = this.bucketItems[key]
            resolve(found);
        });

    }

    putObject(key: string, content: Object): Promise<boolean> {

        return new Promise((resolve: Function, reject: Function) => {

            delete this.bucketItems[key];
            this.bucketItems[key] = content;
            resolve(true);

        });
    }

}

export class MockTopic implements ProxySnsTopic {

    topicItems: Dictionary = {};

    publish(message: ProxySnsMessage): Promise<string> {

        return new Promise((resolve: Function, reject: Function) => {

            const messageId = UUID.newUUID();
            this.topicItems[messageId] = message;
            resolve(messageId);

        });

    }

}

export class MockMetric implements ProxyMetric {

    public metricValues: {
        [key: string]: number;
    } = {};

    publish(name: string, value: string): Promise<boolean> {

        return new Promise((resolve: Function, reject: Function) => {

            const oldValue = this.metricValues[name] || 0;
            this.metricValues[name] = oldValue + parseInt(value);
            resolve(true);

        });

    }
}

interface Dictionary {
    [key: string]: Object;
}
