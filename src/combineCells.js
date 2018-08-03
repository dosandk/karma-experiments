import {updateCoords} from "./updateCoords.js";

export function combineCells(dragElement, divsToMerge) {
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