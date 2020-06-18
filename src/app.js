import WebXRPolyfill from 'webxr-polyfill';
import p5vr from './p5xr/p5vr/p5vr.js';
import p5ar from './p5xr/p5ar/p5ar.js';
import './p5xr/core/raycasting.js';

window.p5xr = {
  instance: null,
};

function polyfillIfRequired() {
  if (!('xr' in window.navigator)) {
    window.injectedPolyfill = true;
    window.polyfill = new WebXRPolyfill();
  } else {
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
p5.prototype.createVRCanvas = function () {
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
p5.prototype.createARCanvas = function () {
  noLoop();
  p5xr.instance = new p5ar();
  p5xr.instance.init();
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
p5.prototype.setVRBackgroundColor = function (r, g, b) {
  p5xr.instance.curClearColor = color(r, g, b);
};

p5.prototype.surroundTexture = function (tex) {
  push();
  texture(tex);
  scale(-1, 1, 1);
  sphere(300, 60, 40);
  pop();
};

p5.prototype.createAnchor = function (vec) {
  if (p5xr.instance.isVR) {
    return;
  }
  return p5xr.instance.createAnchor(vec);
};

p5.prototype.detectHit = function (ev) {
  if (p5xr.instance.isVR) {
    return;
  }
  return p5xr.instance.detectHit(ev);
};
