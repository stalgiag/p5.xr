let ground;
let rightWall;
let leftWall;
let balls = [];

let gravity;
let a = 0;

let x = 1;
let speed = 0.001;
let move = 0.02;

let s =1;
let s2 =1;
let s3 =1;
let s4 =1;

let size =1;
let inc=0.15;

let prevHandPosition;
let newShape = ["sphere", "box", "torus", "cone", "cylinder", "ellipsoid"];
let index = 0;

let newTex = [0,1,2,3,4,5,6,7,8,9,10,11];
let floorTex = [0,1,2,3,4];

let state = 0;
let stateF = 0;

let graphics;
let textGraphics; 

let img1;
let img2;
let img3;
let img4;
let img5;
let img6;
let img7;
let img8;
let img9;
let img10;
let img11;
let img12;

let triggerPreviouslyHeld = false;

let time = 0;
let interval = 10000;

function preload() {
  createVRCanvas();
  img1=loadImage('images/cloud.png');
  img2=loadImage('images/p5texture13.png');
  img3=loadImage('images/p5texture14.png');
  img4=loadImage('images/p5texture12.png');
  img5=loadImage('images/p5texture10b.png');
  img6=loadImage('images/p5texture7.png');
  img7=loadImage('images/p5texture1.png');
  img8=loadImage('images/p5texture3.png');
  img9=loadImage('images/p5texture5.png');
  img10=loadImage('images/p5texture6b.png');
  img11=loadImage('images/p5texture4.png');
  img12=loadImage('images/p5texture9.png');
}

function setup() {
  setVRBackgroundColor(255, 255, 255);
  graphics = createGraphics(600, 600);
  textGraphics = createGraphics(600, 600);
  textGraphics.background(0,0,0);

  ground = new Boundary(0, -3, 0, 20, 1, 20, 1, -1, 1);
  leftWall = new Boundary(-10, 0, 0, 1, 20, 20, -1, 1, 1);
  rightWall = new Boundary(10, 0, 0, 1, 20, 20, -1, 1, 1);

  gravity = createVector(0, -0.0002, 0);

  for (let i = 0; i < 10; i++) {
    balls.push(new Ball(random(-6, 6), random(-2, 6), random(-6, 6)))
  }

}

function draw() {
  
  const left = getXRInput(LEFT);
  const right = getXRInput(RIGHT);

  [left, right].forEach((hand) => {
    if (hand) {
      if (hand.trigger && hand.trigger.pressed) {
        for (let ball of balls) {
          if (ball.checkIntersection(hand.position, .1)) {
            ball.held = true;
            ball.position.x = hand.position.x;
            ball.position.y = hand.position.y;
            ball.position.z = hand.position.z;
          }
        }
        triggerPreviouslyHeld = true;
      } else if (triggerPreviouslyHeld) {
        // Trigger Released!
        for (let ball of balls) {
          if (ball.held) {
            // Releasing ball
            const dx = hand.position.x - prevHandPosition.x
            const dy = hand.position.y - prevHandPosition.y
            const dz = hand.position.z - prevHandPosition.z
            let d = createVector(dx, dy, dz);
            d.mult(0.1);
            ball.applyForce(d);
            ball.held = false;
          }
        }
        triggerPreviouslyHeld = false;
      }
      push();
      applyMatrix(hand.pose);
      fill(0);
      box(0.1);
      pop();
      prevHandPosition = hand.position.copy();
    }
  });

  for (let ba of balls) {
    push();
    ba.applyForce(gravity);
    ba.update();
    ba.checkBoundary(ground);
    ba.checkBoundary(leftWall);
    ba.checkBoundary(rightWall);
    ba.render();
    pop();
  }

  ground.render();
  leftWall.render();
  rightWall.render();
}

