let counter = 0;

let setupCounter = 1;

function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(200, 0, 150);
  setupCounter++;
}

function calculate() {
  checkSync();
  checkSetup();
  counter++;
}

function draw() {
  fill(0, 255, 0);
  translate(0, 0, -10);
  rotateX(10);
  rotateY(20);
  strokeWeight(5);
  box(5);
  
}

function checkSetup() {
  // if(setupCounter !== 2) {
  //   // console.error('setup() running incorrectly');
  //   console.log(`setup has run ${setupCounter} times`)
  // }
}

function checkSync() {
  if(counter === 0) {return;}

  if(counter !== frameCount) {
    console.error(`draw timing out of sync:\nframeCount: ${frameCount}\ncalculate() run times: ${counter}`);
  }
}