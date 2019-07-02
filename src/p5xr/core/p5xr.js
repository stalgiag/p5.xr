
import WebXRPolyfill from 'webxr-polyfill';
import WebXRVersionShim from '../../webxr/webxr-version-shim';
import p5vr from '../p5vr/p5vr';
import p5xrViewer from './p5xrviewer';

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
export default class p5xr {
  constructor() {
    this.xrDevice = null;
    this.xrButton;
    this.isVR;
    this.xrSession = null;
    this.xrFrameOfRef = null;
    this.gl = null;
    this.curClearColor = color(255, 255, 255);
    this.injectedPolyfill = false;
    this.viewer = new p5xrViewer();
    if(!navigator.xr) {
      window.polyfill = new WebXRPolyfill();
      this.injectedPolyfill = polyfill.injected;
      window.versionShim = new WebXRVersionShim();
    }
  }

  removeLoadingElement() {
    let loadingScreen = document.getElementById(window._loadingScreenId);
    if (loadingScreen) {
      loadingScreen.parentNode.removeChild(loadingScreen);
    }
  }

  _updatexr() {
    p5.instance._renderer.ambientLightColors.length = 0;
    p5.instance._renderer.directionalLightDirections.length = 0;
    p5.instance._renderer.directionalLightColors.length = 0;
  
    p5.instance._renderer.pointLightPositions.length = 0;
    p5.instance._renderer.pointLightColors.length = 0;
  }

  // Substitute for p5._setup() which creates a default webgl canvas
  _setupxr() {
    let context = window;
    p5.instance.createCanvas(
      p5.instance._defaultCanvasSize.width,
      p5.instance._defaultCanvasSize.height,
      'webgl'
    );
    if (typeof context.preload === 'function') {
      for (let f in p5.instance._preloadMethods) {
        context[f] = p5.instance._preloadMethods[f][f];
        if (context[f] && p5.instance) {
          context[f] = context[f].bind(p5.instance);
        }
      }
    }

    if (typeof context.setup === 'function') {
      context.setup();
    }

    let canvases = document.getElementsByTagName('canvas');
    for (let i = 0; i < canvases.length; i++) {
      let k = canvases[i];
      if (k.dataset.hidden === 'true') {
        k.style.visibility = '';
        delete k.dataset.hidden;
      }
    }
    p5.instance._setupDone = true;
  }

  /**
   * Called by `createVRCanvas()` or `createARCanvas`.
   * Creates the button for entering XR.
   * Requests an XRDevice object based on current device.
   * Checks if the device supports an immersive session.
   * Then binds the device to the button. <br>
   * <b>TODO:</b> Custom styling for button prior to VR canvas creation.
   */  
  init() {
    window._setup = this._setupxr;
    p5.instance._setup = this._setupxr;
    this.isVR = this instanceof p5vr;
    p5.instance._incrementPreload();
    this.removeLoadingElement();
    // Is WebXR available on this UA?
    this.xrButton = new XRDeviceButton({
      onRequestSession: this.onXRButtonClicked.bind(this),
      onEndSession: this.onSessionEnded.bind(this)
    });
    let header = document.querySelector('header');
    if (!header) {
      header = document.createElement('header');
      document.querySelector('body').appendChild(header);
    }
    header.appendChild(this.xrButton.domElement);

    if (navigator.xr) {
      this.sessionCheck();
    }
  }

  sessionCheck() {
    if(this.injectedPolyfill) {
      if(this.isVR) {
        navigator.xr.requestDevice().then((device) => {
          device.supportsSession({ immersive: true }).then(() => {
            console.log('VR supported with polyfill');
            this.xrButton.setDevice(device);
          });
        });
      } else {
        // AR with polyfill is unsupported currently
        this.printUnsupportedMessage();
        return;
      }
    } else if(this.isVR) {
      navigator.xr.supportsSession('immersive-vr').then(() => {
        console.log('VR supported without polyfill');
        // Updates the button to start an XR session when clicked.
        // HACK
        this.xrButton.setDevice(true);
      });
    } else {
      navigator.xr.supportsSession('legacy-inline-ar').then(() => {
        console.log('AR supported without polyfill');
        // TEMPORARY HACK 4/7/19
        this.xrButton.setDevice(true);
      });
    }
  }

