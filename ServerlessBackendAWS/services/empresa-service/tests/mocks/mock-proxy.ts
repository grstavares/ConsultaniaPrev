import { ProxyTable, ProxyS3Bucket, ProxySnsTopic, ProxyMetric, ProxyResolver } from '../../src/types';

export class MockProxyResolver implements ProxyResolver {

    constructor(private _topic: ProxySnsTopic, private _bucket: ProxyS3Bucket, private _metric: ProxyMetric, private _table: ProxyTable) {}

    topic(topicArn: string): ProxySnsTopic {return this._topic; }
    bucket(region: string, name: string): ProxyS3Bucket  {return this._bucket; }
    metric(region: string, name: string): ProxyMetric  {return this._metric; }
    table(region: string, name: string): ProxyTable  {return this._table; }

}

export class MockTable implements ProxyTable {

    tableItems: Dictionary = {};

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

interface Dictionary {
    [key: string]: Object;
}
