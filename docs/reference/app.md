<a name="resetXR"></a>

## resetXR()
Helper function to reset XR and GL, should be called between
ending an XR session and starting a new XR session

**Kind**: global function  

* * *

<a name="setVRBackgroundColor"></a>

## setVRBackgroundColor(r, g, b)
Sets the clear color for VR-Mode. <br><br>
This has to happen separately from calls to background
to avoid clearing between drawing the eyes

**Kind**: global function  
**Category**: Background  
**Section**: VR  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>r</td><td><code>Number</code></td><td><p>red value of background</p>
</td>
    </tr><tr>
    <td>g</td><td><code>Number</code></td><td><p>green value of background</p>
</td>
    </tr><tr>
    <td>b</td><td><code>Number</code></td><td><p>blue value of background</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
let timer = 0;
const timeBetween = 2000;

function preload() {
  createVRCanvas();
}

function setup() {
  randomizeBackground();
}

function draw() {
  if(millis() - timer > timeBetween) {
    randomizeBackground();
    timer = millis();
  }

  translate(0, 0, -100);
  rotateX(frameCount * 0.005);
  box(10);
}

function randomizeBackground() {
  setVRBackgroundColor(random(255), random(255), random(255));
}
```

* * *

<a name="p5xrButton"></a>

## p5xrButton
p5xrButton
A button that handles entering and exiting an XR session.
All browsers require that the user grant permission to enter XR and permission
can only be request with a user gesture.

**Kind**: global class  
**Category**: Initialization  

* [p5xrButton](#p5xrButton)
    * [.setDevice(device)](#p5xrButton+setDevice) ⇒ [<code>p5xrButton</code>](#p5xrButton)
    * [.setSession(session)](#p5xrButton+setSession) ⇒ [<code>p5xrButton</code>](#p5xrButton)
    * [.setTitle(text)](#p5xrButton+setTitle) ⇒ [<code>p5xrButton</code>](#p5xrButton)
    * [.setTooltip(tooltip)](#p5xrButton+setTooltip) ⇒ [<code>p5xrButton</code>](#p5xrButton)
    * [.show()](#p5xrButton+show) ⇒ [<code>p5xrButton</code>](#p5xrButton)
    * [.hide()](#p5xrButton+hide) ⇒ [<code>p5xrButton</code>](#p5xrButton)
    * [.enable()](#p5xrButton+enable) ⇒ [<code>p5xrButton</code>](#p5xrButton)
    * [.disable()](#p5xrButton+disable) ⇒ [<code>p5xrButton</code>](#p5xrButton)
    * [.remove()](#p5xrButton+remove)


* * *

<a name="p5xrButton+setDevice"></a>

### p5xrButton.setDevice(device) ⇒ [<code>p5xrButton</code>](#p5xrButton)
Sets the XRDevice this button is associated with. This rarely needs to be called directly.

**Kind**: instance method of [<code>p5xrButton</code>](#p5xrButton)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>device</td><td><code>XRDevice</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="p5xrButton+setSession"></a>

### p5xrButton.setSession(session) ⇒ [<code>p5xrButton</code>](#p5xrButton)
Indicates to the p5xrButton that there's an active XRSession.
Switches the button to it's exitXR state if session is not null.

**Kind**: instance method of [<code>p5xrButton</code>](#p5xrButton)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>session</td><td><code>XRSession</code></td><td><p>The active XRSession associated with the button</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="p5xrButton+setTitle"></a>

### p5xrButton.setTitle(text) ⇒ [<code>p5xrButton</code>](#p5xrButton)
Set the title of the p5xrButton

**Kind**: instance method of [<code>p5xrButton</code>](#p5xrButton)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>text</td><td><code>String</code></td><td><p>The title for the button</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="p5xrButton+setTooltip"></a>

### p5xrButton.setTooltip(tooltip) ⇒ [<code>p5xrButton</code>](#p5xrButton)
Set the tooltip of the button

**Kind**: instance method of [<code>p5xrButton</code>](#p5xrButton)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>tooltip</td><td><code>String</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="p5xrButton+show"></a>

### p5xrButton.show() ⇒ [<code>p5xrButton</code>](#p5xrButton)
Show the button

**Kind**: instance method of [<code>p5xrButton</code>](#p5xrButton)  

* * *

<a name="p5xrButton+hide"></a>

### p5xrButton.hide() ⇒ [<code>p5xrButton</code>](#p5xrButton)
Hide the button

**Kind**: instance method of [<code>p5xrButton</code>](#p5xrButton)  

* * *

<a name="p5xrButton+enable"></a>

### p5xrButton.enable() ⇒ [<code>p5xrButton</code>](#p5xrButton)
Enable the button

**Kind**: instance method of [<code>p5xrButton</code>](#p5xrButton)  

* * *

<a name="p5xrButton+disable"></a>

### p5xrButton.disable() ⇒ [<code>p5xrButton</code>](#p5xrButton)
Disable the button from being clicked

**Kind**: instance method of [<code>p5xrButton</code>](#p5xrButton)  

* * *

<a name="p5xrButton+remove"></a>

### p5xrButton.remove()
Remove the p5xrButton from the DOM

**Kind**: instance method of [<code>p5xrButton</code>](#p5xrButton)  

* * *

<a name="createVRCanvas"></a>

## createVRCanvas([xrButton])
starts the process of creating a VR-ready canvas
This actually just creates a button that will set into motion
the creation of a VR canvas and creates a new p5vr object.
This should be called in `preload()` so
that the entire sketch can wait to start until the user has "entered VR"
via a button click gesture

**Kind**: global function  
**Category**: Initialization  
**Section**: VR  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[xrButton]</td><td><code>p5XRButton</code></td><td><p>An optional button to replace default button for entering VR</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="createARCanvas"></a>

## createARCanvas()
**AR IS LARGELY UNTESTED AND EXPERIMENTAL**
This creates a button that will create a AR canvas and new p5ar object
on click.
This should be called in `preload()` so
that the entire sketch can wait to start until the user has "entered AR"
via a button click gesture/

**Kind**: global function  
**Category**: Initialization  
**Section**: AR  

* * *

<a name="getEnterXRButton"></a>

## getEnterXRButton() ⇒ [<code>p5xrButton</code>](#p5xrButton)
Get the current "Enter XR" button.

**Kind**: global function  
**Returns**: [<code>p5xrButton</code>](#p5xrButton) - The button object  
**Category**: Initialization  

* * *

<a name="createXRButton"></a>

## createXRButton(options) ⇒ [<code>p5xrButton</code>](#p5xrButton)
Creates a new p5xrButton object to use for entering and exiting XR.

**Kind**: global function  
**Returns**: [<code>p5xrButton</code>](#p5xrButton) - The button object  
**Category**: Initialization  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>Object</code></td><td><p>Options for the creation of p5xrButton</p>
</td>
    </tr><tr>
    <td>options.background</td><td><code>Color</code></td><td><p>Color of the button background, defaults to rgb(237,34,93)</p>
</td>
    </tr><tr>
    <td>options.opacity</td><td><code>Number</code></td><td><p>Opacity of the button background when XR is available, defaults to 0.95</p>
</td>
    </tr><tr>
    <td>options.disabledOpacity</td><td><code>Number</code></td><td><p>Opacity of the button background when XR is unavailable, defaults to 0.5</p>
</td>
    </tr><tr>
    <td>options.height</td><td><code>Number</code></td><td><p>Height of the button, defaults to window.innerWidth / 5</p>
</td>
    </tr><tr>
    <td>options.fontSize</td><td><code>Number</code></td><td><p>Font size for the button, defaults to height / 3</p>
</td>
    </tr><tr>
    <td>options.textEnterXRTitle</td><td><code>String</code></td><td><p>Text to display on the button before entering XR, defaults to &quot;ENTER XR&quot;</p>
</td>
    </tr><tr>
    <td>options.textXRNotFoundTitle</td><td><code>String</code></td><td><p>Text to display on the button when XR not found, defaults to &quot;XR NOT FOUND&quot;</p>
</td>
    </tr><tr>
    <td>options.textExitXRTitle</td><td><code>String</code></td><td><p>Text to display on the button when currently in XR, defaults to &quot;EXIT XR&quot;</p>
</td>
    </tr><tr>
    <td>options.domElement</td><td><code>HTMLElement</code></td><td><p>Pass in an alternate DOM Element to use for the button, should provide a &#39;click&#39; event</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="p5xrInput"></a>

## p5xrInput
**Kind**: global class  
**Category**: Input  

* [p5xrInput](#p5xrInput)
    * [.direction](#p5xrInput+direction) : <code>p5.Vector</code>
    * [.pose](#p5xrInput+pose) : <code>Float32Array</code>
    * [.position](#p5xrInput+position) : <code>p5.Vector</code>
    * [.rotation](#p5xrInput+rotation) : <code>p5.Vector</code>
    * [.trigger](#p5xrInput+trigger) : <code>GamepadButton</code>
    * [.grip](#p5xrInput+grip) : <code>GamepadButton</code>
    * [.touchpad](#p5xrInput+touchpad) : <code>GamepadButton</code>
    * [.thumbstick](#p5xrInput+thumbstick) : <code>GamepadButton</code>
    * [.touchpad2D](#p5xrInput+touchpad2D) : <code>p5.Vector</code>
    * [.thumbstick2D](#p5xrInput+thumbstick2D) : <code>p5.Vector</code>
    * [.updatePose()](#p5xrInput+updatePose) ⇒ <code>XRPose</code>
    * [.updateGamepad()](#p5xrInput+updateGamepad) ⇒ <code>Gamepad</code>


* * *

<a name="p5xrInput+direction"></a>

### p5xrInput.direction : <code>p5.Vector</code>
**Kind**: instance property of [<code>p5xrInput</code>](#p5xrInput)  

* * *

<a name="p5xrInput+pose"></a>

### p5xrInput.pose : <code>Float32Array</code>
The current 4x4 pose matrix

**Kind**: instance property of [<code>p5xrInput</code>](#p5xrInput)  
**Example**  
```js
// Draws a box at the current pose matrix
let right;

