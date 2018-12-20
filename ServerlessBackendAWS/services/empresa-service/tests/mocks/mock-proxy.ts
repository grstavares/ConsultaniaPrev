import { ProxyTable, ProxyS3Bucket, ProxySnsTopic, ProxyMetric, ProxyResolver, ProxySnsMessage, InfrastructureMetric } from '../../src/types';
import { AWSTable } from '../../src/aws-proxy';
import { AwsHelper } from '../../src/aws-helper';
import { DynamoDB, AWSError } from 'aws-sdk';
import { AttributeDefinitions, KeySchema, CreateTableInput, CreateTableOutput, DescribeTableInput, DescribeTableOutput } from 'aws-sdk/clients/dynamodb';
import { UUID } from '../../src/utilities';
import { DynamoDBMock } from './dynamo-mock';

export interface LocalDynamoConfiguration {
    tableNames: string[];
    tableKeys: KeySchema[];
    tableAttributes: AttributeDefinitions[];
}

export class MockProxyResolver implements ProxyResolver {

    errors = {
        table: false,
        topic: false,
        bucket: false,
        metric: false,
    }

    mockDynamo = new DynamoDBMock();
    rawDynamo: DynamoDB;
    docClient: DynamoDB.DocumentClient;

    constructor(private _topic: ProxySnsTopic, private _bucket: ProxyS3Bucket, private _metric: ProxyMetric) { }

    topic(arn: string): ProxySnsTopic { return this.errors.topic ? null : this._topic; }
    bucket(region: string, name: string): ProxyS3Bucket { return this.errors.bucket ? null : this._bucket; }
    metric(): ProxyMetric { return this.errors.metric ? null : this._metric; }
    table(arn): ProxyTable { return this.errors.table ? null : new AWSTable(this.docClient, arn); }

    initDynamo(dynamo: LocalDynamoConfiguration): Promise<boolean[]> {

        const port = this.mockDynamo.start(null);
        const options = {
            endpoint: `http://localhost:${port}`,
            region: "localhost",
            accessKeyId: "MOCK_ACCESS_KEY_ID",
            secretAccessKey: "MOCK_SECRET_ACCESS_KEY",
            convertEmptyValues: true,
        };

        this.rawDynamo = new DynamoDB(options);
        this.docClient = new DynamoDB.DocumentClient(options);

        const tableCount = dynamo.tableNames.length;

        var promises: Promise<boolean>[] = [];

        var i: number;
        for (i = 0; i < tableCount; i++) {

            const createTable: CreateTableInput = {
                AttributeDefinitions: dynamo.tableAttributes[i],
                KeySchema: dynamo.tableKeys[i],
                ProvisionedThroughput: { ReadCapacityUnits: 50, WriteCapacityUnits: 50 },
                TableName: dynamo.tableNames[i]
            };

            promises.push(new Promise((resolve, reject) => {
                this.rawDynamo.createTable(createTable, (error: AWSError, data: CreateTableOutput) => {
                    if (error) {reject(error);
                    } else {resolve(true);}
                });
            }))

        }

        return Promise.all(promises);

    }

    listDynamoTables(): Promise<string[]> {

        return new Promise((resolve, reject) => {

            const listTables: DynamoDB.ListTablesInput = {}
            this.rawDynamo.listTables(listTables, (error: AWSError, data) => {

                if (!error) {resolve(data.TableNames)
                } else { reject(AwsHelper.parseAWSError(error)) }

            })

        })


    }

    injectObjectOnTable(arn: string, object: Object): Promise<boolean> {
    
        const table = this.table(arn);
        return table.putItem({}, object)

    }

    getObjectOnTable(arn: string, key: {[key: string]: any}): Promise<Object> {
    
        const table = this.table(arn);
        return table.getItem(key)

    }

    removeObjectFromTable(arn: string, key: {[key: string]: any}): Promise<boolean> {
    
        const table = this.table(arn);
        return table.deleteItem(key)

    }

    injectError(errors: {table: boolean; topic: boolean; bucket: boolean; metric: boolean}): void {
        this.errors = errors;
    }

    clearErrors(): void { this.errors = { table: false, topic: false, bucket: false, metric: false} }

    finish(): void { this.mockDynamo.stop(); this.docClient = null; this.mockDynamo = null; }

}

