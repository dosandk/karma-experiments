import riba from './riba';
//const riba = (a, b) => a + b;

describe('foo', () => {

  it('should return 3', () => {
    expect(riba(1, 2)).toBe(3);
  });

  it('should return 5', () => {
    expect(riba(2, 3)).toBe(5);
  });

});
