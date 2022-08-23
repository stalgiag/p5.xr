## Members

* [direction](#direction) ⇒ <code>p5.Vector</code>
* [pose](#pose) ⇒ <code>Float32Array</code>
* [position](#position) ⇒ <code>p5.Vector</code>
* [trigger](#trigger) ⇒ <code>GamepadButton</code>
* [grip](#grip) ⇒ <code>GamepadButton</code>
* [touchpad](#touchpad) ⇒ <code>GamepadButton</code>
* [thumbstick](#thumbstick) ⇒ <code>GamepadButton</code>
* [touchpad2D](#touchpad2D) ⇒ <code>p5.Vector</code>
* [thumbstick2D](#thumbstick2D) ⇒ <code>p5.Vector</code>

## Functions

* [updatePose()](#updatePose)
* [updateGamepad()](#updateGamepad)

<a name="direction"></a>

## direction ⇒ <code>p5.Vector</code>
**Kind**: global variable  
**Returns**: <code>p5.Vector</code> - Returns the current forward direction  
<a name="pose"></a>

## pose ⇒ <code>Float32Array</code>
**Kind**: global variable  
**Returns**: <code>Float32Array</code> - Returns the current 4x4 pose matrix  
**Example**  
```js
// Draws a box at the current pose matrix
let right;

function setup() {
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
```
<a name="position"></a>

## position ⇒ <code>p5.Vector</code>
**Kind**: global variable  
**Returns**: <code>p5.Vector</code> - Returns the current position as a Vector  
<a name="trigger"></a>

## trigger ⇒ <code>GamepadButton</code>
**Kind**: global variable  
**Returns**: <code>GamepadButton</code> - Returns a GamepadButton object corresponding to the controller's trigger button  
<a name="grip"></a>

## grip ⇒ <code>GamepadButton</code>
**Kind**: global variable  
**Returns**: <code>GamepadButton</code> - Returns a GamepadButton object corresponding to the controller's grip button  
<a name="touchpad"></a>

## touchpad ⇒ <code>GamepadButton</code>
**Kind**: global variable  
**Returns**: <code>GamepadButton</code> - Returns a GamepadButton object corresponding to the controller's touchpad button  
<a name="thumbstick"></a>

## thumbstick ⇒ <code>GamepadButton</code>
**Kind**: global variable  
**Returns**: <code>GamepadButton</code> - Returns a GamepadButton object corresponding to the controller's thumbstick button  
<a name="touchpad2D"></a>

## touchpad2D ⇒ <code>p5.Vector</code>
**Kind**: global variable  
**Returns**: <code>p5.Vector</code> - Returns a Vector with the touchpad's X and Y values  
<a name="thumbstick2D"></a>

## thumbstick2D ⇒ <code>p5.Vector</code>
**Kind**: global variable  
**Returns**: <code>p5.Vector</code> - Returns a Vector with the thumbstick's X and Y values  
<a name="updatePose"></a>

## updatePose()
Retrieves the latest XRPose from the current XRFrame

**Kind**: global function  
<a name="updateGamepad"></a>

## updateGamepad()
Retrieves the latest Gamepad from the XRInputSource

**Kind**: global function  
