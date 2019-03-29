
var img;
var vid;
var theta = 0;

function preload(){
  img = loadImage('../../../assets/UV_Grid_Sm.jpg');
  createVRCanvas();
  setVRBackgroundColor(50, 50, 50);
}

function draw(){
  translate(-200, 0, -100);
  push();
  rotate(theta * mouseX * 0.001, [1, 1, 1]);

  texture(img);
  sphere();
  pop();
  translate(150, 0, 0);
  push();

  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  texture(img);
  // box(45);
  torus();
  pop();
  translate(150, 0, 0);
  push();

  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  texture(img);
  // box(45);
  cone();
  pop();
  translate(150, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  texture(img);
  // box(45);
  box();
  pop();
  theta += 0.05;
}
