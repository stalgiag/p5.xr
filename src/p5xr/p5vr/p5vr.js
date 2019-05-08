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
    let self = this;

    this.initVR = function() {
      this.init();
    };

    /**
     * This is where the actual p5 canvas is first created, and
     * the GL rendering context is accessed by p5vr. 
     * The current XRSession also gets a frame of reference and
     * base rendering layer. <br>
     * <b>TODO:</b> Make sure that p5's preload isn't actually completed until this function 
     * is called.
     * @param {XRSession}
     */
    this.startSketch = function(session) {
      self.xrSession = self.xrButton.session = session;
      self.xrSession.addEventListener('end', self.onSessionEnded);
      self.preloadOverride();
      // create p5 canvas
      createCanvas(windowWidth, windowHeight, WEBGL);
      if(self.injectedPolyfill) {
        self.onRequestSessionPolyfill();
      } else {
        self.onRequestSessionNoPF();
      }
      p5.instance._decrementPreload();
    };

    /**
     * `device.requestSession()` must be called within a user gesture event.
     * @param {XRDevice}
     */
    this.onXRButtonClicked = function(device) {
      if(self.injectedPolyfill) {
        console.log('requesting session with device and immersive = true');
        device.requestSession({ immersive: true }).then(self.startSketch);
      } else {
        console.log('requesting session with mode: immersive-vr');
        navigator.xr.requestSession({mode: 'immersive-vr'}).then(self.startSketch);
      }
      // requestSession must be called within a user gesture event
      // like click or touch when requesting an immersive session.
    };

    this.onRequestSessionPolyfill = function() {
      console.log('set context with compatible device');
      // get a copy of the same gl that p5 is using
      self.gl = canvas.getContext('webgl', {
        compatibleXRDevice: self.xrSession.device
      });
      // Use the p5's WebGL context to create a XRWebGLLayer and set it as the
      // sessions baseLayer. This allows any content rendered to the layer to
      // be displayed on the XRDevice;
      
      self.xrSession.baseLayer = new XRWebGLLayer(self.xrSession, self.gl);
      // Get a frame of reference, which is required for querying poses. In
      // this case an 'eye-level' frame of reference means that all poses will
      // be relative to the location where the XRDevice was first detected.
      self.xrSession.requestFrameOfReference('eye-level').then((frameOfRef) => {
        self.xrFrameOfRef = frameOfRef;
        // Inform the session that we're ready to begin drawing.
        self.xrSession.requestAnimationFrame(self.onXRFrame);
      });
    };

    this.onRequestSessionNoPF = function() {
      console.log('set context with xrCompatible: true');
      self.gl = canvas.getContext('webgl', {
        xrCompatible: true
      });
      self.gl.makeXRCompatible().then(() => {
        // Use the p5's WebGL context to create a XRWebGLLayer and set it as the
        // sessions baseLayer. This allows any content rendered to the layer to
        // be displayed on the XRDevice;
        self.xrSession.baseLayer = new XRWebGLLayer(self.xrSession, self.gl);
      });
      // Get a frame of reference, which is required for querying poses. In
      // this case an 'eye-level' frame of reference means that all poses will
      // be relative to the location where the XRDevice was first detected.
      self.xrSession.requestReferenceSpace({ type: 'stationary', subtype: 'eye-level' }).
        then((refSpace) => {
          self.xrFrameOfRef = refSpace;
          // Inform the session that we're ready to begin drawing.
          self.xrSession.requestAnimationFrame(self.onXRFrame);
        });
    };

    /**
     * clears the background based on the current clear color (`curClearColor`)
     */
    this._clearVR = function() {
      if (self.curClearColor === null) {
        return;
      }
      p5.instance.background(self.curClearColor);
    };
  }
}
