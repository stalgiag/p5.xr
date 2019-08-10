import p5xr from '../core/p5xr';

/**
 * p5vr class holds all state and methods that are specific to VR
 * @class
 *
 * @constructor
 *
 */

export default class p5vr extends p5xr {
  constructor() {
    super();
  }

  initVR() {
    this.init();
  }

  /**
   * This is where the actual p5 canvas is first created, and
   * the GL rendering context is accessed by p5vr. 
   * The current XRSession also gets a frame of reference and
   * base rendering layer. <br>
   * <b>TODO:</b> Make sure that p5's preload isn't actually completed until this function 
   * is called.
   * @param {XRSession}
   */
  startSketch(session) {
    this.xrSession = this.xrButton.session = session;
    this.xrSession.addEventListener('end', this.onSessionEnded.bind(this));
    p5.instance._decrementPreload();
    // create p5 canvas
    createCanvas(windowWidth, windowHeight, WEBGL);
    if(window.injectedPolyfill) {
      this.onRequestSessionPolyfill();
    } else {
      this.onRequestSessionNoPF();
    }
  }

  /**
   * `device.requestSession()` must be called within a user gesture event.
   * @param {XRDevice}
   */
  onXRButtonClicked(device) {
    if(window.injectedPolyfill) {
      console.log('requesting session with device and immersive = true');
      device.requestSession({ immersive: true }).then(this.startSketch.bind(this));
    } else {
      console.log('requesting session with mode: immersive-vr');
      navigator.xr.requestSession('immersive-vr').then(this.startSketch.bind(this));
    }
    // requestSession must be called within a user gesture event
    // like click or touch when requesting an immersive session.
  }

  onRequestSessionPolyfill() {
    console.log('set context with compatible device');
    // get a copy of the same gl that p5 is using
    this.gl = canvas.getContext('webgl', {
      compatibleXRDevice: this.xrSession.device
    });
    // Use the p5's WebGL context to create a XRWebGLLayer and set it as the
    // sessions baseLayer. This allows any content rendered to the layer to
    // be displayed on the XRDevice;
    
    this.xrSession.baseLayer = new XRWebGLLayer(this.xrSession, this.gl);
    // Get a frame of reference, which is required for querying poses. In
    // this case an 'eye-level' frame of reference means that all poses will
    // be relative to the location where the XRDevice was first detected.
    this.xrSession.requestFrameOfReference('eye-level').then((frameOfRef) => {
      this.xrFrameOfRef = frameOfRef;
      // Inform the session that we're ready to begin drawing.
      this.xrSession.requestAnimationFrame(this.onXRFrame.bind(this));
    });
  }

  onRequestSessionNoPF() {
    console.log('set context with xrCompatible: true');
    this.gl = canvas.getContext('webgl', {
      xrCompatible: true
    });
    this.gl.makeXRCompatible().then(() => {
      // Use the p5's WebGL context to create a XRWebGLLayer and set it as the
      // sessions baseLayer. This allows any content rendered to the layer to
      // be displayed on the XRDevice;
      this.xrSession.updateRenderState({ baseLayer: new XRWebGLLayer(this.xrSession, this.gl) });
    });
    // Get a frame of reference, which is required for querying poses. In
    // this case an 'eye-level' frame of reference means that all poses will
    // be relative to the location where the XRDevice was first detected.
    this.xrSession.requestReferenceSpace('local').
      then((refSpace) => {
        this.xrFrameOfRef = refSpace;
        // Inform the session that we're ready to begin drawing.
        this.xrSession.requestAnimationFrame(this.onXRFrame.bind(this));
      });
  }

  /**
   * clears the background based on the current clear color (`curClearColor`)
   */
  _clearVR() {
    if (this.curClearColor === null) {
      return;
    }
    p5.instance.background(this.curClearColor);
  }
}
