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
    let self = p5xr.instance;
    /**
     * Called by `createVRCanvas()`.
     * Creates the button for entering VR.
     * Requests an XRDevice object based on current device.
     * Checks if the device supports an immersive session.
     * Then binds the device to the button. <br>
     * <b>TODO:</b> Custom styling for button prior to VR canvas creation.
     */
    this.initVR = function() {
      
    };

    this.polyFillSessionCheck = function() {
      navigator.xr.requestDevice().then((device) => {
        device.supportsSession({ immersive: true }).then(() => {
          console.log('supported with polyfill');
          self.xrButton.setDevice(device);
        });
      });
    };

    this.noPolyFillSessionCheck = function() {
      navigator.xr.supportsSessionMode('immersive-vr').then(() => {
        console.log('supported without polyfill');
        // Updates the button to start an XR session when clicked.
        // HACK
        self.xrButton.setDevice(true);
      });
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
      // create p5 canvas
      self.preloadOverride();
      createCanvas(windowWidth, windowHeight, WEBGL);
      // make a plan for where canvas should live
      let canvas = p5.instance.canvas;
      
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
    this.onVRButtonClicked = function(device) {
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
     * This is the method that is attached to the event that announces
     * availability of a new frame. The next animation frame is requested here,
     * the device pose is retrieved, the modelViewMatrix (`uMVMatrix`) for p5 is set,
     * and each eye is drawn
     * @param frame {XRFrame}
     */
    this.onXRFrame = function (t, frame) {
      let session = self.xrSession = frame.session;
      if(session === null || self.gl === null) {return;}
      // Inform the session that we're ready for the next frame.
      session.requestAnimationFrame(self.onXRFrame);
      // Get the XRDevice pose relative to the Frame of Reference we created
      // earlier.
      let pose;
      if(self.injectedPolyfill) {
        pose = frame.getDevicePose(self.xrFrameOfRef);
      } else {
        pose = frame.getViewerPose(self.xrFrameOfRef);
      }
      // Getting the pose may fail if, for example, tracking is lost. So we
      // have to check to make sure that we got a valid pose before attempting
      // to render with it. If not in this case we'll just leave the
      // framebuffer cleared, so tracking loss means the scene will simply
      // dissapear.
      if (pose) {
        // If we do have a valid pose, bind the WebGL layer's framebuffer,
        // which is where any content to be displayed on the XRDevice must be
        // rendered.
        self.gl.bindFramebuffer(self.gl.FRAMEBUFFER, session.baseLayer.framebuffer);

        self._clearVR();
        
        if(self.injectedPolyfill) {
          for (let view of frame.views) {
            let viewport = session.baseLayer.getViewport(view);
            self.gl.viewport(viewport.x, viewport.y,
              viewport.width, viewport.height);
            p5.instance._renderer.uMVMatrix.set(pose.getViewMatrix(view));
            p5.instance._renderer.uPMatrix.set(view.projectionMatrix);
            self._drawEye();
          }
        } else {
          for (let view of pose.views) {
            let viewport = session.baseLayer.getViewport(view);
            self.gl.viewport(viewport.x, viewport.y,
              viewport.width, viewport.height);
            p5.instance._renderer.uMVMatrix.set(view.viewMatrix);
            p5.instance._renderer.uPMatrix.set(view.projectionMatrix);
            self._drawEye();
          }
        }
      }
    };

    /**
     * clears the background based on the current clear color (`curClearColor`)
     */
    this._clearVR = function() {
      if (this.curClearColor === null) {
        return;
      }

      p5.instance.background(this.curClearColor);
    };


    /**
     * Runs the code that the user has in `draw()` once for each eye
     * <b>TODO: </b> optimizations!
     * <b>TODO: </b> make a different `_update` function so that the p5.RendererGL.prototype
     * does not need to be modified (ie: we need to reset everything except the model view matrix)
     */
    this._drawEye = function () {
      // 2D Mode should use graphics object
      if (!p5.instance._renderer.isP3D) {
        console.error('Sketch does not have 3D Renderer');
        return;
      }
      
      var context = window;
      var userSetup = context.setup;
      var userDraw = context.draw;
      if (typeof userDraw === 'function') {
        if (typeof userSetup === 'undefined') {
          context.scale(context._pixelDensity, context._pixelDensity);
        }
        var callMethod = function (f) {
          f.call(context);
        };
        // TODO Just call a different function that does this minus matrix reset
        if (context._renderer.isP3D) {
          context._renderer._update();
        } else {
          console.error('Context does not have 3D Renderer');
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
  }
}
