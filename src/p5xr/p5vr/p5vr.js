import WebXRPolyfill from 'webxr-polyfill';

export default() => {

    let xrDevice = null;
    let xrSession = null;
    let xrFrameOfRef = null;

    let gl = null;

    p5.prototype.createVRCanvas = function () {
        var polyfill = new WebXRPolyfill();
        // var versionShim = new WebXRVersionShim();
        initVR(this);
    }

    // Called when we've successfully acquired a XRSession. In response we
    // will set up the necessary session state and kick off the frame loop.
    function onVRSessionStarted(session) {
        xrSession = session;
        // Listen for the sessions 'end' event so we can respond if the user
        // or UA ends the session for any reason.
        session.addEventListener('end', onSessionEnded);
        // Create a WebGL context to render with, initialized to be compatible
        // with the XRDisplay we're presenting to.
        createCanvas(windowWidth, windowHeight, WEBGL);
        console.log('MADE VR CANVAS');
        let canvas = p5.instance.canvas;
        gl = canvas.getContext('webgl', {
            compatibleXRDevice: session.device
        });
        // Use the new WebGL context to create a XRWebGLLayer and set it as the
        // sessions baseLayer. This allows any content rendered to the layer to
        // be displayed on the XRDevice.
        session.baseLayer = new XRWebGLLayer(session, gl);
        // Get a frame of reference, which is required for querying poses. In
        // this case an 'eye-level' frame of reference means that all poses will
        // be relative to the location where the XRDevice was first detected.
        session.requestFrameOfReference('eye-level').then((frameOfRef) => {
            xrFrameOfRef = frameOfRef;
            // Inform the session that we're ready to begin drawing.
            session.requestAnimationFrame(onXRFrame);
        });
    }

    function initVR(_pInst) {
        // Is WebXR available on this UA?
        if (navigator.xr) {
            // Request an XRDevice connected to the system.
            let xrButton = document.getElementById('xr-button');
            navigator.xr.requestDevice().then((device) => {
                xrDevice = device;
                device.supportsSession({ immersive: true }).then(() => {
                    xrButton.addEventListener('click', onVRButtonClicked);
                    xrButton.innerHTML = 'Enter XR';
                    xrButton.disabled = false;
                    console.log('supported');
                });
            });
        }
    }

    function onVRButtonClicked() {
        console.log('clicked');
        if (!xrSession) {
            xrDevice.requestSession({ immersive: true }).then(onVRSessionStarted);
        } else {
            xrSession.end();
        }
    }


    function onXRFrame(t, frame) {
        let session = frame.session;
        // Inform the session that we're ready for the next frame.
        session.requestAnimationFrame(onXRFrame);
        // Get the XRDevice pose relative to the Frame of Reference we created
        // earlier.
        let pose = frame.getDevicePose(xrFrameOfRef);
        // Getting the pose may fail if, for example, tracking is lost. So we
        // have to check to make sure that we got a valid pose before attempting
        // to render with it. If not in this case we'll just leave the
        // framebuffer cleared, so tracking loss means the scene will simply
        // dissapear.
        if (pose) {
            // If we do have a valid pose, bind the WebGL layer's framebuffer,
            // which is where any content to be displayed on the XRDevice must be
            // rendered.
            gl.bindFramebuffer(gl.FRAMEBUFFER, session.baseLayer.framebuffer);
            // Update the clear color so that we can observe the color in the
            // headset changing over time.
            let time = Date.now();
            // Normally you'd loop through each of the views reported by the frame
            // and draw them into the corresponding viewport here, but we're
            // keeping this sample slim so we're not bothering to draw any
            // geometry.
            background(200, 0, 200);
            for (let view of frame.views) {
                let viewport = session.baseLayer.getViewport(view);
                gl.viewport(viewport.x, viewport.y,
                    viewport.width, viewport.height);
                p5.instance._renderer.uMVMatrix.set(pose.getViewMatrix(view));
                p5.instance._renderer.uPMatrix.set(view.projectionMatrix);
                drawing();
                // Draw something.
                //   drawScene(view.projectionMatrix, pose.getViewMatrix(view));
            }
        }
    }

    let viewX = 0;

    function drawing() {
        // 
        fill(0, 150, 100);
        translate(0, 0, 10);
        strokeWeight(0.1);
        rotateX(10);
        rotateY(20);
        box(5);
        p5.instance._renderer._update();
    }

    function onEndSession(session) {
        session.end();
    }
    // Called either when the user has explicitly ended the session (like in
    // onEndSession()) or when the UA has ended the session for any reason.
    // At this point the session object is no longer usable and should be
    // discarded.
    function onSessionEnded(event) {
        xrSession = null;
        xrButton.innerHTML = 'Enter VR';
        // In this simple case discard the WebGL context too, since we're not
        // rendering anything else to the screen with it.
        gl = null;
    }

    p5.RendererGL.prototype._update = function () {
        /* TODO: Figure out how to avoid overwriting this function */
        /* IE: Override the resetting of cameraMatrices in _update */
        /*
        /*
        /*
        /*
        /*
        */

        // reset model view and apply initial camera transform
        // (containing only look at info; no projection).
        // this.uMVMatrix.set(
        //   this._curCamera.cameraMatrix.mat4[0],
        //   this._curCamera.cameraMatrix.mat4[1],
        //   this._curCamera.cameraMatrix.mat4[2],
        //   this._curCamera.cameraMatrix.mat4[3],
        //   this._curCamera.cameraMatrix.mat4[4],
        //   this._curCamera.cameraMatrix.mat4[5],
        //   this._curCamera.cameraMatrix.mat4[6],
        //   this._curCamera.cameraMatrix.mat4[7],
        //   this._curCamera.cameraMatrix.mat4[8],
        //   this._curCamera.cameraMatrix.mat4[9],
        //   this._curCamera.cameraMatrix.mat4[10],
        //   this._curCamera.cameraMatrix.mat4[11],
        //   this._curCamera.cameraMatrix.mat4[12],
        //   this._curCamera.cameraMatrix.mat4[13],
        //   this._curCamera.cameraMatrix.mat4[14],
        //   this._curCamera.cameraMatrix.mat4[15]
        // );
        // p5.instance._renderer.uMVMatrix.set(viewMat);
        // p5.instance._renderer.uPMatrix.set(projMat);
        // reset light data for new frame.

        /*
        /*
        /*
        /*
        /*
        */
        /* TODO: Figure out how to avoid overwriting this function */
        /* IE: Override the resetting of cameraMatrices in _update */

        this.ambientLightColors.length = 0;
        this.directionalLightDirections.length = 0;
        this.directionalLightColors.length = 0;

        this.pointLightPositions.length = 0;
        this.pointLightColors.length = 0;
    };
};