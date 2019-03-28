import WebXRPolyfill from 'webxr-polyfill';

export default class p5vr {
    constructor() {
        this.xrDevice = null;
        this.xrSession = null;
        this.xrFrameOfRef = null;

        this.gl = null;

        this.curClearColor = null;

        this.polyfill = new WebXRPolyfill();
        this.versionShim = new WebXRVersionShim();
        console.log('constructor');

        this.startSession = function (session) {
            console.log('session started');
            // xrSession = session;
            // Listen for the sessions 'end' event so we can respond if the user
            // or UA ends the session for any reason.
            // session.addEventListener('end', onSessionEnded.call(this));
            // Create a WebGL context to render with, initialized to be compatible
            // with the XRDisplay we're presenting to.
            createCanvas(windowWidth, windowHeight, WEBGL);
            p5.instance._decrementPreload();
            console.log('MADE VR CANVAS OF WIDTH:' + width + ' AND HEIGHT:' + height);
            let canvas = p5.instance.canvas;
            this.gl = canvas.getContext('webgl', {
                compatibleXRDevice: session.device
            });
            // Use the new WebGL context to create a XRWebGLLayer and set it as the
            // sessions baseLayer. This allows any content rendered to the layer to
            // be displayed on the XRDevice.
            console.log(this.onXRFrame);
            session.baseLayer = new XRWebGLLayer(session, this.gl);
            // Get a frame of reference, which is required for querying poses. In
            // this case an 'eye-level' frame of reference means that all poses will
            // be relative to the location where the XRDevice was first detected.
            session.requestFrameOfReference('eye-level').then((frameOfRef) => {
                this.xrFrameOfRef = frameOfRef;
                // Inform the session that we're ready to begin drawing.
                session.requestAnimationFrame(this.onXRFrame.bind(this));
            });
        };

        this.initVR = function () {
            console.log('init');
            // Is WebXR available on this UA?
            // Is WebXR available on this UA?
            let xrButton = new XRDeviceButton({
                onRequestSession: this.onVRButtonClicked.bind(this),
                onEndSession: this.onSessionEnded.bind(this)
            });
            document.querySelector('header').appendChild(xrButton.domElement);

            if (navigator.xr) {
                // Request a list of all the XR Devices connected to the system.
                navigator.xr.requestDevice().then((device) => {
                    // If the device allows creation of immersive sessions set it as the
                    // target of the 'Enter XR' button.
                    device.supportsSession({ immersive: true }).then(() => {
                        console.log('supported');
                        xrButton.setDevice(device);
                    });
                });
            }
        };



        this.onVRButtonClicked = function (device) {
            console.log('clicked');
            console.log(this);
            // requestSession must be called within a user gesture event
            // like click or touch when requesting an immersive session.
            device.requestSession({ immersive: true }).then(this.startSession.bind(this)
            );
        }

        this.onXRFrame = function (t, frame) {
            let session = frame.session;
            // Inform the session that we're ready for the next frame.
            session.requestAnimationFrame(this.onXRFrame.bind(this));
            // Get the XRDevice pose relative to the Frame of Reference we created
            // earlier.
            let pose = frame.getDevicePose(this.xrFrameOfRef);
            // Getting the pose may fail if, for example, tracking is lost. So we
            // have to check to make sure that we got a valid pose before attempting
            // to render with it. If not in this case we'll just leave the
            // framebuffer cleared, so tracking loss means the scene will simply
            // dissapear.
            if (pose) {
                // If we do have a valid pose, bind the WebGL layer's framebuffer,
                // which is where any content to be displayed on the XRDevice must be
                // rendered.
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, session.baseLayer.framebuffer);
                // Update the clear color so that we can observe the color in the
                // headset changing over time.
                let time = Date.now();
                // Normally you'd loop through each of the views reported by the frame
                // and draw them into the corresponding viewport here, but we're
                // keeping this sample slim so we're not bothering to draw any
                // geometry.
                this._clearVR();
                for (let view of frame.views) {
                    let viewport = session.baseLayer.getViewport(view);
                    this.gl.viewport(viewport.x, viewport.y,
                        viewport.width, viewport.height);
                    p5.instance._renderer.uMVMatrix.set(pose.getViewMatrix(view));
                    p5.instance._renderer.uPMatrix.set(view.projectionMatrix);
                    this._drawEye();
                }
            }
        };

        this._clearVR = function () {
            if (this.curClearColor === null) {
                return;
            }

            background(this.curClearColor);
        };

        this._drawEye = function () {
            // 
            if (!p5.instance._renderer.isP3D) {
                return;
            }

            var context = window;
            var userSetup = context.setup;
            var userDraw = context.draw;
            if (typeof userDraw === 'function') {
                if (typeof userSetup === 'undefined') {
                    context.scale(context._pixelDensity, context._pixelDensity);
                }
                var callMethod = function (f) {
                    f.call(context);
                };
                if (context._renderer.isP3D) {
                    context._renderer._update();
                }
                context._setProperty('frameCount', context.frameCount + 1);
                context._registeredMethods.pre.forEach(callMethod);
                p5.instance._inUserDraw = true;
                try {
                    userDraw();
                } finally {
                    p5.instance._inUserDraw = false;
                }
                context._registeredMethods.post.forEach(callMethod);
            }
        }

        this.onEndSession = function (session) {
            session.end();
        }
        // Called either when the user has explicitly ended the session (like in
        // onEndSession()) or when the UA has ended the session for any reason.
        // At this point the session object is no longer usable and should be
        // discarded.
        this.onSessionEnded = function (event) {
            this.xrSession = null;
            xrButton.innerHTML = 'Enter VR';
            // In this simple case discard the WebGL context too, since we're not
            // rendering anything else to the screen with it.
            this.gl = null;
        }
    }

    // Called when we've successfully acquired a XRSession. In response we
    // will set up the necessary session state and kick off the frame loop.
}

// export default () => {

// };