import { AWSProxyResolver } from '../src/aws-proxy';

import { expect, should } from 'chai';
import { mockEvent } from './mocks/mock-events';

import 'mocha';

describe('AWS Proxy', () => {

    it('Should Convert JSON to DynamoObject', () => {

        const proxy = new AWSProxyResolver();
        const table = proxy.table('region', 'name');
        const object = JSON.parse(mockEvent.body);
        const marshalled = table.marshalObject(object);
        should().exist(marshalled);

    });

    it('Should Convert DynamoObject to JSON', () => {

        const proxy = new AWSProxyResolver();
        const table = proxy.table('region', 'name');
        const object = JSON.parse(mockEvent.body);
        const marshalled = table.marshalObject(object);
        const unmarshalled = table.unmarshalObject(marshalled);
        expect(object).to.eql(unmarshalled);

    });

});