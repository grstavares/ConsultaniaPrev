import { handler } from '../src/index'

import { expect, should } from 'chai';
import { mockEvent } from './mocks/mock-events';

import 'mocha';
import { Callback } from 'aws-lambda';

describe('Lambda Execution', () => {

  it('Should Return Status Code 200', () => {
    
    const callback: Callback = (error, result) => {
      should().exist(result);
      expect(result.statusCode).equal(200);
    }

    handler(mockEvent, null, callback);

  });

});