function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(0, 0, 255);
  angleMode(DEGREES);
  noStroke();
}

function draw() {
  const left = getXRInput(LEFT);
  const right = getXRInput(RIGHT);

  [left, right].forEach((hand) => {
	  if (hand) {
		  push();
      if(hand.trigger && hand.trigger.pressed) {
        fill(255, 255, 0);
      }
      else if(hand.grip && hand.grip.pressed) {
        fill(0, 255, 255);
      } 
      else {
        fill(255);
      }
      applyMatrix(hand.pose)
		  box(0.05);
		  pop();
	  }
  });

  push();
  translate(0, -1, 0);
  rotateX(-90);
  fill(0, 255, 0);
  plane(10, 10);
  pop();
}
