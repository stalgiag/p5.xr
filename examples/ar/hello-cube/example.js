function setup() {
  createCanvas(windowWidth, windowHeight, AR);
  describe("A cube waiting to be seen");
}

function draw() {
  translate(0, 0, -0.4);
  box(0.1, 0.1, 0.1);
}
