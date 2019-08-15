# p5.xr
This library is currently at a pre-alpha stage. Alpha release is currently projected for early fall. This library is a wrapper for WebXR that allows you to render anything that can be rendered in p5 WEBGL mode in VR or AR. The WebXR API is unstable right now and only certain hardware with certain versions of Chrome are known to work. Extensive documentation and examples are coming with Alpha release.

## Setting up for VR
Your phone will need an accelerometer/gyrometer and you should have the most recent version of Chrome installed.

<img src = 'https://user-images.githubusercontent.com/10382506/63109079-54a98800-bf56-11e9-8c17-341817f7489c.jpg' alt = 'Several red spheres with a single blue sphere in the center, double drawn in VR goggles view' height = '200' />

1. On your phone enter `chrome://flags` into the URL bar.
2. Type `webxr` into the search bar
3. Set everything here to 'Enabled'
4. Try one of these examples
    - [Basic VR Example](https://editor.p5js.org/stalgiag/present/7RUbTWiOg) ---- [Editor Link](https://editor.p5js.org/stalgiag/sketches/7RUbTWiOg)
    - [Raycasting Example](https://editor.p5js.org/stalgiag/present/xijXG0FOc) ---- [Editor Link](https://editor.p5js.org/stalgiag/sketches/xijXG0FOc)
    - [2D in VR Example](https://editor.p5js.org/stalgiag/present/TOBzS6UP1) ---- [Editor Link](https://editor.p5js.org/stalgiag/sketches/TOBzS6UP1)
    
## Setting up for AR

<img src = 'https://user-images.githubusercontent.com/10382506/63109012-2fb51500-bf56-11e9-9f81-d74d14845b9c.jpg' alt = 'A floating box with a backdrop that is people working in the Frank-Ratchye Insitute for Creative Inquiry' height = '400' />


1. Your phone must have Android 8.0 currently (ARKit and iOS support coming)
2. Install ARCore in the Play Store
3. Complete Steps 1 - 3 in the `Setting up for VR` section
4. Try and example:
    - [Basic AR Example (no anchors, floating may occur)](https://editor.p5js.org/stalgiag/present/1wzwzI2uG)
    
## DOCS

COMING SOON!

## BUILDING

to build package:
- `npm install`
- `npm run build`

to build docs:
- `npm run docs`
