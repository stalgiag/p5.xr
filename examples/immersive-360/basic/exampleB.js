let graphics;

let x = 0;
let speed = 0.005;

let state = [0,1,2];
let index = 0;
let time = 0;
let interval = 300;

function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(0,0,0);
  graphics = createGraphics(600,600);
}

function draw() {

  const left = getXRInput(LEFT);
  const right = getXRInput(RIGHT);

  [left, right].forEach((hand) => {
	  if (hand) {
		  push();
      if(hand.trigger && hand.trigger.pressed) {
        //when trigger is pressed
        //turn cube yellow
        // & have index increase to change btwn states
        fill(255, 255, 0);
        time += deltaTime;
        if (time > interval) {
          index = (index + 1) % state.length;
          time = 0;
        }
      } else {
        fill(255);
      }
      //positions a cube at your hand
      translate(hand.position.x, hand.position.y, hand.position.z);
		  box(0.05);
		  pop();
	  }
  });

  rand = random(-5, 5);

  // red bg with moving white circle
  if (index == 0) {
    graphics.push();
    graphics.background(200, 0, 0,10);
    graphics.rotate(-x/2);
    graphics.fill(250);
    graphics.circle(0, 300, 80+rand);
    graphics.pop();
    
  // green bg with moving line
  } else if (index == 1) {
    graphics.push();
    graphics.background(0, 200, 0, 50);
    for (i = 0; i < width; i += 20) {
    graphics.translate(i,0);
    graphics.rotate(x/10);
    graphics.fill(250);
    graphics.strokeWeight(5)
    graphics.stroke(255,200);
    graphics.line(-100, -300, 255, 255);
    graphics.line(30, 20, 155, 155);
    }
    graphics.pop();
  }

  // blue bg with moving squares
  else if (index==2){
    graphics.push();
    graphics.background(0, 0, 200);
    for (i = 0; i < width; i += 50) {
      for (j = 0; j < height; j += 50) {
        graphics.stroke(255);
        graphics.fill(250,200,0)
        graphics.square(i*x/5, j*x/5, 5);
        graphics.noFill();
        graphics.square(i,j,20+x*5);
      }
    }
    graphics.pop();
  } 

  // moves the shapes back and forth by reversing speed
  if (x > 2 || x < 0) {
    speed = speed * -1;
  }

  x = x + speed;

  // this automatically creates a sphere around the viewer
  // that displays a texture of your choice
  surroundTexture(graphics);
}
