
let tex;

function preload() {
  tex = loadImage('../../../assets/equirectangular_hd.jpg');
  createVRCanvas();
  noStroke();
  setVRBackgroundColor(200, 0, 150);
}

function draw() {
  rotateX(PI);
  texture(tex);
  scale(-1, 1, 1);
  sphere(500, 60, 40);
}
