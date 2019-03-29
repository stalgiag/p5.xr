import WebXRPolyfill from 'webxr-polyfill';
// currently a stub

export default class p5ar{
  constructor(){
    this.xrDevice = null;
    this.xrSession = null;
    this.xrFrameOfRef = null;

    this.gl = null;
    this.polyfill = new WebXRPolyfill();
    this.versionShim = new WebXRVersionShim();
  }
}