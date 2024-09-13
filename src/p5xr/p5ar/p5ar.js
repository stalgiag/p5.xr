import p5xr from '../core/p5xr';
import ARAnchor from './ARAnchor';

export default class p5ar extends p5xr {
  constructor() {
    super({
      requiredFeatures: ['local', 'hit-test'],
    });
    this.mode = 'immersive-ar';
    this.displayMode = 'AR';
    this.canvas = null;
    this.__createButton();
  }

  //* ********************************************************//
  //* *********ARCORE and ARKIT BASED AR BELOW****************//
  //* ********************************************************//

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

    if (typeof touchStarted === 'function') {
      this.xrSession.addEventListener('select', touchStarted);
    }
  }

  /**
   *
   * @param {InputEvent} ev
   * @private
   * @ignore
   */
  __onSelect(ev) {
    const context = window;
    const userMousePressed = context.mousePressed;
    if (typeof userMousePressed === 'function') {
      userMousePressed(ev);
    }
  }

  /**
   *
   * @param {InputEvent} ev
   * @returns {p5.Vector}
   * @private
   * @ignore
   */
  __detectHit(ev) {
    if (ev === null || typeof ev === 'undefined') {
      console.warn('You must pass the touchStarted event to detectHit.');
      return null;
    }

    if (!this.xrSession) {
      return null;
    }

    if (this.xrHitTestSource && this.viewer.pose && this.frame) {
      const hitTestResults = this.frame.getHitTestResults(this.xrHitTestSource);
      if (hitTestResults.length > 0) {
        // const pose = hitTestResults[0].getPose(ev.inputSource.targetRaySpace, this.xrRefSpace);
        const pose = hitTestResults[0].getPose(this.xrRefSpace);
        return createVector(
          pose.transform.position.x,
          pose.transform.position.y,
          pose.transform.position.z,
        );
      }
    }
  }

  /**
   *
   * @param {p5.Vector} vec Vector3
   * @returns ARAnchor
   * @private
   * @ignore
   */
  __createAnchor(vec) {
    if (vec === null || typeof vec === 'undefined') {
      return null;
    }
    return new ARAnchor(vec.x, vec.y, vec.z);
  }
}
