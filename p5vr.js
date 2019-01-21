// (function () {
//     'use strict';
//     var polyfill = new WebXRPolyfill();
//     var versionShim = new WebXRVersionShim();
//     // XR globals.
//     let xrButton = document.getElementById('xr-button');
//     let xrDevice = null;
//     let xrSession = null;
//     let xrFrameOfRef = null;
//     // WebGL scene globals.
//     let gl = null;
//     // Checks to see if WebXR is available and, if so, requests an XRDevice
//     // that is connected to the system and tests it to ensure it supports the
//     // desired session options.
//     function initXR() {
//       // Is WebXR available on this UA?
//       if (navigator.xr) {
//         // Request an XRDevice connected to the system.
//         navigator.xr.requestDevice().then((device) => {
//           xrDevice = device;
//           // If the device allows creation of exclusive sessions set it as the
//           // target of the 'Enter XR' button.
//           device.supportsSession({immersive: true}).then(() => {
//             // Updates the button to start an XR session when clicked.
//             xrButton.addEventListener('click', onButtonClicked);
//             xrButton.innerHTML = 'Enter XR';
//             xrButton.disabled = false;
//           });
//         });
//       }
//     }
//     // Called when the user clicks the button to enter XR. If we don't have a
//     // session already we'll request one, and if we do we'll end it.
//     function onButtonClicked() {
//       if (!xrSession) {
//         xrDevice.requestSession({immersive: true}).then(onSessionStarted);
//       } else {
//         xrSession.end();
//       }
//     }
//     // Called when we've successfully acquired a XRSession. In response we
//     // will set up the necessary session state and kick off the frame loop.
//     function onSessionStarted(session) {
//       xrSession = session;
//       xrButton.innerHTML = 'Exit XR';
//       // Listen for the sessions 'end' event so we can respond if the user
//       // or UA ends the session for any reason.
//       session.addEventListener('end', onSessionEnded);
//       // Create a WebGL context to render with, initialized to be compatible
//       // with the XRDisplay we're presenting to.
//       let canvas = document.createElement('canvas');
//       gl = canvas.getContext('webgl', {
//         compatibleXRDevice: session.device
//       });
//       // Use the new WebGL context to create a XRWebGLLayer and set it as the
//       // sessions baseLayer. This allows any content rendered to the layer to
//       // be displayed on the XRDevice.
//       session.baseLayer = new XRWebGLLayer(session, gl);
//       // Get a frame of reference, which is required for querying poses. In
//       // this case an 'eye-level' frame of reference means that all poses will
//       // be relative to the location where the XRDevice was first detected.
//       session.requestFrameOfReference('eye-level').then((frameOfRef) => {
//         xrFrameOfRef = frameOfRef;
//         // Inform the session that we're ready to begin drawing.
//         session.requestAnimationFrame(onXRFrame);
//       });
//     }
//     // Called when the user clicks the 'Exit XR' button. In response we end
//     // the session.
//     function onEndSession(session) {
//       session.end();
//     }
//     // Called either when the user has explicitly ended the session (like in
//     // onEndSession()) or when the UA has ended the session for any reason.
//     // At this point the session object is no longer usable and should be
//     // discarded.
//     function onSessionEnded(event) {
//       xrSession = null;
//       xrButton.innerHTML = 'Enter VR';
//       // In this simple case discard the WebGL context too, since we're not
//       // rendering anything else to the screen with it.
//       gl = null;
//     }
//     // Called every time the XRSession requests that a new frame be drawn.
//     function onXRFrame(t, frame) {
//       let session = frame.session;
//       // Inform the session that we're ready for the next frame.
//       session.requestAnimationFrame(onXRFrame);
//       // Get the XRDevice pose relative to the Frame of Reference we created
//       // earlier.
//       let pose = frame.getDevicePose(xrFrameOfRef);
//       // Getting the pose may fail if, for example, tracking is lost. So we
//       // have to check to make sure that we got a valid pose before attempting
//       // to render with it. If not in this case we'll just leave the
//       // framebuffer cleared, so tracking loss means the scene will simply
//       // dissapear.
//       if (pose) {
//         // If we do have a valid pose, bind the WebGL layer's framebuffer,
//         // which is where any content to be displayed on the XRDevice must be
//         // rendered.
//         gl.bindFramebuffer(gl.FRAMEBUFFER, session.baseLayer.framebuffer);
//         // Update the clear color so that we can observe the color in the
//         // headset changing over time.
//         let time = Date.now();
//         gl.clearColor(Math.cos(time / 2000), Math.cos(time / 4000), Math.cos(time / 6000), 1.0);
//         // Clear the framebuffer
//         gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//         // Normally you'd loop through each of the views reported by the frame
//         // and draw them into the corresponding viewport here, but we're
//         // keeping this sample slim so we're not bothering to draw any
//         // geometry.
//         for (let view of frame.views) {
//           let viewport = session.baseLayer.getViewport(view);
//           gl.viewport(viewport.x, viewport.y,
//                       viewport.width, viewport.height);
//           // Draw something.
//           drawScene(view.projectionMatrix, pose.getViewMatrix(view));
//         }
//       }
//     }

