## createARCanvas()
`createARCanvas()` is the one essential line in any AR sketch.
It should always be placed inside of `setup()`.

```js
function setup() {
    createARCanvas(MARKER); //creates a fullscreen MARKER based sketch
}
```
```js
function setup() {
    createARCanvas(ARCORE); //creates a fullscreen ARCORE based sketch
}
```

| Parameters        | Returns          |
| ------------- |:-------------:
| __MARKER__ or __ARCORE__    | None

***

## addMarker()
`addMarker()` adds a new marker for tracking.

It takes a string URL for a .patt file, and an optional success callback.

```js
addMarker('pattern-p5js.patt', callback);
```

| Parameters        | Returns          |
| ------------- |:-------------:
| (String __urlForPattFile__, [Function __successCallback__])   | None

***

## showVideoFeed()
`showVideoFeed()` displays the video feed. This should be called before any rendering in a standard marker-detection sketch.

```js
showVideoFeed(myCapture);
```

| Parameters        | Returns          |
| ------------- |:-------------:
| p5.MediaElement __videoToDisplay__ | None

***

## detectMarkers()
`detectMarkers()` processes the current frame of a video and looks for all of the added markers.

```js
detectMarkers(capture);
```

| Parameters        | Returns          |
| ------------- |:-------------:
| (p5.MediaElement __videoToDetectMarkerIn__)  | None

***

## getSmoothTrackerMatrix()
`getSmoothTrackerMatrix` returns a p5.Matrix that represents an averaged and smoothed model view matrix for the specified marker. This will only work after a call to [`detectMarkers()`](#detectMarkers).

```js
getSmoothTrackerMatrix(markerId);
```

| Parameters        | Returns          |
| ------------- |:-------------:
| (Number __markerIndex__)  | p5.Matrix

***

## getTrackerMatrix()
`getTrackerMatrix` returns a p5.Matrix that represents an model view matrix for the specified marker. This will only work after a call to [`detectMarkers()`](#detectMarkers).

```js
getTrackerMatrix(markerId);
```

| Parameters        | Returns          |
| ------------- |:-------------:
| (Number __markerIndex__)  | p5.Matrix

***


