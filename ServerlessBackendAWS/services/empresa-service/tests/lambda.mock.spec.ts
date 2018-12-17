import { handler, injetResolver } from '../src/index'

import { expect, should } from 'chai';
import { mockEvent } from './mocks/mock-events';
import { mockContext } from './mocks/mock-context';
import { MockProxyResolver } from './mocks/mock-proxy';

import 'mocha';
import { Callback } from 'aws-lambda';

describe('Lambda Mock Resolver Injection', () => {

  it('Should Return Error when Mock is Not Injected', () => {

    const callback: Callback = (error, result) => {
      should().exist(result);
      expect(result.statusCode).equal(500);
    }

    handler(mockEvent, mockContext, callback);

  });

  it('Should Return StatusCode 200 when Mock Resolver is Injected', () => {

    const mockResolver = new MockProxyResolver(null, null, null, null);
    injetResolver(mockResolver);

    const callback: Callback = (error, result) => {
      should().exist(result);
      expect(result.statusCode).equal(200);
    }

    // Insert a mock Context

    handler(mockEvent, mockContext, callback);

  });

});