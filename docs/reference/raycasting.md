## generateRay()
`createARCanvas()` is the one essential line in any AR sketch.
It should always be placed inside of `setup()`.

```
generateRay();
```

| Parameters        | Returns          |
| ------------- |:-------------:
| (Number __x1__, Number __y1__, Number __z1__, Number __x1__, Number __y2__, Number __z2__)  | RayObject __{origin: p5.Vector, direction: p5.Vector}__

***

## intersectsSphere()
`createARCanvas()` is the one essential line in any AR sketch.
It should always be placed inside of `setup()`.

```
intersectsSphere();
```

| Parameters        | Returns          |
| ------------- |:-------------:
| Number radius, [rayObject ray] | Boolean

***

## intersectsPlane()
`createARCanvas()` is the one essential line in any AR sketch.
It should always be placed inside of `setup()`.

```
intersectsPlane();
```

| Parameters        | Returns          |
| ------------- |:-------------:
| [RayObject ray]  | p5.Vector

***

## intersectsBox()
`createARCanvas()` is the one essential line in any AR sketch.
It should always be placed inside of `setup()`.

```
intersectsBox();
```

| Parameters        | Returns          |
| ------------- |:-------------:
| (Number width, [Number height], [Number depth], [RayObject ray])  | Boolean

***

## getRayFromScreen()
`createARCanvas()` is the one essential line in any AR sketch.
It should always be placed inside of `setup()`.

```
getRayFromScreen();
```

| Parameters        | Returns          |
| ------------- |:-------------:
| (Number screenX, Number screenY)  | RayObject

***