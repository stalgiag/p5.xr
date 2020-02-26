
let anchor = null;

function setup() {
  createARCanvas(ARCORE);
}


function draw() {
  if(anchor) {
    push();
    anchor.transform();
    box(50);
    pop();
  }
}

let debug = false;

function mousePressed() {
  anchor = createAnchor();
}
