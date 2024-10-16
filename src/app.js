import * as constants from './p5xr/core/constants';
import './p5xr/core/p5overrides';
import './p5xr/features/handtracking';
import p5vr from './p5xr/p5vr/p5vr';
import p5ar from './p5xr/p5ar/p5ar';

window.p5xr = {
  instance: null,
};

// attach constants to p5 prototype
// eslint-disable-next-line guard-for-in
for (const k in constants) {
  p5.prototype[k] = constants[k];
}

/**
 * This file contains all functions that extend the p5 prototype.
 * Sections are currently designated by #region and #endregion
 * If this file grows longer in the future it can be broken up into
 * separate files.
 */

// #region Initialization

/**
 * starts the process of creating a VR-ready canvas
 * This actually just creates a button that will set into motion
 * the creation of a VR canvas and creates a new p5vr object.
 * This should be called in `preload()` so
 * that the entire sketch can wait to start until the user has "entered VR"
 * via a button click gesture
 * @method createVRCanvas
 * @param {p5XRButton} [xrButton] An optional button to replace default button for entering VR
 * @section VR
 * @category Initialization
 */
p5.prototype.createVRCanvas = function () {
  noLoop();
  p5xr.instance = new p5vr();
};

/**
 * **AR IS LARGELY UNTESTED AND EXPERIMENTAL**
 * This creates a button that will create a AR canvas and new p5ar object
 * on click.
 * This should be called in `preload()` so
 * that the entire sketch can wait to start until the user has "entered AR"
 * via a button click gesture/
 * @method createARCanvas
 * @section AR
 * @category Initialization
 */
p5.prototype.createARCanvas = function () {
  noLoop();
  p5xr.instance = new p5ar();
};

/**
 * Get the current "Enter XR" button.
 * @returns {p5xrButton} The button object
 * @method getEnterXRButton
 * @category Initialization
 */
p5.prototype.getXRButton = function () {
  if (p5xr && p5xr.instance && p5xr.instance.xrButton) {
    return p5xr.instance.xrButton;
  }
  console.warn(
    'No XR button found. Make sure to call createVRCanvas() or createARCanvas() first.',
  );
};

/**
 * Creates a new p5xrButton object to use for entering and exiting XR.
 * @param {Object} options Options for the creation of p5xrButton
 * @param {Color} options.background Color of the button background, defaults to rgb(237,34,93)
 * @param {Number} options.opacity Opacity of the button background when XR is available, defaults to 0.95
 * @param {Number} options.disabledOpacity Opacity of the button background when XR is unavailable, defaults to 0.5
 * @param {Number} options.height Height of the button, defaults to window.innerWidth / 5
 * @param {Number} options.fontSize Font size for the button, defaults to height / 3
 * @param {String} options.textEnterXRTitle Text to display on the button before entering XR, defaults to "ENTER XR"
 * @param {String} options.textXRNotFoundTitle Text to display on the button when XR not found, defaults to "XR NOT FOUND"
 * @param {String} options.textExitXRTitle Text to display on the button when currently in XR, defaults to "EXIT XR"
 * @param {HTMLElement} options.domElement Pass in an alternate DOM Element to use for the button, should provide a 'click' event
 * @returns {p5xrButton} The button object
 * @method createXRButton
 * @category Initialization
 */
p5.prototype.createXRButton = function (options) {
  return new p5xrButton(options);
};

// #endregion

// #region Background
/**
 * Sets the clear color for VR-Mode. <br><br>
 * This has to happen separately from calls to background
 * to avoid clearing between drawing the eyes
 * @method setVRBackgroundColor
 * @param  {Number} r red value of background
 * @param  {Number} g green value of background
 * @param  {Number} b blue value of background
 * @example
 *
 * let timer = 0;
 * const timeBetween = 2000;
 *
 * function preload() {
 *   createVRCanvas();
 * }
 *
 * function setup() {
 *   randomizeBackground();
 * }
 *
 * function draw() {
 *   if(millis() - timer > timeBetween) {
 *     randomizeBackground();
 *     timer = millis();
 *   }
 *
 *   translate(0, 0, -100);
 *   rotateX(frameCount * 0.005);
 *   box(10);
 * }
 *
 * function randomizeBackground() {
 *   setVRBackgroundColor(random(255), random(255), random(255));
 * }
 *
 *
 * @section VR
 * @category Background
 */
p5.prototype.setVRBackgroundColor = function (r, g, b) {
  p5xr.instance.curClearColor = color(r, g, b);
};

