import p5xr from '../core/p5xr';
import ARAnchor from './ARAnchor';

export default class p5ar extends p5xr {
  constructor() {
    super();
    this.canvas = null;
  }

  initAR() {
    this.__createButton();
    // WebXR available
    if (navigator?.xr) {
      this.__sessionCheck();
    }
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
    this.xrSession = this.xrButton.session = session;
    this.xrSession.addEventListener('end', this.__onSessionEnded);
    if (typeof touchStarted === 'function') {
      this.xrSession.addEventListener('select', touchStarted);
    }
    this.canvas = p5.instance.canvas;
    p5.instance._renderer._curCamera.cameraType = 'custom';
    this.__onRequestSession();
    p5.instance._decrementPreload();
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
          pose.transform.position.z
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

  /**
   * `device.requestSession()` must be called within a user gesture event.
   * @param {XRDevice}
   * @private
   * @ignore
   */
  __onXRButtonClicked() {
    // Normalize the various vendor prefixed versions of getUserMedia.
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    navigator.xr
      .requestSession('immersive-ar', {
        requiredFeatures: ['local', 'hit-test'],
      })
      .then(
        (session) => {
          this.__startSketch(session);
        },
        (error) => {
          console.log(`${error} unable to request an immersive-ar session.`);
        }
      );
  }

  /**
   * @private
   * @ignore
   */
  __onRequestSession() {
    this.gl = this.canvas.getContext(p5.instance.webglVersion, {
      xrCompatible: true,
    });
    this.gl.makeXRCompatible().then(() => {
      this.xrSession.updateRenderState({
        baseLayer: new XRWebGLLayer(this.xrSession, this.gl),
      });
    });

    this.xrSession.requestReferenceSpace('viewer').then((refSpace) => {
      this.xrViewerSpace = refSpace;
      this.xrSession
        .requestHitTestSource({ space: this.xrViewerSpace })
        .then((hitTestSource) => {
          this.xrHitTestSource = hitTestSource;
        });
    });

    this.xrSession.requestReferenceSpace('local').then((refSpace) => {
      this.xrRefSpace = refSpace;
      // Inform the session that we're ready to begin drawing.
      this.xrSession.requestAnimationFrame(this.__onXRFrame.bind(this));
    });
  }
}
