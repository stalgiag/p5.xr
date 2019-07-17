let pg;
let pos, vel;
let speed = 1.5, ellipseSize = 20;

function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(200, 0, 150);
  pg = createGraphics(300, 150);
  vel = createVector(speed, speed);
  pos = createVector(width/2, height/2);
  textureMode(NORMAL);
}

function calculate() {
  pos.x += vel.x;
  pos.y += vel.y;

  testBounds();
}

function draw() {
  pg.background(150, 150, 250);
  pg.ellipse(pos.x, pos.y, 20);
  translate(0, 0, 10);
  noStroke();
  texture(pg);
  rect(-10, -20, 20, 40);
  
}

function testBounds() {
  let rad = ellipseSize/2;
  if(pos.x > pg.width - rad || pos.x < 0 + rad) {
    vel.x *= -1;
  }
  if(pos.y > pg.height - rad || pos.y < 0 + rad) {
    vel.y *= -1;
  }
}
