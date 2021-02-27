
let vid;
let readyToPlay = false;

function preload() {
  vid = createVideo('../../../assets/Ayutthaya.mp4', playVideo);
  createVRCanvas();
  noStroke();
  setVRBackgroundColor(200, 0, 150);
}

function draw() {
  surroundTexture(vid);
}

function playVideo() {

}

function mousePressed() {
  readyToPlay = true;
  // vid.hide();
  vid.loop();
}
