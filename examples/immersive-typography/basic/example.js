let angle = 0;
let x = 0;
let speed = 0.01;

let words = ['a', 'b',  'c', 'd', 'e'];
let index = 0;

let time = 0;
let interval = 1000;

let graphics;

function preload() {
  //createVRCanvas() MUST ALWAYS be included in preload
  //this runs hardware checks to make sure your hardware/browser can support VR
  //it also places the "ENTER VR" button on the screen that allows you to enter the sketch
  createVRCanvas();
}

function setup() {
  //when in VR, bg color CANNOT be set in draw 
  //unlike regular p5, you must clear the bg every frame to avoid motion sickness
  //so setVRBackgroundColor is used to clear the bg after rendering for each eye
  setVRBackgroundColor(200,200,200);

  //createGraphics MUST be in setup, other attributes can go in draw()
  graphics = createGraphics(600,600);
}

function draw() {
  //similar to using camera() in WEBGL mode, setViewerPosition moves the viewer to a specific position within the virtual space.
  setViewerPosition(0, 0, 600);
  
  //once you're in draw, you have to access the propeties of the createGraphics() object you created
  //in this case, since "graphics" = createGraphics(), you have to put "graphics dot" before the lines of code you want displayed in your texture 
  //if you don't use this syntax, your code won't show up in the texture and will affect the entire sketch instead
  graphics.push();
  graphics.translate(300,300);
  graphics.rotate(x);
  graphics.fill(255);
  graphics.stroke(0)
  graphics.textAlign(CENTER, CENTER);
  graphics.textSize(400);
  graphics.text(words[index], 0, 0);
  graphics.pop();
  
  //rotate box & give it "graphics" texture
  push();
  translate(200, 100, 0);
  rotateX(angle*1.3);
  rotateZ(angle*0.7);
  stroke(255);
  texture(graphics);
 
  //intersectsBox is a VR function that checks for a ray hit with a box of the specified size at the current model transform location
  //in this case, whenever the viewer's gaze meets a box with the size of 200, the following changes below will occur
  //if a box does not match the size that is specified, no changes will occur 
  if(intersectsBox(200)){
    strokeWeight(4);
    stroke(200,0,150);

    time += deltaTime;

    if(time > interval) {
    //index goes up by one until it hits end of array and resets
    //this creates a continuous loop of changing letterforms
     index = (index + 1) % words.length;
     time = 0;
     }    
  } 

  box(200);
  pop();
  
  angle += 0.001;
  
  x = x + speed;
}
