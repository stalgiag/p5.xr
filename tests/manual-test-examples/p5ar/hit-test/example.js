let touchAnchor;

function setup() {
  createARCanvas();
}

function draw() {
  if (touchAnchor) {
    push();
    touchAnchor.transform();
    box(50);
    pop();
  }
}

function touchStarted(event) {
  const hit = detectHit(event);
  if (hit !== null) {
    console.log(hit);

    touchAnchor = createAnchor(hit);
  } else {
    touchAnchor = null;
  }
}
