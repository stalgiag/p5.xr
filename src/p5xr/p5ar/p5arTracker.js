import p5ar from './p5ar';
import * as constants from '../core/constants.js';
import p5xr from '../core/p5xr';

export default class p5arTracker extends p5ar {
  constructor(patt) {
    super();
    this.trackingOptions = {
      smoothingAmount: 15,
      smoothTolerance : .05,
      maxToleranceExceed : 10
    };
    this.patt = patt;
    this.markers = [];
    this.readyForDetection = false;
    this.correctionMat = p5.Matrix.identity();
    this.makeRotationY(this.correctionMat);
    this.makeRotationZ(this.correctionMat);
  }
    
  initializeMarkerTracking() {
    this.arController = new ARController(width, height, 'camera_para.dat');
    this.arController.onload = this.arControllerLoaded.bind(this);
  }

  arControllerLoaded() {
    this.arController.loadMarker(this.patt, (uId) => {
      console.log('marker loading successful, UID = ' + uId);
      this.readyForDetection = true;
      this.markers.push({
        id: uId,
        currentMat : new Float64Array(16),
        transMat: new Float64Array(12),
        smoothingMats : new Array(this.trackingOptions.smoothingAmount),
        averageMat : p5.Matrix.identity(),
        tracker: this.arController.trackPatternMarkerId(uId, 1)
      });
    });
    // not working :-(
    // this.getProjectionMatrix();
  }

  getProjectionMatrix() {
    
    let temp = this.arController.getCameraMatrix();
    this.projectionMatrix = p5.Matrix.identity().set(
      temp[0],
      temp[1],
      temp[2],
      temp[3],
      temp[4],
      temp[5],
      temp[6],
      temp[7],
      temp[8],
      temp[9],
      temp[10],
      temp[11],
      temp[12],
      temp[13],
      temp[14],
      temp[15]
    );
    this.projectionMatrix.mult(p5.instance._renderer.uPMatrix);
    this.projectionMatrix.apply(this.correctionMat);
    
    p5.instance._renderer.uPMatrix = this.projectionMatrix;
  }
    
  startMarkerSketch() {
    // p5.instance.decrementPreload();
    createCanvas(windowWidth, windowHeight, WEBGL);
    this.capture = createCapture({
      audio: false,
      video: {
        facingMode: {
          exact: 'environment'
        }
      }
    });
    this.capture.size(width, height);
    this.capture.hide();
    this.initializeMarkerTracking();
  }


  getMarkerById(id) {
    for(let i=0; i<this.markers.length; i++) {
      if(this.markers[i].id === id) {
        return this.markers[i];
      }
    }
  }

  isMarkerVisible(id) {
    if(!this.markers[id]) {return;}
    return this.markers[id].tracker.inCurrent;
  }

  getTrackerMatrix(id) {
    if(!this.readyForDetection) {return p5.Matrix.identity();}

    const marker = this.getMarkerById(id);
    if(!marker) {return p5.Matrix.identity();}

    this.arController.getTransMatSquare(id, 1, marker.transMat);
    this.arController.transMatToGLMat(marker.transMat, marker.currentMat, 100);

    let pCurMat = p5.Matrix.identity().set(
      marker.currentMat[0],
      marker.currentMat[1],
      marker.currentMat[2],
      marker.currentMat[3],
      marker.currentMat[4],
      marker.currentMat[5],
      marker.currentMat[6],
      marker.currentMat[7],
      marker.currentMat[8],
      marker.currentMat[9],
      marker.currentMat[10],
      marker.currentMat[11],
      marker.currentMat[12],
      marker.currentMat[13],
      marker.currentMat[14],
      marker.currentMat[15]
    );

    pCurMat.mult(p5.instance._renderer.uMVMatrix);
    pCurMat.apply(this.correctionMat);
    this.makeRH(pCurMat);
    return pCurMat;
  }

  makeRH(mat) {
    // y
    // does not work :-(
    // mat.mat4[1] *= -1;
    // mat.mat4[5] *= -1;
    // mat.mat4[9] *= -1;
    // mat.mat4[13] *= -1;
    // z
    mat.mat4[2] *= -1;
    mat.mat4[6] *= -1;
    mat.mat4[10] *= -1;
    mat.mat4[14] *= -1;
  
    // 0 0 0 1
    mat.mat4[3] = 0;
    mat.mat4[7] = 0;
    mat.mat4[11] = 0;
    mat.mat4[15] = 1;
      
    return mat;
  }

  getSmoothTrackerMatrix(id) {
    if(!this.readyForDetection) {return p5.Matrix.identity();}

    const marker = this.getMarkerById(id);
    if(!marker) {return p5.Matrix.identity();}

    const cur = this.getTrackerMatrix(id);
    this.addToSmoothingMats(cur, id);
    // if there aren't enough frames for averaging
    // return the standard matrix and add it to the smoothing queu
    if(!marker.smoothingMats[marker.smoothingMats.length-1]) {
      return cur;
    } else {
      return marker.averageMat.copy();
    }
  }
    
  addToSmoothingMats(_newMat, id) {
    const marker = this.getMarkerById(id);
   
    // toss garbage frames
    if(marker.averageMat.mat4[marker.averageMat.mat4.length-1]) {
      let exceedsAverageTolerance = 0;
      for(let i=0; i<marker.averageMat.mat4.length; i++) {
        if (Math.abs(marker.averageMat.mat4[i] - _newMat[i]) >= this.trackingOptions.smoothTolerance) {
          exceedsAverageTolerance++;
        }
      }
      if(exceedsAverageTolerance > this.trackingOptions.maxToleranceExceed || !this.isMarkerVisible(id)) {
        return;
      }
    }
    // out with the old, in with the _new
    marker.smoothingMats.push(_newMat.mat4.slice());
    marker.smoothingMats.shift();
      
    // if we don't have a full set of smoothing mats
    if(!marker.smoothingMats[0]) {return;}
      
    for(let i=0; i<marker.smoothingMats[0].length; i++) {
      let avg = 0;
      for(let j=0; j<marker.smoothingMats.length; j++) {
        avg += marker.smoothingMats[j][i];
      }
      avg /= marker.smoothingMats.length;
      marker.averageMat.mat4[i] = avg;
    }
  }

  makeRotationY(mat) {
    const theta = Math.PI;
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    mat.mat4[0] = c;
    mat.mat4[2] = s;
    mat.mat4[8] = -s;
    mat.mat4[10] = c;
    return mat;
  }

  makeRotationZ(mat) {
    const theta = Math.PI;
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    mat.mat4[0] = c;
    mat.mat4[1] = -s;
    mat.mat4[4] = s;
    mat.mat4[5] = c;
    return mat;
  }
}