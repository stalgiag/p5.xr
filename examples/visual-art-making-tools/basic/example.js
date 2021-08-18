// BASIC EXAMPLE 
// three colors red, yellow, blue
// floor image of wood
// access colors using r g b variables

const brushStrokes = [];
const maxOrbs = 500;
let img;
let ray;

let r = 0;
let g = 0;
let b = 0;
let valSize = 0.05;

let uiForward = 2;
let uiLeft = -0.75;
let uiRight = 0.75;
let uiTop = 0.95;
let uiMiddle = 0.5;
let uiBottom = 0.15;
let uiSize = 0.15;

function preload() {
  createVRCanvas();
  img = loadImage('woodtex.jpg')
}

function setup() {
  setVRBackgroundColor(235, 230, 235);
  angleMode(DEGREES);
}

function draw() {

  drawGround();

  const left = getXRInput(LEFT);
  const right = getXRInput(RIGHT);
  let hand;

  if (right) {
    hand = right;
  } else if (left) {
    hand = left;
  } else {
    // no controller
    print('In order to draw, please ensure that a controller is connected and tracking')
  }

  if (hand) {
    if (hand.trigger && hand.trigger.pressed) {
      //if triggered is pressed, draw brushStroke at hand's position
      attemptNewBrushStroke(hand);
    }

  // Apply the pose matrix for the hand
  // Create a ray, note that rays are made with the current
  // model view matrix applied so it is easier to assign
  // position and directionality because it is relative to the
  // current transform, just like rendering
  push();
  applyMatrix(hand.pose);
  ray = generateRay(0, 0, 0, 0, 0, -1);
  stroke(255);
  strokeWeight(5);
  line(0, 0, 0, 0, 0, -100);
  noStroke();
  fill(r, g, b);
  box(0.05);
  pop();    
  }

  noStroke();
  drawColorControls();
  drawBrushStrokes();
}

function drawColorControls() {
  // generateRay takes an origin location (x, y, z) and a target location (x, y, z) 
  // and returns an Object with an origin and a direction 
  if (!ray) {
    return;
  }

  // when the hand's ray instersects with red sphere
  // change brush color to red
  push();
  translate(uiRight, uiTop, uiForward);
  if (intersectsSphere(uiSize, ray)) {
    r = 255;
    g = 60;
    b = 110;    
    fill(225, 30, 80);
  } else {
    fill(255, 60, 110);
  }
  sphere(uiSize);
  pop();

  // when the hand's ray instersects with yellow sphere
  // change brush color to yellow
  push();
  translate(uiRight, uiMiddle, uiForward);
  if (intersectsSphere(uiSize, ray)) {
    r = 255;
    g = 210;
    b = 100;  
    fill(225, 180, 70);
  } else {
    fill(255, 210, 100);
  }
  sphere(uiSize);
  pop();

  // when the hand's ray instersects with blue sphere
  // change brush color to blue
  push();
  translate(uiRight, uiBottom, uiForward);
  if (intersectsSphere(uiSize, ray)) {
    r = 38;
    g = 183;
    b = 255;  
    fill(8, 153, 225);
  } else {
    fill(38, 183, 255);
  }
  sphere(uiSize);
  pop();
}

function attemptNewBrushStroke(hand) {
  if (brushStrokes.length > maxOrbs) {
    // keep the number of marks from getting too long
    brushStrokes.shift();
  }
  // Each stroke must be an object that stores both the color and the position
  // so whenever you press the trigger
  // this adds locations to the brushStrokes drawing array
  // and the strokes draw at each of those locations every frame
  const brushStroke =
  {
    position: new p5.Vector(hand.position.x, hand.position.y, hand.position.z),
    color: color(r, g, b)
  }
  brushStrokes.push(brushStroke);
}

function drawBrushStrokes() {
// in order to access the values you stored in the brushStrokes array
// they must be called here 
// in this case, the brush is translated to the brushStroke's position
// which is the hand's x,y,z position within the virtual space
// and the brushStroke's RGB color values are placed within fill()
// if you don't do this, your brush won't look the way you want it to
  for (const stroke of brushStrokes) {
    push();
    translate(stroke.position);
    fill(stroke.color);
    sphere(valSize);
    pop();
  }
}

function drawGround() {
 // this draws the floor of the sketch
 // can be any color or texture you desire
  push();
  translate(0, -3, 0);
  rotateX(-90);
  noStroke();
  fill(30, 90, 50);
  texture(img);
  plane(10, 10);
  pop();
}

