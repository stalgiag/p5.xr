function preload() {
  createARCanvas();
}

function setup() {
  describe("Show all joints with their radii.");
}

function draw() {
  normalMaterial();
  for (let i = 0; i < hands.length; i++) {
    const joint = hands[i];
    push();
    translate(joint.x, joint.y, joint.z);
    sphere(joint.rad);
    pop();
  }
}
