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
  constructor(inputSource) {
    this._inputSource = inputSource;
    this._pose;
    this.gamepad = inputSource.gamepad;
  }

  /** @returns {Float32Array} Returns the current 4x4 pose matrix */
  get pose() {
    this.updatePose();
    return this._pose.transform.matrix;
  }

  /** @returns {p5.Vector} Returns the current position as a Vector */
  get position() {
    this.updatePose();
    const p = this._pose.transform.position;
    return new p5.Vector(p.x, p.y, p.z);
  }

  /** Retrieves the latest XRPose from the current XRFrame */
  updatePose() {
    this._pose = window.p5xr.instance.frame.getPose(this._inputSource.gripSpace, window.p5xr.instance.xrRefSpace);
  }

  /** @returns {GamepadButton} Returns a GamepadButton object corresponding to the controller's trigger button */
  get trigger() {
    this.updateGamepad();
    return this.gamepad.buttons[0];
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
