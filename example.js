// (function () {
//     'use strict';

//     var polyfill = new WebXRPolyfill();
//     // Apply the version shim after the polyfill is instantiated, to ensure
//     // that the polyfill also gets patched if necessary.
//     var versionShim = new WebXRVersionShim();

//     // XR globals.
//     let xrButton = null;
//     let xrFrameOfRef = null;

//     // WebGL scene globals.
//     let gl = null;
//     let renderer = null;

//     function initXR() {
//         xrButton = new XRDeviceButton({
//             onRequestSession: onRequestSession,
//             onEndSession: onEndSession
//         });
//         document.querySelector('header').appendChild(xrButton.domElement);

//         if (navigator.xr) {
//             navigator.xr.requestDevice().then((device) => {
//                 device.supportsSession({ immersive: true }).then(() => {
//                     xrButton.setDevice(device);
//                 });
//             });
//         }
//     }

//     function onRequestSession(device) {
//         // In order to mirror an exclusive session, we must provide
//         // an XRPresentationContext, which indicates the canvas that will
//         // contain results of the session's rendering.
//         let mirrorCanvas = document.createElement('canvas');
//         let ctx = mirrorCanvas.getContext('xrpresent');
//         mirrorCanvas.setAttribute('id', 'mirror-canvas');

//         // Add the canvas to the document.
//         document.body.appendChild(mirrorCanvas);

//         // Providing an outputContext when requesting an exclusive session
//         // indicates that it should be used as the mirror destination.
//         device.requestSession({
//             immersive: true,
//             outputContext: ctx
//         }).then(onSessionStarted);
//     }

//     function onSessionStarted(session) {
//         xrButton.setSession(session);

//         session.addEventListener('end', onSessionEnded);

//         if (!gl) {
//             gl = createWebGLContext({
//                 compatibleXRDevice: session.device
//             });

//             renderer = new Renderer(gl);

//             scene.setRenderer(renderer);
//         }

//         session.baseLayer = new XRWebGLLayer(session, gl);

//         // Set the mirroring context to be the same size as one eye on the
//         // layer context.
//         let outputCanvas = document.querySelector('#mirror-canvas');
//         outputCanvas.width = session.baseLayer.framebufferWidth / 2;
//         outputCanvas.height = session.baseLayer.framebufferHeight;

//         session.requestFrameOfReference('eye-level').then((frameOfRef) => {
//             xrFrameOfRef = frameOfRef;

//             session.requestAnimationFrame(onXRFrame);
//         });
//     }

//     function onEndSession(session) {
//         session.end();
//     }

//     function onSessionEnded(event) {
//         xrButton.setSession(null);

//         gl = null;

//         // Remove the injected mirroring canvas from the DOM.
//         document.body.removeChild(document.querySelector('#mirror-canvas'));
//     }

//     function onXRFrame(t, frame) {
//         // Do we have an active session?
//         if (xrSession) {
//             let glLayer = xrSession.renderState.baseLayer;
//             let pose = xrFrame.getViewerPose(xrReferenceSpace);
//             gl.bindFramebuffer(gl.FRAMEBUFFER, glLayer.framebuffer);

//             for (let view of pose.views) {
//                 let viewport = glLayer.getViewport(view);
//                 gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
//                 drawScene(view);
//             }

//             // Request the next animation callback
//             xrSession.requestAnimationFrame(onXRFrame);
//         } else {
//             // No session available, so render a default mono view.
//             gl.viewport(0, 0, glCanvas.width, glCanvas.height);
//             drawScene();

//             // Request the next window callback
//             window.requestAnimationFrame(onXRFrame);
//         }
//     }

//     function drawScene(view) {
//         let viewMatrix = null;
//         let projectionMatrix = null;
//         if (view) {
//             viewMatrix = view.viewMatrix;
//             projectionMatrix = view.projectionMatrix;
//         } else {
//             viewMatrix = defaultViewMatrix;
//             projectionMatrix = defaultProjectionMatrix;
//         }

//         // Set uniforms as appropriate for shaders being used

//         // Draw Scene
//     }

//     // Start the XR application.
//     initXR();
// })();

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

let init = 0;

function preload() {
    createVRCanvas();
}

  
  function draw() {
      if(init > 4) {
          background(200);
        //   rotateX(frameCount * 0.01);
        //   rotateY(frameCount * 0.01);
        fill(255, 0,0);
          box(.001, 10, 15,15);
          fill(0,255,0);
          sphere(100);
      }
  }

  function mousePressed() {
      init++;
      console.log(init);
  }

