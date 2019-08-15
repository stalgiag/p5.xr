# p5.xr

## STATUS
This is at a pre-alpha stage. Alpha release is currently projected for early fall. The WebXR API is unstable right now and only certain hardware with certain versions of Chrome are known to work.

## Setting up for VR
Your phone will need an accelerometer/gyrometer and you should have the most recent version of Chrome installed.

1. On your phone enter `chrome://flags` into the URL bar.
2. Type `webxr` into the search bar
3. Set everything here to 'Enabled'
4. Try one of these examples
    - [Basic VR Example](https://editor.p5js.org/stalgiag/present/7RUbTWiOg) ---- [Editor Link](https://editor.p5js.org/stalgiag/sketches/7RUbTWiOg)
    - [Raycasting Example](https://editor.p5js.org/stalgiag/present/xijXG0FOc) ---- [Editor Link](https://editor.p5js.org/stalgiag/sketches/xijXG0FOc)
    - [2D in VR Example](https://editor.p5js.org/stalgiag/present/TOBzS6UP1) ---- [Editor Link](https://editor.p5js.org/stalgiag/sketches/TOBzS6UP1)
    
## Setting up for AR

1. Your phone must have Android 8.0 currently (ARKit and iOS support coming)
2. Install ARCore in the Play Store
3. Complete Steps 1 - 3 in the `Setting up for VR` section
4. Try and example:
  - [Basic AR Example (no anchors, floating may occur)[https://editor.p5js.org/stalgiag/present/1wzwzI2uG]

## BUILDING

to build package:
- `npm install`
- `npm run build`

to build docs:
- `npm run docs`

you may need to enable the WebXR flag in your browser by going to `chrome://flags/#webxr` in your url bar
