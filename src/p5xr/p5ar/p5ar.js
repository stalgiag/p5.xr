import p5xr from '../core/p5xr';

export default class p5ar extends p5xr {
  constructor() {
    super();
    // let self = p5xr.instance;
    let xrButton;
    this.canvas = null;

    /**
     * This is where the actual p5 canvas is first created, and
     * the GL rendering context is accessed by p5vr. 
     * The current XRSession also gets a frame of reference and
     * base rendering layer. <br>
     * @param {XRSession}
     */
    this.startSketch = function(session) {
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
    this.onXRButtonClicked = function(device) {
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
      setTimeout(function() {
        outputCanvas.style.height = window.innerHeight + 'px';
      }, 0);
      // HACK to get close to 'fullscreen' 4/7/19
      xrButton.hide();
      if(self.injectedPolyfill) {
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

    this.onRequestSessionPolyfill = function() {
      // STUB
    };

    this.onRequestSessionNoPF = function() {
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
  }
}