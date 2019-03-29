import WebXRPolyfill from 'webxr-polyfill';

/**
 * p5vr class holds all state and methods that are specific to VR
 * @class
 *
 * @constructor
 *
 * @property vrDevice  {XRDevice} the current VR compatible device
 * @property vrSession  {XRSession} the current VR session
 * @property vrFrameOfRef  {XRFrameOfReference} the current VR frame of reference 
 * (starting point for transform, default eye-level)
 * @property gl  {WebGLRenderingContext} points to p5.RendererGL.GL (the WebGL Rendering Context)
 * @property curClearColor  {Color} background clear color set by global `setVRBackgroundColor`
 */

export default class p5vr{
  constructor(){
    this.vrDevice = null;
    this.vrSession = null;
    this.vrFrameOfRef = null;

    this.gl = null;

    // TODO: initialize with default and make this use p5.Color
    this.curClearColor = null;

    this.polyfill = new WebXRPolyfill();
    this.versionShim = new WebXRVersionShim();
    
    
    /**
     * Called by `createVRCanvas()`.
     * Creates the button for entering VR.
     * Requests an XRDevice object based on current device.
     * Checks if the device supports an immersive session.
     * Then binds the device to the button. <br>
     * <b>TODO:</b> Custom styling for button prior to VR canvas creation.
     */
    this.initVR = function(){
      // Is WebXR available on this UA?
      let xrButton = new XRDeviceButton({
        onRequestSession: this.onVRButtonClicked.bind(this),
        onEndSession: this.onSessionEnded.bind(this)
      });
      document.querySelector('header').appendChild(xrButton.domElement);

      if (navigator.xr){
        // Request a list of all the XR Devices connected to the system.
        navigator.xr.requestDevice().then((device) => {
          // If the device allows creation of immersive sessions set it as the
          // target of the 'Enter XR' button.
          device.supportsSession({ immersive: true }).then(() => {
            console.log('supported');
            xrButton.setDevice(device);
          });
        });
      }
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
    this.startSketch = function(session){

      // create p5 canvas
      createCanvas(windowWidth, windowHeight, WEBGL);

      // TODO: set up preload decrementing
      p5.instance._decrementPreload();

      // make a plan for where canvas should live
      let canvas = p5.instance.canvas;

      // get a copy of the same gl that p5 is using
      this.gl = canvas.getContext('webgl', {
        compatibleXRDevice: session.device
      });


      // Use the p5's WebGL context to create a XRWebGLLayer and set it as the
      // sessions baseLayer. This allows any content rendered to the layer to
      // be displayed on the XRDevice.
      session.baseLayer = new XRWebGLLayer(session, this.gl);

      // Get a frame of reference, which is required for querying poses. In
      // this case an 'eye-level' frame of reference means that all poses will
      // be relative to the location where the XRDevice was first detected.
      session.requestFrameOfReference('eye-level').then((frameOfRef) => {
        this.xrFrameOfRef = frameOfRef;
        // Inform the session that we're ready to begin drawing.
        session.requestAnimationFrame(this.onXRFrame.bind(this));
      });
    };

    /**
     * `device.requestSession()` must be called within a user gesture event.
     * @param {XRDevice}
     */
    this.onVRButtonClicked = function(device){
      // requestSession must be called within a user gesture event
      // like click or touch when requesting an immersive session.
      device.requestSession({ immersive: true }).then(this.startSketch.bind(this)
      );
    };

    /**
     * This is the method that is attached to the event that announces
     * availability of a new frame. The next animation frame is requested here,
     * the device pose is retrieved, the modelViewMatrix (`uMVMatrix`) for p5 is set,
     * and each eye is drawn
     * @param frame {XRFrame}
     */
    this.onXRFrame = function (t, frame){
      let session = frame.session;
      // Inform the session that we're ready for the next frame.
      session.requestAnimationFrame(this.onXRFrame.bind(this));
      // Get the XRDevice pose relative to the Frame of Reference we created
      // earlier.
      let pose = frame.getDevicePose(this.vrFrameOfRef);
      // Getting the pose may fail if, for example, tracking is lost. So we
      // have to check to make sure that we got a valid pose before attempting
      // to render with it. If not in this case we'll just leave the
      // framebuffer cleared, so tracking loss means the scene will simply
      // dissapear.
      if (pose){
        // If we do have a valid pose, bind the WebGL layer's framebuffer,
        // which is where any content to be displayed on the XRDevice must be
        // rendered.
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, session.baseLayer.framebuffer);

        this._clearVR();
        for (let view of frame.views){
          let viewport = session.baseLayer.getViewport(view);
          this.gl.viewport(viewport.x, viewport.y,
            viewport.width, viewport.height);
          p5.instance._renderer.uMVMatrix.set(pose.getViewMatrix(view));
          p5.instance._renderer.uPMatrix.set(view.projectionMatrix);
          this._drawEye();
        }
      }
    };

    /**
     * clears the background based on the current clear color (`curClearColor`)
     */
    this._clearVR = function(){
      if (this.curClearColor === null){
        return;
      }

      window.p5.instance.background(this.curClearColor);
    };

    /**
     * Runs the code that the user has in `draw()` once for each eye
     * <b>TODO: </b> optimizations!
     * <b>TODO: </b> make a different `_update` function so that the p5.RendererGL.prototype
     * does not need to be modified (ie: we need to reset everything except the model view matrix)
     */
    this._drawEye = function (){
      // 
      if (!p5.instance._renderer.isP3D){
        return;
      }

      var context = window;
      var userSetup = context.setup;
      var userDraw = context.draw;
      if (typeof userDraw === 'function'){
        if (typeof userSetup === 'undefined'){
          context.scale(context._pixelDensity, context._pixelDensity);
        }
        var callMethod = function (f){
          f.call(context);
        };
        // Just call a different function that does this minus matrix reset
        if (context._renderer.isP3D){
          context._renderer._update();
        }
        context._setProperty('frameCount', context.frameCount + 0.5);
        context._registeredMethods.pre.forEach(callMethod);
        p5.instance._inUserDraw = true;
        try {
          userDraw();
        } finally {
          p5.instance._inUserDraw = false;
        }
        context._registeredMethods.post.forEach(callMethod);
      }
    };

    this.onEndSession = function(){
      
    };

    /**
    * Called either when the user has explicitly ended the session
    *  or when the UA has ended the session for any reason.
    * The vrSession is ended and discarded. p5 is reset with `remove()`
    * 
    */
    this.onSessionEnded = function(){
      this.vrSession.end();
      this.vrSession = null;
      this.xrButton.innerHTML = 'Enter VR';
      this.gl = null;
      window.p5.instance.remove();
    };
  }
}
