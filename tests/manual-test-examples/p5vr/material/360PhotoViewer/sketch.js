let tex;

function preload(){
  tex = loadImage('../../../assets/equirectangular.png');
  createVRCanvas();
  setVRBackgroundColor(200, 0, 150);
}

let counter = 0;
function draw(){
  if(counter<2){counter++;return;}
  rotateX(90);
  noStroke();
  texture(tex);
  translate(-25, 0, -25);
  sphere(100);
}