export class LocalDynamoTable implements ProxyTable {

    public tableItems: Dictionary = {};

    private raw: DynamoDB;
    private doc: DynamoDB.DocumentClient;

    constructor(private portNumber: number, private tableName: string, attributes: AttributeDefinitions, keys: KeySchema) {

        const options = {
            endpoint: `http://localhost:${this.portNumber}`,
            region: "localhost",
            accessKeyId: "MOCK_ACCESS_KEY_ID",
            secretAccessKey: "MOCK_SECRET_ACCESS_KEY",
            convertEmptyValues: true,
        };

        this.raw = new DynamoDB(options);
        this.doc = new DynamoDB.DocumentClient(options);

        const createTable: CreateTableInput = {
            AttributeDefinitions: attributes,
            KeySchema: keys,
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
            TableName: tableName
        };

        this.raw.createTable(createTable, (error: AWSError, data: CreateTableOutput) => { });

    }

    getItem(keys: { [key: string]: any }): Promise<Object> {

        var getItemParams: DynamoDB.DocumentClient.GetItemInput = { Key: keys, TableName: this.tableName, ReturnConsumedCapacity: 'TOTAL' };

        return new Promise((resolve: Function, reject: Function) => {

            this.doc.get(getItemParams, function (err, data: DynamoDB.DocumentClient.GetItemOutput) {

                if (!err) {
                    resolve(data.Item);
                } else { reject(AwsHelper.parseAWSError(err)); }

            });

        });

    }

    putItem(keys: { [key: string]: any }, object: Object): Promise<boolean> {

        var putItemParams: DynamoDB.DocumentClient.PutItemInput = { TableName: this.tableName, Item: object, ReturnConsumedCapacity: 'TOTAL' };

        return new Promise((resolve: Function, reject: Function) => {

            this.doc.put(putItemParams, function (err, data: DynamoDB.DocumentClient.PutItemOutput) {

                if (!err) {
                    resolve(true);
                } else { reject(AwsHelper.parseAWSError(err)); }

            });

        });

    }

    deleteItem(keys: { [key: string]: any }): Promise<boolean> {

        var deleteItemParams: DynamoDB.DocumentClient.DeleteItemInput = { TableName: this.tableName, Key: keys, ReturnConsumedCapacity: 'TOTAL' };

        return new Promise((resolve: Function, reject: Function) => {

            this.doc.delete(deleteItemParams, function (err, data: DynamoDB.DocumentClient.DeleteItemOutput) {

                if (!err) {
                    resolve(true);
                } else { reject(AwsHelper.parseAWSError(err)); }

            });

        });

    }

    private isTableActive(): Promise<boolean> {

        return new Promise((resolve, reject) => {
            const describeTable: DescribeTableInput = { TableName: this.tableName }
            this.raw.describeTable(describeTable, (error: AWSError, data: DescribeTableOutput) => {

                console.log('checking table ' + this.tableName)
                const result = data.Table.TableStatus
                if (result === 'ACTIVE') {
                    resolve(true);
                } else if (result === 'DELETING') {
                    reject();
                } else { resolve(false); }

            });

        });
    }

}

export class MockTable implements ProxyTable {

    public tableItems: Dictionary = {};

    getItem(keys: { [key: string]: any }): Promise<Object> {

        return new Promise((resolve: Function, reject: Function) => {
            const key = JSON.stringify(keys)
            const found = this.tableItems[key]
            resolve(found);
        });

    }

    putItem(keys: { [key: string]: any }, object: Object): Promise<boolean> {
        return new Promise((resolve: Function, reject: Function) => {
            const key = JSON.stringify(keys)
            delete this.tableItems[key]
            this.tableItems[key] = object
            resolve(true);

        });
    }

    deleteItem(keys: { [key: string]: any }): Promise<boolean> {
        return new Promise((resolve: Function, reject: Function) => {
            const key = JSON.stringify(keys)
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

    publish(metric: InfrastructureMetric): Promise<boolean> {

        return new Promise((resolve: Function, reject: Function) => {

            const oldValue = this.metricValues[metric.name] || 0;
            this.metricValues[name] = oldValue + metric.value;
            resolve(true);

        });

    }
}

interface Dictionary {
    [key: string]: Object;
}
