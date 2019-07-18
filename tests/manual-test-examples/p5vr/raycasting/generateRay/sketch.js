let vrGlobals = {
  counter: 0
};

let randomx = [], randomy = [];

function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(200, 0, 150);
  for (let i = 0; i < 5; ++i) {
    randomx[i] = random(-500, 500);
    randomy[i] = random(-500, 500);
  }
}

function draw() {
  setViewerPosition(0, 0, 400);
  push();
  translate(randomx[0], randomy[0]);
  fill('green');
  sphere(30);
  rotateZ(millis() / 1000);
  line(0, 0, 0, 1000, 1000, 0);
  let ray = generateRay(0, 0, 0, 1000, 1000, 0);
  pop();
  for (let i = 1; i < 5; ++i) {
    push();
    translate(randomx[i], randomy[i]);
    fill('red');
    if (intersectsSphere(70, ray)) {
      fill('blue');
    }
    sphere(70);
    pop();
  }
}
