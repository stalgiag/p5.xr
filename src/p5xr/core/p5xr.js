import p5xrViewer from './p5xrViewer';
import p5xrButton from './p5xrButton';
import p5xrInput from './p5xrInput';

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
  constructor(xrButton) {
    this.xrDevice = null;
    this.xrButton = xrButton || null;
    this.mode = null; // VR, AR or MR
    this.hasImmersive = null;
    this.xrSession = null;
    this.xrRefSpace = null;
    this.xrViewerSpace = null;
    this.xrHitTestSource = null;
    this.frame = null;
    this.gl = null;
    this.curClearColor = color(255, 255, 255);
    this.viewer = new p5xrViewer();
  }

  /**
   * Hide the preload loading element
   * @private
   * @ignore
   */
  __removeLoadingElement() {
    const loadingScreen = document.getElementById(window._loadingScreenId);
    if (loadingScreen) {
      loadingScreen.parentNode.removeChild(loadingScreen);
    }
  }

  /**
   * Resets a few key WebGL renderer values. This is typically handled by p5.RendererGL.
   * but we need to do it manually so that it doesn't happen between drawing in each eye
   * @private
   * @ignore
   */
  __updateXR() {
    const renderer = p5.instance._renderer;
    // reset light data for new frame.

    renderer.ambientLightColors.length = 0;
    renderer.specularColors = [1, 1, 1];

    renderer.directionalLightDirections.length = 0;
    renderer.directionalLightDiffuseColors.length = 0;
    renderer.directionalLightSpecularColors.length = 0;

    renderer.pointLightPositions.length = 0;
    renderer.pointLightDiffuseColors.length = 0;
    renderer.pointLightSpecularColors.length = 0;

    renderer.spotLightPositions.length = 0;
    renderer.spotLightDirections.length = 0;
    renderer.spotLightDiffuseColors.length = 0;
    renderer.spotLightSpecularColors.length = 0;
    renderer.spotLightAngle.length = 0;
    renderer.spotLightConc.length = 0;

    renderer._enableLighting = false;

    // reset tint value for new frame
    renderer._tint = [255, 255, 255, 255];
  }

  /**
   * Substitute for p5._setup() which creates a default webgl canvas
   * @private
   * @ignore
   */
  __setupCanvas() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    p5.instance._setupDone = true;
  }

  /**
   * Called by `createVRCanvas()` or `createARCanvas`.
   * Creates the button for entering XR.
   * Requests an XRDevice object based on current device.
   * Checks if the device supports an immersive session.
   * Then binds the device to the button.
   * @private
   * @ignore
   */
  __createButton() {
    p5.instance._incrementPreload();
    this.__setupCanvas();
    this.__removeLoadingElement();
    this.xrButton = new p5xrButton({
      onRequestSession: this.__onXRButtonClicked.bind(this),
      onEndSession: this.__onSessionEnded.bind(this),
      textEnterXRTitle: 'LOADING',
    });
    let header = document.querySelector('header');
    if (!header) {
      header = document.createElement('header');
      document.querySelector('body').appendChild(header);
    }
    header.appendChild(this.xrButton.domElement);

    this.__sessionCheck();
  }

  /**
   * Checks if the device supports an immersive session.
   * If it does, gives the device to the button and updates its state.
   * @private
   * @ignore
   */
  async __sessionCheck() {
    // WebXR availabilty
    if (navigator?.xr) {
      console.log('XR Available');
      const mode = this.mode;
      const session = this.mode === 'VR' ? 'immersive-vr' : 'immersive-ar';
      const supported = await navigator.xr.isSessionSupported(session);
      this.hasImmersive = supported;
      this.xrButton.setAvailable(supported, mode);
    } else {
      console.log('XR Not Available');
      this.xrButton.disable();
    }
  }

  /**
   * This is the method that is attached to the event that announces
   * availability of a new frame. The next animation frame is requested here,
   * the device pose is retrieved, the modelViewMatrix (`uMVMatrix`) for p5 is set,
   * and each eye is drawn
   * @param frame {XRFrame}
   * @private
   * @ignore
   */
  __onXRFrame(t, frame) {
    const session = (this.xrSession = frame.session);
    if (session === null || this.gl === null) {
      return;
    }
    // Inform the session that we're ready for the next frame.
    session.requestAnimationFrame(this.__onXRFrame.bind(this));

    let targetRefSpace = this.xrRefSpace;
    if (this.mode === 'VR' && !this.isImmersive) {
      // Account for the click-and-drag mouse movement or touch movement when
      // calculating the viewer pose for inline sessions.
      targetRefSpace = this.getAdjustedRefSpace(this.xrRefSpace);
    }
    // Get the XRDevice pose relative to the Frame of Reference we created
    // earlier.
    const viewer = frame.getViewerPose(this.xrRefSpace);
    const glLayer = session.renderState.baseLayer;
    this.frame = frame;
    // Getting the pose may fail if, for example, tracking is lost. So we
    // have to check to make sure that we got a valid pose before attempting
    // to render with it. If not in this case we'll just leave the
    // framebuffer cleared, so tracking loss means the scene will simply
    // dissapear.
    if (viewer) {
      this.viewer.pose = frame.getViewerPose(targetRefSpace);
      // If we do have a valid pose, bind the WebGL layer's framebuffer,
      // which is where any content to be displayed on the XRDevice must be
      // rendered.
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, glLayer.framebuffer);

      if (this.mode === 'VR') {
        this.clearVR();
      }

      let i = 0;
      for (const view of this.viewer.pose.views) {
        this.viewer.view = view;
        const scaleFactor = this.isImmersive ? 1 : pixelDensity();
        const viewport = glLayer.getViewport(this.viewer.view);
        this.gl.viewport(
          viewport.x,
          viewport.y,
          viewport.width * scaleFactor,
          viewport.height * scaleFactor
        );
        this.__updateViewport(viewport);

        this.__drawEye(i);
        i++;
      }
    }
  }

  /**
   * Update the renderer viewport to match rendering eye
   * @param {XRViewport} viewport The viewport of the eye
   * @private
   * @ignore
   */
  __updateViewport(viewport) {
    p5.instance._renderer._viewport[0] = viewport.x;
    p5.instance._renderer._viewport[1] = viewport.y;
    p5.instance._renderer._viewport[2] = viewport.width;
    p5.instance._renderer._viewport[3] = viewport.height;
  }

  /**
   * Runs the code that the user has in `draw()` once for each eye
   * So twice for VR and once for AR
   * @param {Number} i The index of the eye
   * @private
   * @ignore
   */
  __drawEye(eyeIndex) {
    const context = window;
    const userSetup = context.setup;
    const userDraw = context.draw;
    const userCalculate = context.calculate;

    if (this.mode === 'VR' || this.mode === 'MR') {
      if (eyeIndex === 0) {
        if (typeof userCalculate === 'function') {
          userCalculate();
        }
        const now = window.performance.now();
        p5.instance.deltaTime = now - p5.instance._lastFrameTime;
        p5.instance._frameRate = 1000.0 / p5.instance.deltaTime;
        p5.instance._setProperty('deltaTime', p5.instance.deltaTime);
        p5.instance._lastFrameTime = now;
        context._setProperty('frameCount', context.frameCount + 1);
      }
    } else {
      // Scale is much smaller in AR
      scale(0.01);
    }
    // 2D Mode should use graphics object
    if (!p5.instance._renderer.isP3D) {
      console.error('Sketch does not have 3D Renderer');
      return;
    }

    if (typeof userDraw === 'function') {
      if (typeof userSetup === 'undefined') {
        context.scale(context._pixelDensity, context._pixelDensity);
      }

      this.__updateXR();

      p5.instance._inUserDraw = true;

      try {
        userDraw();
      } finally {
        p5.instance._inUserDraw = false;
      }
    }
  }

  /**
   * Takes a string and returns a p5xrInput
   * Public interface is p5.prototype.getXRInput which calls this
   * @param {String} input The input identifier
   * @returns {p5xrInput} The input object
   * @private
   * @ignore
   */
  __getXRInput(input) {
    let inputDevice;
    this.xrSession.inputSources.forEach((inputSource) => {
      if (inputSource.handedness === input) {
        inputDevice = new p5xrInput(inputSource, this.frame, this.xrRefSpace);
      }
    });
    return inputDevice;
  }

  /**
   * Called either when the user has explicitly ended the session
   *  or when the UA has ended the session for any reason.
   * The xrSession is ended and discarded. p5 is reset with `remove()`
   *  //TODO: Revisit how we exit session
   * @private
   * @ignore
   */
  __onSessionEnded() {
    if (!(this.mode === 'VR')) {
      this.xrHitTestSource.cancel();
      this.xrHitTestSource = null;
    } else if (this.isImmersive) {
      console.log('Exiting immersive session');
      this.isImmersive = false;
      this.__sessionCheck();
      console.log('Requesting new session');
      navigator.xr.requestSession('inline').then(this.__startSketch.bind(this));
    }
    if (this.isImmersive && this.hasImmersive) {
      this.isImmersive = false;
    }
  }

  /**
   * @private
   * @ignore
   */
  printUnsupportedMessage() {
    console.warn(
      'Your browser/hardware does not work with AR Mode currently. This is' +
        ' undergoing heavy development currently.' +
        'You may be able to fix this by enabling WebXR flags in Chrome.'
    );
  }

  remove() {
    if (this.xrButton) {
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