/**
 * Creates a 360 degree texture around the current sketch using the supplied image.
 * @param {p5.Image} tex The texture to be used for the background
 * @section VR
 * @category Background
 */
p5.prototype.surroundTexture = function (tex) {
  push();
  texture(tex);
  rotateX(PI);
  scale(-1, 1, 1);
  sphere(300, 60, 40);
  pop();
};

// #endregion

// #region Anchors

/**
 * **AR IS LARGELY UNTESTED AND EXPERIMENTAL**
 * @param {p5.Vector} vec Vector for the AR real-world hit position
 * @returns p5.Anchor object with anchor position and orientation
 * @section AR
 */
p5.prototype.createAnchor = function (vec) {
  if (p5xr.instance.isVR) {
    return;
  }
  return p5xr.instance.__createAnchor(vec);
};

/**
 * @ignore
 */
p5.prototype.detectHit = function (ev) {
  if (p5xr.instance.isVR) {
    return;
  }
  return p5xr.instance.__detectHit(ev);
};

// #endregion

// #region Input

/**
 * Get an XR input source for the given input source id.
 * @param {String} input The name of the input to access, typically 'left' or 'right'
 * @returns {p5XRInput} The input object
 * @category Input
 */
p5.prototype.getXRInput = function (input) {
  if (p5xr.instance.xrSession.inputSources.length === 0) {
    return;
  }
  return p5xr.instance.__getXRInput(input);
};

// #endregion

// #region View

/**
 * Sets the position of the viewer
 * @param {*} targetX The target x position of the viewer
 * @param {*} targetY The target y position of the viewer
 * @param {*} targetZ The target z position of the viewer
 * @method setViewerPosition
 * @category View
 * @example
 *  let z = 0;
 * let viewerPosition;
 *
 * function preload() {
 *   createVRCanvas();
 * }
 *
 * function setup() {
 *   setVRBackgroundColor(0, 0, 255);
 *   noStroke();
 *   angleMode(DEGREES);
 *   viewerPosition = createVector(0, 0, 0);
 * }
 *
 * function draw() {
 *   //moves the viewer forward if controller trigger is pressed
 *   const left = getXRInput(LEFT);
 *   const right = getXRInput(RIGHT);
 *   [left, right].forEach((hand) => {
 *   if (hand) {
 *       viewerPosition.z += hand.thumbstick2D.y * 0.01;
 *       viewerPosition.x += hand.thumbstick2D.x * 0.01;
 *       if(hand.thumbstick2D.x !== 0 || hand.thumbstick2D.y !== 0) {
 *         fill('red');
 *       } else {
 *         fill('purple');
 *       }
 *       push();
 *       applyMatrix(hand.pose)
 *       box(0.05);
 *       pop();
 *     }
 *   });
 *   if (viewerPosition.z < -7) {
 *     viewerPosition.z = 7;
 *   }
 *   setViewerPosition(viewerPosition.x, viewerPosition.y, viewerPosition.z);
 *   //draw a 10x10 floor
 *   push();
 *   translate(0, -1, 0);
 *   rotateX(-90);
 *   fill(0, 255, 0);
 *   plane(10, 10);
 *   pop();
 *   //resets the viewer's position if they move too far
 *  }
 */
p5.prototype.setViewerPosition = function (x, y, z) {
  const { viewer } = p5xr.instance;
  viewer.setPosition(x, y, z);
};

/**
 * Gets the current viewer object
 * @returns {p5xrViewer} The viewer object
 * @method getViewer
 * @category View
 */
p5.prototype.getViewer = function () {
  if (!p5xr.instance || !p5xr.instance.viewer) {
    console.warn(
      'No viewer found. Make sure to call createVRCanvas() or createARCanvas() first.',
    );
  }
  return p5xr.instance.viewer;
};

/**
 * All calls after sticky() and before noSticky() will move with the view.
 * @param {Boolean} drawOnTop If true, all calls after this will be drawn on top of everything else
 * @method sticky
 * @category View
 */
p5.prototype.sticky = function (drawOnTop = false) {
  push();
  p5xr.instance.viewer.drawOnTop = drawOnTop;
  if (drawOnTop) {
    p5.instance._renderer.GL.disable(p5.instance._renderer.GL.DEPTH_TEST);
  }
  p5.instance._renderer.uMVMatrix.set(p5.Matrix.identity());
  const viewerPosition = p5xr.instance.viewer.position;
  setViewerPosition(viewerPosition.x, viewerPosition.y, viewerPosition.z);
};

