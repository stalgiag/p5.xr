## generateRay()
`generateRay()` takes an origin location (x, y, z) and a target location (x, y, z) and returns an Object with an origin and a direction. This object is useful for using with many of the other raycasting functions.

```js
generateRay();
```

| Parameters        | Returns          |
| ------------- |:-------------:
| (Number __x1__, Number __y1__, Number __z1__, Number __x1__, Number __y2__, Number __z2__)  | RayObject __{origin: p5.Vector, direction: p5.Vector}__

***

## intersectsSphere()
`intersectsSphere()` checks for a ray hit with a sphere of the specified radius at the current model transform location.

You can optionally pass in a rayObject made with [`generateRay()`](#generateray). If you don't pass in this argument, [`getRayFromScreen(0, 0)`](#getRayFromScreen) is used to create the ray used for hit detection.

```js
intersectsSphere();
```

| Parameters        | Returns          |
| ------------- |:-------------:
| Number radius, [rayObject ray] | Boolean

***

## intersectsPlane()
`intersectsPlane` checks for a ray hit with a plane at the current model transform. If a hit is detected, a p5.Vector is returned with the offset location of the hit relative to the plane.

You can optionally pass in a rayObject made with [`generateRay()`](#generateray). If you don't pass in this argument, [`getRayFromScreen(0, 0)`](#getRayFromScreen) is used to create the ray used for hit detection.

```js
intersectsPlane();
```

| Parameters        | Returns          |
| ------------- |:-------------:
| [RayObject ray]  | p5.Vector

***

## intersectsBox()
`intersectsBox()` checks for a ray hit with a box of the specified size at the current model transform location.

You can optionally pass in a rayObject made with [`generateRay()`](#generateray). If you don't pass in this argument, [`getRayFromScreen(0, 0)`](#getRayFromScreen) is used to create the ray used for hit detection.


```js
intersectsBox();
```

| Parameters        | Returns          |
| ------------- |:-------------:
| (Number width, [Number height], [Number depth], [RayObject ray])  | Boolean

***

## getRayFromScreen()
`getRayFromScreen()` takes an x and y screen coordinate and uses this to generate a ray object which can be used for hit detection in the raycasting functions.

```js
getRayFromScreen();
```

| Parameters        | Returns          |
| ------------- |:-------------:
| (Number screenX, Number screenY)  | RayObject

***