class Ball {
  constructor(x, y, z) {
    this.position = createVector(x, y, z);
    this.startingPosition = createVector(x, y, z);
    this.velocity = createVector(0, .01, 0);
    this.acceleration = createVector(0, 0, 0);
    this.held = false;
    this.radius = 0.25;
    this.color = color(50, 50, 200);
    this.heldColor = color(200, 50, 50);
   
    this.shape = newShape[index];
    this.index = index;
  
    this.state = state;
    this.graphics = graphics;
    this.tex = newTex[state];
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    if (this.position.y < ground.position.y) {
      this.reset();
      return;
    }
    if (this.held) {
      this.velocity.set(0, 0, 0);
    } else {
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
    }
    this.acceleration.set(0, 0, 0);
  }

  reset() {
    this.position.set(this.startingPosition);
    this.velocity.set(0, 0.01, 0);
    this.acceleration.set(0, 0, 0);
  }

  checkIntersection(position, radius) {
    let d = dist(position.x, position.y, position.z, this.position.x, this.position.y, this.position.z);
    return (d <= radius + this.radius)

  }

  checkBoundary(boundary) {
    if (boundary.checkIntersection(this.position, this.radius)) {
      // SG - check if heading direction is already same
      if(p5.Vector.dot(boundary.reflectionNormal, this.velocity) <= 0 ) {
        // Already heading in same direction
        // console.log(' already in same direction');
        return;
      }
        this.velocity.mult(boundary.reflectionNormal);
        // this.velocity.mult(boundary.friction);

        //CHANGE COLOR EVERY TIME IT HITS GROUND
        this.color = color(random(150,255),random(150), random(150,255));

        //CHANGE SHAPE EVERY TIME IT HITS GROUND
        this.index = (index += 1) % newShape.length

        //CHANGE TEXTURE EVERY TIME IT HITS GROUND
        this.state = (state += 1) % newTex.length;

        //CHAHGE SIZE EVERYTIME IT HITS THE GROUND
        this.radius = random(0.2,0.5);
      }
  }

  render() {
    push();
    if (this.held) {
      fill(this.heldColor);
    } else {
      fill(this.color);
    }
    noStroke();
    translate(this.position);

    this.shape = newShape[this.index];
   
    this.tex = newTex[this.state];    
    this.graphics = graphics;
    texture(this.graphics);
  
    //each state below is a different object texture
    //background color changes when object hits ground
    if (this.state === 0) {
      push();
      texture(this.graphics);
      graphics.push();
      graphics.background(this.color);
      graphics.image(img1,0,0);
      graphics.image(img1,300,300);
      graphics.pop();
      pop();

    } else if (this.state === 1) {
      push();
      texture(this.graphics);
      graphics.push();
      graphics.background(this.color);
      graphics.image(img2,0,0);
      graphics.image(img2,300,300);
      graphics.pop();
      pop();
 
    } else if (this.state === 2) {
      push();
      texture(this.graphics);
      graphics.push();
      graphics.background(this.color);
      graphics.image(img3,0,0);
      graphics.image(img3,300,300);
      graphics.pop();
      pop();

    }else if (this.state === 3) {
      push();
      texture(this.graphics);
      graphics.push();
      graphics.background(this.color);
      graphics.image(img4,0,0);
      graphics.image(img4,300,300);
      graphics.pop();
      pop();

    } else if (this.state === 4) {
      push();
      texture(this.graphics);
      graphics.push();
      graphics.background(this.color);
      graphics.image(img5,0,0);
      graphics.image(img5,300,300);
      graphics.pop();
      pop();

    } else if (this.state === 5) {
      push();
      texture(this.graphics);
      graphics.push();
      graphics.background(this.color);
      graphics.image(img6,0,0);
      graphics.image(img6,300,300);
      graphics.pop();
      pop();

    } else if (this.state === 6) {
      push();
      texture(this.graphics);
      graphics.push();
      graphics.background(this.color);
      graphics.image(img7,0,0);
      graphics.image(img7,300,300);
      graphics.pop();
      pop();

    } else if (this.state === 7) {
      push();
      texture(this.graphics);
      graphics.push();
      graphics.background(this.color);
      graphics.image(img8,0,0);
      graphics.image(img8,300,300);
      graphics.pop();
      pop();

    } else if (this.state === 8) {
      push();
      texture(this.graphics);
      graphics.push();
      graphics.background(this.color);
      graphics.image(img9,0,0);
      graphics.image(img9,300,300);
      graphics.pop();
      pop();

    } else if (this.state === 9) {
      push();
      texture(this.graphics);
      graphics.push();
      graphics.background(this.color);
      graphics.image(img10,0,0);
      graphics.image(img10,300,300);
      graphics.pop();
      pop();

    } else if (this.state === 10) {
      push();
      texture(this.graphics);
      graphics.push();
      graphics.background(this.color);
      graphics.image(img11,0,0);
      graphics.image(img11,300,300);
      graphics.pop();
      pop();

    } else if (this.state === 11) {
      push();
      texture(this.graphics);
      graphics.push();
      graphics.background(this.color);
      graphics.image(img12,0,0);
      graphics.image(img12,300,300);
      graphics.pop();
      pop();
    } 

    //different possible shape changes
    if (this.shape === "sphere") {
      sphere(this.radius);
    } else if (this.shape === "box") {
      box(this.radius);
    } else if (this.shape === "torus") {
      torus(this.radius, this.radius / 4);
    } else if (this.shape === "cone") {
      cone(this.radius, this.radius * 2);
    } else if (this.shape === "cylinder") {
      cylinder(this.radius, this.radius * 4);
    } else if (this.shape === "ellipsoid") {
      ellipsoid(this.radius, this.radius * 3, this.radius * 2);
    }

    pop();
  }
}

