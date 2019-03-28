import WebXRPolyfill from 'webxr-polyfill';

export default () => {

    let arDevice;

    let arSession = null;
    let arFrameOfRef = null;

    let gl = null;

    /**
     * Fetches the XRDevice, if available.
     */
    p5.prototype.createARCanvas = function () {
        // The entry point of the WebXR Device API is on `navigator.xr`.
        // We also want to ensure that `XRSession` has `requestHitTest`,
        // indicating that the #webxr-hit-test flag is enabled.
        var polyfill = new WebXRPolyfill();
        var versionShim = new WebXRVersionShim();
        console.log('start');
        initAR();
    };

    function onRequestSession() {
        onEnterAR();
    }

    function onEndSession() { }

    function initAR() {

        let xrButton = new XRDeviceButton({
            onRequestSession: onRequestSession,
            onEndSession: onEndSession,
            textEnterXRTitle: "START AR",
            textXRNotFoundTitle: "AR NOT FOUND",
            textExitXRTitle: "EXIT  AR",
        });
        document.querySelector('header').appendChild(xrButton.domElement);

        if (navigator.xr) {
            console.log(navigator.xr);
            // if (XRSession.prototype.requestHitTest) {
            //     console.log('hit test');
            // } else {
            //     console.log('no hit test');
            // }
            navigator.xr.requestDevice().then((device) => {
                // If the device allows creation of immersive sessions set it as the
                // target of the 'Enter XR' button.
                device.supportsSession({immersive: true}).then(() => {
                    console.log('SUPPORTED');
                    xrButton.setDevice(device);
                    arDevice = device;
                });
            });

            // We found an XRDevice! Bind a click listener on our "Enter AR" button
            // since the spec requires calling `device.requestSession()` within a
            // user gesture.
        }
    }

    /**
     * Handle a click event on the '#enter-ar' button and attempt to
     * start an XRSession.
     */
    function onEnterAR() {
        // Now that we have an XRDevice, and are responding to a user
        // gesture, we must create an XRPresentationContext on a
        // canvas element.

        createCanvas(windowWidth, windowHeight, WEBGL);
        let canvas = p5.instance.canvas;
        let ctx = canvas.getContext('xrpresent');
        
        const session = arDevice.requestSession({
                outputContext: ctx,
                environmentIntegration: true,
            }).then(onARSessionStarted);

            // If `requestSession` is successful, add the canvas to the
            // DOM since we know it will now be used.
            
            // If `requestSession` fails, the canvas is not added, and we
            // call our function for unsupported browsers.
            // this.onNoXRDevice();
    }

    function onARSessionStarted(session){
        console.log('AR SESSION STARTED');
        gl = p5.instance.canvas.getContext('webgl', {
            compatibleXRDevice: session.device
        });
        
        session.baseLayer = new XRWebGLLayer(session, gl);
        // Get a frame of reference, which is required for querying poses. In
        // this case an 'eye-level' frame of reference means that all poses will
        // be relative to the location where the XRDevice was first detected.
        session.requestFrameOfReference('eye-level').then((frameOfRef) => {
            arFrameOfRef = frameOfRef;
            // Inform the session that we're ready to begin drawing.
            session.requestAnimationFrame(onXRFrame);
        });
    }

    /**
     * Toggle on a class on the page to disable the "Enter AR"
     * button and display the unsupported browser message.
     */
    function onNoXRDevice() {
        console.log('unsupported');
        document.body.classList.add('unsupported');
    }

    /**
     * Called when the XRSession has begun. Here we set up our three.js
     * renderer, scene, and camera and attach our XRWebGLLayer to the
     * XRSession and kick off the render loop.
     */
    function onSessionStarted(session) {
        // this.session = session;

        // // Add the `ar` class to our body, which will hide our 2D components
        // document.body.classList.add('ar');

        // // To help with working with 3D on the web, we'll use three.js. Set up
        // // the WebGLRenderer, which handles rendering to our session's base layer.
        // this.renderer = new THREE.WebGLRenderer({
        //     alpha: true,
        //     preserveDrawingBuffer: true,
        // });
        // this.renderer.autoClear = false;

        // // We must tell the renderer that it needs to render shadows.
        // this.renderer.shadowMap.enabled = true;
        // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // this.gl = this.renderer.getContext();

        // // Ensure that the context we want to write to is compatible
        // // with our XRDevice
        // await this.gl.setCompatibleXRDevice(this.session.device);

        // // Set our session's baseLayer to an XRWebGLLayer
        // // using our new renderer's context
        // this.session.baseLayer = new XRWebGLLayer(this.session, this.gl);

        // // Set the XRSession framebuffer on our three.js renderer rather
        // // than using the default framebuffer -- this is necessary for things
        // // in three.js that use other render targets, like shadows.
        // const framebuffer = this.session.baseLayer.framebuffer;
        // this.renderer.setFramebuffer(framebuffer);

        // // A THREE.Scene contains the scene graph for all objects in the
        // // render scene. Call our utility which gives us a THREE.Scene
        // // with a few lights and surface to render our shadows. Lights need
        // // to be configured in order to use shadows, see `shared/utils.js`
        // // for more information.
        // this.scene = DemoUtils.createLitScene();

        // // Use the DemoUtils.loadModel to load our OBJ and MTL. The promise
        // // resolves to a THREE.Group containing our mesh information.
        // // Dont await this promise, as we want to start the rendering
        // // process before this finishes.
        // DemoUtils.loadModel(MODEL_OBJ_URL, MODEL_MTL_URL).then(model => {
        //     this.model = model;

        //     // Some models contain multiple meshes, so we want to make sure
        //     // all of our meshes within the model case a shadow.
        //     this.model.children.forEach(mesh => mesh.castShadow = true);

        //     // Every model is different -- you may have to adjust the scale
        //     // of a model depending on the use.
        //     this.model.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);
        // });

        // // We'll update the camera matrices directly from API, so
        // // disable matrix auto updates so three.js doesn't attempt
        // // to handle the matrices independently.
        // this.camera = new THREE.PerspectiveCamera();
        // this.camera.matrixAutoUpdate = false;

        // // Add a Reticle object, which will help us find surfaces by drawing
        // // a ring shape onto found surfaces. See source code
        // // of Reticle in shared/utils.js for more details.
        // this.reticle = new Reticle(this.session, this.camera);
        // this.scene.add(this.reticle);

        // this.frameOfRef = await this.session.requestFrameOfReference('eye-level');
        // this.session.requestAnimationFrame(this.onXRFrame);

        // window.addEventListener('click', this.onClick);
    }

    /**
     * Called on the XRSession's requestAnimationFrame.
     * Called with the time and XRPresentationFrame.
     */
    function onXRFrame(time, frame) {
        // let session = frame.session;
        // let pose = frame.getDevicePose(this.frameOfRef);

        // // Update the reticle's position
        // this.reticle.update(this.frameOfRef);

        // // If the reticle has found a hit (is visible) and we have
        // // not yet marked our app as stabilized, do so
        // if (this.reticle.visible && !this.stabilized) {
        //     this.stabilized = true;
        //     document.body.classList.add('stabilized');
        // }

        // // Queue up the next frame
        // session.requestAnimationFrame(this.onXRFrame);

        // // Bind the framebuffer to our baseLayer's framebuffer
        // this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.session.baseLayer.framebuffer);

        // if (pose) {
        //     // Our XRFrame has an array of views. In the VR case, we'll have
        //     // two views, one for each eye. In mobile AR, however, we only
        //     // have one view.
        //     for (let view of frame.views) {
        //         const viewport = session.baseLayer.getViewport(view);
        //         this.renderer.setSize(viewport.width, viewport.height);

        //         // Set the view matrix and projection matrix from XRDevicePose
        //         // and XRView onto our THREE.Camera.
        //         this.camera.projectionMatrix.fromArray(view.projectionMatrix);
        //         const viewMatrix = new THREE.Matrix4().fromArray(pose.getViewMatrix(view));
        //         this.camera.matrix.getInverse(viewMatrix);
        //         this.camera.updateMatrixWorld(true);

        //         // Render our scene with our THREE.WebGLRenderer
        //         this.renderer.render(this.scene, this.camera);
        //     }
        // }
    }

    /**
     * This method is called when tapping on the page once an XRSession
     * has started. We're going to be firing a ray from the center of
     * the screen, and if a hit is found, use it to place our object
     * at the point of collision.
     */
    function onClick(e) {
        // // If our model is not yet loaded, abort
        // if (!this.model) {
        //     return;
        // }

        // // We're going to be firing a ray from the center of the screen.
        // // The requestHitTest function takes an x and y coordinate in
        // // Normalized Device Coordinates, where the upper left is (-1, 1)
        // // and the bottom right is (1, -1). This makes (0, 0) our center.
        // const x = 0;
        // const y = 0;

        // // Create a THREE.Raycaster if one doesn't already exist,
        // // and use it to generate an origin and direction from
        // // our camera (device) using the tap coordinates.
        // // Learn more about THREE.Raycaster:
        // // https://threejs.org/docs/#api/core/Raycaster
        // this.raycaster = this.raycaster || new THREE.Raycaster();
        // this.raycaster.setFromCamera({ x, y }, this.camera);
        // const ray = this.raycaster.ray;

        // // Fire the hit test to see if our ray collides with a real
        // // surface. Note that we must turn our THREE.Vector3 origin and
        // // direction into an array of x, y, and z values. The proposal
        // // for `XRSession.prototype.requestHitTest` can be found here:
        // // https://github.com/immersive-web/hit-test
        // const origin = new Float32Array(ray.origin.toArray());
        // const direction = new Float32Array(ray.direction.toArray());
        // const hits = await this.session.requestHitTest(origin,
        //     direction,
        //     this.frameOfRef);

        // // If we found at least one hit...
        // if (hits.length) {
        //     // We can have multiple collisions per hit test. Let's just take the
        //     // first hit, the nearest, for now.
        //     const hit = hits[0];

        //     // Our XRHitResult object has one property, `hitMatrix`, a
        //     // Float32Array(16) representing a 4x4 Matrix encoding position where
        //     // the ray hit an object, and the orientation has a Y-axis that corresponds
        //     // with the normal of the object at that location.
        //     // Turn this matrix into a THREE.Matrix4().
        //     const hitMatrix = new THREE.Matrix4().fromArray(hit.hitMatrix);

        //     // Now apply the position from the hitMatrix onto our model.
        //     this.model.position.setFromMatrixPosition(hitMatrix);

        //     // Rather than using the rotation encoded by the `modelMatrix`,
        //     // rotate the model to face the camera. Use this utility to
        //     // rotate the model only on the Y axis.
        //     DemoUtils.lookAtOnY(this.model, this.camera);

        //     // Now that we've found a collision from the hit test, let's use
        //     // the Y position of that hit and assume that's the floor. We created
        //     // a mesh in `DemoUtils.createLitScene()` that receives shadows, so set
        //     // it's Y position to that of the hit matrix so that shadows appear to be
        //     // cast on the ground under the model.
        //     const shadowMesh = this.scene.children.find(c => c.name === 'shadowMesh');
        //     shadowMesh.position.y = this.model.position.y;

        //     // Ensure our model has been added to the scene.
        //     this.scene.add(this.model);
    }
};
