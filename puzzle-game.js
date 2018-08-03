"use strict";

import {createTiles} from './src/createTiles.js';
import {shuffleTiles} from './src/shuffleTiles.js';
import {insertTiles} from './src/insertTiles.js';
import {updateCoords} from './src/updateCoords.js';
import {checkPosition} from './src/checkPosition.js';

export let puzzlesData;

const game = {
  initialize: function () {
    const imgData = {};
    const preview = document.getElementById('preview');
    const file = document.getElementById('file');

    file.addEventListener('change', function() {
      if (file.files[0]) {
        const image = new Image();

        image.addEventListener('load', function () {
          imgData.width = image.width;
          imgData.height = image.height;
        });

        imgData.url = URL.createObjectURL(file.files[0]);
        image.src = imgData.url;
        preview.style.backgroundImage = `url(${imgData.url})`;
      }
    });

    const hint = document.getElementById('hint');
    hint.addEventListener('click', function(){
      console.log('click');
      preview.classList.toggle('show');
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
          startY === event.clientY) onClick(dragElement);
        updateCoords(dragElement);
        checkPosition(dragElement);
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
        checkPosition(dragElement);
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
    });

  }
};


function onClick(dragElement) {
  // Rotate element by 90 degrees clockwise
  let degree = +dragElement.style.transform.replace(/\D+/g, '') + 90;
  if (degree === 360) degree = 0;
  dragElement.style.transform = `rotate(${degree}deg)`;

  for (let child of dragElement.children) {
    puzzlesData[child.id].rotation = degree;
  }
}

export default game;