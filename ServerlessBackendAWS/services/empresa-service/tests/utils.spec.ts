import * as uuid from '../src/utils'
import { expect, should } from 'chai';
import 'mocha';

describe('Utils Functions', () => {

  it('Should generate Random Uuid', () => {
    const result = uuid();
    should().exist(result);
  });

});