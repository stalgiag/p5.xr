function preload() {
  createARCanvas();
}

function setup() {
  describe("Show all fingers with their radii.");
}

function draw() {
  let l = 0.05;
  
  strokeWeight(3); 

  push();
  applyMatrix(finger.mat4);
  
  // x axis
  stroke(255, 0, 0);
  line(0, 0, 0, l, 0, 0);

  // y axis
  stroke(0, 255, 0);
  line(0, 0, 0, 0, l, 0);

  // z axis
  stroke(0, 0, 255);
  line(0, 0, 0, 0, 0, l);

  pop();
}
