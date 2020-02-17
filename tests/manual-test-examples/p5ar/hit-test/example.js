
let anchor = null;

function setup() {
  createARCanvas(ARCORE);
}


function draw() {
  if(anchor) {
    push();
    translate(anchor.transform.position.x * 100, anchor.transform.position.y * 100, anchor.transform.position.z * 100);
    box(50);
    pop();
  }
}

let debug = false;

function mousePressed() {
  anchor = createAnchor();
}
