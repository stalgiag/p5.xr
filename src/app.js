import './../jsartoolkit/artoolkit.api.js';
import WebXRPolyfill from 'webxr-polyfill';
import WebXRVersionShim from './webxr/webxr-version-shim';
import p5vr from '../src/p5xr/p5vr/p5vr.js';
import p5ar from '../src/p5xr/p5ar/p5ar.js';
import p5arTracker from '../src/p5xr/p5ar/p5arTracker.js';
import * as constants from '../src/p5xr/core/constants.js';
import './p5xr/core/raycasting.js';

window.p5xr = {
  instance: null
};

// attach constants to p5
for (const k in constants) {
  p5.prototype[k] = constants[k];
}

function polyfillIfRequired() {
  if(!navigator.xr) {
    window.injectedPolyfill = true;
    window.polyfill = new WebXRPolyfill();
    window.versionShim = new WebXRVersionShim();
  }
  else {
    window.injectedPolyfill = false;
  }
}

polyfillIfRequired();

/**
 * starts the process of creating a VR-ready canvas
 * This actually just creates a button that will set into motion
 * the creation of a VR canvas and creates a new p5vr object.
 *  This should be called in `preload()` so
 * that the entire sketch can wait to start until the user has "entered VR"
 * via a button click gesture
 * @method createVRCanvas
 */
p5.prototype.createVRCanvas = function() {
  noLoop();
  p5xr.instance = new p5vr();
  p5xr.instance.initVR();
};

/**
 * starts the process of creating a VR-ready canvas
 * This actually just creates a button that will set into motion
 * the creation of a AR canvas and creates a new p5ar object.
 * This should be called in `preload()` so
 * that the entire sketch can wait to start until the user has "entered AR"
 * via a button click gesture
 * @method createARCanvas
 */
p5.prototype.createARCanvas = function(mode, patt) {
  if(mode === constants.MARKER) {
    if(typeof patt === 'undefined') {
      throw new Error('Cannot start a marker-based AR session without a .patt file.')
    } else {
      p5xr.instance = new p5arTracker(patt);
      p5xr.instance.startMarkerSketch();
    }
  } else {
    noLoop();
    p5xr.instance = new p5ar();
    p5xr.instance.init();
  }
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
p5.prototype.setVRBackgroundColor = function(r, g, b) {
  p5xr.instance.curClearColor = color(r, g, b);
};

p5.prototype.processForMarker = function(input) {
  if(!p5xr.instance.readyForDetection) {return;}
  // currently only works with p5.MediaElement
  // TODO add conditions and checks to operate with other types
  p5xr.instance.arController.process(p5xr.instance.capture.elt);
};

p5.prototype.getTrackerMatrix = function(id) {
  return p5xr.instance.getTrackerMatrix(id);
};

p5.prototype.getSmoothTrackerMatrix = function(id) {
  return p5xr.instance.getSmoothTrackerMatrix(id);
};

p5.prototype.showVideoFeed = function() {
  push();
  this._renderer.GL.disable(this._renderer.GL.DEPTH_TEST);
  this._renderer.GL.depthMask(false);
  
  texture(p5xr.instance.capture);
  rect(-width/2, -height/2, width, height);

  this._renderer.GL.enable(this._renderer.GL.DEPTH_TEST);
  this._renderer.GL.depthMask(true);
  pop();
};

p5.prototype.isMarkerVisible = function(id) {
  return p5xr.instance.isMarkerVisible(id);
};

p5.prototype.getMarkerById = function(id) {
  return p5xr.instance.getMarkerById(id);
};