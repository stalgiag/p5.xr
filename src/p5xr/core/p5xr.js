import p5xrViewer from './p5xrViewer';
import p5xrButton from './p5xrButton';
import p5xrInput from './p5xrInput';
import '../features/handtracking';

/**
 * p5vr class holds all state and methods that are specific to VR
 * @class
 *
 * @constructor
 *
 * @param {Object} [options={}] - Configuration options for the XR session
 * @param {Array<"anchors" | "bounded-floor" | "depth-sensing" | "dom-overlay" |
 * "hand-tracking" | "hit-test" | "layers" | "light-estimation" | "local" |
 * "local-floor" | "secondary-views" | "unbounded" | "viewer">} [options.requiredFeatures=[]] - Required features
 * @param {Object} [options={}] - Configuration options for the XR session
 * @param {Array<"anchors" | "bounded-floor" | "depth-sensing" | "dom-overlay" |
 * "hand-tracking" | "hit-test" | "layers" | "light-estimation" | "local" |
 * "local-floor" | "secondary-views" | "unbounded" | "viewer">} [options.optionalFeatures=[]] - Optional features
 *
 * @property mode  {"inline" | "immersive-ar" | "immersive-vr"} WebXR session mode
 * @property vrDevice  {XRDevice} the current VR compatible device
 * @property vrSession  {XRSession} the current VR session
 * @property vrFrameOfRef  {XRFrameOfReference} the current VR frame of reference
 * (starting point for transform, default eye-level)
 * @property gl  {WebGLRenderingContext} points to p5.RendererGL.GL (the WebGL Rendering Context)
 * @property curClearColor  {Color} background clear color set by global `setVRBackgroundColor`
 */
export default class p5xr {
  constructor(options = {}) {
    const { requiredFeatures = [], optionalFeatures = ['hand-tracking'] } = options;

    this.xrDevice = null;
    this.isVR = null;
    this.mode = 'inline';
    this.hasImmersive = null;
    this.isImmersive = false;
    this.xrSession = null;
    this.xrRefSpace = null;
    this.xrViewerSpace = null;
    this.xrHitTestSource = null;
    this.frame = null;
    this.gl = null;
    this.curClearColor = color(255, 255, 255);
    this.viewer = new p5xrViewer();

    this.requiredFeatures = requiredFeatures;
    this.optionalFeatures = optionalFeatures;
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
   * Overrides some p5.js default values to reflect sensible real-world metric sizes in XR
   * @private
   * @ignore
   */
  __setupSensibleXRDefaults() {
    if (typeof linePerspective !== 'undefined') {
      if (linePerspective()) {
        // Stroke weight of 1mm
        console.log(
          'p5xr: linePerspective is active, setting stroke width to 0.001',
        );
        strokeWeight(0.001);
      }
    }
  }

  /**
   * Substitute for p5._setup() which creates a default webgl canvas
   * @private
   * @ignore
   */
  __setupCanvas() {
    createCanvas(windowWidth, windowHeight, WEBGL);
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
      onEndSession: this.__onEndSession.bind(this),
      textEnterXRTitle: `Enter ${this.displayMode}`,
      textXRNotFoundTitle: `${this.displayMode} not found`,
      textExitXRTitle: `Exit ${this.displayMode}`,
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
      const supported = await navigator.xr.isSessionSupported(this.mode);
      this.hasImmersive = supported;
      this.xrButton.setAvailable(supported, this.mode);
    } else {
      console.log('XR Not Available');
      this.xrButton.disable();
    }
  }

  /**
   * Helper function to reset XR and GL, should be called between
   * ending an XR session and starting a new XR session
   * @method resetXR
   */
  resetXR() {
    this.xrDevice = null;
    this.xrSession = null;
    this.xrButton.setSession(null);
    this.xrRefSpace = null;
    this.xrViewerSpace = null;
    this.xrHitTestSource = null;
    this.gl = null;
    this.frame = null;
  }

  /**
   * `navigator.xr.requestSession()` must be called within a user gesture event.
   * @private
   * @ignore
   */
  __onXRButtonClicked() {
    if (!this.hasImmersive) {
      this.xrButton.hide();
      return;
    }

    console.log(`Requesting session with mode: ${this.mode}`);
    this.isImmersive = true;
    this.resetXR();

    const isEmulator = typeof CustomWebXRPolyfill !== 'undefined';
    const isP5LiveEditor = window.parent?.p5frame;
    const parentFrameXRSession = !isEmulator && isP5LiveEditor;
    const context = parentFrameXRSession ? window.parent : window;

    if (parentFrameXRSession) {
      console.log('p5xr: p5live experimental xr session persistance mode');
    }

    if (context.xrSession) {
      console.log('p5xr: p5live mode attempting xr session reuse');
      setTimeout(() => {
        const session = context.xrSession;
        this.xrButton.setSession(session);
        this.__startSketch.call(this, session);
      }, 1);
    } else {
      context.navigator.xr
        .requestSession(this.mode, {
          requiredFeatures: this.requiredFeatures,
          optionalFeatures: this.optionalFeatures,
        })
        .then((session) => {
          context.xrSession = session;
          this.xrButton.setSession(session);
          this.__startSketch.call(this, session);
        })
        .catch((error) => {
          console.error(`An error occured activating ${this.mode}: ${error}`);
        });
    }
  }

