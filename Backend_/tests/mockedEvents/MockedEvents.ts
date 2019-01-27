/* tslint:disable all*/
import { Context, APIGatewayProxyEvent } from 'aws-lambda';

import fs = require('fs');

export enum AWSEvent {
    ActivityGetAll = 'APIGatewayEvent_ActivityGetAll',
    ActivityDelete = 'APIGatewayEvent_ActivityDelete',
    ActivityGet = 'APIGatewayEvent_ActivityGet',
    ActivityPost = 'APIGatewayEvent_ActivityPost',
    ActivityPut = 'APIGatewayEvent_ActivityPut',
    ComplaintGetAll = 'APIGatewayEvent_ComplaintGetAll',
    ComplaintDelete = 'APIGatewayEvent_ComplaintDelete',
    ComplaintGet = 'APIGatewayEvent_ComplaintGet',
    ComplaintPost = 'APIGatewayEvent_ComplaintPost',
    ComplaintPut = 'APIGatewayEvent_ComplaintPut',
    DocumentGetAll = 'APIGatewayEvent_DocumentGetAll',
    DocumentDelete = 'APIGatewayEvent_DocumentDelete',
    DocumentGet = 'APIGatewayEvent_DocumentGet',
    DocumentPost = 'APIGatewayEvent_DocumentPost',
    DocumentPut = 'APIGatewayEvent_DocumentPut',
    FinancialGetAll = 'APIGatewayEvent_FinancialGetAll',
    FinancialDelete = 'APIGatewayEvent_FinancialDelete',
    FinancialGet = 'APIGatewayEvent_FinancialGet',
    FinancialPost = 'APIGatewayEvent_FinancialPost',
    FinancialPut = 'APIGatewayEvent_FinancialPut',
    InstitutionGetAll = 'APIGatewayEvent_InstitutionGetAll',
    InstitutionDelete = 'APIGatewayEvent_InstitutionDelete',
    InstitutionGet = 'APIGatewayEvent_InstitutionGet',
    InstitutionPost = 'APIGatewayEvent_InstitutionPost',
    InstitutionPut = 'APIGatewayEvent_InstitutionPut',
    MessagesGetAll = 'APIGatewayEvent_MessagesGetAll',
    MessagesDelete = 'APIGatewayEvent_MessagesDelete',
    MessagesGet = 'APIGatewayEvent_MessagesGet',
    MessagesPost = 'APIGatewayEvent_MessagesPost',
    MessagesPut = 'APIGatewayEvent_MessagesPut',
    PeopleGetAll = 'APIGatewayEvent_PeopleGetAll',
    PeopleDelete = 'APIGatewayEvent_PeopleDelete',
    PeopleGet = 'APIGatewayEvent_PeopleGet',
    PeoplePost = 'APIGatewayEvent_PeoplePost',
    PeoplePut = 'APIGatewayEvent_PeoplePut',
    RetirementGetAll = 'APIGatewayEvent_RetirementGetAll',
    RetirementDelete = 'APIGatewayEvent_RetirementDelete',
    RetirementGet = 'APIGatewayEvent_RetirementGet',
    RetirementPost = 'APIGatewayEvent_RetirementPost',
    RetirementPut = 'APIGatewayEvent_RetirementPut',
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
