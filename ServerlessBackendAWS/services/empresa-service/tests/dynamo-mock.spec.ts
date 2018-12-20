import { DynamoDBMock } from './mocks/dynamo-mock';
import { MockProxyResolver, LocalDynamoConfiguration } from './mocks/mock-proxy';
import { expect, should } from 'chai';
import 'mocha';
import { KeySchema, AttributeDefinitions } from 'aws-sdk/clients/dynamodb';
import { ProxyResolver } from '../src/types';

const tableNames = ['tableA', 'tableB', 'tableC'];
const tableKeys: KeySchema[] = [
    [{ AttributeName: 'id', KeyType: 'HASH' }],
    [{ AttributeName: 'id', KeyType: 'HASH' }],
    [{ AttributeName: 'id', KeyType: 'HASH' }]
];
const tableAttributes: AttributeDefinitions[] = [
    [{ AttributeName: 'id', AttributeType: 'S' }],
    [{ AttributeName: 'id', AttributeType: 'S' }],
    [{ AttributeName: 'id', AttributeType: 'S' }]
];

describe('Testing Dynamo Local', () => {

    var resolver: MockProxyResolver;

    before(function (done) {

    this.timeout(10000);

        const dynamoconfig: LocalDynamoConfiguration = {
            tableNames: tableNames,
            tableKeys: tableKeys,
            tableAttributes: tableAttributes,
        }

        resolver = new MockProxyResolver(null, null, null);
        resolver.initDynamo(dynamoconfig).then(values => done());

    })

    it('Tables must be created', () => {

        return resolver.listDynamoTables()
            .then(data => expect(data.length).to.above(1))
            .catch(error => { console.log(error); expect(error).to.undefined; })

    }).timeout(5000);

    it('Shoud Put an Item with Success', () => {

        const tableName = tableNames[0]
        const table = resolver.table(tableName);
        const object = { id: '12345', name: 'AndyJassy' };

        return table.putItem({ id: '12345' }, object)
            .then(result => expect(result).to.true)
            .catch(error => expect(error).to.undefined)

    });

    it('Shoud Put an Item and Get it Back with Success', () => {

        const tableName = tableNames[1]
        const table = resolver.table(tableName);
        const key = { id: '12346' }
        const object = { id: '12346', name: 'AndyJassy' };

        return table.putItem(key, object)
            .then(result => expect(result).to.true)
            .then(() => table.getItem(key))
            .then(result => expect(result).to.eqls(object))
            .catch(error => {console.log(error); expect(error).to.undefined})

    });

    it('Shoud Put an Item and Delete it with Success', () => {

        const tableName = tableNames[2]
        const table = resolver.table(tableName);
        const key = { id: '12347' }
        const object = { id: '12347', name: 'AndyJassy' };

        return table.putItem(key, object)
            .then(result => expect(result).to.true)
            .then(() => table.getItem(key))
            .then(result => expect(result).to.eqls(object))
            .then(() => table.deleteItem(key))
            .then(() => table.getItem(key))
            .then(result => expect(result).to.null)
            .catch(error => {console.log(error); expect(error).to.undefined})

    });

    after(() => {
        resolver.finish(); 
    })

});