function preload(){
  // need to make sure preload works
  createVRCanvas();
}

function setup(){
  setVRBackgroundColor(200, 0, 150);
}
let counter = 0;
function draw(){
  if(counter<2){counter++; return;}
  fill(0, 150, 100);
  translate(0, 0, 10);
  strokeWeight(0.1);
  rotateX(10);
  rotateY(20);
  box(5);
}
