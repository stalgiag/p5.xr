## createARCanvas()
`createARCanvas()` is the one essential line in any AR sketch.
It should always be placed inside of `setup()`.

```
function setup() {
    createARCanvas();
}
```

| Parameters        | Returns          |
| ------------- |:-------------:
| __MARKER__ or __ARCORE__    | None

***

## addMarker()
`createARCanvas()` is the one essential line in any AR sketch.
It should always be placed inside of `setup()`.

```
addMarker('pattern-p5js.patt', callback);
```

| Parameters        | Returns          |
| ------------- |:-------------:
| (String __urlForPattFile__, Function __successCallback__)   | None

***
## showVideoFeed()
`createARCanvas()` is the one essential line in any AR sketch.
It should always be placed inside of `setup()`.

```
showVideoFeed();
```

| Parameters        | Returns          |
| ------------- |:-------------:
|  | None
***

## detectMarkers()
`createARCanvas()` is the one essential line in any AR sketch.
It should always be placed inside of `setup()`.

```
detectMarkers(capture);
```

| Parameters        | Returns          |
| ------------- |:-------------:
| (p5.MediaElement __videoToDetectMarkerIn__)  | None

***

## getSmoothTrackerMatrix()
`createARCanvas()` is the one essential line in any AR sketch.
It should always be placed inside of `setup()`.

```
getSmoothTrackerMatrix(markerId);
```

| Parameters        | Returns          |
| ------------- |:-------------:
| (Number __markerIndex__)  | None

***

## getTrackerMatrix()
`createARCanvas()` is the one essential line in any AR sketch.
It should always be placed inside of `setup()`.

```
getTrackerMatrix(markerId);
```

| Parameters        | Returns          |
| ------------- |:-------------:
| (Number __markerIndex__)  | None

***