/**
 * All calls after sticky() and before noSticky() will move with the view.
 * @method noSticky
 * @category View
 */
p5.prototype.noSticky = function () {
  p5.instance._renderer.GL.enable(p5.instance._renderer.GL.DEPTH_TEST);
  pop();
};

// #endregion

// #region Raycasting

/**
 * Takes a 2D screen coordinate and returns a Ray in 3D coordinates.
 * @method getRayFromScreen
 * @param {Number} x The screen x position for the Ray to originate from
 * @param {Number} y The screen y position for the Ray to originate from
 * @returns {Ray} Ray object for use with raycasting methods, {origin, direction}
 * @category Raycasting
 */
p5.prototype.getRayFromScreen = function (x, y) {
  if (!p5xr.instance || !p5xr.instance.viewer) {
    console.warn(
      'No viewer found to calculate Ray. Make sure to call createVRCanvas() or createARCanvas() first.',
    );
  }
  const { viewer } = p5xr.instance;
  return viewer.getRayFromScreen(x, y);
};

/**
 * Checks ray against a sphere collider with given radius at current drawing position.
 * @method intersectsSphere
 * @param {Number} radius The radius of the sphere to check collision with
 * @param {Number} [Ray] Optional. The ray to use for checking, defaults to getRayFromScreen(0, 0)
 * @returns {Boolean} True if the ray intersects with a sphere with the given radius at current drawing position, false otherwise
 * @category Raycasting
 */
p5.prototype.intersectsSphere = function (radius) {
  let ray = {
    origin: null,
    direction: null,
  };
  if (arguments.length !== 2 || !Object.hasOwn(arguments[1], 'origin')) {
    const screenX = arguments[1] || 0;
    const screenY = arguments[2] || 0;
    ray = p5xr.instance.viewer.getRayFromScreen(screenX, screenY);
  } else {
    ray.origin = arguments[1].origin.copy();
    ray.direction = arguments[1].direction.copy();
  }

  if (ray === null) return false;

  // sphere in View space
  let uMVMatrix = p5.instance._renderer.uMVMatrix.copy();
  uMVMatrix.transpose(uMVMatrix);
  uMVMatrix = uMVMatrix.mat4;

  const sphereCenter = new p5.Vector(0, 0, 0);
  sphereCenter.x = uMVMatrix[3];
  sphereCenter.y = uMVMatrix[7];
  sphereCenter.z = uMVMatrix[11];

  if (p5.Vector.sub(ray.origin, sphereCenter).mag() <= radius) {
    return true;
  }

  // check if sphere is in front of ray
  if (
    p5.Vector.dot(p5.Vector.sub(sphereCenter, ray.origin), ray.direction) < 0
  ) {
    return false;
  }

  const sphereToRayOrigin = p5.Vector.sub(ray.origin, sphereCenter);
  const b = 2 * p5.Vector.dot(ray.direction, sphereToRayOrigin);
  const c = p5.Vector.mag(sphereToRayOrigin) * p5.Vector.mag(sphereToRayOrigin)
    - radius * radius;

  const det = b * b - 4 * c;

  return det >= 0;
};

/**
 * Checks ray against a box collider with given dimensions at current drawing position.
 * @method intersectsBox
 * @param {Number} width Width of box collider for check
 * @param {Number} [height] Optional. Height of box collider for check
 * @param {Number} [depth] Optional. Depth of box collider for check
 * @param {Ray} [ray] Optional. The ray to use for checking, defaults to getRayFromScreen(0, 0)
 * @returns {Boolean} True if the ray intersects with a box collider with given dimension at current drawing position, false otherwise
 * @category Raycasting
 */
