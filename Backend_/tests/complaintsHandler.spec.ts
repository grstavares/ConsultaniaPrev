/* tslint:disable all */
import { handler, setInjector } from '../src/complaints/index'
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

describe('ServiceComplaints Handler', () => {

    before(function(done) {

        mockedEvents = new MockedEvents();

        const tableNames = ['Complaints'];
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

    it('Complaint::Get OK response when send a Get Request For RootResource', async () => {

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.ComplaintGetAll);
        const object1 = new ItemBuilder().buildWithUUID('InexistentId1');
        const object2 = new ItemBuilder().buildWithUUID('InexistentId2');

        const responseA = await mockedInjector.injectItemOnTable({ institutionId: 'mockedIntitution', uuid: 'InexistentId1'}, object1);
        const responseB = await mockedInjector.injectItemOnTable({ institutionId: 'mockedIntitution', uuid: 'InexistentId2'}, object2);
        return lambdaTester(handler).event(mocked).expectResult((verifier) => { expect(verifier.statusCode).to.eql(200) });

    });

    it('Complaint::Get OK response when send a Get Request', async () => {

        const mockedUUID = 'existOnDB'

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.ComplaintGet);
        const object = new ItemBuilder().buildWithUUID(mockedUUID);

        const response = await mockedInjector.injectItemOnTable({ institutionId: 'mockedIntitution', itemId: mockedUUID}, object)
        .then((result) => { return lambdaTester(handler).event(mocked)});

        return response.expectResult((verifier) => { expect(verifier.statusCode).to.eql(200) });


    });

    it('Complaint::Get NotFound response when send a Get Request for an InexistentId', async () => {

        const mockedUUID = '12346'

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.ComplaintGet);
        const object = new ItemBuilder().buildWithUUID(mockedUUID);

        const response = await mockedInjector.injectItemOnTable({ institutionId: 'mockedIntitution', itemId: mockedUUID}, object)
        .then((result) => { return lambdaTester(handler).event(mocked)});

        return response.expectResult((verifier) => { expect(verifier.statusCode).to.eql(200) });


    });

    it('Complaint::Get Created response when send a Post Request', async () => {

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.ComplaintPost);

        const response = await lambdaTester(handler).event(mocked)
        return response.expectResult((verifier) => expect(verifier.statusCode).to.eql(201));

    });

    it('Complaint::Get OK response when send a Put Request', async () => {

        const mockedUUID = 'existOnDbAndWillBeUpdated'

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.ComplaintPut);
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

    it('Complaint::Get OK response when send a Delete Request', async () => {

        const mockedUUID = 'willBeRemovedFromDB'

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.ComplaintDelete);
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
    private content: string;
    private dataCreation: number;
    private dateReception: number;
    private status: string;
    private wasDeleted: boolean;

    public withUUID(value: string): ItemBuilder { this.itemId = value; return this; }
    public withTitle(value: string): ItemBuilder { this.title = value; return this; }
    public withContent(value: string): ItemBuilder { this.content = value; return this; }
    public withdateCreation(value: number): ItemBuilder { this.dataCreation = value; return this; }
    public withLastUpdate(value: number): ItemBuilder { this.dateReception = value; return this; }
    public withUrl(value: string): ItemBuilder { this.status = value; return this; }
    public withDeleted(value: boolean): ItemBuilder { this.wasDeleted = value; return this; }

    build(): Object {
        return {
            institutionId: 'mockedIntitution',
            itemId: this.itemId,
            title: this.title,
            content: this.content,
            dataCreation: this.dataCreation,
            dateReception: this.dateReception,
            status: this.status,
            imageUrl: this.status,
            wasDeleted: false,
        };
    }

    buildWithUUID(uuid: string): Object {

        return new ItemBuilder()
        .withUUID(uuid)
        .withTitle('Mock Title')
        .withContent('Mock Content')
        .withdateCreation(new Date().getTime())
        .withLastUpdate(null)
        .withUrl('open')
        .build();

    }

}
