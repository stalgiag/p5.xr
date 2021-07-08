let angle = 0;
let x = 0;
let speed = 0.01;

let graphics;

function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(200,200,200);
 
  //createGraphics MUST be in setup, other attributes can go in draw()
  graphics = createGraphics(600,600);
}

function draw() {
  setViewerPosition(0, 0, 600);
  
  //must put "name." or else texture attributes wont work
  graphics.push();
  graphics.translate(300,300);
  graphics.rotate(x);
  graphics.fill(255);
  graphics.stroke(0)
  graphics.textAlign(CENTER, CENTER);
  graphics.textSize(400);
  graphics.text('a',0,0);
  graphics.pop();
  
  //rotate box & give it "graphics" texture
  push();
  translate(200, 100, 0);
  rotateX(angle*1.3);
  rotateZ(angle*0.7);
  stroke(255);
  texture(graphics);
  
  if(intersectsBox(200)){
    strokeWeight(4);
    stroke(200,0,150);
    angle += 0;
  } 

  box(200);
  pop();
  
  angle += 0.001;
  
  //if x is more than 30 or less than 0, reverse the a's rotation
  if (x > 30 || x < 0) {
    speed = speed * -1;
  } 
  
  x = x + speed;
  
}
