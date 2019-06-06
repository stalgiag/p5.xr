let vrGlobals = {
    counter: 0
  };
  
  function preload() {
    createVRCanvas();
  }
  
  function setup() {
    setVRBackgroundColor(200, 0, 150);
  }
  
  let x = 0;
  let direction = 1;
  function draw() {
    setViewerPosition(x, 0, 0);
    if(x > 10)
      direction = -1;
    else if(x < -10)
      direction = 1;
    x += direction * 0.1;
  
    fill(0, 255, 0);
    checkSync();
  
    vrGlobals.counter++;
    
    translate(0, 0, -10);
    rotateX(10);
    rotateY(20);
    strokeWeight(0.1);
    
    box(5);
  }
  
  function checkSync() {
    if(vrGlobals.counter === 0) {return;}
  
    if(vrGlobals.counter !== frameCount) {
      console.error('Out of sync!');
    }
  }
  