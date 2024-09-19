<img src="https://github.com/stalgiag/p5.xr/raw/main/docs/assets/xr-tear.png" alt="drawing of a face with eyes that are the letter x and r with a tear coming out of one eye" style="max-width:40%; margin-left:30%; margin-bottom: -30px"/>

## What is it?

p5.xr is an add-on for [p5.js](https://p5js.org/), a Javascript library that makes coding accessible for artists, designers, educators, and beginners. p5.xr adds the ability to __run p5 sketches in Augmented Reality or Virtual Reality__. It does this with the help of [WebXR](https://www.w3.org/TR/webxr/). This enables anyone familiar with p5 to start experimenting with these technologies with little setup.


## Features

p5.xr sketches can be run with [p5's online editor.](https://editor.p5js.org/) All of the existing p5 functionality works, and in addition, p5.xr allows you to:
- __Virtual Reality__
  - Run any 2D or 3D p5 sketch in VR ( mobile, desktop or standalone device )

- __Augmented Reality__
  - Make sketches that use Augmented Reality with any device that supports immersive AR Session 

## Getting Started
1. Use the [the most recent version of p5.js](https://p5js.org/download/) 
2. Check out the [Device and Browser Support Section](https://stalgiag.github.io/p5.xr/#/device-support.html) or use the [Immersive Web Emulator](https://stalgiag.github.io/p5.xr/#/quick-start/emulator)
3. Add p5.xr to your project. This can be done most easily by adding the script link to a CDN in the `<head>` of your HTML file underneath the p5 link:
    ```
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.10.0/p5.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/p5.xr@latest/dist/p5xr.min.js"></script>
    ```
4. Change the `createCanvas()` call in your p5 WEBGL sketch to `createVRCanvas()` and put it in `preload()` -or-
5. [Try out one of the Examples](https://stalgiag.github.io/p5.xr/#/quick-start/examples)!
