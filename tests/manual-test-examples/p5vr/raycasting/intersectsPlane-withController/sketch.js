const planeWidth = 500;
const planeHeight = 400;
let pg;

function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(200, 0, 150);
  pg = createGraphics(planeWidth, planeHeight); 
}
  

function draw() {
  let right = getXRInput('right');
  setViewerPosition(0, 0, 400);
  pg.background(100, 100, 250);
  if(right) {
    let offset;
    let ray = generateRay(right.position.x, right.position.y, right.position.z + 400, right.direction.x, right.direction.y, right.direction.z);
    offset = intersectsPlane(ray);
    // Numbers need to be normalized when not in screen space
    // TODO: Fix this in intersectsPlane
    let xPos = map(offset.x, -planeWidth / 1000, planeWidth / 1000, 0, planeWidth);
    let yPos = map(offset.y, -planeHeight / 1000, planeHeight / 1000, 0, planeHeight);
    pg.fill('white');
    pg.circle(xPos, yPos, 100);
    console.log(offset);
    push();
    strokeWeight(10);
    line(right.position.x, right.position.y, right.position.z + 400, right.position.x + right.direction.x * 100, right.position.y + right.direction.y * 100, (right.position.z + 400) + right.direction.z * 100);
    pop();

  }
  push();
  texture(pg);
  plane(planeWidth, planeHeight);
  pop();
}