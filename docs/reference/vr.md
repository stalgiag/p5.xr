## createVRCanvas()
`createVRCanvas()` is the one essential line in any VR sketch.
It should always be placed inside of `preload()`. The browser places limitations on how VR is entered into. By placing `createVRCanvas()` inside of `preload()` you are doing three things:
1. Delaying the start of your sketch.
2. Running all of the hardware checks to see if your hardware/browser combo can support VR.
3. Adding a button to the window, that will start your sketch and enter VR when pressed.

```js
function preload() {
    createVRCanvas();
}
```

| Parameters        | Returns          |
| ------------- |:-------------:
| None    | None

***

## calculate()
Unlike a standard p5 sketch, while in VR mode p5.xr runs [draw()](https://p5js.org/reference/#/p5/draw) twice per frame, or once for each eye. Because of this, any value that you change inside of [draw()](https://p5js.org/reference/#/p5/draw) while in VR mode will change twice per frame. This is often not the desired behavior, for this reason, we have calculate().

All code inside of [`calculate()`](#calculate) is run once per frame, before the rendering of the first eye.

```js
function calculate() {
    // code that you want to run once each frame.
}
```
***

## setVRBackgroundColor()
Working with VR is different than working in 2D. With VR you want to clear the background every frame to avoid motion sickness. `setVRBackgroundColor()` sets the color that will be used to clear the background after rendering each eye.
```js
setVRBackgroundColor(200, 0, 150);
```

| Parameters        | Returns          |
| ------------- |:-------------:
| Number __r__, Number __g__, Number __b__    | None

***

## surroundTexture()
`surroundTexture()` is useful for 360 photo. It essentially creates a very large sphere with inverted scale that surrounds the viewer.
```js
surroundTexture(myTexture);
```

| Parameters        | Returns          |
| ------------- |:-------------:
| p5.MediaElement or p5.Graphics or p5.Image __texture__ | None

***

