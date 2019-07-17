let counter = 0;

function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(200, 0, 150);
}

function calculate() {
  counter++;
}

function draw() {
  fill(0, 255, 0);
  checkSync();
  translate(0, 0, 10);
  rotateX(10);
  rotateY(20);
  strokeWeight(0.1);
  
  box(5);
}

function checkSync() {
  if(counter === 0) {return;}

  if(counter !== frameCount) {
    console.error('Out of sync!');
  }
}