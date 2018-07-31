"use strict";

import { createTiles, puzzlesData } from './src/createTiles';
import { shuffleTiles } from './src/shuffleTiles';
import { insertTiles } from './src/insertTiles';

const tiles = createTiles(4, 4);
const shuffledTiles = shuffleTiles(tiles);
insertTiles(shuffledTiles);

document.addEventListener('mousedown', function(event) {

  if (event.target.className !== 'img-cell') return;
  const dragElement = event.target.closest('.draggable');
  if (!dragElement) return;

  event.preventDefault();
  let startX, startY, shiftX, shiftY;

  startDrag(event.clientX, event.clientY);

  // remember the initial shift and start position
  // move the element as a direct child of body
  function startDrag(clientX, clientY) {
    shiftX = clientX - dragElement.getBoundingClientRect().left;
    shiftY = clientY - dragElement.getBoundingClientRect().top;
    startX = dragElement.getBoundingClientRect().left + shiftX;
    startY = dragElement.getBoundingClientRect().top + shiftY;

    if (dragElement.style.position !== 'absolute') {
      dragElement.style.position = 'absolute';
      dragElement.style.left = clientX - shiftX + 'px';
      dragElement.style.top = clientY - shiftY + 'px';
    }
    document.body.append(dragElement);
  }

  document.addEventListener('mousemove', onMouseMove);

  dragElement.addEventListener('mouseup', function() {
    document.removeEventListener('mousemove', onMouseMove);
    dragElement.onmouseup = null;
    //
    if (startX === event.clientX &&
      startY === event.clientY) onClick();
    updateCoords(dragElement);
    checkPosition();
  });

  function onMouseMove(event) {
    // Remember initial coordinates
    startX = dragElement.getBoundingClientRect().left + shiftX;
    startY = dragElement.getBoundingClientRect().top + shiftY;
    moveAt(event.clientX, event.clientY);
  }

  function moveAt(clientX, clientY) {
    let diffX = clientX - startX;
    let diffY = clientY - startY;
    dragElement.style.left = parseInt(dragElement.style.left) + diffX + 'px';
    dragElement.style.top = parseInt(dragElement.style.top) + diffY + 'px';
  }

  function onClick() {
    // Rotate element by 90 degrees clockwise
    let degree = +dragElement.style.transform.replace(/\D+/g, '') + 90;
    if (degree == 360) degree = 0;
    dragElement.style.transform = `rotate(${degree}deg)`;

    for (let child of dragElement.children) {
      puzzlesData[child.id].rotation = degree;
    }
  }

  function updateCoords(element) {
    for (let child of element.children) {
      let tile = puzzlesData[child.id];
      let tileDiv = document.getElementById(`${child.id}`);
      let tileDivCoords = tileDiv.getBoundingClientRect();
      tile.coords[0] = {
        x: parseInt(tileDivCoords.left),
        y: parseInt(tileDivCoords.top)
      };
      tile.coords[1] = {
        x: parseInt(tileDivCoords.left) + tileDiv.clientWidth,
        y: parseInt(tileDivCoords.top)
      };
      tile.coords[2] = {
        x: parseInt(tileDivCoords.left) + tileDiv.clientWidth,
        y: parseInt(tileDivCoords.top) + tileDiv.clientHeight
      };
      tile.coords[3] = {
        x: parseInt(tileDivCoords.left),
        y: parseInt(tileDivCoords.top) + tileDiv.clientHeight
      };

      let degree = tile.rotation;
      while (degree > 0) {
        tile.coords.push(tile.coords.shift());
        degree -= 90;
      }
    }
  }

  function checkPosition() {
    const field = document.getElementById('field');
    const fieldPositionTop = field.offsetTop + field.clientTop + puzzlesData[dragElement.firstElementChild.id].row * 100;
    const fieldPositionLeft = field.offsetLeft + field.clientLeft + puzzlesData[dragElement.firstElementChild.id].col * 100;
    const tileCoords = dragElement.firstElementChild.getBoundingClientRect();

    if (+dragElement.style.transform.replace(/\D+/g, '') === 0 &&
      Math.abs(fieldPositionTop - tileCoords.top) < 3 &&
      Math.abs(fieldPositionLeft - tileCoords.left) < 3) {
      field.append(...dragElement.children);
      updateCoords(field);
      dragElement.remove();
      return;
    }

    checkNeighbours();
  }

  function checkNeighbours() {
    let divsToMerge = [];
    for (let child of dragElement.children) {
      let tile = puzzlesData[child.id];

      if (tile.neighbourLeft != "none" &&
        Math.abs(tile.coords[0].x - puzzlesData[tile.neighbourLeft].coords[1].x) < 3 &&
        Math.abs(tile.coords[0].y - puzzlesData[tile.neighbourLeft].coords[1].y) < 3 &&
        tile.rotation == puzzlesData[tile.neighbourLeft].rotation) {
        let neighbourDiv = document.getElementById(tile.neighbourLeft).parentNode;
        if (!divsToMerge.includes(neighbourDiv)) divsToMerge.push(neighbourDiv);
        puzzlesData[tile.neighbourLeft].neighbourRight = "none";
        tile.neighbourLeft = "none";
      }

      if (tile.neighbourRight != "none" &&
        Math.abs(tile.coords[2].x - puzzlesData[tile.neighbourRight].coords[3].x) < 3 &&
        Math.abs(tile.coords[2].y - puzzlesData[tile.neighbourRight].coords[3].y) < 3 &&
        tile.rotation == puzzlesData[tile.neighbourRight].rotation) {
        let neighbourDiv = document.getElementById(tile.neighbourRight).parentNode;
        if (!divsToMerge.includes(neighbourDiv)) divsToMerge.push(neighbourDiv);
        puzzlesData[tile.neighbourRight].neighbourLeft = "none";
        tile.neighbourRight = "none";
      }

      if (tile.neighbourTop != "none" &&
        Math.abs(tile.coords[0].x - puzzlesData[tile.neighbourTop].coords[3].x) < 3 &&
        Math.abs(tile.coords[0].y - puzzlesData[tile.neighbourTop].coords[3].y) < 3 &&
        tile.rotation == puzzlesData[tile.neighbourTop].rotation) {
        let neighbourDiv = document.getElementById(tile.neighbourTop).parentNode;
        if (!divsToMerge.includes(neighbourDiv)) divsToMerge.push(neighbourDiv);
        puzzlesData[tile.neighbourTop].neighbourBottom = "none";
        tile.neighbourTop = "none";
      }

      if (tile.neighbourBottom != "none" &&
        Math.abs(tile.coords[2].x - puzzlesData[tile.neighbourBottom].coords[1].x) < 3 &&
        Math.abs(tile.coords[2].y - puzzlesData[tile.neighbourBottom].coords[1].y) < 3 &&
        tile.rotation == puzzlesData[tile.neighbourBottom].rotation) {
        let neighbourDiv = document.getElementById(tile.neighbourBottom).parentNode;
        if (!divsToMerge.includes(neighbourDiv)) divsToMerge.push(neighbourDiv);
        puzzlesData[tile.neighbourBottom].neighbourTop = "none";
        tile.neighbourBottom = "none";
      }
    }

    if (divsToMerge.length !== 0) combineCells(divsToMerge);
  }

  function combineCells(divsToMerge) {
    for (let div of divsToMerge) {
      let newX = Math.min(parseInt(dragElement.style.left), parseInt(div.style.left));
      let newY = Math.min(parseInt(dragElement.style.top), parseInt(div.style.top));
      dragElement.style.display = "grid";
      dragElement.append(...div.children);
      dragElement.style.left = newX + "px";
      dragElement.style.top = newY + "px";
      div.remove();
    }
    updateCoords(dragElement);
  }
});
