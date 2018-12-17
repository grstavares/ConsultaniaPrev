import { ProxyTable, ProxyS3Bucket, ProxySnsTopic, ProxyMetric, ProxyResolver } from '../../src/types';

export class MockProxyResolver implements ProxyResolver {

    constructor(private _topic: ProxySnsTopic, private _bucket: ProxyS3Bucket, private _metric: ProxyMetric, private _table: ProxyTable) {}

    topic(topicArn: string): ProxySnsTopic {return this._topic; }
    bucket(region: string, name: string): ProxyS3Bucket  {return this._bucket; }
    metric(region: string, name: string): ProxyMetric  {return this._metric; }
    table(region: string, name: string): ProxyTable  {return this._table; }

}