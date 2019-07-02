function setup() {
  createARCanvas();
}

let counter = 0;

function draw() {
  // TEMPORARY HACK
  if(counter < 2) {counter++; return;}
  translate(0, 0, 100);
  fill(100,240,100);
  stroke(200, 0, 200);
  strokeWeight(0.1);
  rotateX(frameCount * 0.02);
  rotateY(frameCount * 0.02);
  box(20);
}