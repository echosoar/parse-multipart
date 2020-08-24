import { bufferIndexOf, bufferSplit } from '../src/utils';
import * as assert from 'assert';
describe('utils', () => {
  it('bufferIndexOf', () => {
    const bufferA = Buffer.from('abcdefghijk');
    const bufferB = Buffer.from('gh');
    const index = bufferIndexOf(bufferA, bufferB);
    assert(index === 6);
  });
  it('bufferIndexOf offset', () => {
    const bufferA = Buffer.from('abcdefghijk');
    const bufferB = Buffer.from('gh');
    const index = bufferIndexOf(bufferA, bufferB, 7);
    assert(index === -1);
  });
  it('bufferSplit', () => {
    const buffer = Buffer.from('abc000efg000hij000');
    const separator = Buffer.from('000');
    const result = bufferSplit(buffer, separator);
    assert(result.length === 4);
  });
  it('bufferSplit limit', () => {
    const buffer = Buffer.from('abc000efg000hij000');
    const separator = Buffer.from('000');
    const result = bufferSplit(buffer, separator, 2);
    assert(result.length === 2);
  });
});
