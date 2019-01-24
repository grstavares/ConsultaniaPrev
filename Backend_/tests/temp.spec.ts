/* tslint:disable no-implicit-dependencies */
import { expect, should } from 'chai';

/* tslint:disable no-submodule-imports */
import { KeySchema, AttributeDefinitions } from 'aws-sdk/clients/dynamodb';
import { DynamoDBMock, LocalDynamoConfiguration } from './mockedDependencies/dynamoMock';

import { DynamoDBTable } from '../src/aws/dynamodb';

/* tslint:disable no-import-side-effect */
import 'mocha';

describe('Testing UpdateExpression Mapper', () => {

    /* tslint:disable arrow-return-shorthand */
    it('Must Convert Expression', () => {

        const dynamo = new DynamoDBTable('tableName');

        const expression = dynamo.updateExpression({ cartId: 'adsf', quantity: 20});
        return expect(expression).to.not.null;

    });

});
