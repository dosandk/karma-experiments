export const puzzlesData = [];

export function createTiles(rows, cols) {
  const shiftX = 100 / (cols - 1);
  const shiftY = 100 / (rows - 1);
  const result = [];

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      const degree = Math.floor(Math.random() * 4) * 90;
      const tile = {
        id: x * cols + y,
      };
      tile.img = `<div class="draggable" style="transform: rotate(${degree}deg);">
        <span class="img-cell" id="${tile.id}" style="background-position: ${y*shiftX}% ${x*shiftY}%;
        grid-row: ${x+1}/${x+2}; grid-column: ${y+1}/${y+2};"></span>
        </div>`;
      const obj= {
        row: x,
        col: y,
        coords: [{}, {}, {}, {}],
        rotation: degree,
        neighbourLeft: y !== 0 ? tile.id - 1 : "none",
        neighbourRight: y !== cols - 1 ? tile.id + 1 : "none",
        neighbourTop: x !== 0 ? tile.id - cols : "none",
        neighbourBottom: x !== rows - 1 ? tile.id + cols : "none",
      };
      puzzlesData.push(obj);
      result.push(tile);
    }
  }

  return result;
}
