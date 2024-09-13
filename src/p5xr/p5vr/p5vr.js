import { quat } from 'gl-matrix';
import p5xr from '../core/p5xr';

/**
 * p5vr class holds all state and methods that are specific to VR
 * @class
 * @private
 * @constructor
 * @ignore
 */

export default class p5vr extends p5xr {
  constructor() {
    super();
    this.mode = 'immersive-vr';
    this.displayMode = 'VR';
    this.isVR = true;
    this.lookYaw = 0;
    this.lookPitch = 0;
    this.LOOK_SPEED = 0.0025;
    // Keep track of touch-related state so that users can touch and drag on
    // the canvas to adjust the viewer pose in an inline session.
    this.primaryTouch = undefined;
    this.prevTouchX = undefined;
    this.prevTouchY = undefined;
    if (navigator?.xr) {
      navigator.xr.requestSession('inline').then(this.__startSketch.bind(this));
    }
    this.__createButton();
  }

  /**
   * This is where the actual p5 canvas is first created, and
   * the GL rendering context is accessed by p5vr.
   * The current XRSession also gets a frame of reference and
   * base rendering layer. <br>
   * @param {XRSession}
   * @private
   * @ignore
   */
  __startSketch(session) {
    super.__startSketch(session);
  }

  /**
   * clears the background based on the current clear color (`curClearColor`)
   * @private
   * @ignore
   */
  clearVR() {
    if (this.curClearColor === null) {
      return;
    }
    p5.instance.background(this.curClearColor);

    this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
  }

  /**
   * Returns a new reference space modified by the inline session's viewer pose.
   * @param {XRReferenceSpace} refSpace Reference space adjusted for user's current pose
   * @returns {XRReferenceSpace} Referennce space adjusted by inline view's current pose   * @private
   * @ignore
   */
  getAdjustedRefSpace(refSpace) {
    // Represent the rotational component of the reference space as a
    // quaternion.
    // TODO: Add rotation ability to xrViewer
    const invOrientation = quat.create();
    quat.rotateX(invOrientation, invOrientation, -this.lookPitch);
    quat.rotateY(invOrientation, invOrientation, -this.lookYaw);
    const xform = new XRRigidTransform(
      { x: 0, y: 0, z: 0 },
      {
        x: invOrientation[0],
        y: invOrientation[1],
        z: invOrientation[2],
        w: invOrientation[3],
      },
    );
    return refSpace.getOffsetReferenceSpace(xform);
  }

  /**
   * Modifies the view of an inline session, called by mouse events.
   * @param {Number} dx view yaw change in radians
   * @param {Numbers} dy view pitch change in radians
   * @private
   * @ignore
   */
  rotateInlineView(dx, dy) {
    this.lookYaw += dx * this.LOOK_SPEED;
    this.lookPitch += dy * this.LOOK_SPEED;
    if (this.lookPitch < -Math.PI * 0.5) this.lookPitch = -Math.PI * 0.5;
    if (this.lookPitch > Math.PI * 0.5) this.lookPitch = Math.PI * 0.5;
  }

  // Make the canvas listen for mouse and touch events so that we can
  // adjust the viewer pose accordingly in inline sessions.
  /**
   * Adds event listeners to the canvas to allow for user interaction with the canvas during
   * inline sessions.
   * @private
   * @ignore
   */
  addInlineViewListeners() {
    this.canvas.addEventListener('mousemove', (event) => {
      // Only rotate when the right button is pressed
      if (event.buttons && 2) {
        this.rotateInlineView(event.movementX, event.movementY);
      }
    });

    // Keep track of all active touches, but only use the first touch to
    // adjust the viewer pose.
    this.canvas.addEventListener('touchstart', (event) => {
      if (this.primaryTouch === undefined) {
        const touch = event.changedTouches[0];
        this.primaryTouch = touch.identifier;
        this.prevTouchX = touch.pageX;
        this.prevTouchY = touch.pageY;
      }
    });

    // Update the set of active touches now that one or more touches
    // finished. If the primary touch just finished, update the viewer pose
    // based on the final touch movement.
    this.canvas.addEventListener('touchend', (event) => {
      for (const touch of event.changedTouches) {
        if (this.primaryTouch === touch.identifier) {
          this.primaryTouch = undefined;
          this.rotateInlineView(
            touch.pageX - this.prevTouchX,
            touch.pageY - this.prevTouchY,
          );
        }
      }
    });

    // Update the set of active touches now that one or more touches was
    // cancelled. Don't update the viewer pose when the primary touch was
    // cancelled.
    this.canvas.addEventListener('touchcancel', (event) => {
      for (const touch of event.changedTouches) {
        if (this.primaryTouch === touch.identifier) {
          this.primaryTouch = undefined;
        }
      }
    });

    // Only use the delta between the most recent and previous events for
    // the primary touch. Ignore the other touches.
    this.canvas.addEventListener('touchmove', (event) => {
      for (const touch of event.changedTouches) {
        if (this.primaryTouch === touch.identifier) {
          this.rotateInlineView(
            touch.pageX - this.prevTouchX,
            touch.pageY - this.prevTouchY,
          );
          this.prevTouchX = touch.pageX;
          this.prevTouchY = touch.pageY;
        }
      }
    });
  }
}
