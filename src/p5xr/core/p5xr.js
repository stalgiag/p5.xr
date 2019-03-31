
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
    
  }

  get instance(){
    return _instance;
  }

  set instance(p5xrInst){
    _instance = p5xrInst;
    return _instance;
  }
}