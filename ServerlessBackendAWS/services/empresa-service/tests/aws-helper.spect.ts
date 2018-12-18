import { AwsHelper } from '../src/aws-helper';
import { expect, should } from 'chai';
import { mockEvent } from './mocks/mock-events';

import 'mocha';

describe('AWS Proxy', () => {

    it('Should Convert JSON to DynamoObject', () => {

        const object = JSON.parse(mockEvent.body);
        const marshalled = AwsHelper.marshalObject(object);
        should().exist(marshalled);

    });

    it('Should Convert DynamoObject to JSON', () => {

        const object = JSON.parse(mockEvent.body);
        const marshalled = AwsHelper.marshalObject(object);
        const unmarshalled = AwsHelper.unmarshalObject(marshalled);
        expect(object).to.eql(unmarshalled);

    });

});