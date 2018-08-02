import {createTiles} from '../src/createTiles';
import {shuffleTiles} from "../src/shuffleTiles";

describe('shuffleTiles()', () => {
  const array = createTiles(4, 4);
  const shuffledArray = shuffleTiles(array);
  it('input array was not mutated', () => {
    expect(array).not.toEqual(shuffledArray);
  });
  it('each element should be present in shuffled array', () => {
    for (let elem of array) {
      expect(shuffledArray.includes(elem)).toBeTruthy();
    }
  });
});