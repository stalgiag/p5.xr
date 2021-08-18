function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(0, 0, 0);
  // sets the resolution at which bezier's curve is displayed
  // the higher the number, the smoother the curves will be
  bezierDetail(200);
}

function draw() {
  // these can be useful if you ever want to draw something relative to the head
  let viewerPose = p5xr.instance.viewer.pose;
  // get location of the camera with viewerPosition
  let viewerPosition = viewerPose.transform.position;
  // get the pose of the camera with viewerPoseMatrix
  let viewerPoseMatrix = p5xr.instance.viewer.pose.transform.matrix;

  // invert the character so it looks more like a mirror
  push();
  scale(-1, 1, 1)
  noStroke();

  // HEAD
  push();
  // applies pose of camera to the head shape
  // as you move your head, the box moves along with it
  applyMatrix(viewerPoseMatrix);
  fill(0, 0, 255);
  box(0.25);
  pop();

  // BODY
  push();
  // translates body to the location of the camera
  translate(viewerPosition.x, viewerPosition.y - 0.55, viewerPosition.z);
  fill(0, 0, 255);
  box(0.3, 0.6, 0.3);
  pop();

  // LEGS
  push();
  stroke(255);
  strokeWeight(8);
  fill(255)

  // left leg
  beginShape();
  curveVertex(viewerPosition.x, viewerPosition.y - 0.70, viewerPosition.z - 0.1);
  curveVertex(viewerPosition.x, viewerPosition.y - 0.70, viewerPosition.z - 0.1);
  curveVertex(viewerPosition.x, viewerPosition.y - 1.30, viewerPosition.z - 0.2);
  curveVertex(viewerPosition.x, viewerPosition.y - 2.1, viewerPosition.z - 0.2);
  curveVertex(viewerPosition.x, viewerPosition.y - 2.3, viewerPosition.z - 0.3);
  endShape();
  // left foot
  push();
  translate(viewerPosition.x, viewerPosition.y - 2.2, viewerPosition.z - 0.2);
  fill(0, 0, 255);
  box(0.4, 0.2, 0.2)
  pop();

  // right leg
  beginShape();
  curveVertex(viewerPosition.x, viewerPosition.y - 0.70, viewerPosition.z + 0.1);
  curveVertex(viewerPosition.x, viewerPosition.y - 0.70, viewerPosition.z + 0.1);
  curveVertex(viewerPosition.x, viewerPosition.y - 1.30, viewerPosition.z + 0.2);
  curveVertex(viewerPosition.x, viewerPosition.y - 2.1, viewerPosition.z + 0.2);
  curveVertex(viewerPosition.x, viewerPosition.y - 2.3, viewerPosition.z + 0.3);
  endShape();
  // right foot
  push();
  translate(viewerPosition.x, viewerPosition.y - 2.2, viewerPosition.z + 0.2);
  fill(0, 0, 255);
  box(0.4, 0.2, 0.2);
  pop();

  pop();

  // gets input for the left and right hand controllers
  const left = getXRInput(LEFT);
  const right = getXRInput(RIGHT);
  // ARMS
  push();
  noFill();
  stroke(255);
  strokeWeight(8);

  // if the left controller is detected, display the following...  
  if (left) {
    // creates a curved line located on the left side of the viewer
    beginShape();
    curveVertex(viewerPosition.x, viewerPosition.y - 0.35, viewerPosition.z)
    curveVertex(viewerPosition.x, viewerPosition.y - 0.35, viewerPosition.z)
    curveVertex(viewerPosition.x, viewerPosition.y - 0.35, viewerPosition.z - 0.2)
    curveVertex(viewerPosition.x, viewerPosition.y - 0.55, viewerPosition.z - 0.4)
    // left.position makes it so that these points are directly at position of the left hand
    curveVertex(left.position.x, left.position.y, left.position.z);
    curveVertex(left.position.x, left.position.y, left.position.z);

    push();
    // applies pose of left hand to box
    applyMatrix(left.pose);
    box(0.08)
    pop();

    endShape();
  }

  // if the right controller is detected, display the following...  
  if (right) {
    // creates a curved line located on the right side of the viewer
    beginShape();
    curveVertex(viewerPosition.x, viewerPosition.y - 0.35, viewerPosition.z)
    curveVertex(viewerPosition.x, viewerPosition.y - 0.35, viewerPosition.z)
    curveVertex(viewerPosition.x, viewerPosition.y - 0.35, viewerPosition.z + 0.2)
    curveVertex(viewerPosition.x, viewerPosition.y - 0.55, viewerPosition.z + 0.4)
    // right.position makes it so that these points are directly at position of the right hand
    curveVertex(right.position.x, right.position.y, right.position.z);
    curveVertex(right.position.x, right.position.y, right.position.z);

    push();
    // applies pose of right hand to box
    applyMatrix(right.pose);
    box(0.08)
    pop();

    endShape();

    pop();
  }

  pop();

  drawGround();
}

function drawGround() {
  push();
  translate(0, -2, 0);
  rotateX(-Math.PI / 2);
  noStroke();
  fill(100);
  plane(10, 10);
  pop();
}