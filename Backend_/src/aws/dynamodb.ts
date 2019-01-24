/* tslint:disable:no-implicit-dependencies */
import { DynamoDB } from 'aws-sdk';
import { NoSQLTable } from '../common/backend';
import { AWSParser } from './parser';

/* tslint:disable no-submodule-imports */
import { ExpressionAttributeNameMap, ExpressionAttributeValueMap } from 'aws-sdk/clients/dynamodb';

/* tslint:disable:no-var-requires */
const AWSXRay = require('aws-xray-sdk');

export class DynamoDBTable implements NoSQLTable {

    private readonly dynamoDB: DynamoDB;

    constructor(private readonly tableName: string, dynamodb?: DynamoDB) {

        /* tslint:disable:no-unsafe-any */
        this.dynamoDB = (dynamodb === null || dynamodb == undefined) ? AWSXRay.captureAWSClient(new DynamoDB()) : dynamodb;

    }

    public async getItem(keys: {[key: string]: any}): Promise<Object> {

        const parsedKeys = this.marshalObject(keys);
        const getItemParams: DynamoDB.GetItemInput = { Key: parsedKeys, TableName: this.tableName, ReturnConsumedCapacity: 'TOTAL' };

        return new Promise((resolve: Function, reject: Function) => {

            this.dynamoDB.getItem(getItemParams).promise()
            .then((result) => resolve((result.Item !== null && result.Item !== undefined) ? this.unmarshalObject(result.Item) : null))
            .catch((error) => reject(AWSParser.parseAWSError(error, {type: 'table', name: this.tableName})));

        });

    }

    public async queryItemByHashKey(keys: {[key: string]: any}): Promise<Object[]> {

        const queryKeys = Object.keys(keys);
        const hashKeyName = { '#keyname': queryKeys[0] };
        const hashKeyValue = { ':keyvalue': keys[queryKeys[0]] };
        const parsedKeyValue = this.marshalObject(hashKeyValue);

        const queryItemParams: DynamoDB.QueryInput = {
            ExpressionAttributeNames: hashKeyName,
            ExpressionAttributeValues: parsedKeyValue,
            KeyConditionExpression: '#keyname = :keyvalue',
            ReturnConsumedCapacity: 'TOTAL',
            TableName: this.tableName,
        };

        return new Promise((resolve: Function, reject: Function) => {

            this.dynamoDB.query(queryItemParams).promise()
            .then((result) => {

                const dynamoItems = result.Items;
                const objectItems = dynamoItems.map((item, index, array) => this.unmarshalObject(item));
                resolve(objectItems);

            }).catch((error) => reject(AWSParser.parseAWSError(error, {type: 'table', name: this.tableName})));

        });

    }

    public async putItem(keys: { [key: string]: any }, object: Object): Promise<boolean> {

        const payload = this.marshalObject(object);
        const putObject: DynamoDB.PutItemInput = { TableName: this.tableName, Item: payload, ReturnConsumedCapacity: 'TOTAL' };

        return new Promise((resolve: Function, reject: Function) => {

            this.dynamoDB.putItem(putObject).promise()
            .then((result) => resolve(true))
            .catch((error) => reject(AWSParser.parseAWSError(error, {type: 'table', name: this.tableName})));

        });

    }

    public async updateItem(keys: { [key: string]: any }, values: { [key: string]: any }): Promise<boolean> {

        const parsedKeys = this.marshalObject(keys);
        const updateExpression = this.updateExpression(values);

        const updateItemParams: DynamoDB.UpdateItemInput = {
            TableName: this.tableName,
            Key: parsedKeys,
            UpdateExpression: updateExpression.UpdateExpression,
            ExpressionAttributeNames: updateExpression.ExpressionAttributeNames,
            ExpressionAttributeValues: updateExpression.ExpressionAttributeValues,
        };

        return new Promise((resolve: Function, reject: Function) => {

            this.dynamoDB.updateItem(updateItemParams).promise()
            .then((result) => resolve(true))
            .catch((error) => reject(AWSParser.parseAWSError(error, {type: 'table', name: this.tableName})));

        });

    }

    public async deleteItems(keys: { [key: string]: any }): Promise<boolean> {

        const parsedKeys = this.marshalObject(keys);
        const deleteItemParams: DynamoDB.DeleteItemInput = { Key: parsedKeys, TableName: this.tableName, ReturnConsumedCapacity: 'TOTAL' };

        return new Promise((resolve: Function, reject: Function) => {

            this.dynamoDB.deleteItem(deleteItemParams).promise()
            .then((result) => resolve(true))
            .catch((error) => reject(AWSParser.parseAWSError(error, {type: 'table', name: this.tableName})));

        });

    }

    public updateExpression(object: { [key: string]: any }): { UpdateExpression: string; ExpressionAttributeNames: ExpressionAttributeNameMap; ExpressionAttributeValues: ExpressionAttributeValueMap } {

        if (Object.keys(object).length === 0) { throw Error('NoValues'); }

        let expression = 'SET ';
        const attributeNames: ExpressionAttributeNameMap = {};
        const attributeValues: ExpressionAttributeValueMap = {};

        let counter = 0;
        Object.keys(object).forEach((key) => {

            const tag = this.makeUpdateTag();
            const value = object[key];

            const nameKey = `#${tag}`;
            const valueKey = `:${tag}`;

            if (counter > 0) { expression += ', '; }
            expression += `${nameKey} = ${valueKey}`;

            attributeNames[nameKey] = key;
            attributeValues[valueKey] = this.parseValue(value);

            counter += 1;

          });

        return {
            UpdateExpression: expression,
            ExpressionAttributeNames: attributeNames,
            ExpressionAttributeValues: attributeValues,
        };

    }

    private makeUpdateTag(): string {

        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        for (let i = 0; i < 8; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }
        return text;

    }

    private parseValue(value: any): Object {

        return (typeof value === 'number') ? { N: String(value) } : (typeof value === 'string') ? { S: value } : this.marshalObject(value);

    }

    private marshalObject(object: Object): DynamoDB.AttributeMap {

        const marshsalled = DynamoDB.Converter.marshall(object, { convertEmptyValues: true, wrapNumbers: true });
        return marshsalled;

    }

    private unmarshalObject(object: DynamoDB.AttributeMap): Object {

        const unmarshsalled = DynamoDB.Converter.unmarshall(object, { convertEmptyValues: true, wrapNumbers: false });
        return unmarshsalled;

    }

}
