function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(200, 0, 150);
}

let rotSpeed = 0.3, rotAngle = 0;

function draw() {
  setViewerPosition(0, 0, 200);
  push();
  angleMode(DEGREES);
  rotateZ(rotAngle);
  translate(100, 0, 0);
  fill('red');
  if (intersectsBox(50, 0, 0)) {
    rotAngle += rotSpeed;
    fill('blue');
  }
  box(50);
  pop();
}
