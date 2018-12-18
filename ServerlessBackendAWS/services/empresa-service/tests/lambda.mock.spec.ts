import { handler, injetResolver } from '../src/index'

import { expect, should } from 'chai';
import { mockEvent } from './mocks/mock-events';
import { mockContext } from './mocks/mock-context';
import { MockProxyResolver, MockTable } from './mocks/mock-proxy';

import 'mocha';
import lambdaTester = require('lambda-tester');

describe('Lambda Mock Resolver Injection', () => {

  it('Should Return Error when Mock is Not Injected', () => {

    return lambdaTester(handler).event(mockEvent).expectResult(result => {
      expect(result.statusCode === 500);
    });

  })

});

it('Should Return StatusCode 200 when Mock Resolver is Injected', () => {

  const mockTable = new MockTable()
  const mockResolver = new MockProxyResolver(null, null, null, mockTable);
  injetResolver(mockResolver);

  return lambdaTester(handler).event(mockEvent).expectResult(result => {
    expect(result.statusCode === 200);
  });

});