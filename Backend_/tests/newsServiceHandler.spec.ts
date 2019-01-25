/* tslint:disable all */
import { handler, setInjector } from '../src/news/index'
import 'mocha';
import { expect, should } from 'chai';
import lambdaTester = require('lambda-tester');

import { MockedEvents, AWSEvent } from './mockedEvents/MockedEvents';
import { KeySchema, AttributeDefinitions } from 'aws-sdk/clients/dynamodb';
import { DynamoDBMock, LocalDynamoConfiguration } from './mockedDependencies/dynamoMock';
import { DependencyInjectorMock } from './mockedDependencies/injectorMock';

let mockedEvents:MockedEvents;
let mockedInjector: DependencyInjectorMock;
let mockedDynamo: DynamoDBMock;

describe('Lambda Handler', () => {

    before(function(done) {

        mockedEvents = new MockedEvents();

        const tableNames = ['NewsReports'];
        const tableKeys: KeySchema[] = [ [{ AttributeName: 'itemId', KeyType: 'HASH'}] ];
        const tableAttributes: AttributeDefinitions[] = [ [{ AttributeName: 'itemId', AttributeType: 'S' }] ];

        this.timeout(10000);
        const dynamoconfig: LocalDynamoConfiguration = {
            tableNames: tableNames,
            tableKeys: tableKeys,
            tableAttributes: tableAttributes,
        };

        const context = mockedEvents.getContext();
        mockedDynamo = new DynamoDBMock(dynamoconfig);
        mockedDynamo.start()
        .then((result) => {
            mockedInjector = new DependencyInjectorMock(context, mockedDynamo.rawDynamo, tableNames[0]);
            done();
        })
        .catch((error) => {throw new Error(error); });

    });

    it('NewsReport::Get OK response when send a Get Request For RootResource', async () => {

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.NewsReportGetAll);
        const object1 = new ItemBuilder().withUUID('InexistentId1').withTitle('Mock Title').withContent('Mock Content').withdateCreation('teste').withLastUpdate(null).withUrl('http://www.google.com').withImageUrl('https://images.google.com').build();
        const object2 = new ItemBuilder().withUUID('InexistentId2').withTitle('Mock Title').withContent('Mock Content').withdateCreation('teste').withLastUpdate(null).withUrl('http://www.google.com').withImageUrl('https://images.google.com').build();

        const responseA = await mockedInjector.injectItemOnTable({ uuid: 'InexistentId1'}, object1);
        const responseB = await mockedInjector.injectItemOnTable({ uuid: 'InexistentId2'}, object2);
        return lambdaTester(handler).event(mocked).expectResult((verifier) => { expect(verifier.statusCode).to.eql(200) });

    });

    it('NewsReport::Get OK response when send a Get Request', async () => {

        const mockedUUID = '12345'

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.NewsReportGet);
        const object = new ItemBuilder()
        .withUUID(mockedUUID)
        .withTitle('Mock Title')
        .withContent('Mock Content')
        .withdateCreation('teste')
        .withLastUpdate(null)
        .withUrl('http://www.google.com')
        .withImageUrl('https://images.google.com')
        .build();

        const response = await mockedInjector.injectItemOnTable({ uuid: mockedUUID}, object)
        .then((result) => { return lambdaTester(handler).event(mocked)});

        return response.expectResult((verifier) => { expect(verifier.statusCode).to.eql(200) });


    });

    it('Product::Get Created response when send a Post Request', async () => {

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.NewsReportPost);

        const response = await lambdaTester(handler).event(mocked)
        return response.expectResult((verifier) => expect(verifier.statusCode).to.eql(201));

    });

    it('Product::Get OK response when send a Put Request', async () => {

        const mockedUUID = '98765'

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.NewsReportPut);
        const object = new ItemBuilder()
        .withUUID(mockedUUID)
        .withTitle('Mock Title')
        .withContent('Mock Content')
        .withdateCreation('teste')
        .withLastUpdate(null)
        .withUrl('http://www.google.com')
        .withImageUrl('https://images.google.com')
        .build();

        const response = await mockedInjector.injectItemOnTable({ uuid: mockedUUID}, object)
        .then((result) => { return lambdaTester(handler).event(mocked)});

        return response.expectResult((verifier) => { expect(verifier.statusCode).to.eql(200) });

    });

    it('NewsReport::Get OK response when send a Delete Request', async () => {

        const mockedUUID = '54321_7890'

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.NewsReportDelete);
        const object = new ItemBuilder()
        .withUUID(mockedUUID)
        .withTitle('Mock Title')
        .withContent('Mock Content')
        .withdateCreation('teste')
        .withLastUpdate(null)
        .withUrl('http://www.google.com')
        .withImageUrl('https://images.google.com')
        .build();

        const response = await mockedInjector.injectItemOnTable({ uuid: mockedUUID}, object)
        .then((result) => { return lambdaTester(handler).event(mocked)});
        return response.expectResult((verifier) => { expect(verifier.statusCode).to.eql(200) });

    });

    after(() => {
        mockedDynamo.stop();
    });

});

class ItemBuilder {

    private uuid: string;
    private title: string;
    private contents: string;
    private dataCreation: number;
    private lastUpdate: number;
    private url: string;
    private imageUrl: string;
    private wasDeleted: boolean;

    public withUUID(value: string): ItemBuilder { this.uuid = value; return this; }
    public withTitle(value: string): ItemBuilder { this.uuid = value; return this; }
    public withContent(value: string): ItemBuilder { this.uuid = value; return this; }
    public withdateCreation(value: string): ItemBuilder { this.uuid = value; return this; }
    public withLastUpdate(value: string): ItemBuilder { this.uuid = value; return this; }
    public withUrl(value: string): ItemBuilder { this.uuid = value; return this; }
    public withImageUrl(value: string): ItemBuilder { this.uuid = value; return this; }
    public withDeleted(value: boolean): ItemBuilder { this.wasDeleted = value; return this; }

    build(): Object {
        return {
            itemId: this.uuid,
            title: this.title,
            contents: this.contents,
            dataCreation: this.dataCreation,
            lastUpdate: this.lastUpdate,
            url: this.url,
            imageUrl: this.imageUrl,
            wasDeleted: this.wasDeleted,
        };
    }

}


export interface NewsReport {
    uuid: string;
    title: string;
    contents: string;
    dateCreation: number;
    lastUpdate?: number;
    url?: string;
    imageUrl?: string;
    wasDeleted: boolean;
}
