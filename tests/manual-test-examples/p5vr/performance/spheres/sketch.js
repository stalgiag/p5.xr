var theta = 0;

function preload(){
  createVRCanvas();
  setVRBackgroundColor(250, 250, 250);
}

function draw(){
  noStroke();
  normalMaterial();
  translate(0, 0, -800);
  rotateY(frameCount * 0.01);

  for (var j = 0; j < 2; j++){
    push();
    for (var i = 0; i < 100; i++){
      translate(sin(theta + j) * 100, sin(theta + j) * 100, i * 0.1);
      rotateZ(theta * 0.2);
      push();
      sphere(8, 6, 4);
      pop();
    }
    pop();
  }

  theta += 0.02;
}
