let gold;
let ring;
let letter;

let myFont;
let randomX = [], randomY = [];
let words = ["a", "b", "c", "d", "e"];
let index = 0;

let angle = 0;
let a = 1;
let x = 10;
let speed = 0.5;

let time = 0;
let interval = 1000;

let fontSize = 75;
let hiArray;
let samplefact = 0.25;

function preload() {
  createVRCanvas();
  myFont = loadFont('assets/WorkSans-Medium.ttf');
}
 
function setup() {
  setVRBackgroundColor(0,0,0);
  textFont(myFont);

  //text to points for wavyOhs()
  hiArray = myFont.textToPoints("0", 150, 100, fontSize, {
    sampleFactor: samplefact,
  });

  gold = createGraphics(600, 600);
  gold.background(255, 80);

  ring = createGraphics(600, 600);
  ring.background(5);

  letter = createGraphics(200, 200);

  for (let i = 0; i < 10; ++i) {
    randomX[i] = random(-800, 800);
    randomY[i] = random(-300, 300);
  }
}

function draw() {
  setViewerPosition(0, 0, 1000);  
 
  letter.push();
  letter.clear();
  letter.fill(50);
  letter.textAlign(CENTER,CENTER);
  letter.translate(50, 70);
  letter.textSize(30);
  letter.text(words[index], 100, 100);
  letter.pop();

  //"words[index]" means the index value is equal to the numerical order of each letter in the "words" array (ex: a=0, b=1, c=2, etc.)
  //as the time that passes increases with deltaTime, the index value goes up by one until it hits the end of the array & resets
  //this creates a loop of changing letterforms
  //look up modulo for more info

  time += deltaTime;
  if (time > interval) {
    index = (index + 1) % words.length;
    time = 0;
  }
  
  wavyOhs();
  shapes();

  //for loop contains array of letters on each side of a rotating box
  //each box is translated at a random x/y location (see range in setup)
  for (let i = 0; i < 10; ++i) {
    push();
    translate(randomX[i], randomY[i]);
    rotateX(angle / 15);
    rotateY(angle / 15);
    angle += 0.003;
    texture(letter);
    box(400);
    pop();
  }
  
   a = frameCount / 155;
  
  //if x is more than width or less than 0, reverse the animation
  if (x > width || x < 0) {
    speed = speed * -1;
  }

  x = x + speed;

}

function wavyOhs() {
  //possible shapes for textToPoint outlines: TRIANGLE_FAN|TRIANGLE_STRIP|QUADS|QUAD_STRIP|TESS

  letter.push();
  letter.fill(255, 30);
  letter.stroke(255, 60);
  letter.beginShape(QUAD_STRIP);
  for (let i = 0; i < hiArray.length; i++) {
    letter.vertex(
      hiArray[i].x + sin(frameCount * 0.005 - hiArray[i].y / 32) * 5,
      hiArray[i].y + sin(frameCount * 0.05 - hiArray[i].x / 32) / 50
    );
    letter.vertex(
      hiArray[i].x + sin(frameCount * 0.07 - hiArray[i].y / 10) * 5,
      hiArray[i].y + sin(frameCount * 0.005 - hiArray[i].x / 10) / 100
    );
    letter.strokeWeight(0.5);

  }
  letter.endShape();
  letter.pop();
}

function shapes() {

  //gold texture used on triangle torus
  //shows rotating letters with thin gold strokes 
  gold.push();
  gold.clear();
  gold.rotate(a * sin * 2);
  gold.fill(205, 150, 0, 20);
  gold.strokeWeight(1);
  gold.stroke(255);
  gold.textAlign(CENTER);
  gold.textSize(120);
  gold.translate(400, 0);
  gold.rotate(x / 1200);
  gold.text("o x o x o x o x o x o x o x o x", -200, -150 + x);
  gold.text("x o x o x o x o x o x o x o x o", -200, -250 + x);
  gold.text("o x o x o x o x o x o x o x o x", -200, -350 + x);
  gold.text("x o x o x o x o x o x o x o x o", -200, -450 + x);
  gold.pop();

  //ring texture used on sphere and torus
  //shows rotating letters with thick white strokes 
  ring.push();
  ring.clear();
  ring.rotate(a * sin * 2);
  ring.fill(5, 20);
  ring.strokeWeight(5);
  ring.stroke(255);
  ring.textAlign(CENTER);
  ring.textSize(120);
  ring.translate(400, 0);
  ring.text("o x o x o x o x o x o x o x o x", -200, -150 + x);
  ring.text("x o x o x o x o x o x o x o x o", -200, -250 + x);
  ring.text("o x o x o x o x o x o x o x o x", -200, -350 + x);
  ring.text("x o x o x o x o x o x o x o x o", -200, -450 + x);
  ring.pop();
  
  noStroke();
  
  //round ring torus
  push();
  rotateY(180 + a/2);
  rotateX(180 + a/2);
  texture(ring);
  torus(350, 20);

  //triangle torus
  rotateY(180 + a/2);
  texture(gold);
  torus(550, 40, 3);
  pop();
  
  //sphere 
  push();
  texture(ring);
  rotateZ(15);
  rotateX(30-angle * 0.13/2);
  rotateY(-angle * 0.13/2)
  sphere(200);
  pop();
}