function preload() {
 createVRCanvas();
}

function draw() {
  right = getXRInput('right');
  if (right) {
    push();
    translate(right.pose());
    box(10);
    pop();
 }
}
```

* * *

<a name="p5xrInput+position"></a>

### p5xrInput.position : <code>p5.Vector</code>
Returns the current position as a Vector

**Kind**: instance property of [<code>p5xrInput</code>](#p5xrInput)  

* * *

<a name="p5xrInput+rotation"></a>

### p5xrInput.rotation : <code>p5.Vector</code>
Returns the current rotation as an euler Vector.Using this is prone to gimbal locking, which leads to unexpected results.`applyMatrix(p5xrInput.pose)` is the preferred method of rotation.

**Kind**: instance property of [<code>p5xrInput</code>](#p5xrInput)  

* * *

<a name="p5xrInput+trigger"></a>

### p5xrInput.trigger : <code>GamepadButton</code>
Returns a GamepadButton object corresponding to the controller's trigger button

**Kind**: instance property of [<code>p5xrInput</code>](#p5xrInput)  

* * *

<a name="p5xrInput+grip"></a>

### p5xrInput.grip : <code>GamepadButton</code>
Returns a GamepadButton object corresponding to the controller's grip button

**Kind**: instance property of [<code>p5xrInput</code>](#p5xrInput)  

* * *

<a name="p5xrInput+touchpad"></a>

### p5xrInput.touchpad : <code>GamepadButton</code>
Returns a GamepadButton object corresponding to the controller's touchpad button

**Kind**: instance property of [<code>p5xrInput</code>](#p5xrInput)  

* * *

<a name="p5xrInput+thumbstick"></a>

### p5xrInput.thumbstick : <code>GamepadButton</code>
Returns a GamepadButton object corresponding to the controller's thumbstick button

**Kind**: instance property of [<code>p5xrInput</code>](#p5xrInput)  

* * *

<a name="p5xrInput+touchpad2D"></a>

### p5xrInput.touchpad2D : <code>p5.Vector</code>
Returns a Vector with the touchpad's X and Y values

**Kind**: instance property of [<code>p5xrInput</code>](#p5xrInput)  

* * *

<a name="p5xrInput+thumbstick2D"></a>

### p5xrInput.thumbstick2D : <code>p5.Vector</code>
Returns a Vector with the thumbstick's X and Y values

**Kind**: instance property of [<code>p5xrInput</code>](#p5xrInput)  

* * *

<a name="p5xrInput+updatePose"></a>

### p5xrInput.updatePose() ⇒ <code>XRPose</code>
Retrieves the latest pose using the current frame

**Kind**: instance method of [<code>p5xrInput</code>](#p5xrInput)  
**Returns**: <code>XRPose</code> - The latest pose from the XRInputSource  

* * *

<a name="p5xrInput+updateGamepad"></a>

### p5xrInput.updateGamepad() ⇒ <code>Gamepad</code>
Retrieves the latest Gamepad from the XRInputSource

**Kind**: instance method of [<code>p5xrInput</code>](#p5xrInput)  
**Returns**: <code>Gamepad</code> - The latest Gamepad from the XRInputSource  

* * *

<a name="getRayFromScreen"></a>

## getRayFromScreen(x, y) ⇒ <code>Ray</code>
Takes a 2D screen coordinate and returns a Ray in 3D coordinates.

**Kind**: global function  
**Returns**: <code>Ray</code> - Ray object for use with raycasting methods, {origin, direction}  
**Category**: Raycasting  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>x</td><td><code>Number</code></td><td><p>The screen x position for the Ray to originate from</p>
</td>
    </tr><tr>
    <td>y</td><td><code>Number</code></td><td><p>The screen y position for the Ray to originate from</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="intersectsSphere"></a>

## intersectsSphere(radius, [Ray]) ⇒ <code>Boolean</code>
Checks ray against a sphere collider with given radius at current drawing position.

**Kind**: global function  
**Returns**: <code>Boolean</code> - True if the ray intersects with a sphere with the given radius at current drawing position, false otherwise  
**Category**: Raycasting  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>radius</td><td><code>Number</code></td><td><p>The radius of the sphere to check collision with</p>
</td>
    </tr><tr>
    <td>[Ray]</td><td><code>Number</code></td><td><p>Optional. The ray to use for checking, defaults to getRayFromScreen(0, 0)</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="intersectsBox"></a>

## intersectsBox(width, [height], [depth], [ray]) ⇒ <code>Boolean</code>
Checks ray against a box collider with given dimensions at current drawing position.

**Kind**: global function  
**Returns**: <code>Boolean</code> - True if the ray intersects with a box collider with given dimension at current drawing position, false otherwise  
**Category**: Raycasting  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>width</td><td><code>Number</code></td><td><p>Width of box collider for check</p>
</td>
    </tr><tr>
    <td>[height]</td><td><code>Number</code></td><td><p>Optional. Height of box collider for check</p>
</td>
    </tr><tr>
    <td>[depth]</td><td><code>Number</code></td><td><p>Optional. Depth of box collider for check</p>
</td>
    </tr><tr>
    <td>[ray]</td><td><code>Ray</code></td><td><p>Optional. The ray to use for checking, defaults to getRayFromScreen(0, 0)</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="intersectsPlane"></a>

## intersectsPlane([ray]) ⇒ <code>p5.Vector</code>
Checks ray against a plane with at current drawing position and returns normalized x and y coordinates of intersection point.

**Kind**: global function  
**Returns**: <code>p5.Vector</code> - The normalized coordinate of the intersection point on the plane, or null if no intersection  
**Category**: Raycasting  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[ray]</td><td><code>Ray</code></td><td><p>Optional. The ray to use for checking, defaults to getRayFromScreen(0, 0)</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="generateRay"></a>

## generateRay(x1, y1, z1, x2, y2, z2) ⇒ <code>Ray</code>
Create a ray object for using with raycasting methods.

**Kind**: global function  
**Returns**: <code>Ray</code> - Ray object with {origin: p5.Vector, direction: p5.Vector}  
**Category**: Raycasting  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>x1</td><td><code>Number</code></td><td><p>X coordinate for origin</p>
</td>
    </tr><tr>
    <td>y1</td><td><code>Number</code></td><td><p>Y coordinate for origin</p>
</td>
    </tr><tr>
    <td>z1</td><td><code>Number</code></td><td><p>Z coordinate for origin</p>
</td>
    </tr><tr>
    <td>x2</td><td><code>Number</code></td><td><p>X coordinate for direction</p>
</td>
    </tr><tr>
    <td>y2</td><td><code>Number</code></td><td><p>Y coordinate for direction</p>
</td>
    </tr><tr>
    <td>z2</td><td><code>Number</code></td><td><p>Z coordinate for direction</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="p5xrViewer"></a>

## p5xrViewer
p5xrViewer
Class that contains state of current viewer position and view. The view and pose matrices
are updated automatically but can be accessed directly. For most use cases, the viewer position
should be modified using the setViewerPosition function.

**Kind**: global class  
**Category**: View  

* [p5xrViewer](#p5xrViewer)
    * [.pose](#p5xrViewer+pose) : <code>p5.Matrix</code>
    * [.view](#p5xrViewer+view) : <code>p5.Matrix</code>
    * [.getRayFromScreen(screenX, screenY)](#p5xrViewer+getRayFromScreen) ⇒ <code>Ray</code>


* * *

<a name="p5xrViewer+pose"></a>

### p5xrViewer.pose : <code>p5.Matrix</code>
Pose matrix

**Kind**: instance property of [<code>p5xrViewer</code>](#p5xrViewer)  

* * *

<a name="p5xrViewer+view"></a>

### p5xrViewer.view : <code>p5.Matrix</code>
View matrix

**Kind**: instance property of [<code>p5xrViewer</code>](#p5xrViewer)  

* * *

<a name="p5xrViewer+getRayFromScreen"></a>

### p5xrViewer.getRayFromScreen(screenX, screenY) ⇒ <code>Ray</code>
Get a ray object from a viewer for a given screen coordinate.
Used for raycasting.

**Kind**: instance method of [<code>p5xrViewer</code>](#p5xrViewer)  
**Returns**: <code>Ray</code> - Ray from viewer position to screen position, {origin, direction}  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>screenX</td><td><code>Number</code></td><td><p>Screen X position to use for ray origin</p>
</td>
    </tr><tr>
    <td>screenY</td><td><code>Number</code></td><td><p>Screen Y position to use for ray origin</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="setViewerPosition"></a>

## setViewerPosition(targetX, targetY, targetZ)
Sets the position of the viewer

**Kind**: global function  
**Category**: View  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>targetX</td><td><code>*</code></td><td><p>The target x position of the viewer</p>
</td>
    </tr><tr>
    <td>targetY</td><td><code>*</code></td><td><p>The target y position of the viewer</p>
</td>
    </tr><tr>
    <td>targetZ</td><td><code>*</code></td><td><p>The target z position of the viewer</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
let z = 0;
let viewerPosition;

function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(0, 0, 255);
  noStroke();
  angleMode(DEGREES);
  viewerPosition = createVector(0, 0, 0);
}

function draw() {
  //moves the viewer forward if controller trigger is pressed
  const left = getXRInput(LEFT);
  const right = getXRInput(RIGHT);
  [left, right].forEach((hand) => {
  if (hand) {
      viewerPosition.z += hand.thumbstick2D.y * 0.01;
      viewerPosition.x += hand.thumbstick2D.x * 0.01;
      if(hand.thumbstick2D.x !== 0 || hand.thumbstick2D.y !== 0) {
        fill('red');
      } else {
        fill('purple');
      }
      push();
      applyMatrix(hand.pose)
      box(0.05);
      pop();
    }
  });
  if (viewerPosition.z < -7) {
    viewerPosition.z = 7;
  }
  setViewerPosition(viewerPosition.x, viewerPosition.y, viewerPosition.z);
  //draw a 10x10 floor
  push();
  translate(0, -1, 0);
  rotateX(-90);
  fill(0, 255, 0);
  plane(10, 10);
  pop();
  //resets the viewer's position if they move too far
 }
```

* * *

<a name="getViewer"></a>

## getViewer() ⇒ [<code>p5xrViewer</code>](#p5xrViewer)
Gets the current viewer object

**Kind**: global function  
**Returns**: [<code>p5xrViewer</code>](#p5xrViewer) - The viewer object  
**Category**: View  

* * *

<a name="sticky"></a>

## sticky(drawOnTop)
All calls after sticky() and before noSticky() will move with the view.

**Kind**: global function  
**Category**: View  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>drawOnTop</td><td><code>Boolean</code></td><td><p>If true, all calls after this will be drawn on top of everything else</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="noSticky"></a>

## noSticky()
All calls after sticky() and before noSticky() will move with the view.

**Kind**: global function  
**Category**: View  

* * *

