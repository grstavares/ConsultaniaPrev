/* tslint:disable: no-implicit-dependencies */
import { Context } from 'aws-lambda';
import { DependencyInjector, MessageBus, MetricBus, NoSQLTable, InputParser } from '../../src/common/backend';

/* tslint:disable no-submodule-imports */
import { DynamoDBTable } from '../../src/aws/dynamodb';
import { DynamoDB } from 'aws-sdk';
import { InfrastructureMetric } from '../../src/common/types';
import { AWSParser } from '../../src/aws';

export class DependencyInjectorMock implements DependencyInjector {

    constructor(context: Context, private readonly dynamoDB: DynamoDB, private readonly tableName: string) { }

    public async getNoSQLTable(): Promise<NoSQLTable> {

        return  new DynamoDBTable(this.tableName, this.dynamoDB);

    }

    public async getMessageBus(): Promise<MessageBus> { return new MockedMessageBus(); }

    public async getMetricBus(): Promise<MetricBus> { return new MockedMetricBus(); }

    public async injectItemOnTable(keys: { [key: string]: any }, object: Object): Promise<boolean> {

        return this.getNoSQLTable()
        .then(async (table) => table.putItem(keys, object));

    }

    public async getItemByKey(keys: { [key: string]: any }): Promise<Object> {

        return this.getNoSQLTable()
        .then(async (table) => table.getItem(keys));

    }

    public getInputParser(event: any): InputParser {

        /* tslint:disable no-unsafe-any*/
        return AWSParser.parseAPIGatewayEvent(event);

    }

}

export class ErrorNoSQLTable implements NoSQLTable {

    public async getItem(keys: {[key: string]: any}): Promise<Object> { return Promise.reject(); }
    public async queryItemByHashKey(keys: {[key: string]: any}): Promise<Object[]> { return Promise.reject(); }
    public async putItem(keys: { [key: string]: any }, object: Object): Promise<boolean> { return Promise.reject(); }
    public async deleteItems(keys: { [key: string]: any }): Promise<boolean> { return Promise.reject(); }
    public async updateItem(keys: { [key: string]: any }, values: { [key: string]: any }): Promise<boolean> { return Promise.reject(); }
    public async queryIndex(indexName: string, keys: { [key: string]: any }): Promise<Object[]> { return Promise.reject(); }
}

export class MockedMessageBus implements MessageBus {
    public async publish(message: Object): Promise<string> { return Promise.resolve('teste'); }
}

export class MockedMetricBus implements MetricBus {
    public async publish(message: InfrastructureMetric): Promise<boolean> { return Promise.resolve(true); }
}
