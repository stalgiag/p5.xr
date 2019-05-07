
import WebXRPolyfill from 'webxr-polyfill';
import WebXRVersionShim from '../../webxr/webxr-version-shim';

let _instance;

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
export default class p5xr{
  constructor(){
    this.xrDevice = null;
    this.xrSession = null;
    this.xrFrameOfRef = null;
    this.gl = null;

    // TODO: initialize with default and make this use p5.Color
    this.curClearColor = null;
    this.injectedPolyfill = false;
    if(!navigator.xr){
      window.polyfill = new WebXRPolyfill();
      this.injectedPolyfill = polyfill.injected;
    }
    window.versionShim = new WebXRVersionShim();
    _instance = this;

    this.removeLoadingElement = function(){
      let loadingScreen = document.getElementById(window._loadingScreenId);
      if (loadingScreen){
        loadingScreen.parentNode.removeChild(loadingScreen);
      }
    };

    this.preloadOverride = function(){
      let context = window;
      context._setup();
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
      var p5Canvi = document.getElementsByClassName('p5Canvas');
      while(p5Canvi.length > 0){
        p5Canvi[0].parentNode.removeChild(p5Canvi[0]);
      }
      xrButton.session = null;
      self.gl = null;
    };
    
  }

  get instance(){
    return _instance;
  }

  set instance(p5xrInst){
    _instance = p5xrInst;
    return _instance;
  }
}