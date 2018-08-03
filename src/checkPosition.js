import {updateCoords} from "./updateCoords.js";
import {checkNeighbours} from "./checkNeighbours.js";
import {puzzlesData} from "../puzzle-game.js";

export function checkPosition(dragElement) {
  const field = document.getElementById('field');
  const tile = puzzlesData[dragElement.firstElementChild.id];
  const tilePositionTop = field.offsetTop + field.clientTop + tile.row * 100;
  const tilePositionLeft = field.offsetLeft + field.clientLeft + tile.col * 100;
  const tileCoords = dragElement.firstElementChild.getBoundingClientRect();

  if (+dragElement.style.transform.replace(/\D+/g, '') === 0 &&
    Math.abs(tilePositionTop - tileCoords.top) < 3 &&
    Math.abs(tilePositionLeft - tileCoords.left) < 3) {
    field.append(...dragElement.children);
    dragElement.remove();
    updateCoords(field);
    return;
  }

  checkNeighbours(dragElement);
}