let toonShader;

function preload() {
  toonShader = loadShader('vert.glsl', 'frag.glsl');
  createVRCanvas();
  setVRBackgroundColor(200, 0, 150);
}

function draw() {
  translate(0, 0, -10);
  noStroke();
  // Custom shaders temporarily broken
  shader(toonShader);
  toonShader.setUniform('fraction', 0.5);
  directionalLight(255, 204, 204, -1, -1, -1);
  ambientMaterial(0, 255, 255);
  sphere(2);
}
