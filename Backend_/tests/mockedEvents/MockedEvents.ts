/* tslint:disable all*/
import { Context, APIGatewayProxyEvent } from 'aws-lambda';

import fs = require('fs');

export enum AWSEvent {
    NewsReportGetAll = 'APIGatewayEvent_NewsReportGetAll',
    NewsReportDelete = 'APIGatewayEvent_NewsReportDelete',
    NewsReportGet = 'APIGatewayEvent_NewsReportGet',
    NewsReportPost = 'APIGatewayEvent_NewsReportPost',
    NewsReportPut = 'APIGatewayEvent_NewsReportPut',
}

export class MockedEvents {

    public getEvent(event: AWSEvent): APIGatewayProxyEvent {

        let filename = "./tests/mockedEvents/" + event + '.json'
        let contents = fs.readFileSync(filename,'utf8');
        return JSON.parse(contents)

    }

    public getContext(): Context { return new MockedContext() }

}

class MockedContext {

    callbackWaitsForEmptyEventLoop: boolean = false
    functionName: string = "mockedFunction"
    functionVersion: string = "0.1"
    invokedFunctionArn: string = "local:mockedfunction"
    memoryLimitInMB: number = 128
    awsRequestId: string = "mockedRequest"
    logGroupName: string = "mockedLogGroup"
    logStreamName: string = "mockedLogStream"
    identity = null
    clientContext = null

    // Functions
    getRemainingTimeInMillis(): number { return 1000000 }
    done(error?: Error, result?: any): void { }
    fail(error: Error | string): void { }
    succeed(messageOrObject: any): void { }

}
