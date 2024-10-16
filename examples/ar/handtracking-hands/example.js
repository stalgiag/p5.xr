function setup() {
  createCanvas(windowWidth, windowHeight, AR);
  describe("Spheres on all the skeletal joints of the hand.");
}

function draw() {
  normalMaterial();
  for (let i = 0; i < hands.length; i++) {
    const joint = hands[i];
    push();
    translate(joint.x, joint.y, joint.z);
    sphere(0.01);
    pop();
  }
}
