import sum from '../src/sum';

describe('sum::', () => {
  it('should return 3', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('should return 5', () => {
    expect(sum(2, 3)).toBe(5);
  });
});
