import {puzzlesData} from '../puzzle-game.js';

export function updateCoords(element) {
  for (let child of element.children) {
    const tile = puzzlesData[child.id];
    const tileDiv = document.getElementById(`${child.id}`);
    const {left, top} = tileDiv.getBoundingClientRect();
    tile.coords[0] = {
      x: left,
      y: top
    };
    tile.coords[1] = {
      x: left + tileDiv.clientWidth,
      y: top
    };
    tile.coords[2] = {
      x: left + tileDiv.clientWidth,
      y: top + tileDiv.clientHeight
    };
    tile.coords[3] = {
      x: left,
      y: top + tileDiv.clientHeight
    };

    let degree = tile.rotation;
    while (degree > 0) {
      tile.coords.push(tile.coords.shift());
      degree -= 90;
    }
  }
}