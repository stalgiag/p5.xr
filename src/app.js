
import p5vr from '../src/p5xr/p5vr/p5vr.js';
import p5ar from '../src/p5xr/p5ar/p5ar.js';

window.p5xr = {
  instance: null
};

/**
 * starts the process of creating a VR-ready canvas
 * This actually just creates a button that will set into motion
 * the creation of a VR canvas and creates a new p5vr object.
 *  This should be called in `preload()` so
 * that the entire sketch can wait to start until the user has "entered VR"
 * via a button click gesture
 * @method createVRCanvas
 */
p5.prototype.createVRCanvas = function (){
  noLoop();
  p5xr.instance = new p5vr();
  p5xr.instance.initVR();
};

/**
 * Sets the clear color for VR-Mode. <br><br>
 * This has to happen separately from calls to background
 * to avoid clearing between drawing the eyes
 * @method setVRBackgroundColor
 * @param  {Number} r red value of background
 * @param  {Number} g green value of background
 * @param  {Number} b blue value of background
 */
p5.prototype.setVRBackgroundColor = function(r, g, b){
  p5xr.instance.curClearColor = color(r, g, b);
};

/**
 * starts the process of creating a VR-ready canvas
 * This actually just creates a button that will set into motion
 * the creation of a AR canvas and creates a new p5ar object.
 *  This should be called in `preload()` so
 * that the entire sketch can wait to start until the user has "entered AR"
 * via a button click gesture
 * @method createARCanvas
 */
p5.prototype.createARCanvas = function (){
  noLoop();
  p5xr.instance = new p5ar();
  p5xr.instance.initAR();
};

p5.RendererGL.prototype._update = function (){
  /* TODO: Make a diff function to avoid overwriting this function */
  /* IE: Override the resetting of cameraMatrices in _update */
  /*
    /*
    /*
    /*
    /*
    */

  // reset model view and apply initial camera transform
  // (containing only look at info; no projection).
  // this.uMVMatrix.set(
  //   this._curCamera.cameraMatrix.mat4[0],
  //   this._curCamera.cameraMatrix.mat4[1],
  //   this._curCamera.cameraMatrix.mat4[2],
  //   this._curCamera.cameraMatrix.mat4[3],
  //   this._curCamera.cameraMatrix.mat4[4],
  //   this._curCamera.cameraMatrix.mat4[5],
  //   this._curCamera.cameraMatrix.mat4[6],
  //   this._curCamera.cameraMatrix.mat4[7],
  //   this._curCamera.cameraMatrix.mat4[8],
  //   this._curCamera.cameraMatrix.mat4[9],
  //   this._curCamera.cameraMatrix.mat4[10],
  //   this._curCamera.cameraMatrix.mat4[11],
  //   this._curCamera.cameraMatrix.mat4[12],
  //   this._curCamera.cameraMatrix.mat4[13],
  //   this._curCamera.cameraMatrix.mat4[14],
  //   this._curCamera.cameraMatrix.mat4[15]
  // );
  // p5.instance._renderer.uMVMatrix.set(viewMat);
  // p5.instance._renderer.uPMatrix.set(projMat);
  // reset light data for new frame.

  /*
    /*
    /*
    /*
    /*
    */
  /* TODO: Make different function to avoid overwriting this function */
  /* IE: Override the resetting of cameraMatrices in _update */

  this.ambientLightColors.length = 0;
  this.directionalLightDirections.length = 0;
  this.directionalLightColors.length = 0;

  this.pointLightPositions.length = 0;
  this.pointLightColors.length = 0;
};