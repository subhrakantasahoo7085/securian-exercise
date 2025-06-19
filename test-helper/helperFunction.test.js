import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import HelperFunctions from '../src/utils/helperFunction';

describe('HelperFunctions - readDataFromJson', () => {
  afterEach(() => sinon.restore());

  it('should return value for a valid key', () => {
    sinon.stub(fs, 'existsSync').returns(true);
    sinon.stub(fs, 'readFileSync').returns(JSON.stringify({ name: 'John' }));

    const result = HelperFunctions.readDataFromJson('name');
    expect(result).to.equal('John');
  });
});
