/* tslint:disable all */
import { handler, setInjector } from '../src/institution/index'
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

describe('ServiceInstitutions Handler', () => {

    before(function(done) {

        mockedEvents = new MockedEvents();

        const tableNames = ['Institutions'];
        const tableKeys: KeySchema[] = [ [{ AttributeName: 'institutionId', KeyType: 'HASH'} ] ];
        const tableAttributes: AttributeDefinitions[] = [ [{ AttributeName: 'institutionId', AttributeType: 'S' } ] ];

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

    it('Institution::Get OK response when send a Get Request For RootResource', async () => {

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.InstitutionGetAll);
        const object1 = new ItemBuilder().buildWithUUID('InexistentId1');
        const object2 = new ItemBuilder().buildWithUUID('InexistentId2');

        const responseA = await mockedInjector.injectItemOnTable({ institutionId: 'InexistentId1'}, object1);
        const responseB = await mockedInjector.injectItemOnTable({ institutionId: 'InexistentId2'}, object2);
        return lambdaTester(handler).event(mocked).expectResult((verifier) => { expect(verifier.statusCode).to.eql(200) });

    });

    it('Institution::Get OK response when send a Get Request', async () => {

        const mockedUUID = 'existOnDB'

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.InstitutionGet);
        const object = new ItemBuilder().buildWithUUID(mockedUUID);

        const response = await mockedInjector.injectItemOnTable({ institutionId: mockedUUID}, object)
        .then((result) => { return lambdaTester(handler).event(mocked)});

        return response.expectResult((verifier) => { expect(verifier.statusCode).to.eql(200) });


    });

    it('Institution::Get NotFound response when send a Get Request for an InexistentId', async () => {

        const mockedUUID = '12346'

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.InstitutionGet);
        const object = new ItemBuilder().buildWithUUID(mockedUUID);

        const response = await mockedInjector.injectItemOnTable({ institutionId: mockedUUID}, object)
        .then((result) => { return lambdaTester(handler).event(mocked)});

        return response.expectResult((verifier) => { expect(verifier.statusCode).to.eql(200) });


    });

    it('Institution::Get Created response when send a Post Request', async () => {

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.InstitutionPost);

        const response = await lambdaTester(handler).event(mocked)
        return response.expectResult((verifier) => expect(verifier.statusCode).to.eql(201));

    });

    it('Institution::Get OK response when send a Put Request', async () => {

        const mockedUUID = 'existOnDbAndWillBeUpdated'

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.InstitutionPut);
        const object = new ItemBuilder().buildWithUUID(mockedUUID);
        const existentTitle = object['name'];
        const updatedValue = JSON.parse(mocked.body)['name'];

        const response = await mockedInjector.injectItemOnTable({ institutionId: mockedUUID}, object)
        .then((result) => { return lambdaTester(handler).event(mocked)});

        return response.expectResult((verifier) => {

            expect(existentTitle).to.not.eql(updatedValue);
            expect(verifier.statusCode).to.eql(200);

            const responseBody = JSON.parse(verifier.body);
            expect(responseBody.name).to.eql(updatedValue);
        });

    });

    it('Institution::Get OK response when send a Delete Request', async () => {

        const mockedUUID = 'willBeRemovedFromDB'

        setInjector(mockedInjector);
        const mocked = mockedEvents.getEvent(AWSEvent.InstitutionDelete);
        const object = new ItemBuilder().buildWithUUID(mockedUUID);

        const response = await mockedInjector.injectItemOnTable({ institutionId: mockedUUID}, object)
        .then((result) => mockedInjector.getItemByKey({ institutionId: mockedUUID}))
        .then((objectfound) => { if (objectfound === null || objectfound == undefined) { return Promise.reject(); } else { return Promise.resolve(true); } })
        .then((result) => lambdaTester(handler).event(mocked));

        return response.expectResult((verifier) => { expect(verifier.statusCode).to.eql(200) })
        .then((result) => mockedInjector.getItemByKey({ institutionId: mockedUUID}))
        .then((result) => expect(result['wasDeleted']).to.be.true);

    });

    after(() => {
        mockedDynamo.stop();
    });

});

class ItemBuilder {

    buildWithUUID(uuid: string): Object {

        return {
            institutionId: uuid,
            name: 'Mocked Institution',
            wasDeleted: false,
        };

    }

}
