var toonShader;

function preload(){
  toonShader = loadShader('vert.glsl', 'frag.glsl');
  createVRCanvas();
  setVRBackgroundColor(200, 0, 150);
}

let counter = 0;
function draw(){
  if(counter<2){counter++;return;}
  translate(0, 0, 100);
  noStroke();
  shader(toonShader);
  toonShader.setUniform('fraction', 0.5);
  directionalLight(255, 204, 204, -1, -1, -1);
  ambientMaterial(0, 255, 255);
  sphere(10);
}
