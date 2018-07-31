export function insertTiles(array, container) {
  for (let tile of array) {
    container.insertAdjacentHTML('beforeend', tile.img);
  }
}