p5.prototype.intersectsBox = function () {
  const width = arguments[0];
  let height;
  let depth;
  let ray = {
    origin: null,
    direction: null,
  };
  if (Object.hasOwn(arguments[arguments.length - 1], 'origin')) {
    ray.origin = arguments[arguments.length - 1].origin.copy();
    ray.direction = arguments[arguments.length - 1].direction.copy();
    height = arguments.length > 2 ? arguments[1] : width;
    depth = arguments.length > 3 ? arguments[2] : height;
  } else if (arguments.length === 5) {
    // if screenX, screenY is specified => width, height, depth must also be specified
    ray = p5xr.instance.viewer.getRayFromScreen(arguments[3], arguments[4]);
    height = arguments[1];
    depth = arguments[2];
  } else {
    ray = p5xr.instance.viewer.getRayFromScreen(0, 0);
    height = arguments.length > 1 ? arguments[1] : width;
    depth = arguments.length > 2 ? arguments[2] : height;
  }

  // bounding box in view space will not be axis aligned
  // so we will transform ray to box space by applying inverse(uMVMatrix) to origin and direction

  let uMVMatrixInv = p5.instance._renderer.uMVMatrix.copy();
  uMVMatrixInv.transpose(uMVMatrixInv);
  uMVMatrixInv.invert(uMVMatrixInv);
  uMVMatrixInv = uMVMatrixInv.mat4;

  const rayOriginCopy = ray.origin.copy();
  ray.origin.x = uMVMatrixInv[0] * rayOriginCopy.x
    + uMVMatrixInv[1] * rayOriginCopy.y
    + uMVMatrixInv[2] * rayOriginCopy.z
    + uMVMatrixInv[3];
  ray.origin.y = uMVMatrixInv[4] * rayOriginCopy.x
    + uMVMatrixInv[5] * rayOriginCopy.y
    + uMVMatrixInv[6] * rayOriginCopy.z
    + uMVMatrixInv[7];
  ray.origin.z = uMVMatrixInv[8] * rayOriginCopy.x
    + uMVMatrixInv[9] * rayOriginCopy.y
    + uMVMatrixInv[10] * rayOriginCopy.z
    + uMVMatrixInv[11];

  const rayDirectionCopy = ray.direction.copy();
  ray.direction.x = uMVMatrixInv[0] * rayDirectionCopy.x
    + uMVMatrixInv[1] * rayDirectionCopy.y
    + uMVMatrixInv[2] * rayDirectionCopy.z;
  ray.direction.y = uMVMatrixInv[4] * rayDirectionCopy.x
    + uMVMatrixInv[5] * rayDirectionCopy.y
    + uMVMatrixInv[6] * rayDirectionCopy.z;
  ray.direction.z = uMVMatrixInv[8] * rayDirectionCopy.x
    + uMVMatrixInv[9] * rayDirectionCopy.y
    + uMVMatrixInv[10] * rayDirectionCopy.z;
  ray.direction.normalize();

  // representing AABB (Axis aligned bounding box) with 2 extreme points
  const min = new p5.Vector(-0.5 * width, -0.5 * height, -0.5 * depth);
  const max = new p5.Vector(0.5 * width, 0.5 * height, 0.5 * depth);

  // ray-AABB intersection algorithm
  const t1 = (min.x - ray.origin.x) / ray.direction.x;
  const t2 = (max.x - ray.origin.x) / ray.direction.x;
  const t3 = (min.y - ray.origin.y) / ray.direction.y;
  const t4 = (max.y - ray.origin.y) / ray.direction.y;
  const t5 = (min.z - ray.origin.z) / ray.direction.z;
  const t6 = (max.z - ray.origin.z) / ray.direction.z;

  const tmin = Math.max(
    Math.max(Math.min(t1, t2), Math.min(t3, t4)),
    Math.min(t5, t6),
  );
  const tmax = Math.min(
    Math.min(Math.max(t1, t2), Math.max(t3, t4)),
    Math.max(t5, t6),
  );

  if (tmax < 0 || tmin > tmax) {
    return false;
  }
  return true;
};

/**
 * Checks ray against a plane with at current drawing position and returns normalized x and y coordinates of intersection point.
 * @method intersectsPlane
 * @param {Ray} [ray] Optional. The ray to use for checking, defaults to getRayFromScreen(0, 0)
 * @returns {p5.Vector} The normalized coordinate of the intersection point on the plane, or null if no intersection
 * @category Raycasting
 */
