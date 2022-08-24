import { mat3, vec3 } from 'gl-matrix';
import Quaternion from 'quaternion';

/**
 * p5xrInput holds all state and methods related to XR device input
 * @class
 */
export default class p5xrInput {
  /**
   * Represents the input data of the device
   * @constructor
   * @param {XRInputSource} inputSource The input source of the XR device
   */
  constructor(inputSource, frame, refSpace) {
    this._inputSource = inputSource;
    this._targetRayPose = frame.getPose(this._inputSource.targetRaySpace, refSpace);
    this._pose = undefined;
    this.gamepad = inputSource.gamepad;
    this._dir = vec3.create();
    const normalMat = mat3.create();
    const origin = vec3.create();
    this._dir[2] = -1.0;

    if (this._targetRayPose) {
      vec3.transformMat4(origin, origin, this._targetRayPose.transform.matrix);
      mat3.fromMat4(normalMat, this._targetRayPose.transform.matrix);
      vec3.transformMat3(this._dir, this._dir, normalMat);
    }
    this.direction = this._dir;
    // console.log(p5.instance.angleMode);
  }

  /** @returns {p5.Vector} Returns the current forward direction */
  get direction() {
    return new p5.Vector(this._dir[0], this._dir[1], this._dir[2]);
  }

  set direction(value) {
    this._dir = vec3.copy(this._dir, value);
    vec3.normalize(this._dir, this._dir);

    this.inv_dir = vec3.fromValues(
      1.0 / this._dir[0],
      1.0 / this._dir[1],
      1.0 / this._dir[2],
    );

    this.sign = [
      (this.inv_dir[0] < 0) ? 1 : 0,
      (this.inv_dir[1] < 0) ? 1 : 0,
      (this.inv_dir[2] < 0) ? 1 : 0,
    ];
  }

  /** @returns {Float32Array} Returns the current 4x4 pose matrix */
  get pose() {
    this.updatePose();
    return this._pose.transform.matrix;
  }

  /** @returns {p5.Vector} Returns the current position as a Vector */
  get position() {
    this.updatePose();
    const p = this._pose?.transform?.position;
    return new p5.Vector(p.x, p.y, p.z);
  }
  /** @returns {p5.Vector} Returns the current rotation as a Vector */
  get rotation() {
    this.updatePose();
    if (this._pose){
      const {x, y, z, w} = this._pose?.transform?.orientation;
      let q = new Quaternion(x, y, z, w);
      let e = q.toEuler();
      let c = (p5.instance.angleMode == RADIANS)? 1 : 180 / Math.PI; // TODO: Change output with ANGLE MODE
      return new p5.Vector( -e.yaw * c, e.pitch * c, -e.roll * c  );
    }
    return new p5.Vector(0, 0, 0);
  }

  /** Retrieves the latest XRPose from the current XRFrame */
  updatePose() {
    this._pose = window.p5xr.instance.frame.getPose(this._inputSource.gripSpace, window.p5xr.instance.xrRefSpace);
  }

  /** @returns {GamepadButton} Returns a GamepadButton object corresponding to the controller's trigger button */
  get trigger() {
    this.updateGamepad();
    return this.gamepad?.buttons[0];
  }

  /** @returns {GamepadButton} Returns a GamepadButton object corresponding to the controller's grip button */
  get grip() {
    this.updateGamepad();
    return this.gamepad.buttons[1];
  }

  /** @returns {GamepadButton} Returns a GamepadButton object corresponding to the controller's touchpad button */
  get touchpad() {
    this.updateGamepad();
    return this.gamepad.buttons[2];
  }

  /** @returns {GamepadButton} Returns a GamepadButton object corresponding to the controller's thumbstick button */
  get thumbstick() {
    this.updateGamepad();
    return this.gamepad.buttons[3];
  }

  /** @returns {p5.Vector} Returns a Vector with the touchpad's X and Y values */
  get touchpad2D() {
    this.updateGamepad();
    return new p5.Vector(this.gamepad.axes[0], this.gamepad.axes[1]);
  }

  /** @returns {p5.Vector} Returns a Vector with the thumbstick's X and Y values */
  get thumbstick2D() {
    this.updateGamepad();
    return new p5.Vector(this.gamepad.axes[2], this.gamepad.axes[3]);
  }

  /** Retrieves the latest Gamepad from the XRInputSource */
  updateGamepad() {
    this.gamepad = this._inputSource.gamepad;
  }
}
