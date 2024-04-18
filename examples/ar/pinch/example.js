let isBox = true;

function preload() {
  createARCanvas();
}

function setup() {
  describe("Toggle between a box and a sphere with a pinch.");
  mainHandMode(RIGHT);
}

function draw() {
  normalMaterial();
  push();
  translate(finger.x, finger.y, finger.z);
  scale(0.01);
  if (isBox) {
    box(1, 1, 1);
  } else {
    sphere(1);
  }
  pop();
}

function fingersPinched(){
  isBox = !isBox;
}
