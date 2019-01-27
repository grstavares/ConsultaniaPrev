/* tslint:disable all */
import { handler, setInjector } from '../src/retirement/index'
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

describe('ServiceRetirement Handler', () => {

    before(function(done) {

        mockedEvents = new MockedEvents();

        const tableNames = ['Retirements'];
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

    it('Retirement::Get OK response when send a Get Request For RootResource', async () => {

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.RetirementGetAll);
        const object1 = new ItemBuilder().buildWithUUID('InexistentId1');
        const object2 = new ItemBuilder().buildWithUUID('InexistentId2');

        const responseA = await mockedInjector.injectItemOnTable({ institutionId: 'mockedIntitution', uuid: 'InexistentId1'}, object1);
        const responseB = await mockedInjector.injectItemOnTable({ institutionId: 'mockedIntitution', uuid: 'InexistentId2'}, object2);
        return lambdaTester(handler).event(mocked).expectResult((verifier) => { expect(verifier.statusCode).to.eql(200) });

    });

    it('Retirement::Get OK response when send a Get Request', async () => {

        const mockedUUID = 'existOnDB'

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.RetirementGet);
        const object = new ItemBuilder().buildWithUUID(mockedUUID);

        const response = await mockedInjector.injectItemOnTable({ institutionId: 'mockedIntitution', itemId: mockedUUID}, object)
        .then((result) => { return lambdaTester(handler).event(mocked)});

        return response.expectResult((verifier) => { expect(verifier.statusCode).to.eql(200) });


    });

    it('Retirement::Get NotFound response when send a Get Request for an InexistentId', async () => {

        const mockedUUID = '12346'

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.RetirementGet);
        const object = new ItemBuilder().buildWithUUID(mockedUUID);

        const response = await mockedInjector.injectItemOnTable({ institutionId: 'mockedIntitution', itemId: mockedUUID}, object)
        .then((result) => { return lambdaTester(handler).event(mocked)});

        return response.expectResult((verifier) => { expect(verifier.statusCode).to.eql(200) });


    });

    it('Retirement::Get Created response when send a Post Request', async () => {

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.RetirementPost);

        const response = await lambdaTester(handler).event(mocked)
        return response.expectResult((verifier) => expect(verifier.statusCode).to.eql(201));

    });

    it('Retirement::Get OK response when send a Put Request', async () => {

        const mockedUUID = 'existOnDbAndWillBeUpdated'

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.RetirementPut);
        const object = new ItemBuilder().buildWithUUID(mockedUUID);
        const existentTitle = object['title'];
        const updatedValue = JSON.parse(mocked.body)['title'];

        const response = await mockedInjector.injectItemOnTable({ institutionId: 'mockedIntitution', itemId: mockedUUID}, object)
        .then((result) => { return lambdaTester(handler).event(mocked)});

        return response.expectResult((verifier) => {expect(verifier.statusCode).to.eql(200);});

    });

    it('Retirement::Get OK response when send a Delete Request', async () => {

        const mockedUUID = 'willBeRemovedFromDB'

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.RetirementDelete);
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

    buildWithUUID(uuid: string): Object {

        return {
            institutionId: 'mockedIntitution',
            itemId: uuid,
            startDate: 1,
            endDate: 2,
            contributions: [],
            withdrawals: [],
            wasDeleted: false,
        };

    }

}
