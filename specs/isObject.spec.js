import isObject from '../src/isObject';

describe('isObject::', () => {
  it('Should return true for object literal {}', () => {
    expect(isObject({})).toBeTruthy();
  });

  it('Should return false for array literal []', () => {
    expect(isObject([])).toBeFalsy();
  });

  it('Should return false for null', () => {
    expect(isObject(null)).toBeFalsy();
  });

  it('Should return false for primitive values', () => {
    expect(isObject(1)).toBeFalsy();
    expect(isObject('string')).toBeFalsy();
    expect(isObject(true)).toBeFalsy();
  });
});
