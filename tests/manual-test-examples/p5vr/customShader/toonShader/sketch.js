var toonShader;

function preload(){
  toonShader = loadShader('vert.glsl', 'frag.glsl');
  createVRCanvas();
  setVRBackgroundColor(200, 0, 150);
}

function setup(){
  
  
}
let counter = 0;
function draw(){
  if(counter<2){counter++;return;}
  translate(0, 0, 10);
  strokeWeight(0.1);
  shader(toonShader);
  toonShader.setUniform('fraction', 1.0);
  var dirY = (mouseY / height - 0.5) * 2;
  var dirX = (mouseX / width - 0.5) * 2;
  directionalLight(255, 204, 204, -dirX, -dirY, -1);
  ambientMaterial(0, 255, 255);
  sphere(5);
}
