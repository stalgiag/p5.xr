let vrGlobals = {
  counter: 0
};

let randomx=[], randomy=[];

function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(200, 0, 150);
  for(let i=0; i<5; ++i) {
    randomx[i] = random(-500, 500);
    randomy[i] = random(-500, 500);
  }
}

function draw() {
  setViewerPosition(0, 0, 400);
  for(let i=0; i<5; ++i) {
    push();
    // translate(randomx[i], randomy[i]);
    fill('red');
    if(intersectsSphere(70, 0, 0)) {
      fill('blue');
    }
    sphere(70);
    pop();
  }
}