let ground;
let rightWall;
let leftWall;
let frontWall;
let backWall;
let ceiling;
let balls = [];

let gravity;
let a = 0;

let x = 1;
let speed = 0.001;
let move = 0.02;

let s = 1;
let s2 = 1;
let s3 = 1;
let s4 = 1;

let size = 1;
let inc = 0.15;

let index = 0;

let floorTex = [0, 1, 2, 3, 4];
let state = 0;
let textGraphics;

let triggerPreviouslyHeld = false;
let prevHandPosition;

let time = 0;
let interval = 10000;

function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(255, 255, 255);
  textGraphics = createGraphics(600, 600);
  textGraphics.background(0, 0, 0);

  ground = new Boundary(0, -3, 0, 20, 1, 20, 1, -1, 1);
  leftWall = new Boundary(-10, 0, 0, 1, 20, 20, -1, 1, 1);
  rightWall = new Boundary(10, 0, 0, 1, 20, 20, -1, 1, 1);
  frontWall = new Boundary(0, 0, -10, 20, 20, 1, 1, 1, -1);
  backWall = new Boundary(0, 0, 10, 20, 20, 1, 1, 1, -1);
  ceiling = new Boundary(0, 7, 0, 20, 1, 20, 1, -1, 1);

  gravity = createVector(0, -0.0002, 0);

  for (let i = 0; i < 10; i++) {
    balls.push(new Ball(random(-6, 6), random(-1, 6), random(-6, 6)))
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
        for (let ball of balls) {
          if (ball.held) {
            const dx = hand.position.x - prevHandPosition.x
            const dy = hand.position.y - prevHandPosition.y
            const dz = hand.position.z - prevHandPosition.z
            let d = createVector(dx, dy, dz);
            d.mult(0.4);
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

  for (let ball of balls) {
    push();
    ball.applyForce(gravity);
    ball.update();
    ball.checkBoundary(ground);
    ball.checkBoundary(leftWall);
    ball.checkBoundary(rightWall);
    ball.checkBoundary(frontWall);
    ball.checkBoundary(backWall);
    ball.checkBoundary(ceiling);
    ball.render();
    pop();
  }

  ground.render();
  leftWall.render();
  rightWall.render();
  frontWall.render();
  backWall.render();
  ceiling.render();

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
      if (p5.Vector.dot(boundary.reflectionNormal, this.velocity) <= 0) {
        return;
      }
      this.velocity.mult(boundary.reflectionNormal);

      this.color = color(random(150, 255), random(150), random(150, 255));

      this.radius = random(0.5, 1.5);
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
    this.stroke = color(255, 255, 255);
    this.strokeWeight = strokeWeight(5)
    this.color = color(5, 60);
    this.friction = 0.98;

    this.time = time;
    this.state = state;
    this.textGraphics = textGraphics;
    this.tex = floorTex[state];
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

    this.tex = floorTex[this.state];
    this.textGraphics = textGraphics;
    texture(this.textGraphics);
    this.time += deltaTime / 3;

    if (this.time > interval) {
      this.state = (this.state + 1) % floorTex.length;
      this.time = 0;
    }
    translate(this.position);
    box(this.scale);
    pop();

    if (this.state === 0) {
      push();
      textGraphics.push();
      textGraphics.fill(5, 20);
      textGraphics.strokeWeight(1);
      textGraphics.stroke(255);
      textGraphics.textAlign(CENTER, CENTER);
      textGraphics.textSize(270);
      textGraphics.text('aaaaaaaaaaaaaaaaaaaaaaaaaaaa', x + 300, 150);
      textGraphics.text('aaaaaaaaaaaaaaaaaaaaaaaaaaaa', -x + 300, 300);
      textGraphics.text('aaaaaaaaaaaaaaaaaaaaaaaaaaaa', x + 300, 450);
      textGraphics.pop();

      x += move;
      if (x >= width || x < -width) {
        move = -move
      }
      pop();

    } else if (this.state === 1) {
      push();
      textGraphics.push();
      textGraphics.background(5, 5);

      textGraphics.fill(random(255));
      textGraphics.textAlign(CENTER, CENTER);
      textGraphics.textSize(30 + random(-20, 30));
      textGraphics.rotate(random(65));
      textGraphics.stroke(5);
      textGraphics.strokeWeight(random(0.5, 8));
      textGraphics.text('o', s + random(width), 100 + random(s));
      textGraphics.text('Y', s + random(width), 200 + random(s));
      textGraphics.pop();

      if (s > 60) {
        speed = -speed;
      }
      s = s + speed;
      pop();

    } else if (this.state === 2) {
      push();
      textGraphics.push();
      textGraphics.background(5, 8);

      textGraphics.fill(10);
      textGraphics.stroke(255);
      textGraphics.strokeWeight(0.5 + size)
      textGraphics.textSize(200 + size / 2);
      textGraphics.textLeading(130 + size)
      textGraphics.textWrap(WORD);
      textGraphics.rotate(-size * 0.01)
      textGraphics.textStyle(BOLDITALIC);
      textGraphics.textAlign(CENTER);
      textGraphics.text('wash', 200 + s2 * 0.02, 0 + size + s2, 470);
      textGraphics.text('wash', 0 + s2 * 0.02, 150 + size + s2, 470);
      textGraphics.text('wash', -200 + s2 * 0.02, 300 + size + s2, 470);

      textGraphics.pop();

      if (s2 > 200) {
        s2 = 0;
        size = -size;
      }
      s2 += 0.5;

      size = size + inc;
      if (size >= 10 || size <= 0) {
        inc = -inc;
      }
      pop();

    } else if (this.state === 3) {
      push();
      textGraphics.push();
      textGraphics.background(255, 1);

      textGraphics.fill(255);
      textGraphics.strokeWeight(1);
      textGraphics.stroke(5 + s3, 150);
      textGraphics.rotate(-s3 * 0.01)
      textGraphics.textAlign(CENTER, CENTER);
      textGraphics.textSize(200);
      textGraphics.text('oxoxoxoxo', 150, s3 + 300);
      textGraphics.text('oxoxoxoxo', 300, s3 * 1.5 + 450);
      textGraphics.text('oxoxoxoxo', 450, s3 * 2 + 600);
      textGraphics.pop();

      s3 += move;
      if (s3 >= 80 || s3 < -20) {
        move = -move
      }
      pop();

    } else if (this.state === 4) {
      push();
      textGraphics.push();
      textGraphics.background(5, 5);
      textGraphics.noFill();
      textGraphics.strokeWeight(random(0.5, 5));
      textGraphics.stroke(10 * s4 / 2);
      textGraphics.rotate(s4 * 0.01)
      textGraphics.textStyle(ITALIC);
      textGraphics.textAlign(CENTER, CENTER);
      textGraphics.textSize(200);
      textGraphics.text('i!i!i!i!i!i!i!i!i', 150 + s4, s4);
      textGraphics.text('i!i!i!i!i!i!i!i!i', 300 + s4, s4 + 150);
      textGraphics.text('i!i!i!i!i!i!i!i!i', 450 + s4, s4 + 300);
      textGraphics.pop();

      s4 += move;
      if (s4 >= 100 || s4 < -100) {
        move = -move
      }
      pop();
    }
  }
}