  /**
   * Attempts to start an interactive session outside of the normal flow
   * Useful for development with the Immersive Web Emulator or when a special flag is activated to bypass the need for a user action
   */
  startXRWithoutUserAction() {
    this.hasImmersive = true;
    this.__onXRButtonClicked();
  }

  /**
   * This is where the actual p5 canvas is first created, and
   * the GL rendering context is accessed by p5vr.
   * The current XRSession also gets a frame of reference and
   * base rendering layer. <br>
   * @param {XRSession}
   * @private
   * @ignore
   */
  __startSketch(session) {
    this.xrSession = session;
    this.canvas = p5.instance.canvas;
    this.canvas.style.visibility = 'visible';

    p5.instance._renderer._curCamera.cameraType = 'custom';
    p5.instance._renderer._curCamera.useLinePerspective = false;

    if (typeof window.setup === 'function') {
      if (!p5.instance._setupDone) {
        window.setup();
      }
      p5.instance._millisStart = window.performance.now();
    }

    this.__setupSensibleXRDefaults();

    const refSpaceRequest = this.isImmersive ? 'local' : 'viewer';
    this.xrSession.requestReferenceSpace(refSpaceRequest).then((refSpace) => {
      this.xrRefSpace = refSpace;
      // Inform the session that we're ready to begin drawing.
      this.xrSession.requestAnimationFrame(this.__onXRFrame.bind(this));
      if (!this.isImmersive) {
        this.xrSession.updateRenderState({
          baseLayer: new XRWebGLLayer(this.xrSession, this.gl),
          inlineVerticalFieldOfView: 70 * (Math.PI / 180),
        });
        this.addInlineViewListeners(this.canvas);
      }
    });
    this.__onRequestSession();
  }

  /**
   * Requests a reference space and makes the p5's WebGL layer XR compatible.
   * @private
   * @ignore
   */
  __onRequestSession() {
    this.xrSession.addEventListener('end', (event) =>
      this.__onSessionEnded(event),
    );

    const refSpaceRequest = this.isImmersive ? 'local' : 'viewer';
    this.gl = this.canvas.getContext(p5.instance.webglVersion);
    this.gl
      .makeXRCompatible()
      .then(() => {
        // Use the p5's WebGL context to create a XRWebGLLayer and set it as the
        // sessions baseLayer. This allows any content rendered to the layer to
        // be displayed on the XRDevice;
        this.xrSession.updateRenderState({
          baseLayer: new XRWebGLLayer(this.xrSession, this.gl),
        });
        // TODO : need better way to handle feature-specific actions
        if (this.requiredFeatures.includes('hit-test')) {
          this.xrSession.requestReferenceSpace('viewer').then((refSpace) => {
            this.xrViewerSpace = refSpace;
            this.xrSession
              .requestHitTestSource({ space: this.xrViewerSpace })
              .then((hitTestSource) => {
                this.xrHitTestSource = hitTestSource;
              });
          });
        }

        // Get a frame of reference, which is required for querying poses.
        // 'local' places the initial pose relative to initial location of viewer
        // 'viewer' is only for inline experiences and only allows rotation
        this.xrSession
          .requestReferenceSpace(refSpaceRequest)
          .then((refSpace) => {
            this.xrRefSpace = refSpace;
            // Request initial animation frame
            this.xrSession.requestAnimationFrame(this.__onXRFrame.bind(this));
          });
      })
      .catch((e) => {
        console.log(e);
      });
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
    if (this.isVR && !this.isImmersive) {
      // Account for the click-and-drag mouse movement or touch movement when
      // calculating the viewer pose for inline sessions.
      targetRefSpace = this.getAdjustedRefSpace(this.xrRefSpace);
    }
    // Get the XRDevice pose relative to the Frame of Reference we created
    // earlier.
    const viewer = frame.getViewerPose(this.xrRefSpace);
    const glLayer = session.renderState.baseLayer;
    this.frame = frame;

    for (const inputSource of session.inputSources) {
      _handleHandInput(frame, this.xrRefSpace, inputSource);
    }

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

      if (this.isVR) {
        this.clearVR();
      }

      const context = window;
      const userCalculate = context.calculate;
      if (this.viewer.pose.views.length > 1) {
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

      let i = 0;
      for (const view of this.viewer.pose.views) {
        this.viewer.view = view;
        const scaleFactor = this.isImmersive ? 1 : pixelDensity();
        const viewport = glLayer.getViewport(this.viewer.view);
        this.gl.viewport(
          viewport.x,
          viewport.y,
          viewport.width * scaleFactor,
          viewport.height * scaleFactor,
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
  __drawEye() {
    const context = window;
    const userSetup = context.setup;
    const userDraw = context.draw;

    // 2D Mode should use graphics object
    if (!p5.instance._renderer.isP3D) {
      console.error('Sketch does not have 3D Renderer');
      return;
    }

    if (typeof userDraw === 'function') {
      if (typeof userSetup === 'undefined') {
        context.scale(context._pixelDensity, context._pixelDensity);
      }
      context.resetMatrix();
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
   * Called by the XRButton when Exit XR is clicked
   * Should perform cleanup here
   * @private
   * @ignore
   */
  __onEndSession(session) {
    if (!this.isVR) {
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

    session.end();
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
    this.resetXR();
    if (window.parent && window.parent.xrSession) {
      window.parent.xrSession = null;
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
        'You may be able to fix this by enabling WebXR flags in Chrome.',
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
