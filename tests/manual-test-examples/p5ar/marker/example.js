
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
      // arController.debugSetup();
      
      // var camera_mat = arController.getCameraMatrix();
      // console.log(camera_mat);

      // yet another non-working approach
      addListener();
    });
  };
};

function setup() {
  createARCanvasMarker();
  defaultCam = new p5.Camera();
  glRH = p5.Matrix.identity();
}

let capture;
let readyForDetection = false;


function createARCanvasMarker() {
  createCanvas(640, 480, WEBGL);
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();
  
  detectedMat = new p5.Matrix();
}

let detectTest;
let transMat = new Float64Array(12);
let currentMat = new Float64Array(16);
let targetMat = new Float64Array(16);
let rot = new Float64Array(3);
let defaultCam;

function draw() {
  background(0);
  // p5.instance._renderer.uMVMatrix.set(
  //   defaultCam.cameraMatrix.mat4[0],
  //   defaultCam.cameraMatrix.mat4[1],
  //   defaultCam.cameraMatrix.mat4[2],
  //   defaultCam.cameraMatrix.mat4[3],
  //   defaultCam.cameraMatrix.mat4[4],
  //   defaultCam.cameraMatrix.mat4[5],
  //   defaultCam.cameraMatrix.mat4[6],
  //   defaultCam.cameraMatrix.mat4[7],
  //   defaultCam.cameraMatrix.mat4[8],
  //   defaultCam.cameraMatrix.mat4[9],
  //   defaultCam.cameraMatrix.mat4[10],
  //   defaultCam.cameraMatrix.mat4[11],
  //   defaultCam.cameraMatrix.mat4[12],
  //   defaultCam.cameraMatrix.mat4[13],
  //   defaultCam.cameraMatrix.mat4[14],
  //   defaultCam.cameraMatrix.mat4[15]
  // );

  fill(100,100,250);


  if(readyForDetection) {
    arController.process(capture.elt);

    arController.getTransMatSquare(0, 1, transMat);
    arController.transMatToGLMat(transMat, currentMat, 100);

    // invert(currentMat, currentMat);
    // copyMarkerMatrix(transMat, currentMat)

    
    // p5.instance._renderer.uMVMatrix = superTemp;

    // currentMat = arController.getTransformationMatrix();
    let pCurMat = p5.Matrix.identity().set(
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

    // let glRH;

    // let glRh = p5.Matrix.identity().set(
    //   detectTest.transformGL_RH[0],
    //   detectTest.transformGL_RH[1],
    //   detectTest.transformGL_RH[2],
    //   detectTest.transformGL_RH[3],
    //   detectTest.transformGL_RH[4],
    //   detectTest.transformGL_RH[5],
    //   detectTest.transformGL_RH[6],
    //   detectTest.transformGL_RH[7],
    //   detectTest.transformGL_RH[8],
    //   detectTest.transformGL_RH[9],
    //   detectTest.transformGL_RH[10],
    //   detectTest.transformGL_RH[11],
    //   detectTest.transformGL_RH[12],
    //   detectTest.transformGL_RH[13],
    //   detectTest.transformGL_RH[14],
    //   detectTest.transformGL_RH[15]
    // );
    
    let superTemp = pCurMat.copy().mult(p5.instance._renderer.uMVMatrix);

    let t = superTemp.copy();
    // let transposed = p5.Matrix.identity().transpose(superTemp);
    

    // to be continued 
    // not sure if the projMat is correct (or if this is even the correct prop)
    // p5.instance._renderer.uProjMatrix = arController.getCameraMatrix();
    
    drawVideoFeed();

    if(detectTest.inCurrent) {
      addToSmoothingMats(t.mat4);
    }
    let finfin = getSmoothedMat();
    
    // if(detectTest.inCurrent) {
    applyMatrix(
      finfin[0],
      finfin[1],
      finfin[2],
      finfin[3],
      finfin[4],
      finfin[5],
      finfin[6],
      finfin[7],
      finfin[8],
      finfin[9],
      finfin[10],
      finfin[11],
      finfin[12],
      finfin[13],
      -finfin[14],
      finfin[15]
    );

    // applyMatrix(
    //   rh.mat4[0],
    //   rh.mat4[1],
    //   rh.mat4[2],
    //   rh.mat4[3],
    //   rh.mat4[4],
    //   rh.mat4[5],
    //   rh.mat4[6],
    //   rh.mat4[7],
    //   rh.mat4[8],
    //   rh.mat4[9],
    //   rh.mat4[10],
    //   rh.mat4[11],
    //   rh.mat4[12],
    //   rh.mat4[13],
    //   rh.mat4[14],
    //   rh.mat4[15]
    // );
      
    // p5.instance._renderer.uPMatrix.set(arController.getCameraMatrix());
    // let pMat = arController.getCameraMatrix();
    // p5.instance._renderer.uPMatrix.set(
    //   pMat[0],
    //   pMat[1],
    //   pMat[2],
    //   pMat[3],
    //   pMat[4],
    //   pMat[5],
    //   pMat[6],
    //   pMat[7],
    //   pMat[8],
    //   pMat[9],
    //   pMat[10],
    //   pMat[11],
    //   pMat[12],
    //   pMat[13],
    //   pMat[14],
    //   pMat[15]
    // );

    box(100);
    // }
    // translate(width/2, height/2, 0);
    // }
    // TESTING TRANSLATE AND ROTATE
    // translate(0,0,-200);
    // rotateY(50);
    // TESTING TRANSLATE AND ROTATE

    // This isn't correct yet, scaling done in transMatToGLMat is a magical #
    // invert(targetMat, currentMat);

    // getRotation(rot, targetMat);
    // rotateY(rot[1]);
    // rotateX(rot[0]);
    // rotateZ(rot[2]);

    
    // getTranslation(trans, currentMat);
    // translate(trans[0], 0, 0);

    // x index = 12
    // y index = 13
    // z index = 14
    // translate(currentMat[12], currentMat[13], currentMat[14]);


    // arController.debugDraw();
  }

  
  // rot += rotSpeed;
  // rotateY(rot);
}

function addListener() {
  // listen to the event
  arController.addEventListener('getMarker', function(event) {
    onMarkerFound(event);
  }
  );
}

let modelViewMatrix = p5.Matrix.identity();
let glRH;
function onMarkerFound(event) {
  // console.log(event);
  if(detectTest.inCurrent) {
    console.log(event);
    glRH = p5.Matrix.identity().set(
      event.data.matrixGL_RH[0],
      event.data.matrixGL_RH[1],
      event.data.matrixGL_RH[2],
      event.data.matrixGL_RH[3],
      event.data.matrixGL_RH[4],
      event.data.matrixGL_RH[5],
      event.data.matrixGL_RH[6],
      event.data.matrixGL_RH[7],
      event.data.matrixGL_RH[8],
      event.data.matrixGL_RH[9],
      event.data.matrixGL_RH[10],
      event.data.matrixGL_RH[11],
      event.data.matrixGL_RH[12],
      event.data.matrixGL_RH[13],
      event.data.matrixGL_RH[14],
      event.data.matrixGL_RH[15]
    );
  }
  // honor his.parameters.minConfidence
  // if(event.data.type === artoolkit.PATTERN_MARKER && event.data.marker.cfPatt < _this.parameters.minConfidence) return;
  // if(event.data.type === artoolkit.BARCODE_MARKER && event.data.marker.cfMatt < _this.parameters.minConfidence) return;

  // updateWithModelViewMatrix(modelViewMatrix);
  // if(detectTest.inCurrent) {
  //   modelViewMatrix.set(event.data.matrixGL_RH);
  //   console.log(modelViewMatrix);
  // }
}

function updateWithModelViewMatrix(modelViewMatrix) {

  // apply context._axisTransformMatrix - change artoolkit axis to match usual webgl one
  // var tmpMatrix = new THREE.Matrix4().copy(this.context._artoolkitProjectionAxisTransformMatrix);
  // tmpMatrix.multiply(modelViewMatrix);

  // modelViewMatrix.copy(tmpMatrix);

  // change markerObject3D.matrix based on parameters.changeMatrixMode
  // if(this.parameters.changeMatrixMode === 'modelViewMatrix') {
  if(true) {
    // if (this.parameters.smooth) {
    if(false) {
      // var sum,
      //   i, j,
      //   averages, // average values for matrix over last smoothCount
      //   exceedsAverageTolerance = 0;

      // this.smoothMatrices.push(modelViewMatrix.elements.slice()); // add latest

      // if (this.smoothMatrices.length < (this.parameters.smoothCount + 1)) {
      //   markerObject3D.matrix.copy(modelViewMatrix); // not enough for average
      // } else {
      //   this.smoothMatrices.shift(); // remove oldest entry
      //   averages = [];

      //   for (i in modelViewMatrix.elements) { // loop over entries in matrix
      //     sum = 0;
      //     for (j in this.smoothMatrices) { // calculate average for this entry
      //       sum += this.smoothMatrices[j][i];
      //     }
      //     averages[i] = sum / this.parameters.smoothCount;
      //     // check how many elements vary from the average by at least AVERAGE_MATRIX_TOLERANCE
      //     if (Math.abs(averages[i] - modelViewMatrix.elements[i]) >= this.parameters.smoothTolerance) {
      //       exceedsAverageTolerance++;
      //     }
      //   }
				
      //   // if moving (i.e. at least AVERAGE_MATRIX_THRESHOLD entries are over AVERAGE_MATRIX_TOLERANCE)
      //   if (exceedsAverageTolerance >= this.parameters.smoothThreshold) {
      //     // then update matrix values to average, otherwise, don't render to minimize jitter
      //     for (i in modelViewMatrix.elements) {
      //       modelViewMatrix.elements[i] = averages[i];
      //     }
      //     markerObject3D.matrix.copy(modelViewMatrix);
      //     renderReqd = true; // render required in animation loop
      //   }
    }
    return modelViewMatrix;
  } else {
    // markerObject3D.matrix.copy(modelViewMatrix);
    return modelViewMatrix;
  }
  // else if(this.parameters.changeMatrixMode === 'cameraTransformMatrix') {
  //   markerObject3D.matrix.getInverse(modelViewMatrix);
  // }else {
  //   console.assert(false);
  // }

  
}

let smoothingAmount = 15;
let smoothingMats = new Array(smoothingAmount);
let averageMat = new Array(16);
let smoothTolerance = .05;
let maxToleranceExceed = 10;

function addToSmoothingMats(_newMat) {

  if(averageMat[averageMat.length-1]) {
    let exceedsAverageTolerance = 0;
    for(let i=0; i<averageMat.length; i++) {
      if (Math.abs(averageMat[i] - _newMat[i]) >= smoothTolerance) {
        exceedsAverageTolerance++;
      }
    }
    if(exceedsAverageTolerance > maxToleranceExceed) {
      console.log('CHANGE TOO RAPID');
      return;
    }
  }

  smoothingMats.push(_newMat.slice());
  smoothingMats.shift();

  // if we don't have a full set of smoothing mats
  if(!smoothingMats[0]) {return;}

  for(let i=0; i<smoothingMats[0].length; i++) {
    let avg = 0;
    for(let j=0; j<smoothingMats.length; j++) {
      avg += smoothingMats[j][i];
    }
    avg /= smoothingMats.length;
    averageMat[i] = avg;
  }
}

function getSmoothedMat() {
  return averageMat.slice();
}

let trans = new Float64Array(3);

function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}

