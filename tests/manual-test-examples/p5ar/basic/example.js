function setup() {
  createARCanvas(ARCORE);
}

let rot = 0;
let rotSpeed = 0.1;


function draw() {
  rot += rotSpeed;
  translate(0, 0, 10);
  fill(100,240,100);
  stroke(200, 0, 200);
  strokeWeight(0.1);
  rotateX(rot);
  rotateY(rot);
  box(2);
}