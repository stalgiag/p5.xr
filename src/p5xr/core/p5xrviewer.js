export default class p5xrViewer {
  constructor() {
    this._pose = null;
    this._view = null;
    this.poseMatrix = new p5.Matrix();
    this.initialMVMatrix = new p5.Matrix();
    this.leftPMatrix = new p5.Matrix();
    this.rightPMatrix = new p5.Matrix();

    this.setPosition = function(x, y, z) {
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

  set view(newView) {
    this._view = newView;
    if(p5xr.instance.injectedPolyfill) {
      p5.instance._renderer.uMVMatrix.set(this._pose.getViewMatrix(this._view));
      p5.instance._renderer.uPMatrix.set(this._view.projectionMatrix);
      this.initialMVMatrix.set(p5.instance._renderer.uMVMatrix.copy());
    } else {
      p5.instance._renderer.uMVMatrix.set(this._view.transform.inverse.matrix);
      p5.instance._renderer.uPMatrix.set(this._view.projectionMatrix);
    }
    if(newView.eye === 'left') {
      this.leftPMatrix.set(p5.instance._renderer.uPMatrix.copy());
    }
    else {
      this.rightPMatrix.set(p5.instance._renderer.uPMatrix.copy());
    }
  }

  get view() {
    return this._view;
  }
}

p5.prototype.setViewerPosition = function(x, y, z) {
  let viewer = p5xr.instance.viewer;
  viewer.setPosition(x, y, z);
};
