
let vid;
let readyToPlay = false;

function preload() {
  vid = createVideo('../../../assets/Ayutthaya.mp4');
  vid.hide();
  createVRCanvas();
  noStroke();
  setVRBackgroundColor(200, 0, 150);
}

function draw() {
  surroundTexture(vid);
}


function mousePressed() {
  readyToPlay = true;
  vid.loop();
}
