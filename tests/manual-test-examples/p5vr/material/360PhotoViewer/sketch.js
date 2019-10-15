
let tex;

function preload() {
  tex = loadImage('../../../assets/equirectangular_hd.jpg');
  createVRCanvas();
  noStroke();
  setVRBackgroundColor(200, 0, 150);
}

function draw() {
  rotateX(PI);
  surroundTexture(tex);
}
