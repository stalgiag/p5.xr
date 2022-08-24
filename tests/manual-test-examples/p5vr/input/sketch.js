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
      } else {
        fill(255);
      }
      translate(hand.position.x, hand.position.y, hand.position.z);
      rotateX(-hand.rotation.x)
      rotateY(hand.rotation.y)
      rotateZ(-hand.rotation.z)
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
