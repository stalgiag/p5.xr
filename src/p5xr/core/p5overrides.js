import * as constants from './constants';
import p5vr from '../p5vr/p5vr';
import p5ar from '../p5ar/p5ar';

import { lineVert, lineFrag } from '../shaders/lineShader';
import compareVersions from '../utilities/versionComparator';

/**
 * @method  Overridden createCanvas function to handle different rendering modes: AR, VR, and default renderers.
 * @param  {Number} [w]
 * @param  {Number} [h]
 * @param {string} renderer - The rendering mode. Possible values:
   - P2D: 2D rendering context (default in p5.js)
   - WEBGL: 3D rendering context
   - AR: Augmented Reality mode (sets the renderer to WEBGL internally)
   - VR: Virtual Reality mode (sets the renderer to WEBGL internally)
 * @param  {HTMLCanvasElement} [canvas]
 * @return {p5.Renderer}
 */

const originalCreateCanvas = p5.prototype.createCanvas;
p5.prototype.createCanvas = function (w, h, renderer, canvas) {
  let effectiveRenderer = renderer;
  const isXRNoUserAction =
    renderer === constants.AR || renderer === constants.VR;
  const isXRUserAction =
    renderer === constants.AR_BUTTON || renderer === constants.VR_BUTTON;
  if (isXRUserAction || isXRNoUserAction) {
    noLoop();
    p5xr.instance =
      renderer === constants.AR || renderer === constants.AR_BUTTON
        ? new p5ar()
        : new p5vr();
    effectiveRenderer = WEBGL;
    w = windowWidth;
    h = windowHeight;
    if (isXRNoUserAction) {
      p5xr.instance.startXRWithoutUserAction();
    }
  }
  originalCreateCanvas.call(
    this,
    windowWidth,
    windowHeight,
    effectiveRenderer,
    canvas,
  );
};

/**
 * Override default p5 background to take viewport into account
 * Important for stereo rendering
 * @ignore
 */
const originalBackground = p5.prototype.background;
p5.prototype.background = function (...args) {
  const gl = this._renderer.GL;
  const viewport = this._renderer._viewport;
  gl.scissor(viewport[0], viewport[1], viewport[2], viewport[3]);
  gl.enable(gl.SCISSOR_TEST);
  originalBackground.call(this, ...args);
  gl.disable(gl.SCISSOR_TEST);
  return this;
};

/**
 * Override default p5 line shader to avoid issue in v1.10.0
 * https://github.com/processing/p5.js/issues/7200
 * @private
 * @ignore
 */
const overrideLineVertShader = compareVersions(p5.VERSION, '1.10.0') >= 0;
if (overrideLineVertShader) {
  console.log('p5.xr: overriding p5 v1.10.x line vert shader for v1.9.4');
  p5.RendererGL.prototype._getLineShader = function () {
    if (!this._customLineShader) {
      this._customLineShader = new p5.Shader(
        this,
        this._webGL2CompatibilityPrefix('vert', 'mediump') + lineVert,
        this._webGL2CompatibilityPrefix('frag', 'mediump') + lineFrag,
      );
    }

    return this._customLineShader;
  };
}

const overrideMatrixCopy = compareVersions(p5.VERSION, '1.9.2') >= 0;
if (overrideMatrixCopy) {
  console.log(
    'p5.xr: Overriding camera copy so linePerspective works with push pop',
  );
  const originalCopy = p5.Camera.prototype.copy;

  p5.Camera.prototype.copy = function () {
    const copiedCamera = originalCopy.call(this);
    copiedCamera.useLinePerspective = this.useLinePerspective;
    return copiedCamera;
  };

  const originalSet = p5.Camera.prototype.set;
  p5.Camera.prototype.set = function (cam) {
    originalSet.call(this, cam);
    this.useLinePerspective = cam.useLinePerspective;
    return this;
  };
}
