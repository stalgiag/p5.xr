let graphics;

let state = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let index = 0;
let time = 0;
let interval = 300;

let words = ['x', 'o', 'z'];
let time2 = 0;
let index2 = 0
let interval2 = 4300;

let locX = 0.05;
let locY = 0.05;
let circleX = 0.05;
let circleY = 0.05;
let rectX = 0.05;
let rectY = 0.05;
let bluX = 0.05;
let bluY = 0.05;

let inc = 0.02;
let inc2 = 0.02;
let inc3 = 0.15;

let f = 255;

let b = 0.01;

let angle = 0;

let x = 0;
let y = 0;
let x2 = 1;
let speed = 5;
let speed2 = 0.5;

let a = 0;
let add = 0.01;
let size = 30;
let size2 = 1;

function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(0, 0, 0);
  graphics = createGraphics(800, 800);
}

function draw() {

  const left = getXRInput(LEFT);
  const right = getXRInput(RIGHT);

  [left, right].forEach((hand) => {
    if (hand) {
      push();
      if (hand.trigger && hand.trigger.pressed) {
        fill(255, 255, 0);
        time += deltaTime;
        if (time > interval) {
          index = (index + 1) % state.length;
          time = 0;
        }
      } else {
        fill(255);
      }
      translate(hand.position.x, hand.position.y, hand.position.z);
      box(0.05);
      pop();
    }
  });

  if (index == 0) {
    ripple();

  } else if (index == 1) {
    ahhh();

  } else if (index == 2) {
    squares();

  } else if (index == 3) {
    letters();

  } else if (index == 4) {
    blueOrbs();

  } else if (index == 5) {
    glow();

  } else if (index == 6) {
    vortex();

  } else if (index == 7) {
    hollow();

  } else if (index == 8) {
    scratch();

  }

  noStroke();
  surroundTexture(graphics);

}

function ripple() {
  graphics.push();
  graphics.background(0);
  for (let x = 0; x <= width; x += 200) {
    for (let y = 0; y <= height; y += 200) {
      for (let z = 0; z <= 150; z += 25) {
        graphics.noFill();
        graphics.strokeWeight(z * 0.01);
        graphics.stroke(z, 0, f);
        graphics.ellipse(x, y, circleX - 20 + z, circleY - 20 + z);
      }

      circleX = circleX + 0.05;
      circleY = circleY + 0.05;

      if (circleX > 300 || circleY > 300) {
        circleX = circleX * -1;
        circleY = circleY * -1;
        f = 255;
      }

      if (circleX > -120 && circleY > -120) {
        f -= 0.275;
      }
    }
  }
  graphics.pop();
}

function vortex() {
  graphics.push();
  graphics.translate(200, 200);
  graphics.rectMode(CORNER);

  graphics.push();
  for (let i = 0; i < 65; i++) {
    graphics.stroke(200, 0, 200);
    graphics.fill(50 + i * 2, 0, 50 + i * 2);

    let bb = i * 2;

    graphics.rotate(-angle / 500);
    graphics.translate(i, i * 4);
    graphics.textSize(20);
    graphics.text('spin', i, bb);

    angle = angle - 1 / 40;
  }
  graphics.pop();

  x = x ^ 13;
  y = y ^ 1;

  if (x >= 150 || y >= 150) {
    y = -y;
    x = -x;
  }
  graphics.pop();
}

function squares() {
  graphics.push();
  graphics.background(0, 0, 255 + rectX * 2);

  for (let i = 0; i <= width; i += 300) {
    for (let j = 0; j <= height; j += 300) {
      for (let k = 0; k <= 150; k += 25) {
        graphics.noFill();
        graphics.strokeWeight(k * 0.03);
        graphics.stroke(255, k, 0);
        graphics.rect(i, j, rectX - 20 + k, rectY - 20 + k);

        graphics.push();
        graphics.noFill();
        graphics.stroke(0, k, 255);
        graphics.strokeWeight(k * -0.03);
        graphics.rect(i - 150, j - 150, rectX - 10 + k, rectY - 10 + k);
        graphics.pop();
      }

      rectX = rectX + inc2;
      rectY = rectY + inc2;

      if (rectX > 10 || rectX < -155) {
        inc2 = -inc2;
      }
    }
  }
  graphics.pop();
}

function letters() {

  graphics.push();
  graphics.background(0);
  for (let i = 0; i < width; i += 100) {
    for (let j = 0; j < height; j += 100) {
      graphics.noFill();
      graphics.strokeWeight(size / 10);
      graphics.stroke(i / 2, 0, i * a * 2);
      graphics.textSize(size);
      graphics.textAlign(CENTER);
      graphics.text(words[index2], i, j);
    }
  }
  graphics.pop();

  size += inc * 3;
  if (size >= 100 || size <= 10) {
    inc = -inc;
  }

  time2 += deltaTime;
  if (time2 > interval2) {
    index2 = (index2 + 1) % words.length;
    time2 = 0;
  }

  a += add;
  if (a > 2 || a < 0) {
    add = -add;
  }
}