class Boundary {
  constructor(
    x,
    y,
    z,
    width,
    height,
    depth,
    reflectionNormalX,
    reflectionNormalY,
    reflectionNormalZ
  ) {
    this.position = createVector(x, y, z);
    this.scale = createVector(width, height, depth);
    this.reflectionNormal = createVector(
      reflectionNormalX,
      reflectionNormalY,
      reflectionNormalZ
    );
    this.minY = y - height / 2;
    this.maxY = y + height / 2;
    this.minX = x - width / 2;
    this.maxX = x + width / 2;
    this.minZ = z - depth / 2;
    this.maxZ = z + depth / 2;
    this.stroke = color(255, 255, 255);
    this.strokeWeight = strokeWeight(5)
    this.color = color(5, 60);
    this.friction = 0.98;

    this.time = time;
    this.stateF = stateF;
    this.textGraphics = textGraphics;
    this.tex = floorTex[stateF];
  }

  checkIntersection(position, radius) {
    const x = Math.max(this.minX, Math.min(position.x, this.maxX));
    const y = Math.max(this.minY, Math.min(position.y, this.maxY));
    const z = Math.max(this.minZ, Math.min(position.z, this.maxZ));
    
    var distance = Math.sqrt(
      (x - position.x) * (x - position.x) +
      (y - position.y) * (y - position.y) +
      (z - position.z) * (z - position.z)
    );
    return distance < radius;
  }

