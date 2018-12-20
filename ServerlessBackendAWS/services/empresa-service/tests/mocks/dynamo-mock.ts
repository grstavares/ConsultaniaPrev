import dynamodbLocal = require('dynamodb-localhost');

export interface Config {
    port: number;
    inMemory?: boolean;
    sharedDb?: boolean;
}

export class DynamoDBMock {

    public instancePort: number = 0;

    constructor() { dynamodbLocal.install(() => {}); }

    start(config: Config): number {
        
        if (!config) {config = {port: 8000, inMemory: true, sharedDb: true}}
        this.instancePort = config.port;
        dynamodbLocal.start(config);
        return this.instancePort;

    }

    stop() { dynamodbLocal.stop(this.instancePort) }

    finish() {
        //dynamodbLocal.remove(() => {})
    }

}