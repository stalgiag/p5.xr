import p5xr from '../core/p5xr';
import * as constants from '../core/constants.js';

export default class p5ar extends p5xr {
  constructor() {
    super();
    // let self = p5xr.instance;
    let xrButton;
    this.canvas = null;
    
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
     */
  startSketch(session) {
    this.xrSession = this.xrButton.session = session;
    this.xrSession.addEventListener('end', self.onSessionEnded);
    this.canvas = p5.instance.canvas;

    if(window.injectedPolyfill) {
      console.log('AR does not work with polyfilled version of p5.xr currently');
      return;
    } else {
      this.onRequestSessionNoPF();
    }
    p5.instance._decrementPreload();
  }


  /**
   * `device.requestSession()` must be called within a user gesture event.
   * @param {XRDevice}
   */
  onXRButtonClicked(device) {
    // Normalize the various vendor prefixed versions of getUserMedia.
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    if(window.injectedPolyfill) {
      // STUB
    } else {
      navigator.xr.requestSession('immersive-ar').
        then((session) => {
          this.startSketch(session);
        }, (error) => {
          console.log(error + ' unable to request an immersive-ar session.');
        });
    }
  }

  onRequestSessionNoPF() {
    console.log('set context with xrCompatible: true');
    this.gl = this.canvas.getContext('webgl', {
      xrCompatible: true
    });
    this.gl.makeXRCompatible().then(() => {
      this.xrSession.updateRenderState({ baseLayer: new XRWebGLLayer(this.xrSession, this.gl) });
    });

    this.xrSession.requestReferenceSpace('unbounded').
      then((refSpace) => {
        this.xrFrameOfRef = refSpace;
        // Inform the session that we're ready to begin drawing.
        this.xrSession.requestAnimationFrame(this.onXRFrame.bind(this));
      });
  }
}