function getRotation(out, mat) {
  let scaling = new Float64Array(3);
  getScaling(scaling, mat);
  let is1 = 1 / scaling[0];
  let is2 = 1 / scaling[1];
  let is3 = 1 / scaling[2];
  let sm11 = mat[0] * is1;
  let sm12 = mat[1] * is2;
  let sm13 = mat[2] * is3;
  let sm21 = mat[4] * is1;
  let sm22 = mat[5] * is2;
  let sm23 = mat[6] * is3;
  let sm31 = mat[8] * is1;
  let sm32 = mat[9] * is2;
  let sm33 = mat[10] * is3;
  let trace = sm11 + sm22 + sm33;
  let S = 0;
  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2;
    out[3] = 0.25 * S;
    out[0] = (sm23 - sm32) / S;
    out[1] = (sm31 - sm13) / S;
    out[2] = (sm12 - sm21) / S;
  } else if ((sm11 > sm22) && (sm11 > sm33)) {
    S = Math.sqrt(1.0 + sm11 - sm22- sm33) * 2;
    out[3] = (sm23 - sm32) / S;
    out[0] = 0.25 * S;
    out[1] = (sm12 + sm21) / S;
    out[2] = (sm31 + sm13) / S;
  } else if (sm22 > sm33) {
    S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
    out[3] = (sm31 - sm13) / S;
    out[0] = (sm12 + sm21) / S;
    out[1] = 0.25 * S;
    out[2] = (sm23 + sm32) / S;
  } else {
    S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
    out[3] = (sm12 - sm21) / S;
    out[0] = (sm31 + sm13) / S;
    out[1] = (sm23 + sm32) / S;
    out[2] = 0.25 * S;
  }
  return out;
}

