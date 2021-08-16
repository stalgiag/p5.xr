let graphics;

let state = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
let index = 0;
let time = 0;
let interval = 300;

let words = ['x', 'o', 'z'];
let time2 = 0;
let index2 = 0
let interval2= 4300;

locX = 0.05;
locY = 0.05;
circleX = 0.05;
circleY = 0.05;
rectX = 0.05;
rectY = 0.05;
monX = 0.05;
monY = 0.05;
bluX = 0.05;
bluY = 0.05;

let f = 255;

let inc = 0.02;
let inc2 = 0.02;
let inc5 = 0.02;

let b = 0.01;
let d = 0.01;

let angle = 0;
let angle2 = 0;

let x = 0;
let y = 0;
let x2 = 1;
let speed = 5;
let speed2 = 0.5;

let a = 0;
let aa = 0.1;
let add = 0.01;
let size = 30;
let size2 = 1;
let inc3 = 1;
let inc4 = 0.15;

function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(0,0,0);
  graphics = createGraphics(800, 800);
}

function draw() {

  const left = getXRInput(LEFT);
  const right = getXRInput(RIGHT);

  [left, right].forEach((hand) => {
	  if (hand) {
		  push();
      if(hand.trigger && hand.trigger.pressed) {
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
   breathe();

  } else if (index == 2) {
    vortex();

  } else if(index==3){
    wind();

  } else if(index==4){ 
    squares();

  } else if(index==5){ 
    letters();

  } else if(index==6){ 
    glow();

  } else if(index==7){ 
    money();

  } else if(index==8){ 
    flower();

  } else if(index==9){ 
    volcano();

  } else if(index==10){ 
    blueOrbs();

  } else if(index==11){ 
    scratch();

  } else if(index==12){ 
    hollow();

  } else if(index==13){ 
    ahhh();
  }

  // texture(graphics);
  // box(500);
  noStroke();
  surroundTexture(graphics);

}

function ripple() {
  push();
  graphics.push();
  graphics.background(0);
  //create nested loop of circles along x and y axes
  for (let x = 0; x <= width; x += 200) {
    for (let y = 0; y <= height; y += 200) {
      //create loop of circles within the circles
      for (let z = 0; z <= 150; z += 25) {
        graphics.noFill();
        //this increases stroke weight in increments
        //the larger the number, the thicker the stroke
        graphics.strokeWeight(z * 0.01);
        graphics.stroke(z, 0, f);
        graphics.ellipse(x, y, circleX - 20 + z, circleY - 20 + z);
      }

      //this increases the x/y size of the circles
      circleX = circleX + 0.05;
      circleY = circleY + 0.05;

      //if size is more than limit, reset fill color and subtract size by 1
      //this creates a loop of the animation
      if (circleX > 300 || circleY > 300) {
        circleX = circleX * -1;
        circleY = circleY * -1;
        f = 255;
      }

      //this changes the fill color after the drop
      if (circleX > -120 && circleY > -120) {
        f -= 0.275;
      }
    }
  }

    graphics.pop();
  pop();
}

function breathe() {
  push();
  graphics.push();
  graphics.background(0);

  //background rings blue
  for (let e = 0; e < 30; e += 2) {
    graphics.fill(0, 0, 255, 30);
    graphics.circle(0, 0, 50 * e);
    graphics.noStroke();
  }

  //nested loop of rectangles along x/y axes
  //rotate them to create ray light effect
  for (let a = 0; a < 5; a++) {
    for (let b = 0; b < 16; b++) {
      for (let c = 0; c < 5; c++) {
        graphics.translate(a + d / 4, (b * 2) / 5);
        graphics.rotate(b);
        graphics.fill(d * 12, b * 12, 0, 190);
        graphics.rect(d + a, b, 100 * -b, 0.75*c);
        graphics.fill(d * 8, d * 8, d * 8, 190);
        graphics.rotate(-a);
        graphics.circle(d + a, 100 * -b, 5 * c);
      }
    }
  }

  //add movement to rays to give breathing motion
  d += inc;
  inc += 0.005;

  if (d >= 30) {
    inc = -inc;
  }

  //sun rings white
  for (let e = 0; e < 20; e += 3) {
    graphics.fill(255, 30);
    graphics.circle(0, 0, 30 * e);
    graphics.noStroke();
  }
  
  graphics.pop();
  pop();
}


function vortex(){
  push();
  graphics.push();
  graphics.translate(200, 200);
  graphics.rectMode(CORNER);

  
  graphics.push();
  for (let i = 0; i < 65; i++) {
    graphics.fill(0, 0, 0);
    graphics.noStroke();
    graphics.fill(50 + i * 2, 0, 50 + i * 2);
    
    let bb = i * 2;
    graphics.rotate(-angle / 500);

    graphics.translate(i, i * 4);
    graphics.ellipse(i, i, bb, 20);

    angle = angle - 1 / 40;
  }
  graphics.pop();

  x = x ^ 13;
  y = y ^ 1;
  
  if (x >= 150 || y >= 150){
      y= -y;
    x = -x;
    }
  
    graphics.pop();
    pop();
}

function wind(){
  push();
   graphics.push();
  graphics.background(0, 0, 50);
   graphics.translate(200, 200);
   graphics.rectMode(CORNER);
  
  for (let i = 0; i < 65; i += 3) {
     graphics.noFill();
     graphics.strokeWeight(i * 0.02);
     graphics.stroke(255, 100);
     graphics.fill(0, 0, i*10);
    let bb = i * 2;
     graphics.rotate(angle2 / 500);

    for (let b = 0; b < 20; b += 4) {
      for (let a = 0; a < 20; a += 4) {
         graphics.translate(a / 30, b / 30);
         graphics.circle(a * b, b, (3 * i) / bb);
      }
    }
  }
  x = x ^ 13;
  y = y ^ 1;
  angle2 = angle2 - 1 / 2;
   graphics.pop();
  pop();
}

function popRocks(){
  push();
  graphics.push();
  graphics.background(250,0,0,3);
  for (let a =0; a<20; a++){
    for (let b =0; b<20; b++){
      graphics.translate(x+a/100,y+b/100);
      graphics.rotate(0.05*b*x)
      graphics.fill(255);
      graphics.strokeWeight(a*0.3);
      graphics.stroke(200+a*12,50+y*3,random(50,a*6))     
      graphics.textSize(0.75*a)
      graphics.text('o',a,b)
  
      graphics.push();
      graphics.translate(x*a/100,y+b/100);
      graphics.fill(255);
      graphics.stroke(200+a*12,10+a,random(50,a*12))     
      graphics.textSize(a)
      graphics.textStyle(ITALIC);
      graphics.text('pop',b,a)
      graphics.pop();

    } 
  }

  if (x>width || x<0){
    x=random(0,width);
  }
  
  if (y> width || y<0){
    y=random(250);
  }
  
  if (y>=50&& y<=100){
    y = -y;
  }
   if (y>=101&& y<=150){
    y = y;
  }
  
  if (y>=151&& y<=200){
    y = -y;
  }
  
  if (y>=201&& y<=250){
    y = y;
  }
  
  y = y+speed;
  x = x+speed;

  graphics.pop();
  pop();
}

function squares(){
  push();
  graphics.push();
  graphics.background(0,0,255+rectX*2);

  //create nested loop of shapes along x and y axes
  for (let i = 0; i <= width; i += 300) {
    for (let j = 0; j <= height; j += 300) {
      //create loop of shapes within the shapes
      for (let k = 0; k <= 150; k += 25) {
        graphics.noFill();
        //this increases stroke weight in increments
        //the larger the number, the thicker the stroke
        graphics.strokeWeight(k * 0.03);
        graphics.stroke(255, k, 0);
        graphics.rect(i, j, rectX - 20 + k, rectY - 20 + k);
        
        graphics.push();
        graphics.noFill();
        graphics.stroke(0, k, 255);
        graphics.strokeWeight(k * -0.03);
        graphics.rect(i-150, j-150, rectX - 10 + k, rectY - 10 + k);
        graphics.pop();
      }

      //this increases the x/y size of the shape by inc2
      rectX = rectX + inc2;
      rectY = rectY + inc2;

      // continuously increase and decrease size of shape
      if (rectX > 10 || rectX < -155) {
        inc2 = -inc2;
      }
    }
  }
  graphics.pop();
  pop();
}

function letters(){

  graphics.push();
  graphics.background(0);
  for (let i = 0; i < width; i += 100) {
    for (let j = 0; j < height; j += 100) {        
      graphics.noFill();
      graphics.strokeWeight(size / 10);
      graphics.stroke(i / 2, 0, i * a * 2);
      graphics.textSize(size);
      graphics.textAlign(CENTER);
      graphics.text(words[index2], i , j);
    }
  }
  graphics.pop();

  size += inc*3;
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
  pop();
}

function glow(){
  push();

  graphics.push();
  graphics.background(0);
  for (let r = 0; r <= width; r+= 200) {
    for (let t = 0; t <= height; t += 50) {
    graphics.fill(5,80);
    graphics.stroke(255);
    graphics.strokeWeight(0.5+size2/2)
    graphics.textSize(70+size2);
    graphics.textLeading(55+size2)
    graphics.textWrap(WORD);
    graphics.textStyle(BOLDITALIC);
    graphics.text('glow',x2+r,size2+t,200);
    }
  }
  graphics.pop();

  if (x2>300){
    x2=0;
  }
  x2+=0.5;

  size2 = size2 + inc4;
  if(size2 >= 10 || size2 <= 0){
    inc4 = -inc4;
  }
  pop();
}

function money(){

push();
graphics.push();
for (let x = 0; x <= width; x += 100) {
  for (let y = 0; y <= height; y += 100) {
    for (let z = 0; z <= 250; z += 25) {
      graphics.noFill();
      graphics.strokeWeight(z * 0.03);
      graphics.stroke(0, z, 0);
      graphics.translate(x, y);
      graphics.rotate(z * 130);
      graphics.textSize(z * 4);
      graphics.text("$", monX + z, monY + z);
    }

    monX = monX + inc5;
    monY = monY + inc5;

    // continuously move text back and forth
    if (monX > 50 || monX < -50) {
      inc5 = -inc5;
    }
  }
}
graphics.pop();
pop();
}

function flower(){

push();
graphics.push();
graphics.background(0,20);
graphics.translate(300, 300);
graphics.ellipseMode(CENTER);

  for (let a = 0; a < width; a += 100) {
    for (let b = 0; a < height; a += 100) {
      graphics.translate(a / 2, b / 2);
      for (let k = 0; k < 10; k += 1) {
        for (let i = 0; i < 20; i++) {
          graphics.strokeWeight(i * 0.05);
          graphics.stroke(255, 200);
          graphics.noFill();
          graphics.rotate(angle * i * 0.005);
          graphics.ellipse(k / 2, k * 5, k, i * 5);
        }
      }
    }
  }
  x = x * y;
  y = y + 0.00001;
  angle = angle - 0.0001;

  if (x >= 10 || y >= 10) {
    y = -y;
    x = -x;
  }
  graphics.pop();
  pop();
}

function volcano(){
  push();
  graphics.push();
  graphics.fill(0, 0, 200, 0);
  graphics.translate(300, 300 - aa);

  for (let x = 0; x < width; x += 10) {
    for (let b = 0; b < 50; b += 10) {
      let green = 255 - x;
      let red = 255;
      graphics.translate(50, b * 16);
      graphics.rotate(aa * 0.5);
      graphics.stroke(160, 0,0,200);
      graphics.fill(red + b, green + aa, aa / 2, 200);
      graphics.rect((x * aa) / 155, (b * aa) / 255, x / 10, b);
    }
  }

  if (aa > 255 || aa < 0) {
    add = -add;
  }
  aa = aa + add;
  
  graphics.pop();
  pop();
}

function blueOrbs(){
  push();
  graphics.push();
  graphics.background(0, 130, 250, 20);
  graphics.rotate(x);
  x2 += 0.001;
  for (let x = 0; x <= width; x += 100) {
    for (let y = 0; y <= height; y += 100) {
      for (let z = 0; z <= height; z += 52) {
        graphics.rotate(z / 20);
        graphics.strokeWeight(0.005 * z);
        graphics.stroke(0, z / 2 + random(-40, 60), z + random(-40, 60));
        graphics.noFill();
        graphics.circle(x, bluY + z, z / random(30, 25));
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
  pop();
}

function scratch(){
push();
graphics.push();
graphics.rotate(x);
for (let x = 0; x <= width; x += 100) {
  for (let y = 0; y <= height; y += 100) {
    for (let z = 0; z <= height; z += 52) {
      graphics.rotate(z / 20);
      graphics.strokeWeight(0.5);
      graphics.stroke(
        z / 2 + random(-40, 60),
        z / 2 + random(-40, 60),
        z + random(-40, 60)
      );
      graphics.noFill();
      graphics.textSize(40);
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
pop();
}

function hollow(){
  push();
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
  pop();
}

function ahhh() {
push();
graphics.push();
  graphics.background(5, 1);
  for (let a = 0; a < 20; a++) {
    for (let b = 0; b < 20; b++) {
      graphics.translate(x2 + a / 100, y + b / 100);
      graphics.rotate(0.05 * b);
      graphics.strokeWeight(a * 0.05);
      graphics.stroke(0, 0, a * 10);
      graphics.fill(0, 0, a * 5 + x2);
      graphics.textSize(1.5 * a);
      graphics.text("o", a, b);

      graphics.push();
      graphics.translate((x2 * a) / 100, y + b / 100);
      graphics.rotate(0.05 * a);
      graphics.fill(0, a * 12, random(200, b * 10 * a));
      graphics.strokeWeight(a);
      graphics.stroke(0, 0, random(a * 12));
      graphics.textSize(2.5 * a);
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
  pop();
}