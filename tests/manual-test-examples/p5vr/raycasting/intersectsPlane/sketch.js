const planeWidth = 500;
const planeHeight = 400;

function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(200, 0, 150);  
}
  

function draw() {
  setViewerPosition(0, 0, 400);
  fill('#fae');
  plane(400, 400);
  fill('red');
  let offset;
  offset = intersectsPlane(0, 0);
  if(offset.x > -planeWidth / 2 && offset.x < planeWidth / 2 && offset.y > -planeHeight / 2 && offset.y < planeHeight / 2) {
    fill('blue');
    translate(offset.x, offset.y, 0);
  }
  box(60);
}