function createImg(rows, cols, id, x, y, degree, img) {
  let coef = 1;
  if (img.width > img.height) {
    coef = img.width / img.height;
  }

  return `<div class="draggable" style="transform: rotate(${degree}deg);">
        <span class="img-cell" id="${id}" style="
        background: url(${img.url}) no-repeat ${-y*100}px ${-x*100}px;
        background-size: ${100*coef*rows}%;
        grid-row: ${x+1}/${x+2}; grid-column: ${y+1}/${y+2};"></span>
        </div>`;
}

function createTiles(rows, cols, img) {
  const result = [];
  let id = 0;

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      const degree = Math.floor(Math.random() * 4) * 90;
      const tile = {
        row: x,
        col: y,
        coords: [{}, {}, {}, {}],
        rotation: degree,
        neighbourLeft: y !== 0 ? id - 1 : "none",
        neighbourRight: y !== cols - 1 ? id + 1 : "none",
        neighbourTop: x !== 0 ? id - cols : "none",
        neighbourBottom: x !== rows - 1 ? id + cols : "none",
        img: createImg(rows, cols, id, x, y, degree, img),
      };
      id++;
      result.push(tile);
    }
  }

  return result;
}

export {createImg, createTiles};