function getScaling(out, mat) {
  let m11 = mat[0];
  let m12 = mat[1];
  let m13 = mat[2];
  let m21 = mat[4];
  let m22 = mat[5];
  let m23 = mat[6];
  let m31 = mat[8];
  let m32 = mat[9];
  let m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
}

function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    let a01 = a[1], a02 = a[2], a03 = a[3];
    let a12 = a[6], a13 = a[7];
    let a23 = a[11];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }
}

// Another attempt to get the matrix correct
function copyMarkerMatrix(arMat, glMat) {
  glMat[0] = arMat[0] * 100;
  glMat[1] = -arMat[4] * 100;
  glMat[2] = arMat[8] * 100;
  glMat[3] = 0;
  glMat[4] = arMat[1] * 100;
  glMat[5] = -arMat[5] * 100;
  glMat[6] = arMat[9] * 100;
  glMat[7] = 0;
  glMat[8] = -arMat[2] * 100;
  glMat[9] = arMat[6] * 100;
  glMat[10] = -arMat[10] * 100;
  glMat[11] = 0;
  glMat[12] = arMat[3] * 100;
  glMat[13] = -arMat[7] * 100;
  glMat[14] = arMat[11] * 100;
  glMat[15] = 1;
}

function drawVideoFeed() {
  push();
  p5.instance._renderer.GL.disable(p5.instance._renderer.GL.DEPTH_TEST);
  p5.instance._renderer.GL.depthMask(false);
  
  // p5.instance._renderer.uMVMatrix.set(p5.Matrix.identity());

  texture(capture);
  rect(-width/2, -height/2, width, height);

  // noSticky

  p5.instance._renderer.GL.enable(p5.instance._renderer.GL.DEPTH_TEST);
  p5.instance._renderer.GL.depthMask(true);

  pop();
}


function invert(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;
  // Calculate the determinant
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return null;
  }
  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}