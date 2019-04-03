import p5xr from '../core/p5xr';

export default class p5ar extends p5xr{
  constructor(){
    super();
    let self = this.instance;
    let xrButton;
    this.canvas = null;
    /**
     * Called by `createVRCanvas()`.
     * Creates the button for entering VR.
     * Requests an XRDevice object based on current device.
     * Checks if the device supports an immersive session.
     * Then binds the device to the button. <br>
     * <b>TODO:</b> Custom styling for button prior to VR canvas creation.
     */
    this.initAR = function(){
      
      p5.instance._incrementPreload();
      // Is WebXR available on this UA?
      xrButton = new XRDeviceButton({
        onRequestSession: self.onVRButtonClicked,
        onEndSession: self.onSessionEnded
      });
      document.querySelector('header').appendChild(xrButton.domElement);

      if (navigator.xr){
        // check if polyfilled
        if(self.injectedPolyfill){
          self.polyFillSessionCheck();
        } else {
          self.noPolyFillSessionCheck();
        }
      }
    };

    this.polyFillSessionCheck = function(){
      navigator.xr.requestDevice().then((device) => {
        device.supportsSession({ immersive: true }).then(() => {
          // console.log('supported with polyfill');
          // xrButton.setDevice(device);
          console.log('AR Currently not available with your browser');
        });
      });
    };

    this.noPolyFillSessionCheck = function(){
      navigator.xr.supportsSessionMode('legacy-inline-ar').then(() => {
        console.log('supported without polyfill');
        // Updates the button to start an XR session when clicked.
        // HACK
        xrButton.setDevice(true);
        // xrButton.setTitle('Enter AR');
        // xrButton.addEventListener('click', self.onVRButtonClicked);
        // xrButton.innerHTML = 'Enter XR';
        // xrButton.disabled = false;

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
    this.startSketch = function(session){
      self.xrSession = xrButton.session = session;
      xrButton.innerHTML = 'Exit VR';
      // create p5 canvas
      p5.instance._decrementPreload();
      createCanvas(1,1, WEBGL);
      // make a plan for where canvas should live
      self.canvas = p5.instance.canvas;
      
      if(self.injectedPolyfill){
        // self.onRequestSessionPolyfill();
      } else {
        self.onRequestSessionNoPF();
      }
      // Use the p5's WebGL context to create a XRWebGLLayer and set it as the
      // sessions baseLayer. This allows any content rendered to the layer to
      // be displayed on the XRDevice;
          

      // Get a frame of reference, which is required for querying poses. In
      // this case an 'eye-level' frame of reference means that all poses will
      // be relative to the location where the XRDevice was first detected.
      
    };

    /**
     * `device.requestSession()` must be called within a user gesture event.
     * @param {XRDevice}
     */
    this.onVRButtonClicked = function(device){
      // Normalize the various vendor prefixed versions of getUserMedia.
      navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);
      let outputCanvas = document.createElement('canvas');
      document.querySelector('header').appendChild(outputCanvas);
      let ctx = outputCanvas.getContext('xrpresent');
      outputCanvas.style.width = window.innerWidth + 'px';
      setTimeout(function(){
        outputCanvas.style.height = window.innerHeight + 'px';
      }, 0);
      xrButton.hide();
      if(self.injectedPolyfill){
        // console.log('requesting session with mode: immersive-ar');
        // device.requestSession({ mode: 'legacy-inline-ar', outputContext: ctx }).
        //   then((session) => {
        //     self.startSketch(session);
        //   }, (error) => {
        //     console.log(error + ' unable to request an immersive-ar session.');
        //   });
      } else {
        navigator.xr.requestSession({ mode: 'legacy-inline-ar', outputContext: ctx }).
          then((session) => {
            self.startSketch(session);
          }, (error) => {
            console.log(error + ' unable to request an immersive-ar session.');
          });
      }
      // requestSession must be called within a user gesture event
      // like click or touch when requesting an immersive session.
    };

    this.onRequestSessionPolyfill = function(){
      // console.log('set context with compatible device');
      // // get a copy of the same gl that p5 is using
      // self.gl = canvas.getContext('webgl', {
      //   compatibleXRDevice: self.xrSession.device
      // });
      // self.xrSession.baseLayer = new XRWebGLLayer(self.xrSession, self.gl);

      // self.xrSession.requestFrameOfReference('eye-level').then((frameOfRef) => {
      //   self.xrFrameOfRef = frameOfRef;
      //   console.log('have frame of ref');
      //   // Inform the session that we're ready to begin drawing.
      //   self.xrSession.requestAnimationFrame(self.onXRFrame);
      // }, (err) => {
      //   console.log(err);
      // });
    };

    this.onRequestSessionNoPF = function(){
      console.log('set context with xrCompatible: true');
      self.gl = self.canvas.getContext('webgl', {
        xrCompatible: true
      });
      self.gl.makeXRCompatible().then(() => {
        // self.xrSession.updateRenderState({
        //   baseLayer: new XRWebGLLayer(self.xrSession, self.gl)
        // });
        self.xrSession.baseLayer = new XRWebGLLayer(self.xrSession, self.gl);
      });

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
    this.onXRFrame = function (t, frame){
      let session = self.xrSession = frame.session;
      if(session === null || self.gl === null){return;}
      // Inform the session that we're ready for the next frame.
      session.requestAnimationFrame(self.onXRFrame);
      // Get the XRDevice pose relative to the Frame of Reference we created
      // earlier.
      let pose;
      if(self.injectedPolyfill){
        pose = frame.getDevicePose(self.xrFrameOfRef);
      } else {
        pose = frame.getViewerPose(self.xrFrameOfRef);
      }
      // Getting the pose may fail if, for example, tracking is lost. So we
      // have to check to make sure that we got a valid pose before attempting
      // to render with it. If not in this case we'll just leave the
      // framebuffer cleared, so tracking loss means the scene will simply
      // dissapear.
      if (pose){
        // If we do have a valid pose, bind the WebGL layer's framebuffer,
        // which is where any content to be displayed on the XRDevice must be
        // rendered.
        self.gl.bindFramebuffer(self.gl.FRAMEBUFFER, session.baseLayer.framebuffer);

        if(self.injectedPolyfill){
          for (let view of frame.views){
            let viewport = session.baseLayer.getViewport(view);
            self.gl.viewport(viewport.x, viewport.y,
              viewport.width, viewport.height);
            p5.instance._renderer.uMVMatrix.set(pose.getViewMatrix(view));
            p5.instance._renderer.uPMatrix.set(view.projectionMatrix);
            self._drawEye();
          }
        } else {
          for (let view of pose.views){
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
    this._clearVR = function(){
      if (this.curClearColor === null){
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
    this._drawEye = function (){
      // 2D Mode should use graphics object
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
        // TODO Just call a different function that does this minus matrix reset
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

    /**
    * Called either when the user has explicitly ended the session
    *  or when the UA has ended the session for any reason.
    * The xrSession is ended and discarded. p5 is reset with `remove()`
    * 
    */
    this.onSessionEnded = function(){
      self.xrSession.end();
      self.xrSession = null;
      xrButton.innerHTML = 'Enter VR';
      p5.instance.remove();
      xrButton.session = null;
      self.gl = null;
    };
  }
}