p5.prototype.intersectsPlane = function () {
  let ray = {
    origin: null,
    direction: null,
  };
  const { origin, direction } = arguments.length > 0 ? arguments[0] : {};
  if (origin && direction) {
    ray.origin = origin.copy();
    ray.direction = direction.copy();
  } else {
    ray = p5xr.instance.viewer.getRayFromScreen(arguments[0], arguments[1]);
  }

  // transforming ray to local plane space
  // intersection point will be with respect to the plane

  let uMVMatrixInv = p5.instance._renderer.uMVMatrix.copy();
  uMVMatrixInv.transpose(uMVMatrixInv);
  uMVMatrixInv.invert(uMVMatrixInv);
  uMVMatrixInv = uMVMatrixInv.mat4;

  const rayOriginCopy = ray.origin.copy();
  ray.origin.x = uMVMatrixInv[0] * rayOriginCopy.x
    + uMVMatrixInv[1] * rayOriginCopy.y
    + uMVMatrixInv[2] * rayOriginCopy.z
    + uMVMatrixInv[3];
  ray.origin.y = uMVMatrixInv[4] * rayOriginCopy.x
    + uMVMatrixInv[5] * rayOriginCopy.y
    + uMVMatrixInv[6] * rayOriginCopy.z
    + uMVMatrixInv[7];
  ray.origin.z = uMVMatrixInv[8] * rayOriginCopy.x
    + uMVMatrixInv[9] * rayOriginCopy.y
    + uMVMatrixInv[10] * rayOriginCopy.z
    + uMVMatrixInv[11];

  const rayDirectionCopy = ray.direction.copy();
  ray.direction.x = uMVMatrixInv[0] * rayDirectionCopy.x
    + uMVMatrixInv[1] * rayDirectionCopy.y
    + uMVMatrixInv[2] * rayDirectionCopy.z;
  ray.direction.y = uMVMatrixInv[4] * rayDirectionCopy.x
    + uMVMatrixInv[5] * rayDirectionCopy.y
    + uMVMatrixInv[6] * rayDirectionCopy.z;
  ray.direction.z = uMVMatrixInv[8] * rayDirectionCopy.x
    + uMVMatrixInv[9] * rayDirectionCopy.y
    + uMVMatrixInv[10] * rayDirectionCopy.z;
  ray.direction.normalize();

  // representing plane
  const planeNormal = new p5.Vector(0, 0, 1);
  const planePoint = new p5.Vector(0, 0, 0);

  // ray-plane intersection algorithm
  const w = p5.Vector.sub(planePoint, ray.origin);
  const d = Math.abs(p5.Vector.dot(ray.direction, planeNormal));
  if (d === 0) {
    return null;
  }

  const k = Math.abs(p5.Vector.dot(w, planeNormal) / d);
  const intersectionPoint = p5.Vector.add(
    ray.origin,
    ray.direction.copy().setMag(k),
  );

  return createVector(intersectionPoint.x, intersectionPoint.y);
};

/**
 * Create a ray object for using with raycasting methods.
 * @method generateRay
 * @param {Number} x1 X coordinate for origin
 * @param {Number} y1 Y coordinate for origin
 * @param {Number} z1 Z coordinate for origin
 * @param {Number} x2 X coordinate for direction
 * @param {Number} y2 Y coordinate for direction
 * @param {Number} z2 Z coordinate for direction
 * @returns {Ray} Ray object with {origin: p5.Vector, direction: p5.Vector}
 * @category Raycasting
 */
p5.prototype.generateRay = function (x1, y1, z1, x2, y2, z2) {
  const origin = new p5.Vector(x1, y1, z1);
  let direction = new p5.Vector(x2, y2, z2);
  direction = p5.Vector.sub(direction, origin);
  direction.normalize();

  let uMVMatrix = p5.instance._renderer.uMVMatrix.copy();
  uMVMatrix.transpose(uMVMatrix);
  uMVMatrix = uMVMatrix.mat4;

  const originCopy = origin.copy();
  origin.x = uMVMatrix[0] * originCopy.x
    + uMVMatrix[1] * originCopy.y
    + uMVMatrix[2] * originCopy.z
    + uMVMatrix[3];
  origin.y = uMVMatrix[4] * originCopy.x
    + uMVMatrix[5] * originCopy.y
    + uMVMatrix[6] * originCopy.z
    + uMVMatrix[7];
  origin.z = uMVMatrix[8] * originCopy.x
    + uMVMatrix[9] * originCopy.y
    + uMVMatrix[10] * originCopy.z
    + uMVMatrix[11];

  const directionCopy = direction.copy();
  direction.x = uMVMatrix[0] * directionCopy.x
    + uMVMatrix[1] * directionCopy.y
    + uMVMatrix[2] * directionCopy.z;
  direction.y = uMVMatrix[4] * directionCopy.x
    + uMVMatrix[5] * directionCopy.y
    + uMVMatrix[6] * directionCopy.z;
  direction.z = uMVMatrix[8] * directionCopy.x
    + uMVMatrix[9] * directionCopy.y
    + uMVMatrix[10] * directionCopy.z;

  direction.normalize();

  return {
    origin,
    direction,
  };
};

// #endregion
