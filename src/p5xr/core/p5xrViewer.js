/**
 * @class p5xrViewer
 * Class that contains state of current viewer position and view. The view and pose matrices
 * are updated automatically but can be accessed directly. For most use cases, the viewer position
 * should be modified using the setViewerPosition function.
 * @category View
 */
class p5xrViewer {
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

  /**
   * @type {p5.Matrix}
   * Pose matrix
   */
  set pose(newPose) {
    this._pose = newPose;
    this.poseMatrix.set(newPose.poseModelMatrix);
  }

  get pose() {
    return this._pose;
  }

  /**
   * @type {p5.Matrix}
   * View matrix
   */
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

export default p5xrViewer;
