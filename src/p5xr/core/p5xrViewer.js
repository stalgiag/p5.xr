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
    this.poseMatrix.set(newPose.transform.matrix);
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
    const renderer = p5.instance._renderer;

    if (renderer.uViewMatrix) {
      renderer.uViewMatrix.mat4 = this._view.transform.inverse.matrix;
    }

    // has not effect in v1.10.0, but kept for older version
    renderer.uMVMatrix.mat4 = this._view.transform.inverse.matrix;
    renderer.uPMatrix.mat4 = this._view.projectionMatrix;

    renderer._curCamera.cameraMatrix.mat4 = this._view.transform.inverse.matrix;

    if (newView.eye === 'left') {
      this.leftPMatrix.set(p5.instance._renderer.uPMatrix.copy());
    } else {
      this.rightPMatrix.set(p5.instance._renderer.uPMatrix.copy());
    }
  }

  get view() {
    return this._view;
  }

  /**
   * Get a ray object from a viewer for a given screen coordinate.
   * Used for raycasting.
   * @param {Number} screenX Screen X position to use for ray origin
   * @param {Number} screenY Screen Y position to use for ray origin
   * @returns {Ray} Ray from viewer position to screen position, {origin, direction}
   */
  getRayFromScreen(screenX, screenY) {
    const ray = {
      origin: new p5.Vector(0, 0, 0),
      direction: new p5.Vector(),
    };

    let poseMatrix = this.poseMatrix.copy();
    poseMatrix.transpose(poseMatrix);
    poseMatrix = poseMatrix.mat4;

    // set origin of ray to pose position
    ray.origin.x = poseMatrix[3];
    ray.origin.y = poseMatrix[7];
    ray.origin.z = poseMatrix[11];

    let initialMVMatrix = this.initialMVMatrix.copy();
    initialMVMatrix.transpose(initialMVMatrix);
    initialMVMatrix = initialMVMatrix.mat4;

    // transform ray origin to view space
    const rayOriginCopy = ray.origin.copy();
    ray.origin.x =
      initialMVMatrix[0] * rayOriginCopy.x +
      initialMVMatrix[1] * rayOriginCopy.y +
      initialMVMatrix[2] * rayOriginCopy.z +
      initialMVMatrix[3];
    ray.origin.y =
      initialMVMatrix[4] * rayOriginCopy.x +
      initialMVMatrix[5] * rayOriginCopy.y +
      initialMVMatrix[6] * rayOriginCopy.z +
      initialMVMatrix[7];
    ray.origin.z =
      initialMVMatrix[8] * rayOriginCopy.x +
      initialMVMatrix[9] * rayOriginCopy.y +
      initialMVMatrix[10] * rayOriginCopy.z +
      initialMVMatrix[11];

    // get ray direction from left eye
    const leftDirection = new p5.Vector(screenX, screenY, -1);

    let leftPMatrixInverse = new p5.Matrix();
    leftPMatrixInverse.invert(this.leftPMatrix.copy());
    leftPMatrixInverse.transpose(leftPMatrixInverse);
    leftPMatrixInverse = leftPMatrixInverse.mat4;

    const leftDirectionCopy = leftDirection.copy();
    leftDirection.x =
      leftPMatrixInverse[0] * leftDirectionCopy.x +
      leftPMatrixInverse[1] * leftDirectionCopy.y +
      leftPMatrixInverse[2] * leftDirectionCopy.z;
    leftDirection.y =
      leftPMatrixInverse[4] * leftDirectionCopy.x +
      leftPMatrixInverse[5] * leftDirectionCopy.y +
      leftPMatrixInverse[6] * leftDirectionCopy.z;
    leftDirection.normalize();

    // get ray direction from right eye
    const rightDirection = new p5.Vector(screenX, screenY, -1);

    let rightPMatrixInverse = new p5.Matrix();
    rightPMatrixInverse.invert(this.rightPMatrix.copy());
    rightPMatrixInverse.transpose(rightPMatrixInverse);
    rightPMatrixInverse = rightPMatrixInverse.mat4;

    const rightDirectionCopy = rightDirection.copy();
    rightDirection.x =
      rightPMatrixInverse[0] * rightDirectionCopy.x +
      rightPMatrixInverse[1] * rightDirectionCopy.y +
      rightPMatrixInverse[2] * rightDirectionCopy.z;
    rightDirection.y =
      rightPMatrixInverse[4] * rightDirectionCopy.x +
      rightPMatrixInverse[5] * rightDirectionCopy.y +
      rightPMatrixInverse[6] * rightDirectionCopy.z;
    rightDirection.normalize();

    // combine both ray directions
    ray.direction = p5.Vector.add(leftDirection, rightDirection).normalize();

    return ray;
  }
}

export default p5xrViewer;
