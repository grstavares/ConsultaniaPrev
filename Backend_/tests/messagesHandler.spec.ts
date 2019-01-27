/* tslint:disable all */
import { handler, setInjector } from '../src/messages/index'
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

describe('ServiceMessages Handler', () => {

    before(function(done) {

        mockedEvents = new MockedEvents();

        const tableNames = ['Messages'];
        const tableKeys: KeySchema[] = [ [{ AttributeName: 'institutionId', KeyType: 'HASH'}, { AttributeName: 'itemId', KeyType: 'RANGE'}] ];
        const tableAttributes: AttributeDefinitions[] = [ [{ AttributeName: 'institutionId', AttributeType: 'S' }, { AttributeName: 'itemId', AttributeType: 'S' }] ];

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

    it('Messages::Get OK response when send a Get Request For RootResource', async () => {

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.MessagesGetAll);
        const object1 = new ItemBuilder().buildWithUUID('InexistentId1');
        const object2 = new ItemBuilder().buildWithUUID('InexistentId2');

        const responseA = await mockedInjector.injectItemOnTable({ institutionId: 'mockedIntitution', uuid: 'InexistentId1'}, object1);
        const responseB = await mockedInjector.injectItemOnTable({ institutionId: 'mockedIntitution', uuid: 'InexistentId2'}, object2);
        return lambdaTester(handler).event(mocked).expectResult((verifier) => { expect(verifier.statusCode).to.eql(200) });

    });

    it('Messages::Get OK response when send a Get Request', async () => {

        const mockedUUID = 'existOnDB'

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.MessagesGet);
        const object = new ItemBuilder().buildWithUUID(mockedUUID);

        const response = await mockedInjector.injectItemOnTable({ institutionId: 'mockedIntitution', itemId: mockedUUID}, object)
        .then((result) => { return lambdaTester(handler).event(mocked)});

        return response.expectResult((verifier) => { expect(verifier.statusCode).to.eql(200) });


    });

    it('Messages::Get NotFound response when send a Get Request for an InexistentId', async () => {

        const mockedUUID = '12346'

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.MessagesGet);
        const object = new ItemBuilder().buildWithUUID(mockedUUID);

        const response = await mockedInjector.injectItemOnTable({ institutionId: 'mockedIntitution', itemId: mockedUUID}, object)
        .then((result) => { return lambdaTester(handler).event(mocked)});

        return response.expectResult((verifier) => { expect(verifier.statusCode).to.eql(200) });


    });

    it('Messages::Get Created response when send a Post Request', async () => {

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.MessagesPost);

        const response = await lambdaTester(handler).event(mocked)
        return response.expectResult((verifier) => expect(verifier.statusCode).to.eql(201));

    });

    it('Messages::Get OK response when send a Put Request', async () => {

        const mockedUUID = 'existOnDbAndWillBeUpdated'

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.MessagesPut);
        const object = new ItemBuilder().buildWithUUID(mockedUUID);
        const existentTitle = object['title'];
        const updatedValue = JSON.parse(mocked.body)['title'];

        const response = await mockedInjector.injectItemOnTable({ institutionId: 'mockedIntitution', itemId: mockedUUID}, object)
        .then((result) => { return lambdaTester(handler).event(mocked)});

        return response.expectResult((verifier) => {

            expect(existentTitle).to.not.eql(updatedValue);
            expect(verifier.statusCode).to.eql(200);

            const responseBody = JSON.parse(verifier.body);
            expect(responseBody.title).to.eql(updatedValue);
        });

    });

    it('Messages::Get OK response when send a Delete Request', async () => {

        const mockedUUID = 'willBeRemovedFromDB'

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.MessagesDelete);
        const object = new ItemBuilder().buildWithUUID(mockedUUID);

        const response = await mockedInjector.injectItemOnTable({ institutionId: 'mockedIntitution', itemId: mockedUUID}, object)
        .then((result) => mockedInjector.getItemByKey({ institutionId: 'mockedIntitution', itemId: mockedUUID}))
        .then((objectfound) => { if (objectfound === null || objectfound == undefined) { return Promise.reject(); } else { return Promise.resolve(true); } })
        .then((result) => lambdaTester(handler).event(mocked));

        return response.expectResult((verifier) => { expect(verifier.statusCode).to.eql(200) })
        .then((result) => mockedInjector.getItemByKey({ institutionId: 'mockedIntitution', itemId: mockedUUID}))
        .then((result) => expect(result['wasDeleted']).to.be.true);

    });

    after(() => {
        mockedDynamo.stop();
    });

});

class ItemBuilder {

    private itemId: string;
    private title: string;
    private contents: string;
    private dataCreation: number;
    private lastUpdate: number;
    private url: string;
    private imageUrl: string;
    private wasDeleted: boolean;

    public withUUID(value: string): ItemBuilder { this.itemId = value; return this; }
    public withTitle(value: string): ItemBuilder { this.title = value; return this; }
    public withContent(value: string): ItemBuilder { this.contents = value; return this; }
    public withdateCreation(value: number): ItemBuilder { this.dataCreation = value; return this; }
    public withLastUpdate(value: number): ItemBuilder { this.lastUpdate = value; return this; }
    public withUrl(value: string): ItemBuilder { this.url = value; return this; }
    public withImageUrl(value: string): ItemBuilder { this.imageUrl = value; return this; }
    public withDeleted(value: boolean): ItemBuilder { this.wasDeleted = value; return this; }

    build(): Object {
        return {
            institutionId: 'mockedIntitution',
            itemId: this.itemId,
            title: this.title,
            contents: this.contents,
            dataCreation: this.dataCreation,
            lastUpdate: this.lastUpdate,
            url: this.url,
            imageUrl: this.imageUrl,
            wasDeleted: this.wasDeleted,
        };
    }

    buildWithUUID(uuid: string): Object {

        return {
            institutionId: 'mockedIntitution',
            itemId: uuid,
            title: 'Mock Title',
            summary: 'Mock Summary',
            content: 'Mock Content',
            dataCreation: new Date().getTime(),
            userOrigin: 'Mockd UserId',
            recipients: [],
            wasDeleted: false,
        };

    }

}
