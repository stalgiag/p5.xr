
import WebXRPolyfill from 'webxr-polyfill';
import WebXRVersionShim from '../../webxr/webxr-version-shim';

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
    this.xrDevice = null;
    this.xrButton;
    this.xrSession = null;
    this.xrFrameOfRef = null;
    this.gl = null;
    // TODO: initialize with default and make this use p5.Color
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

    this.init = function() {
      p5.instance._incrementPreload();
      self.removeLoadingElement();
      // Is WebXR available on this UA?
      self.xrButton = new XRDeviceButton({
        onRequestSession: self.onVRButtonClicked,
        onEndSession: self.onSessionEnded
      });
      document.querySelector('header').appendChild(self.xrButton.domElement);

      if (navigator.xr) {
        // Request a list of all the XR Devices connected to the system.
        
        // If the device allows creation of immersive sessions set it as the
        // target of the 'Enter XR' button.
        if(self.injectedPolyfill) {
          self.polyFillSessionCheck();
        } else {
          self.noPolyFillSessionCheck();
        }
      }
    };

    this.sessionCheck = function() {
      
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