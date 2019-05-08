let tex;

function preload() {
  tex = loadImage('../../../assets/equirectangular.png');
  createVRCanvas();
  setVRBackgroundColor(200, 0, 150);
}

function draw() {
  rotateX(90);
  noStroke();
  texture(tex);
  translate(-25, 0, -25);
  sphere(100);
}
