function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(200, 0, 150);  
}
  
let x = 0, y = 0;
  
function draw() {
  setViewerPosition(0, 0, 400);
  fill('#fae');
  plane(400, 400);
  fill('red');
  translate(x, y, 0);
  let offset;
  if(intersectsBox(60, 0, 0)) {
    translate(-x, -y, 0);
    fill('blue');
    offset = intersectsPlane(0, 0);
    x = offset.x;
    y = offset.y;
  }
  translate(x, y, 0);
  box(60);
}