//     function drawScene(projectionMatrix, viewMatrix) {

//     }
//     // Start the XR application.
//     initXR();
//   })();

let xrDevice = null;
let xrSession = null;
let xrFrameOfRef = null;
//     // WebGL scene globals.
let gl = null;


p5.prototype.createVRCanvas = function () {
    var polyfill = new WebXRPolyfill();
    var versionShim = new WebXRVersionShim();

    // this.createCanvas(100, 100, WEBGL);
    // gl = this.renderer.GL;
    // console.log('MADE VR CANVAS');
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

let viewMat;
let projMat;

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
        for (let view of frame.views) {
            let viewport = session.baseLayer.getViewport(view);
            viewMat = new p5.Matrix();
            viewMat = pose.getViewMatrix(view);

            projMat = new p5.Matrix();
            projMat = view.projectionMatrix
            // gl.viewport(viewport.x, viewport.y,
            //     viewport.width, viewport.height);
            // p5.instance._renderer.uMVMatrix.set(pose.getViewMatrix(view));
            // p5.instance._renderer.uPMatrix.set(view.projectionMatrix);
            // Draw something.
            //   drawScene(view.projectionMatrix, pose.getViewMatrix(view));
        }
    }
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

p5.RendererGL.prototype._update = function() {
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
    p5.instance._renderer.uMVMatrix.set(viewMat);
    p5.instance._renderer.uPMatrix.set(projMat);
    // reset light data for new frame.
  
    this.ambientLightColors.length = 0;
    this.directionalLightDirections.length = 0;
    this.directionalLightColors.length = 0;
  
    this.pointLightPositions.length = 0;
    this.pointLightColors.length = 0;
  };

p5.RendererGL.prototype.drawBuffers = function (gId) {
    // var gl = this.GL;
    this._useColorShader();
    var geometry = this.gHash[gId];

    if (this._doStroke && geometry.lineVertexCount > 0) {
        this.curStrokeShader.bindShader();

        // bind the stroke shader's 'aPosition' buffer
        if (geometry.lineVertexBuffer) {
            this._bindBuffer(geometry.lineVertexBuffer, gl.ARRAY_BUFFER);
            this.curStrokeShader.enableAttrib(
                this.curStrokeShader.attributes.aPosition.location,
                3,
                gl.FLOAT,
                false,
                0,
                0
            );
        }

        // bind the stroke shader's 'aDirection' buffer
        if (geometry.lineNormalBuffer) {
            this._bindBuffer(geometry.lineNormalBuffer, gl.ARRAY_BUFFER);
            this.curStrokeShader.enableAttrib(
                this.curStrokeShader.attributes.aDirection.location,
                4,
                gl.FLOAT,
                false,
                0,
                0
            );
        }

        this._applyColorBlend(this.curStrokeColor);
        this._drawArrays(gl.TRIANGLES, gId);
        this.curStrokeShader.unbindShader();
    }

    if (this._doFill !== false) {
        this.curFillShader.bindShader();

        // bind the fill shader's 'aPosition' buffer
        if (geometry.vertexBuffer) {
            //vertex position buffer
            this._bindBuffer(geometry.vertexBuffer, gl.ARRAY_BUFFER);
            this.curFillShader.enableAttrib(
                this.curFillShader.attributes.aPosition.location,
                3,
                gl.FLOAT,
                false,
                0,
                0
            );
        }

        if (geometry.indexBuffer) {
            //vertex index buffer
            this._bindBuffer(geometry.indexBuffer, gl.ELEMENT_ARRAY_BUFFER);
        }

        // bind the fill shader's 'aNormal' buffer
        if (geometry.normalBuffer) {
            this._bindBuffer(geometry.normalBuffer, gl.ARRAY_BUFFER);
            this.curFillShader.enableAttrib(
                this.curFillShader.attributes.aNormal.location,
                3,
                gl.FLOAT,
                false,
                0,
                0
            );
        }

        // bind the fill shader's 'aTexCoord' buffer
        if (geometry.uvBuffer) {
            // uv buffer
            this._bindBuffer(geometry.uvBuffer, gl.ARRAY_BUFFER);
            this.curFillShader.enableAttrib(
                this.curFillShader.attributes.aTexCoord.location,
                2,
                gl.FLOAT,
                false,
                0,
                0
            );
        }

        this._applyColorBlend(this.curFillColor);
        this._drawElements(gl.TRIANGLES, gId);
        this.curFillShader.unbindShader();
    }
    return this;
};