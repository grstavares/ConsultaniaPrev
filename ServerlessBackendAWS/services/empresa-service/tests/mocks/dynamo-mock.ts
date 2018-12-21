import { DynamoDB, AWSError } from 'aws-sdk';
import { AttributeDefinitions, KeySchema, CreateTableInput, CreateTableOutput, DescribeTableInput, DescribeTableOutput } from 'aws-sdk/clients/dynamodb';
import dynamodbLocal = require('dynamodb-localhost');

export interface LocalDynamoConfiguration {
    port: number;
    tableNames: string[];
    tableKeys: KeySchema[];
    tableAttributes: AttributeDefinitions[];
}

export class DynamoDBMock {

    public instancePort: number = 0;
    public rawDynamo: DynamoDB;
    public docClient: DynamoDB.DocumentClient;

    constructor() { dynamodbLocal.install(() => {}); }

    start(config: LocalDynamoConfiguration): Promise<boolean[]> {
        
        this.instancePort = config.port > 0 ? config.port : 8000;
        dynamodbLocal.start({port: this.instancePort, inMemory: true, sharedDb: true});

        const options = {
            endpoint: `http://localhost:${this.instancePort}`,
            region: "localhost",
            accessKeyId: "MOCK_ACCESS_KEY_ID",
            secretAccessKey: "MOCK_SECRET_ACCESS_KEY",
            convertEmptyValues: true,
        };

        this.rawDynamo = new DynamoDB(options);
        this.docClient = new DynamoDB.DocumentClient(options);

        const tableCount = config.tableNames.length;

        var promises: Promise<boolean>[] = [];

        var i: number;
        for (i = 0; i < tableCount; i++) {

            const createTable: CreateTableInput = {
                AttributeDefinitions: config.tableAttributes[i],
                KeySchema: config.tableKeys[i],
                ProvisionedThroughput: { ReadCapacityUnits: 50, WriteCapacityUnits: 50 },
                TableName: config.tableNames[i]
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

    stop() { dynamodbLocal.stop(this.instancePort) }

    remove() { dynamodbLocal.remove(() => {}) }

}