let rot = 0;
let rotSpeed = 0.015;

let arController;

let markerId;

window.onload = function() {
  arController = new ARController(640, 480, 'camera_para.dat');
  arController.onload = function() {
    
    // arController.debugSetup();
    arController.loadMarker('./patt.hiro', (uId) => {
      console.log('marker loading successful, UID = ' + uId);
      markerId = uId;
      readyForDetection = true;
      detectTest = arController.trackPatternMarkerId(0, 1);
      console.log(detectTest);

    });
  };
};

function setup() {
  createARCanvasMarker();
}

let capture;
let readyForDetection = false;


function createARCanvasMarker() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  capture = createCapture({
    audio: false,
    video: {
      facingMode: {
        exact: 'environment'
      }
    }
  }
  );
  capture.size(width, height);
  capture.hide();

  detectedMat = new p5.Matrix();
}

let detectTest;

let currentMat = new Float64Array(16);

function draw() {
  background(0);
  texture(capture);
  translate(0,0,-100);
  rect(-width/2, -height/2, width, height);
  translate(0,0,100);

  fill(100,100,250);

  // translate(0, 0, -5);
  if(readyForDetection) {
    arController.process(capture.elt);

    arController.transMatToGLMat(detectTest.matrix, currentMat, 100);

    // x index = 12
    // y index = 13
    // z index = 14
    // This isn't correct yet, scaling done in transMatToGLMat is a magical #
    p5.instance._renderer.uMVMatrix.set(
      currentMat[0],
      currentMat[1],
      currentMat[2],
      currentMat[3],
      currentMat[4],
      currentMat[5],
      currentMat[6],
      currentMat[7],
      currentMat[8],
      currentMat[9],
      currentMat[10],
      currentMat[11],
      currentMat[12],
      currentMat[13],
      currentMat[14],
      currentMat[15]
    );

    // to be continued 
    // not sure if the projMat is correct (or if this is even the correct prop)
    // p5.instance._renderer.uProjMatrix = arController.getCameraMatrix();
      
    box(100);
  }

  
  // rot += rotSpeed;
  // rotateY(rot);
}
