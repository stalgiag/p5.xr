import { lineVert, lineFrag } from '../shaders/lineShader';
import compareVersions from '../utilities/versionComparator';

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
