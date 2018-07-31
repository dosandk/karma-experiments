export function insertTiles(array) {
  try {
    const container = document.getElementById('image-sliced');
    for (let tile of array) {
      container.insertAdjacentHTML('beforeend', tile.img);
    }
  } catch {
    console.log("Inserting into DOM");
  }
}