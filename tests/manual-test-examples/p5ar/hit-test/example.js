let anchor = null;

function setup() {
  createARCanvas();
}

function draw() {
  if (anchor) {
    push();
    anchor.transform();
    box(50);
    pop();
  }
}

function mousePressed() {
  anchor = createAnchor();
}
