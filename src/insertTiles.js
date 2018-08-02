export function insertTiles(array, container) {
  let insertHtml = '';
  for (let tile of array) {
    insertHtml += tile.img;
  }
  container.insertAdjacentHTML('beforeend', insertHtml);
}
