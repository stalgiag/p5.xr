function preload() {
  createARCanvas();
}

function setup() {
  describe("A cube on your right index finger");
}

function draw() {
  mainHandMode(LEFT);

  push();
  let p = finger;
  translate(p.x, p.y, p.z);
  box(0.01, 0.01, 0.01);
  pop();

  // for (let i = 0; i < hands.length; i++) {
  //   const finger = hands[i];
  //   push();
  //   let p = finger; 
  //   translate(p.x, p.y, p.z);
  //   let s = 0.01;
  //   box(s, s, s);
  //   pop();
  // }
}
