import { createTiles } from '../src/createTiles';
import { shuffleTiles } from '../src/shuffleTiles';

describe('puzzle-game::', () => {
  describe('createTiles()', () => {
    it('puzzle of 4 rows and 5 cols should return array of length 20', () => {
      expect(createTiles(4, 5).length).toEqual(20);
    });
    it('element #n expected to have id=n}', () => {
      expect(createTiles(5, 6)[0].id).toEqual(0);
      expect(createTiles(5, 6)[5].id).toEqual(5);
      expect(createTiles(5, 6)[29].id).toEqual(29);
    });
    it('property img should be of type String', () => {
      for (let elem of createTiles(4, 5)) {
        expect(typeof(elem)).toEqual(String);
      }
    });
  });
  describe('shuffleTiles()', () => {
    const array = createTiles(4, 4);
    it('array length should stay the same', () => {
      expect(shuffleTiles(array).length).toEqual(array.length);
    });
    it('each element should be present in shuffled array', () => {
      for (let elem of array) {
        expect(shuffleTiles(array).includes(elem)).toBeTruthy();
      }
    });
  });
});

