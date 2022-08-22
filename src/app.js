import p5vr from './p5xr/p5vr/p5vr';
import p5ar from './p5xr/p5ar/p5ar';
import './p5xr/core/raycasting';

window.p5xr = {
  instance: null,
};

/**
 * This file contains all functions that extend the p5 prototype.
 * Sections are currently designated by #region and #endregion
 * If this file grows longer in the future it can be broken up into
 * separate files.
 */

// #region Initialization

/**
 * starts the process of creating a VR-ready canvas
 * This actually just creates a button that will set into motion
 * the creation of a VR canvas and creates a new p5vr object.
 * This should be called in `preload()` so
 * that the entire sketch can wait to start until the user has "entered VR"
 * via a button click gesture
 * @method createVRCanvas
 * @section VR
 * @category Initialization
 */
p5.prototype.createVRCanvas = function () {
  noLoop();
  p5xr.instance = new p5vr();
  p5xr.instance.initVR();
};

/**
 * **AR IS LARGELY UNTESTED AND EXPERIMENTAL**
 * This creates a button that will create a AR canvas and new p5ar object
 * on click.
 * This should be called in `preload()` so
 * that the entire sketch can wait to start until the user has "entered AR"
 * via a button click gesture/
 * @method createARCanvas
 * @section AR
 * @category Initialization
 */
p5.prototype.createARCanvas = function () {
  noLoop();
  p5xr.instance = new p5ar();
  p5xr.instance.initAR();
};

// #endregion

// #region Background
/**
 * Sets the clear color for VR-Mode. <br><br>
 * This has to happen separately from calls to background
 * to avoid clearing between drawing the eyes
 * @method setVRBackgroundColor
 * @param  {Number} r red value of background
 * @param  {Number} g green value of background
 * @param  {Number} b blue value of background
 * @section VR
 * @category Background
 */
p5.prototype.setVRBackgroundColor = function (r, g, b) {
  p5xr.instance.curClearColor = color(r, g, b);
};

/**
 * Creates a 360 degree texture around the current sketch using the supplied image.
 * @param {p5.Image} tex The texture to be used for the background
 * @section VR
 * @category Background
 */
p5.prototype.surroundTexture = function (tex) {
  push();
  texture(tex);
  rotateX(PI);
  scale(-1, 1, 1);
  sphere(300, 60, 40);
  pop();
};

// #endregion

// #region Anchors

/**
 * **AR IS LARGELY UNTESTED AND EXPERIMENTAL**
 * @param {p5.Vector} vec Vector for the AR real-world hit position
 * @returns p5.Anchor object with anchor position and orientation
 * @section AR
 */
p5.prototype.createAnchor = function (vec) {
  if (p5xr.instance.isVR) {
    return;
  }
  return p5xr.instance.createAnchor(vec);
};

/**
 * @ignore
 */
p5.prototype.detectHit = function (ev) {
  if (p5xr.instance.isVR) {
    return;
  }
  return p5xr.instance.detectHit(ev);
};

// #endregion

// #region Input

/**
 * Get an XR input source for the given input source id.
 * @param {String} input The name of the input to access, typically 'left' or 'right'
 * @returns {p5XRInput} The input object
 * @category Input
 */
p5.prototype.getXRInput = function (input) {
  if (p5xr.instance.xrSession.inputSources.length === 0) {
    return;
  }
  return p5xr.instance.getXRInput(input);
};

// #endregion

// #region View

/**
 * Sets the position of the viewer
 * @param {*} targetX The target x position of the viewer
 * @param {*} targetY The target y position of the viewer
 * @param {*} targetZ The target z position of the viewer
 * @method setViewerPosition
 * @category View
 */
p5.prototype.setViewerPosition = function (x, y, z) {
  const { viewer } = p5xr.instance;
  viewer.setPosition(x, y, z);
};

/**
 * All calls after sticky() and before noSticky() will move with the view.
 * @param {Boolean} drawOnTop If true, all calls after this will be drawn on top of everything else
 * @method sticky
 * @category View
 */
p5.prototype.sticky = function (drawOnTop = false) {
  push();
  p5xr.instance.viewer.drawOnTop = drawOnTop;
  if (drawOnTop) p5.instance._renderer.GL.disable(p5.instance._renderer.GL.DEPTH_TEST);
  p5.instance._renderer.uMVMatrix.set(p5.Matrix.identity());
  const viewerPosition = p5xr.instance.viewer.position;
  setViewerPosition(viewerPosition.x, viewerPosition.y, viewerPosition.z);
};

/**
 * All calls after sticky() and before noSticky() will move with the view.
 * @method noSticky
 * @category View
 */
p5.prototype.noSticky = function () {
  p5.instance._renderer.GL.enable(p5.instance._renderer.GL.DEPTH_TEST);
  pop();
};

// #endregion
