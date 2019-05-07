import p5xr from '../core/p5xr';

export default class p5ar extends p5xr{
  constructor(){
    super();
    let self = this.instance;
    let xrButton;
    this.canvas = null;
    /**
     * Called by `createARCanvas()`.
     * Creates the button for entering VR.
     * Requests an XRDevice object based on current device.
     * Checks if the device supports an immersive session.
     * Then binds the device to the button. <br>
     * <b>TODO:</b> Custom styling for button prior to VR canvas creation.
     */
    this.initAR = function(){
      
      p5.instance._incrementPreload();
      self.removeLoadingElement();
      // Is WebXR available on this UA?
      xrButton = new XRDeviceButton({
        onRequestSession: self.onVRButtonClicked,
        onEndSession: self.onSessionEnded
      });
      document.querySelector('header').appendChild(xrButton.domElement);

      if (navigator.xr){
        // check if polyfilled
        if(self.injectedPolyfill){
          console.warn('Your browser/hardware does not work with AR Mode currently. This is'+
          'undergoing heavy development currently.' +
          'You may be able to fix this by enabling WebXR flags in Chrome.');
          return;
        } else {
          self.noPolyFillSessionCheck();
        }
      }
    };

    this.polyFillSessionCheck = function(){
      // stub for now
    };

    this.noPolyFillSessionCheck = function(){
      navigator.xr.supportsSessionMode('legacy-inline-ar').then(() => {
        console.log('supported without polyfill');
        // TEMPORARY HACK 4/7/19
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
     * @param {XRSession}
     */
    this.startSketch = function(session){
      self.xrSession = xrButton.session = session;
      self.xrSession.addEventListener('end', self.onSessionEnded);
      // create p5 canvas
      self._preloadOverride();
      // HACK TO GET RENDERING CONTEXT 4/7/19
      createCanvas(1,1, WEBGL);

      self.canvas = p5.instance.canvas;
      
      self.onRequestSessionNoPF();
      p5.instance._decrementPreload();
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
      // AR currently uses a different canvas. 
      let outputCanvas = document.createElement('canvas');
      document.querySelector('header').appendChild(outputCanvas);
      let ctx = outputCanvas.getContext('xrpresent');
      // HACK to get close to 'fullscreen' 4/7/19
      outputCanvas.style.width = window.innerWidth + 'px';
      setTimeout(function(){
        outputCanvas.style.height = window.innerHeight + 'px';
      }, 0);
      // HACK to get close to 'fullscreen' 4/7/19

      xrButton.hide();
      if(self.injectedPolyfill){
        // STUB
      } else {
        navigator.xr.requestSession({ mode: 'legacy-inline-ar', outputContext: ctx }).
          then((session) => {
            self.startSketch(session);
          }, (error) => {
            console.log(error + ' unable to request an immersive-ar session.');
          });
      }
    };

    this.onRequestSessionPolyfill = function(){
      // STUB
    };

    this.onRequestSessionNoPF = function(){
      console.log('set context with xrCompatible: true');
      self.gl = self.canvas.getContext('webgl', {
        xrCompatible: true
      });
      self.gl.makeXRCompatible().then(() => {
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

      if (pose){
        // If we do have a valid pose, bind the WebGL layer's framebuffer,
        // which is where any content to be displayed on the XRDevice must be
        // rendered.
        self.gl.bindFramebuffer(self.gl.FRAMEBUFFER, session.baseLayer.framebuffer);

        if(self.injectedPolyfill){
          // NOT WORKING CURRENTLY
          // for (let view of frame.views){
          //   let viewport = session.baseLayer.getViewport(view);
          //   self.gl.viewport(viewport.x, viewport.y,
          //     viewport.width, viewport.height);
          //   p5.instance._renderer.uMVMatrix.set(pose.getViewMatrix(view));
          //   p5.instance._renderer.uPMatrix.set(view.projectionMatrix);
          //   self._drawEye();
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
     * Runs the code that the user has in `draw()` once for each eye or a single time in AR
     * <b>TODO: </b> optimizations!
     * <b>TODO: </b> more generic name (AR doesn't have 'eyes')
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
      xrButton.innerHTML = 'Enter AR';
      p5.instance.remove();
      xrButton.session = null;
      self.gl = null;
    };
  }
}