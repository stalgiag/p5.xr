let pg;
let pos, vel;
let speed = 1.5, ellipseSize = 20;

let rectPosX = -5, rectPosY = -5;

let col;

function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(200, 0, 150);
  col = color(255);
  pg = createGraphics(400, 400);
  vel = createVector(speed, speed);
  pos = createVector(100, 200);
  textureMode(NORMAL);
}

function calculate() {
  pos.x += vel.x;
  pos.y += vel.y;
  testBounds();
}

function draw() {
  pg.background(150, 150, 250);
  pg.fill(col);
  pg.ellipse(pg.width/2, pg.height/2, 100);
  pg.fill(255);
  pg.ellipse(pos.x, pos.y, 20);
  translate(0, 0, -10);
  noStroke();
  texture(pg);
  rotateY(frameCount * 0.02);
  rect(rectPosX, rectPosY, 10, 10);
  
}

function testBounds() {
  let rad = ellipseSize/2;
  if(pos.x > pg.width - rad || pos.x < 0 + rad) {
    vel.x *= -1;
    col = color(random(255), random(255), random(255));
  }
  if(pos.y > pg.height - rad || pos.y < 0 + rad) {
    vel.y *= -1;
    col = color(random(255), random(255), random(255));
  }
}
