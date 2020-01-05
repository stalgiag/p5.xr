
let tex;
let p;
let rot = 0;

function preload() {
  tex = loadImage('../../../assets/equirectangular_hd.jpg');
  p = loadImage('../../../assets/UV_Grid_SM.jpg');
  createVRCanvas();
  setVRBackgroundColor(200, 0, 150);
}

function setup() {
  noStroke();

}

function calculate() {
  rot += 0.01;
}

function draw() {
  rotateX(PI);
  surroundTexture(tex);
  translate(0, 0, 35);
  rotateY(rot);
  texture(p);
  sphere(10);
}


