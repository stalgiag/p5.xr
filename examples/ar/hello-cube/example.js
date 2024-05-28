function preload() {
  createARCanvas();
}

function setup() {
  describe("A cube waiting to be seen");
}

function draw() {
  push();
  translate(0, 0, -0.4);
  box(0.1, 0.1, 0.1);
  pop();
}
