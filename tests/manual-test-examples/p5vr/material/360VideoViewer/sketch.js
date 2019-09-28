
let vid;
let readyToPlay = false;

function preload() {
  vid = createVideo('../../../assets/Ayutthaya.mp4', playVideo);
  createVRCanvas();
  noStroke();
  setVRBackgroundColor(200, 0, 150);
}

function draw() {
  rotateX(PI);
  texture(vid);
  scale(-1, 1, 1);
  sphere(500, 60, 40);
}

function playVideo() {

}

function mousePressed() {
  readyToPlay = true;
  // vid.hide();
  vid.loop();
}
