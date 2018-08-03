import {puzzlesData} from "../puzzle-game.js";
import {combineCells} from "./combineCells.js";

export function checkNeighbours(dragElement) {
  const divsToMerge = [];
  for (let child of dragElement.children) {
    const tile = puzzlesData[child.id];

    if (checkCorners(tile, 0, tile.neighbourLeft, 1)) {
      addDivToMerge(divsToMerge, tile.neighbourLeft);
      puzzlesData[tile.neighbourLeft].neighbourRight = "none";
      tile.neighbourLeft = "none";
    }

    if (checkCorners(tile, 2, tile.neighbourRight, 3)) {
      addDivToMerge(divsToMerge, tile.neighbourRight);
      puzzlesData[tile.neighbourRight].neighbourLeft = "none";
      tile.neighbourRight = "none";
    }

    if (checkCorners(tile, 0, tile.neighbourTop, 3)) {
      addDivToMerge(divsToMerge, tile.neighbourTop);
      puzzlesData[tile.neighbourTop].neighbourBottom = "none";
      tile.neighbourTop = "none";
    }

    if (checkCorners(tile, 2, tile.neighbourBottom, 1)) {
      addDivToMerge(divsToMerge, tile.neighbourBottom);
      puzzlesData[tile.neighbourBottom].neighbourTop = "none";
      tile.neighbourBottom = "none";
    }
  }

  if (divsToMerge.length !== 0) combineCells(dragElement, divsToMerge);
}

function checkCorners (tile, corner1, neighbour, corner2){
  return neighbour !== "none" &&
    Math.abs(tile.coords[corner1].x - puzzlesData[neighbour].coords[corner2].x) < 3 &&
    Math.abs(tile.coords[corner1].y - puzzlesData[neighbour].coords[corner2].y) < 3 &&
    tile.rotation === puzzlesData[neighbour].rotation;
}

function addDivToMerge(divsToMerge, neighbour) {
  const neighbourDiv = document.getElementById(neighbour).parentNode;
  if (!divsToMerge.includes(neighbourDiv)) divsToMerge.push(neighbourDiv);
  return divsToMerge;
}