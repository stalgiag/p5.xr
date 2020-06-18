export default class p5xrViewer {
  constructor() {
    this._pose = null;
    this._view = null;
    this.poseMatrix = new p5.Matrix();
    this.initialMVMatrix = new p5.Matrix();
    this.leftPMatrix = new p5.Matrix();
    this.rightPMatrix = new p5.Matrix();

    this.position = new p5.Vector(0, 0, 0);

    this.setPosition = function (x, y, z) {
      this.position.set(x, y, z);
      p5.instance._renderer.translate(-x, -y, -z);
    };
  }

  set pose(newPose) {
    this._pose = newPose;
    this.poseMatrix.set(newPose.poseModelMatrix);
  }

  get pose() {
    return this._pose;
  }

  // TODO: set matrices for non polyfill
  set view(newView) {
    this._view = newView;
    p5.instance._renderer.uMVMatrix.set(this._view.transform.inverse.matrix);
    p5.instance._renderer.uPMatrix.set(this._view.projectionMatrix);
    p5.instance._renderer._curCamera.cameraMatrix.set(
      p5.Matrix.identity().mult(this._view.transform.inverse.matrix),
    );

    if (newView.eye === 'left') {
      this.leftPMatrix.set(p5.instance._renderer.uPMatrix.copy());
    } else {
      this.rightPMatrix.set(p5.instance._renderer.uPMatrix.copy());
    }
  }

  get view() {
    return this._view;
  }
}

p5.prototype.setViewerPosition = function (x, y, z) {
  const { viewer } = p5xr.instance;
  viewer.setPosition(x, y, z);
};

p5.prototype.sticky = function (drawOnTop = false) {
  push();
  p5xr.instance.viewer.drawOnTop = drawOnTop;
  if (drawOnTop) p5.instance._renderer.GL.disable(p5.instance._renderer.GL.DEPTH_TEST);
  p5.instance._renderer.uMVMatrix.set(p5.Matrix.identity());
  const viewerPosition = p5xr.instance.viewer.position;
  setViewerPosition(viewerPosition.x, viewerPosition.y, viewerPosition.z);
};

p5.prototype.noSticky = function () {
  p5.instance._renderer.GL.enable(p5.instance._renderer.GL.DEPTH_TEST);
  pop();
};
