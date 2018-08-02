"use strict";

import {createTiles} from './src/createTiles.js';
import {shuffleTiles} from './src/shuffleTiles.js';
import {insertTiles} from './src/insertTiles.js';

const game = {
  initialize: function () {
    let puzzlesData;
    const imgData = {};
    const preview = document.getElementById('preview');
    const file = document.getElementById('file');

    file.addEventListener('change', function() {
      if (file.files[0]) {
        const image = new Image();

        image.addEventListener('load', function () {
          imgData.width = this.width;
          imgData.height = this.height;
        });

        imgData.url = URL.createObjectURL(file.files[0]);
        image.src = imgData.url;
        preview.style.backgroundImage = `url(${imgData.url})`;
      }
    });

    function clearField() {
      const field = document.getElementById('field');
      field.innerHTML = '';
      const elements = document.getElementsByClassName('draggable');
      while (elements[0]) {
        elements[0].remove();
      }
    }

    const start = document.getElementById('start');
    start.addEventListener('click', function(){
      clearField();
      puzzlesData = createTiles(4, 4, imgData);
      const shuffledTiles = shuffleTiles(puzzlesData);
      const container = document.getElementById('image-sliced');
      insertTiles(shuffledTiles, container);
    });

    document.addEventListener('mousedown', function (event) {

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
          dragElement.style.display = "grid";
          dragElement.style.left = clientX - shiftX + 'px';
          dragElement.style.top = clientY - shiftY + 'px';
        }
        document.body.append(dragElement);
      }

      document.addEventListener('mousemove', onMouseMove);

      dragElement.addEventListener('mouseup', onMouseUp);

      function onMouseUp(event) {
        document.removeEventListener('mousemove', onMouseMove);
        dragElement.removeEventListener('mouseup', onMouseUp);
        // If position didn't change, treat is as a click
        if (startX === event.clientX &&
          startY === event.clientY) onClick();
        updateCoords(dragElement);
        checkPosition();
      }

      function onMouseMove(event) {
        // Remember initial coordinates
        startX = dragElement.getBoundingClientRect().left + shiftX;
        startY = dragElement.getBoundingClientRect().top + shiftY;
        moveAt(event.clientX, event.clientY);
      }

      function moveAt(clientX, clientY) {
        const diffX = clientX - startX;
        const diffY = clientY - startY;
        dragElement.style.left = parseInt(dragElement.style.left) + diffX + 'px';
        dragElement.style.top = parseInt(dragElement.style.top) + diffY + 'px';
      }

      function onClick() {
        // Rotate element by 90 degrees clockwise
        let degree = +dragElement.style.transform.replace(/\D+/g, '') + 90;
        if (degree === 360) degree = 0;
        dragElement.style.transform = `rotate(${degree}deg)`;

        for (let child of dragElement.children) {
          puzzlesData[child.id].rotation = degree;
        }
      }

      function updateCoords(element) {
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

      function checkPosition() {
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

        checkNeighbours();
      }

      function checkNeighbours() {
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

        if (divsToMerge.length !== 0) combineCells(divsToMerge);
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

      function combineCells(divsToMerge) {
        for (let div of divsToMerge) {
          const newX = Math.min(parseInt(dragElement.style.left), parseInt(div.style.left));
          const newY = Math.min(parseInt(dragElement.style.top), parseInt(div.style.top));
          dragElement.append(...div.children);
          dragElement.style.left = newX + "px";
          dragElement.style.top = newY + "px";
          div.remove();
        }
        updateCoords(dragElement);
      }
    });



    document.addEventListener('touchstart', function (event) {

      if (event.target.className !== 'img-cell') return;
      const dragElement = event.target.closest('.draggable');
      if (!dragElement) return;

      event.preventDefault();
      let startX, startY, shiftX, shiftY;

      startDrag(event.touches[0].clientX, event.touches[0].clientY);

      // remember the initial shift and start position
      // move the element as a direct child of body
      function startDrag(clientX, clientY) {
        shiftX = clientX - dragElement.getBoundingClientRect().left;
        shiftY = clientY - dragElement.getBoundingClientRect().top;
        startX = dragElement.getBoundingClientRect().left + shiftX;
        startY = dragElement.getBoundingClientRect().top + shiftY;

        if (dragElement.style.position !== 'absolute') {
          dragElement.style.position = 'absolute';
          dragElement.style.display = "grid";
          dragElement.style.left = clientX - shiftX + 'px';
          dragElement.style.top = clientY - shiftY + 'px';
        }
        document.body.append(dragElement);
      }

      document.addEventListener('touchmove', onMouseMove);

      dragElement.addEventListener('touchend', onMouseUp);

      function onMouseUp() {
        document.removeEventListener('touchmove', onMouseMove);
        dragElement.removeEventListener('touchend', onMouseUp);
        updateCoords(dragElement);
        checkPosition();
      }

      function onMouseMove(event) {
        // Remember initial coordinates
        startX = dragElement.getBoundingClientRect().left + shiftX;
        startY = dragElement.getBoundingClientRect().top + shiftY;
        moveAt(event.touches[0].clientX, event.touches[0].clientY);
      }

      function moveAt(clientX, clientY) {
        const diffX = clientX - startX;
        const diffY = clientY - startY;
        dragElement.style.left = parseInt(dragElement.style.left) + diffX + 'px';
        dragElement.style.top = parseInt(dragElement.style.top) + diffY + 'px';
      }

      function updateCoords(element) {
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

      function checkPosition() {
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

        checkNeighbours();
      }

      function checkNeighbours() {
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

        if (divsToMerge.length !== 0) combineCells(divsToMerge);
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

      function combineCells(divsToMerge) {
        for (let div of divsToMerge) {
          const newX = Math.min(parseInt(dragElement.style.left), parseInt(div.style.left));
          const newY = Math.min(parseInt(dragElement.style.top), parseInt(div.style.top));
          dragElement.append(...div.children);
          dragElement.style.left = newX + "px";
          dragElement.style.top = newY + "px";
          div.remove();
        }
        updateCoords(dragElement);
      }
    });

  }
};

export default game;