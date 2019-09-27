import p5ar from './p5ar';
import * as constants from '../core/constants.js';
import p5xr from '../core/p5xr';

export default class p5arTracker extends p5ar {
  constructor() {
    super();
    this.trackingOptions = {
      smoothingAmount: 15,
      smoothTolerance : .05,
      maxToleranceExceed : 10
    };
    this.markers = [];
    this.readyForDetection = false;
  }
    
  initializeMarkerTracking() {
    this.arController = new ARController(640, 480, 'camera_para.dat');
    this.arController.onload = this.arControllerLoaded.bind(this);
  }

  arControllerLoaded() {
    this.arController.loadMarker('./patt.hiro', (uId) => {
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
  }
    
  startMarkerSketch() {
    // p5.instance.decrementPreload();
    createCanvas(640, 480, WEBGL);
    this.capture = createCapture(VIDEO);
    this.capture.size(640, 480);
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

    let normalized = pCurMat.copy().mult(p5.instance._renderer.uMVMatrix);

    let res = normalized.copy();
    return res;
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
}