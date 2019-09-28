
let tex;
// Jitter is from Array of Objects Example
let bugs = []; // array of Jitter objects

function preload() {
  tex = createGraphics(1000,1000);
  createVRCanvas();
}

function setup() {
  // Create objects
  for (let i = 0; i < 100; i++) {
    bugs.push(new Jitter());
  }
}

function draw() {
  tex.background(50, 89, 100);
  for (let i = 0; i < bugs.length; i++) {
    bugs[i].move();
    bugs[i].display();
  }

  rotateX(PI);
  texture(tex);
  scale(-1, 1, 1);
  sphere(500, 60, 40);
}

// Jitter class
class Jitter {
  constructor() {
    this.x = random(tex.width);
    this.y = random(tex.height);
    this.diameter = random(10, 30);
    this.speed = 1;
  }

  move() {
    this.x += random(-this.speed, this.speed);
    this.y += random(-this.speed, this.speed);
  }

  display() {
    tex.ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}

