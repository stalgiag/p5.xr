const brushStrokes = [];
const maxOrbs = 200;

let currentShape = ['sphere','cube', 'ring' ,'cone' ,'cylinder' ,'ellipsoid'];
let currentSize = 'regSize';

let ray;
let valSize = 0.05;

let textures = [];
let index = 0;
let time = 0;
let interval = 300;

let uiForward = 2;
let uiLeft = -0.75;
let uiRight = 0.75;
let uiTop = 0.95;
let uiMiddle = 0.5;
let uiBottom = 0.15;
let uiSize = 0.15;

let x =1;
let size =1;
let inc=0.15;
let floor;

function preload() {
  createVRCanvas();
  textures.push(loadImage('images/p5texture13.png'));
  textures.push(loadImage('images/p5texture14.png'));
  textures.push(loadImage('images/p5texture12.png'));
  textures.push(loadImage('images/p5texture10b.png'));
  textures.push(loadImage('images/p5texture1bbb.png'));
  textures.push(loadImage('images/p5texture7.png'));
  textures.push(loadImage('images/p5texture1.png'));
  textures.push(loadImage('images/p5texture3.png'));
  textures.push(loadImage('images/p5texture5.png'));
  textures.push(loadImage('images/p5texture5b.png'));
  textures.push(loadImage('images/p5texture6b.png'));
  textures.push(loadImage('images/p5texture4.png'));
  textures.push(loadImage('images/p5texture4b.png'));
  textures.push(loadImage('images/p5texture9.png'));
}

function setup() {
  setVRBackgroundColor(0, 0, 0);
  floor = createGraphics(600,600);
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
    print('In order to draw, please ensure that a controller is connected and tracking');
  }

  if (hand) {
    if (hand.trigger && hand.trigger.pressed) {
      attemptNewBrushStroke(hand);
    }

    if (hand.grip && hand.grip.pressed) {
      //when grip is pressed and time > interval, change shape
      time += deltaTime;
        if (time > interval) {
          index = (index + 1) % currentShape.length;
          time = 0;
        }
    }
  
    //thumbstick directional input
    if(hand.thumbstick2D) {
      if(hand.thumbstick2D.y < 0) {
        //thumbstick up
        currentSize = 'addSize'; 
        valSize += 0.001;
      } else if (hand.thumbstick2D.y > 0) {
        //thumbtick down
        currentSize = 'subSize'; 
        valSize -= 0.001;
      }
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
    fill(255);

    texture(random(textures));
    noStroke();
    sphere(valSize);
    pop();
  }

  noStroke();
  drawColorControls();
  drawBrushStrokes();

}

function drawColorControls() {
  if (!ray) {
    return;
  }
  // default brush size is 'regSize'
  // this makes sure to set current size of brush to valSize
  currentSize = valSize + random(-0.1,0.1);

  // intersect & change shape to sphere
  push();
  translate(uiLeft, uiTop, uiForward);
  if (intersectsSphere(uiSize, ray)) {
    currentShape = 'sphere';
    fill(200,0,150);
  } else{
    fill(255);
  }
  sphere(uiSize);
  pop();

  // intersect & change shape to box
  push();
  translate(uiRight, uiTop, uiForward);
  if (intersectsSphere(uiSize, ray)) {
    currentShape = 'cube';
    fill(200,0,150);
  } else{
    fill(255);
  }
  box(uiSize);
  pop();

  // intersect & change shape to torus
  push();
  translate(uiLeft, uiMiddle, uiForward);
  if (intersectsSphere(uiSize, ray)) {
    currentShape = 'ring';
    fill(200,0,150);
  } else{
    fill(255);
  }
  
  torus(uiSize, uiSize/3);
  pop();

  // intersect & change shape to cone
  push();
  translate(uiRight, uiMiddle, uiForward);
  if (intersectsSphere(uiSize, ray)) {
    currentShape = 'cone'
    fill(200,0,150);
  } else{
    fill(255);
  }
  cone(uiSize / 2, uiSize * 1.5);
  pop();

  // intersect & change shape to cylinder
  push();
  translate(uiLeft, uiBottom, uiForward);
  if (intersectsSphere(uiSize, ray)) {
    currentShape ='cylinder';
    fill(200,0,150);
  } else{
    fill(255);
  }
  cylinder(uiSize / 2, uiSize* 1.5);
  pop();

  // intersect & change shape to sphere ellipsoid
  push();
  translate(uiRight, uiBottom, uiForward);
  if (intersectsSphere(uiSize, ray)) {
    currentShape = 'ellipsoid';
    fill(200,0,150);
  } else{
    fill(255);
  }
  ellipsoid(uiSize/1.2, uiSize, uiSize);
  pop();

}

function attemptNewBrushStroke(hand) {
  if (brushStrokes.length > maxOrbs) {
    // keep the number of strokes from getting too long
    brushStrokes.shift();
  }
  // Each stroke must be an object that stores the color, position, shape and size 
  const brushStroke =
  {
    position: new p5.Vector(hand.position.x, hand.position.y, hand.position.z),
    tex: random(textures),
    size: currentSize + random(-0.1,0.2),
    shape: currentShape[index]
  }
  brushStrokes.push(brushStroke);
}

function drawBrushStrokes() {
  for (const stroke of brushStrokes) {
    push();

    //position of stroke
    translate(stroke.position);

    //texture of stroke 
    texture(stroke.tex);

    //size of stroke
    scale(-1);
    if (stroke.size === 'regSize'){
      valSize = 0.05;
    } else if (stroke.size === 'addSize'){
      valSize += 0.001;
    } else if (stroke.size === 'subSize'){
      valSize -= 0.001;
    }

    //shape of stroke
    if(stroke.shape === 'sphere'){
      sphere(stroke.size);
    } else if(stroke.shape === 'cube'){
      box(stroke.size);
    } else if(stroke.shape === 'ring'){
      torus(stroke.size, stroke.size / 4);
    } else if(stroke.shape === 'cone'){
        cone(stroke.size / 2, stroke.size * 1.5);
    } else if(stroke.shape === 'cylinder'){
      cylinder(stroke.size/2, stroke.size * 1.5);
    } else if(stroke.shape === 'ellipsoid'){
      ellipsoid(stroke.size/1.2, stroke.size, stroke.size);
    } 

    pop();
  }
}

function drawGround() {
  push();

  if (x>width){
    x=0;
  }
  x+=0.4;
  
  floor.fill(5,80);
  floor.stroke(255);
  floor.strokeWeight(0.5+size/2)
  floor.textSize(70+size/2);
  floor.textLeading(55+size)
  floor.textWrap(WORD);
  floor.textStyle(BOLDITALIC);
  floor.text('TH1S W0RLD 1S Y0UR C4NV4S',x,size,200);
  floor.text('TH1S W0RLD 1S Y0UR C4NV4S',x-600,size,200);
  floor.text('TH1S W0RLD 1S Y0UR C4NV4S',x+300,size+300,200);
  floor.text('TH1S W0RLD 1S Y0UR C4NV4S',x-300,size+300,200);
  
  size = size + inc;
  if(size >= 5 || size <= 0){
    inc = -inc;
  }
  
  translate(0, -1, 0);
  rotateX(90);
  noStroke();
  fill(0, 255, 0);
  texture(floor);
  plane(10, 10);
  pop();
}