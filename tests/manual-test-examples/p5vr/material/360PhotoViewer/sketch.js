
let tex;
let p;
let rot = 0;

function preload() {
  tex = loadImage('second-equi.jpg');
  p = loadImage('p5-logo.png');
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
  scale(1, 1, -1);
  texture(p);
  sphere(10);
}


