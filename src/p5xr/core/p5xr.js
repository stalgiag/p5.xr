
import WebXRPolyfill from 'webxr-polyfill';
import WebXRVersionShim from '../../webxr/webxr-version-shim';
import p5vr from '../p5vr/p5vr';

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
 * @property self   {p5xr}  a more stable this
 */
export default class p5xr {
  constructor() {
    p5xr.instance = this;
    let self = this;
    this.xrDevice = null;
    this.xrButton;
    this.isVR;
    this.xrSession = null;
    this.xrFrameOfRef = null;
    this.gl = null;
    this.curClearColor = color(255, 255, 255);
    this.injectedPolyfill = false;
    if(!navigator.xr) {
      window.polyfill = new WebXRPolyfill();
      this.injectedPolyfill = polyfill.injected;
    }
    window.versionShim = new WebXRVersionShim();

    this.removeLoadingElement = function() {
      let loadingScreen = document.getElementById(window._loadingScreenId);
      if (loadingScreen) {
        loadingScreen.parentNode.removeChild(loadingScreen);
      }
    };

    this.preloadOverride = function() {
      let context = window;
      context._setup();
    };

    this._updatexr = function() {
      p5.instance._renderer.ambientLightColors.length = 0;
      p5.instance._renderer.directionalLightDirections.length = 0;
      p5.instance._renderer.directionalLightColors.length = 0;
    
      p5.instance._renderer.pointLightPositions.length = 0;
      p5.instance._renderer.pointLightColors.length = 0;
    };

    /**
     * Called by `createVRCanvas()` or `createARCanvas`.
     * Creates the button for entering XR.
     * Requests an XRDevice object based on current device.
     * Checks if the device supports an immersive session.
     * Then binds the device to the button. <br>
     * <b>TODO:</b> Custom styling for button prior to VR canvas creation.
     */
    this.init = function() {
      this.isVR = this instanceof p5vr;
      p5.instance._incrementPreload();
      self.removeLoadingElement();
      // Is WebXR available on this UA?
      self.xrButton = new XRDeviceButton({
        onRequestSession: self.onXRButtonClicked,
        onEndSession: self.onSessionEnded
      });
      document.querySelector('header').appendChild(self.xrButton.domElement);

      if (navigator.xr) {
        self.sessionCheck();
      }
    };

    this.sessionCheck = function() {
      if(self.injectedPolyfill) {
        if(self.isVR) {
          navigator.xr.requestDevice().then((device) => {
            device.supportsSession({ immersive: true }).then(() => {
              console.log('VR supported with polyfill');
              self.xrButton.setDevice(device);
            });
          });
        } else {
          // AR with polyfill is unsupported currently
          self.printUnsupportedMessage();
          return;
        }
      } else if(self.isVR) {
        navigator.xr.supportsSessionMode('immersive-vr').then(() => {
          console.log('VR supported without polyfill');
          // Updates the button to start an XR session when clicked.
          // HACK
          self.xrButton.setDevice(true);
        });
      } else {
        navigator.xr.supportsSessionMode('legacy-inline-ar').then(() => {
          console.log('AR supported without polyfill');
          // TEMPORARY HACK 4/7/19
          self.xrButton.setDevice(true);
        });
      }
    };

    /**
     * This is the method that is attached to the event that announces
     * availability of a new frame. The next animation frame is requested here,
     * the device pose is retrieved, the modelViewMatrix (`uMVMatrix`) for p5 is set,
     * and each eye is drawn
     * @param frame {XRFrame}
     */
    this.onXRFrame = function(t, frame) {
      let session = self.xrSession = frame.session;
      if(session === null || self.gl === null) {return;}
      // Inform the session that we're ready for the next frame.
      session.requestAnimationFrame(self.onXRFrame);
      // Get the XRDevice pose relative to the Frame of Reference we created
      // earlier.
      if(p5.instance.width < window.innerWidth * window.devicePixelRatio) {
        let oldWidth = p5.instance.width;
        p5.instance.resizeCanvas(
          window.innerWidth * window.devicePixelRatio,
          window.innerHeight * window.devicePixelRatio
        );
        console.log('p5 Canvas resized from '+oldWidth+' to '+p5.instance.width);
      }
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

        if(self.isVR) {
          self._clearVR();
        }
        
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
     * Runs the code that the user has in `draw()` once for each eye
     * <b>TODO: </b> optimizations!
     */
    this._drawEye = function() {
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
        var callMethod = function(f) {
          f.call(context);
        };
        if (context._renderer.isP3D) {
          self._updatexr();
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

    this.printUnsupportedMessage = function() {
      console.warn('Your browser/hardware does not work with AR Mode currently. This is'+
          ' undergoing heavy development currently.' +
          'You may be able to fix this by enabling WebXR flags in Chrome.');
      return;
    };

    /**
    * Called either when the user has explicitly ended the session
    *  or when the UA has ended the session for any reason.
    * The xrSession is ended and discarded. p5 is reset with `remove()`
    * 
    */
    this.onSessionEnded = function() {
      let self = p5xr.instance;
      if(self.xrSession) {
        self.xrSession.end();
        self.xrSession = null;
      }
      var p5Canvi = document.getElementsByClassName('p5Canvas');
      while(p5Canvi.length > 0) {
        p5Canvi[0].parentNode.removeChild(p5Canvi[0]);
      }
      self.xrButton.session = null;
      self.gl = null;
    };
  }

  get instance() {
    return window.p5xr.instance;
  }

  set instance(p5xrInst) {
    window.p5xr.instance = p5xrInst;
    return window.p5xr.instance;
  }
}