  /**
   * This is the method that is attached to the event that announces
   * availability of a new frame. The next animation frame is requested here,
   * the device pose is retrieved, the modelViewMatrix (`uMVMatrix`) for p5 is set,
   * and each eye is drawn
   * @param frame {XRFrame}
   */
  onXRFrame(t, frame) {
    let session = this.xrSession = frame.session;
    if(session === null || this.gl === null) {return;}
    // Inform the session that we're ready for the next frame.
    session.requestAnimationFrame(this.onXRFrame.bind(this));
    // Get the XRDevice pose relative to the Frame of Reference we created
    // earlier.
    if(this.injectedPolyfill) {
      this.viewer.pose = frame.getDevicePose(this.xrFrameOfRef);
    } else {
      this.viewer.pose = frame.getViewerPose(this.xrFrameOfRef);
    }
    let glLayer = this.injectedPolyfill ? session.baseLayer : session.renderState.baseLayer;

    // Getting the pose may fail if, for example, tracking is lost. So we
    // have to check to make sure that we got a valid pose before attempting
    // to render with it. If not in this case we'll just leave the
    // framebuffer cleared, so tracking loss means the scene will simply
    // dissapear.
    if (this.viewer.pose) {
      // If we do have a valid pose, bind the WebGL layer's framebuffer,
      // which is where any content to be displayed on the XRDevice must be
      // rendered.
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, glLayer.framebuffer);

      if(this.isVR) {
        this._clearVR();
      }
      
      if(this.injectedPolyfill) {
        for(let i=0; i<frame.views.length; i++) {
          this.viewer.view = frame.views[i];
          let viewport = glLayer.getViewport(this.viewer.view);
          this.gl.viewport(viewport.x, viewport.y,
            viewport.width, viewport.height);
          this._drawEye(i);
        }
      } else {
        let i=0;
        for (let view of this.viewer.pose.views) {
          this.viewer.view = view;
          let viewport = glLayer.getViewport(this.viewer.view);
          this.gl.viewport(viewport.x, viewport.y,
            viewport.width, viewport.height);
          this._drawEye(i);
          i++;
        }
      }
    }
  }

  /**
   * Runs the code that the user has in `draw()` once for each eye
   * <b>TODO: </b> optimizations!
   */
  _drawEye(eyeIndex) {
    if(this.isVR) {
      if(eyeIndex === 0) {
        window.p5xr.instance.vrGlobals = { ...vrGlobals};
      } else {
        vrGlobals = {...window.p5xr.instance.vrGlobals};
      }
    }
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
      if (context._renderer.isP3D) {
        this._updatexr();
      } else {
        console.error('Context does not have 3D Renderer');
      }
      
      p5.instance._inUserDraw = true;
      try {
        userDraw();
      } finally {
        p5.instance._inUserDraw = false;
      }
      if(eyeIndex === 1) {
        context._setProperty('frameCount', context.frameCount + 1);
      }
    }
  }

  /**
  * Called either when the user has explicitly ended the session
  *  or when the UA has ended the session for any reason.
  * The xrSession is ended and discarded. p5 is reset with `remove()`
  * 
  */
  onSessionEnded() {
    if(this.xrSession) {
      this.xrSession.end();
      this.xrSession = null;
    }
    var p5Canvi = document.getElementsByClassName('p5Canvas');
    while(p5Canvi.length > 0) {
      p5Canvi[0].parentNode.removeChild(p5Canvi[0]);
    }
    this.xrButton.session = null;
    this.gl = null;
  }

  printUnsupportedMessage() {
    console.warn('Your browser/hardware does not work with AR Mode currently. This is'+
        ' undergoing heavy development currently.' +
        'You may be able to fix this by enabling WebXR flags in Chrome.');
    return;
  }

  remove() {
    if(this.injectedPolyfill) {
      delete navigator.xr;
    }
    if(this.xrButton) {
      this.xrButton.remove();
    }
    window.p5xr.instance = null;
  }

  get instance() {
    return window.p5xr.instance;
  }

  set instance(p5xrInst) {
    window.p5xr.instance = p5xrInst;
    return window.p5xr.instance;
  }
}