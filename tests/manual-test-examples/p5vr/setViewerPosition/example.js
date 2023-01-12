let z = 0;
let viewerPosition;

function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(0, 0, 255);
  noStroke();
  angleMode(DEGREES);
  viewerPosition = createVector(0, 0, 0);
}

function draw() {

  //moves the viewer forward if controller trigger is pressed
  const left = getXRInput(LEFT);
  const right = getXRInput(RIGHT);
  [left, right].forEach((hand) => {
	  if (hand) {
      viewerPosition.z += hand.thumbstick2D.y * 0.01;
      viewerPosition.x += hand.thumbstick2D.x * 0.01;
      if(hand.thumbstick2D.x !== 0 || hand.thumbstick2D.y !== 0) {
        fill('red');
      } else {
        fill('purple');
      }
      push();
      applyMatrix(hand.pose)
		  box(0.05);
		  pop();
	  }
  });
  if (viewerPosition.z < -7) {
    viewerPosition.z = 7;
  }
  setViewerPosition(viewerPosition.x, viewerPosition.y, viewerPosition.z);
  //draw a 10x10 floor
  push();
  translate(0, -1, 0);
  rotateX(-90);
  fill(0, 255, 0);
  plane(10, 10);
  pop();
  //resets the viewer's position if they move too far
}