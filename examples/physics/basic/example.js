let ground;
let rightWall;
let leftWall;

let ball;

let gravity;
let prevHandPosition;

let triggerPreviouslyHeld = false;

function preload() {
  // must place "createVRCanvas()" in preload() for every VR sketch
  // this runs all of the necessary hardware checks to see if your hardware/browser combo can support VR
  // it also adds a button to the window, that will start your sketch & enter VR when pressed
  createVRCanvas();
}

function setup() {
  // with VR you want to clear the background every frame to avoid motion sickness
  // setVRBackgroundColor() sets the color that will be used to clear the background after rendering each eye
  setVRBackgroundColor(0, 0, 0);

  // creates new class of boundaries for the balls to bounce off from
  ground = new Boundary(0, -3, 0, 20, 1, 20, 1, -1, 1);
  leftWall = new Boundary(-10, 0, 0, 1, 20, 20, -1, 1, 1);
  rightWall = new Boundary(10, 0, 0, 1, 20, 20, -1, 1, 1);

  // adds gravitational force to the balls
  gravity = createVector(0, -0.0002, 0);

  // creates a new ball class
  ball = new Ball(1, 1, 0);
}

function draw() {

  // adds light source to make it easier to see boundaries
  pointLight(250, 250, 250, 0, 0, 0);

  // gets input from left and right controllers
  const left = getXRInput(LEFT);
  const right = getXRInput(RIGHT);

  [left, right].forEach((hand) => {
    if (hand) {
      if (hand.trigger && hand.trigger.pressed) {
        if (ball.checkIntersection(hand.position, .1)) {
          // if hand is detected & the trigger is pressed...
          // & the ball is intersecting with the hand's position
          // you are now able to hold the ball
          ball.held = true;
          ball.position.x = hand.position.x;
          ball.position.y = hand.position.y;
          ball.position.z = hand.position.z;
        }
        triggerPreviouslyHeld = true;

      } else if (triggerPreviouslyHeld) {
        // if the trigger is released...
        // the ball you were holding before is released too
        if (ball.held) {
          const dx = hand.position.x - prevHandPosition.x
          const dy = hand.position.y - prevHandPosition.y
          const dz = hand.position.z - prevHandPosition.z
          let d = createVector(dx, dy, dz);
          // multiply force of ball by 0.1 to slow it down after throwing it
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

  // to display the ball and boundaries properly
  // you must call the functions you created in the Ball and Boundary classes from within draw()

  // applies gravitational force to the ball
  ball.applyForce(gravity);
  ball.update();

  // checks if ball has intersected with the ground/walls
  ball.checkBoundary(ground);
  ball.checkBoundary(leftWall);
  ball.checkBoundary(rightWall);

  // displays the ball and the ground/walls 
  ball.render();
  ground.render();
  leftWall.render();
  rightWall.render();
}

class Ball {
  // create a class for the bouncing ball
  // the ball has it's own size, color, and x, y, z positions
  // as well as it's own physics forces applied to it
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

  // applies acceleration force to the ball
  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    if (this.position.y < ground.position.y) {
      // if the y-position of the ball is less than the y-position of the ground
      // reset the ball to it's starting position
      this.reset();
      return;
    }
    if (this.held) {
      // if the ball is held, set it's velocity to 0 to stop it from moving
      this.velocity.set(0, 0, 0);
    } else {
      // otherwise, if the ball isn't being held 
      // add acceleration and velocity to the ball so that it moves
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
    }
    this.acceleration.set(0, 0, 0);
  }

  // if the ball escapes the boundaries for some reason
  // this resets the ball's current position to its starting position
  reset() {
    this.position.set(this.startingPosition);
    this.velocity.set(0, 0.01, 0);
    this.acceleration.set(0, 0, 0);
  }

  // checks for the intersection of the ball's x, y, z positions with the x, y, z positions of the boundaries
  checkIntersection(position, radius) {
    let d = dist(position.x, position.y, position.z, this.position.x, this.position.y, this.position.z);
    return (d <= radius + this.radius)
  }


  // if the ball has intersected with a boundary, check the dot() product after a collision
  // a dot product is a way of asking whether two vectors are facing the same direction
  // in this case, if it's less 0, then no. otherwise, yes. 
  checkBoundary(boundary) {
    if (boundary.checkIntersection(this.position, this.radius)) {
      if (p5.Vector.dot(boundary.reflectionNormal, this.velocity) <= 0) {
        return;
      }
      // velocity of the ball is reversed upon collision
      // this causes the ball to bounce back up
      this.velocity.mult(boundary.reflectionNormal);

      // change the color of the sphere everytime it hits the ground
      this.color = color(random(255), random(255), random(255));

    }
  }

  render() {
    push();
    // if the ball is held...
    // make it a different color than normal
    if (this.held) {
    // adding this material makes it easier to see edges of the boundaries
    // writing it like this makes it so that the ball is not influenced by the lighting
      emissiveMaterial(this.heldColor);
    } else {
      emissiveMaterial(this.color);
  }
    noStroke();

    // translates the ball to it's position
    translate(this.position);

    // size of sphere
    sphere(this.radius);
    pop();
  }
}

class Boundary {
  // create a boundary class for the walls/ground
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

    // gives boundaries their own x, y, z position
    this.position = createVector(x, y, z);

    // gives a minimum and maximum height, width, and depth to the boundaries
    this.scale = createVector(width, height, depth);

    // create a force to reflect any incoming balls
    this.reflectionNormal = createVector(
      reflectionNormalX,
      reflectionNormalY,
      reflectionNormalZ
    );

    // designated minimum and maximum width, height, and depth of the boundaries
    this.minY = y - height / 2;
    this.maxY = y + height / 2;
    this.minX = x - width / 2;
    this.maxX = x + width / 2;
    this.minZ = z - depth / 2;
    this.maxZ = z + depth / 2;
    this.color = color(50, 200, 50);
    this.friction = 0.98;
  }


  // checks intersection of the ball with x, y, z positions of the boundaries
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
      fill(this.color);

    // translate boundaries to their designated x,y,z locations
    translate(this.position);

    // the width, height, and depth values for the boundaries written above
    // can be called with "this.scale"
    box(this.scale);
    pop();
  }
}