function glow() {

  graphics.push();
  graphics.background(0);
  for (let r = 0; r <= width; r += 200) {
    for (let t = 0; t <= height; t += 50) {
      graphics.fill(5, 80);
      graphics.stroke(255);
      graphics.strokeWeight(0.5 + size2 / 2)
      graphics.textSize(70 + size2);
      graphics.textLeading(55 + size2)
      graphics.textWrap(WORD);
      graphics.textStyle(BOLDITALIC);
      graphics.text('glow', x2 + r, size2 + t, 200);
    }
  }
  graphics.pop();

  if (x2 > 300) {
    x2 = 0;
  }
  x2 += 0.5;

  size2 = size2 + inc3;
  if (size2 >= 10 || size2 <= 0) {
    inc3 = -inc3;
  }
}

function blueOrbs() {
  graphics.push();
  graphics.background(0, 130, 250, 20);
  graphics.rotate(x);
  x2 += 0.001;
  for (let x = 0; x <= width; x += 150) {
    for (let y = 0; y <= height; y += 150) {
      for (let z = 0; z <= height; z += 100) {
        graphics.rotate(z / 20);
        graphics.strokeWeight(0.005 * z);
        graphics.stroke(0, z / 2 + random(-40, 60), z + random(-40, 60));
        graphics.noFill();
        graphics.circle(x, bluY + z, z / random(10, 5));
      }

      bluX = bluX + 0.01;
      bluY = bluY + 0.01;

      if (bluX > 300 || bluY > 300) {
        bluX = bluX * -1;
        bluY = bluY * -1;
      }
    }
  }
  graphics.pop();
}

function scratch() {
  graphics.push();
  graphics.rotate(x);

  for (let x = 0; x <= width; x += 200) {
    for (let y = 0; y <= height; y += 200) {
      for (let z = 0; z <= height; z += 100) {
        graphics.rotate(z / 10);
        graphics.strokeWeight(0.5);
        graphics.stroke(
          z / 2 + random(-40, 60),
          z / 4 + random(-40, 60),
          z + random(-40, 60)
        );
        graphics.noFill();
        graphics.textSize(230);
        graphics.text("x", locY + z, z / random(10, 20));
      }

      x += 0.001;

      locX = locX + 0.01;
      locY = locY + 0.01;

      if (locX > 300 || locY > 300) {
        locX = locX * -1;
        locY = locY * -1;
      }
    }
  }
  graphics.pop();
}

function hollow() {
  graphics.push();
  graphics.fill(5, 20);
  graphics.strokeWeight(1);
  graphics.stroke(255);
  graphics.textAlign(CENTER, CENTER);
  graphics.textSize(270);
  graphics.text("oxoxoxoxoxoxoxoxoxoxoxoxoxo", -x2 + 300, 0);
  graphics.text("oxoxoxoxoxoxoxoxoxoxoxoxoxo", x2 + 300, 150);
  graphics.text("oxoxoxoxoxoxoxoxoxoxoxoxoxo", -x2 + 300, 300);
  graphics.text("oxoxoxoxoxoxoxoxoxoxoxoxoxo", x2 + 300, 450);

  a += speed2;
  if (a >= 255 || a <= 0) {
    speed2 = -speed2;
  }
  x2 += speed2;
  if (x2 >= width || x2 < -width) {
    speed2 = -speed2;
  }
  graphics.pop();
}

function ahhh() {
  graphics.push();
  graphics.background(5, 1);
  for (let a = 0; a < 20; a += 2) {
    for (let b = 0; b < 20; b += 2) {
      graphics.translate(x2 + a / 100, y + b / 100);
      graphics.rotate(0.05 * b);
      graphics.strokeWeight(a * 0.05);
      graphics.stroke(0, 0, a * 10);
      graphics.fill(0, 0, a * 5 + x2);
      graphics.textSize(4.5 * a);
      graphics.text("o", a, b);

      graphics.push();
      graphics.translate((x2 * a) / 100, y + b / 100);
      graphics.rotate(0.05 * a);
      graphics.fill(0, a * 12, random(200, b * 10 * a));
      graphics.strokeWeight(a);
      graphics.stroke(0, 0, random(a * 12));
      graphics.textSize(5.5 * a);
      graphics.text("ah", b, a);
      graphics.pop();
    }
  }

  if (x2 > 300 || x2 < 0) {
    x2 = random(0, width);
  }
  x2 = x2 + speed;

  if (y > 300 || y < 0) {
    y = random(250);
  }

  y = y + speed;

  graphics.pop();
}