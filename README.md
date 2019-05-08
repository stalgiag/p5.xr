# p5.xr

## STATUS
This is at a pre-pre-alpha stage. Alpha release is currently projected for early summer. The WebXR API is very unstable right now and development is in a minor limbo while waiting for that work to solidify. AR functionality is currently stubbed out in master. For simple sketches, mobile VR works relatively well in Chrome when served locally (ie use something like https://www.npmjs.com/package/http-server on shared wifi with your phone). Once WebXR stabilizes a bit and the non-polyfill spec is more predictable, this will work in more scenarios such as with the p5 online editor.

## BUILDING
As stated above, this is currently not guaranteed to work. All of the manual examples work well on a Samsung Galaxy S7 in Chrome. Much more in the way of testing, stabilization, optimization, and features to come.

to build package:
- `npm install`
- `npm run build`

to build docs:
- `npm run docs`

you may need to enable the WebXR flag in your browser by going to `chrome://flags/#webxr` in your url bar
