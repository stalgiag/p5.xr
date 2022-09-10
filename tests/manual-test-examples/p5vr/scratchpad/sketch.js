function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(0, 0, 255);
  angleMode(DEGREES);
  noStroke();
}
var viewerPosition = new p5.Vector(0,0,0);

function draw() {
  setViewerPosition(viewerPosition.x, viewerPosition.y, viewerPosition.z);
  //moves the viewer forward if a key is pressed 
  if(keyIsPressed){
    viewerPosition.z -= 0.01
  }
  //moves the viewer forward if controller trigger is pressed
  const left = getXRInput(LEFT);
  const right = getXRInput(RIGHT);
  [left, right].forEach((hand) => {
	  if (hand) {
		  push();
      if( (hand.trigger && hand.trigger.pressed) || keyIsPressed) {
        viewerPosition.z -= 0.01
      }
      fill(255, 255, 0);
      applyMatrix(hand.pose)
		  box(0.05);
		  pop();
	  }
  });
  //draw a 10x10 floor
  push();
  translate(0, -1, 0);
  rotateX(-90);
  fill(0, 255, 0);
  plane(10, 10);
  pop();
  //resets the viewer's position if they move too far
  if (viewerPosition.z < -7) {
    viewerPosition.z = 7;
  }
}
