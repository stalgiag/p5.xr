let ground;
let rightWall;
let leftWall;

let ball;

let gravity;
let prevHandPosition;

let triggerPreviouslyHeld = false;


function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(0,0,0);
  ground = new Boundary(0, -3, 0, 20, 1, 20, 1, -1, 1);
  leftWall = new Boundary(-10, 0, 0, 1, 20, 20, -1, 1, 1);
  rightWall = new Boundary(10, 0, 0, 1, 20, 20, -1, 1, 1);

  gravity = createVector(0, -0.0002, 0);

  ball = new Ball(1, 1, 0);
}

function draw() {
  // orbitControl();

  // pointLight(250, 250, 250, 0, 0, 0);

  const left = getXRInput(LEFT);
  const right = getXRInput(RIGHT);

  [left, right].forEach((hand) => {
    if (hand) {
      if(hand.trigger && hand.trigger.pressed){ 
        if (ball.checkIntersection(hand.position, .1)) {
        ball.held = true;
        ball.position.x = hand.position.x;
        ball.position.y = hand.position.y;
        ball.position.z = hand.position.z;
        } 
        triggerPreviouslyHeld = true;

      } else if (triggerPreviouslyHeld) {
        // Trigger released!
          if (ball.held){
          // Releasing ball
          const dx = hand.position.x - prevHandPosition.x
          const dy = hand.position.y - prevHandPosition.y
          const dz = hand.position.z - prevHandPosition.z
          let d = createVector(dx, dy, dz);
          d.mult(0.1);
          ball.applyForce(d);
          ball.held = false;
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

  ball.applyForce(gravity);
  ball.update();
  
  ball.checkBoundary(ground);
  ball.checkBoundary(leftWall);
  ball.checkBoundary(rightWall);
  
  ball.render();
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
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    if(this.position.y < ground.position.y) {
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
    this.acceleration.set(0,0,0);
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

        //change color everytime it hits the ground
        this.color = color(random(255),random(255), random(255));

      }
  }

  render() {
    push();
    if(this.held) {
      fill(this.heldColor);
    } else {
      fill(this.color);
    }
    noStroke();
    translate(this.position);
    sphere(this.radius);
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
    this.color = color(50, 200, 50);
    this.friction = 0.98;
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
    if(this.held) {
      fill(200, 50, 50);
    } else {
      fill(this.color);
    }
    translate(this.position);
    box(this.scale);
    pop();
  }
}