  render() {
    push();
    if (this.held) {
      fill(200, 50, 50);
    } else {
      stroke(this.stroke);
      strokeWeight(this.strokeWeight)
      fill(this.color);
    }
   
    this.tex = floorTex[this.stateF];    
    this.textGraphics = textGraphics;
    texture(this.textGraphics);
    this.time += deltaTime/3;  

    if(this.time > interval) {
      //state goes up by one until it hits end of array and resets
      this.stateF = (this.stateF + 1) % floorTex.length;
      this.time = 0;
    } 
    translate(this.position);
    box(this.scale);
    pop();

    //the following states below are different floor textures
    //as state increases, floor texture changes
    if (this.stateF === 0) {
      // letter a moving along x-axis
      push();
      textGraphics.push();
      // textGraphics.background(5, 8);
      textGraphics.fill(5,20);
      textGraphics.strokeWeight(1);
      textGraphics.stroke(255);
      textGraphics.textAlign(CENTER, CENTER);
      textGraphics.textSize(270);
      textGraphics.text('aaaaaaaaaaaaaaaaaaaaaaaaaaaa',x+300,150);
      textGraphics.text('aaaaaaaaaaaaaaaaaaaaaaaaaaaa',-x+300,300);
      textGraphics.text('aaaaaaaaaaaaaaaaaaaaaaaaaaaa',x+300,450);
      textGraphics.pop();

       x += move;
        if (x >= width || x < -width){
          move = -move
          }
      pop();

    } else if (this.stateF === 1) {
      //random grayscale letters
      push();      
      textGraphics.push();
      textGraphics.background(5, 5);

      textGraphics.fill(random(255));
      textGraphics.textAlign(CENTER,CENTER);
      textGraphics.textSize(30+random(-20,30));
      textGraphics.rotate(random(65));
      textGraphics.stroke(5);
      textGraphics.strokeWeight(random(0.5,8));
      textGraphics.text('o', s+random(width),100+random(s));
      textGraphics.text('Y', s+random(width),200+random(s));
      textGraphics.pop();

      if (s>60){
        speed =-speed;
      }
      s = s+speed;
      pop();
      
    } else if (this.stateF === 2) {
      //wash back and forth
      push();
      textGraphics.push();
      textGraphics.background(5, 8);

      textGraphics.fill(10);
      textGraphics.stroke(255);
      textGraphics.strokeWeight(0.5+size)
      textGraphics.textSize(200+size/2);
      textGraphics.textLeading(130+size)
      textGraphics.textWrap(WORD);
      textGraphics.rotate(-size*0.01)
      textGraphics.textStyle(BOLDITALIC);
      textGraphics.textAlign(CENTER);
      textGraphics.text('wash',200+s2*0.02,0+size+s2,470);
      textGraphics.text('wash',0+s2*0.02,150+size+s2,470);
      textGraphics.text('wash',-200+s2*0.02,300+size+s2,470);

      textGraphics.pop();
      
      if (s2>200){
        s2=0;
        size = -size;
      }
      s2+=0.5;

      size = size + inc;
      if(size >= 10 || size <= 0){
        inc = -inc;
      }
      pop();

    }  else if (this.stateF === 3) {
      //xo swirl
      push();
      textGraphics.push();
      textGraphics.background(255,1);

      textGraphics.fill(255);
      textGraphics.strokeWeight(1);
      textGraphics.stroke(5+s3,150);
      textGraphics.rotate(-s3*0.01)
      textGraphics.textAlign(CENTER, CENTER);
      textGraphics.textSize(200);
      textGraphics.text('oxoxoxoxo',150,s3+300);
      textGraphics.text('oxoxoxoxo',300,s3*1.5+450);
      textGraphics.text('oxoxoxoxo',450,s3*2+600);
      textGraphics.pop();

       s3 += move;
        if (s3 >= 80 || s3 < -20){
          move = -move
          }
      pop();

    }  else if (this.stateF === 4) {
     //rotating i's and !'s
      push();
      textGraphics.push();
      textGraphics.background(5, 5);
      textGraphics.noFill();
      textGraphics.strokeWeight(random(0.5,5));
      textGraphics.stroke(10*s4/2);
      textGraphics.rotate(s4*0.01)
      textGraphics.textStyle(ITALIC);
      textGraphics.textAlign(CENTER, CENTER);
      textGraphics.textSize(200);
      textGraphics.text('i!i!i!i!i!i!i!i!i',150+s4,s4);
      textGraphics.text('i!i!i!i!i!i!i!i!i',300+s4,s4+150);
      textGraphics.text('i!i!i!i!i!i!i!i!i',450+s4,s4+300);
      textGraphics.pop();

       s4 += move;
        if (s4 >= 100 || s4 < -100){
          move = -move
          }
      pop();
    }
  }
}