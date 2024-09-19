![](https://github.com/stalgiag/p5.xr/workflows/test/badge.svg)
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)

<p align="center">
  <img width="400" height="400" src="https://github.com/stalgiag/p5.xr/raw/main/docs/assets/xr-tear-small.png">
</p>

<h1 align="center">
  <a href="https://stalgiag.github.io/p5.xr/">🌀🌀 WEBSITE 🌀🌀</a>
</h1>

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


## Contributors ✨

Interested in contributing to this project? [Check out the contributor docs.](https://github.com/stalgiag/p5.xr/tree/master/contributor-docs)

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/vedhant"><img src="https://avatars1.githubusercontent.com/u/32607479?v=4?s=100" width="100px;" alt="Vedhant Agarwal"/><br /><sub><b>Vedhant Agarwal</b></sub></a><br /><a href="#infra-vedhant" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/stalgiag/p5.xr/commits?author=vedhant" title="Tests">⚠️</a> <a href="https://github.com/stalgiag/p5.xr/commits?author=vedhant" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/stalgiag"><img src="https://avatars2.githubusercontent.com/u/10382506?v=4?s=100" width="100px;" alt="Stalgia Grigg"/><br /><sub><b>Stalgia Grigg</b></sub></a><br /><a href="https://github.com/stalgiag/p5.xr/commits?author=stalgiag" title="Tests">⚠️</a> <a href="#infra-stalgiag" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-stalgiag" title="Maintenance">🚧</a> <a href="https://github.com/stalgiag/p5.xr/commits?author=stalgiag" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://msub2.com"><img src="https://avatars.githubusercontent.com/u/70986246?v=4?s=100" width="100px;" alt="Daniel Adams"/><br /><sub><b>Daniel Adams</b></sub></a><br /><a href="https://github.com/stalgiag/p5.xr/commits?author=msub2" title="Code">💻</a> <a href="#example-msub2" title="Examples">💡</a> <a href="#design-msub2" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/anagondesign"><img src="https://avatars.githubusercontent.com/u/83731139?v=4?s=100" width="100px;" alt="anagondesign"/><br /><sub><b>anagondesign</b></sub></a><br /><a href="#example-anagondesign" title="Examples">💡</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://samir.tech"><img src="https://avatars.githubusercontent.com/u/22751315?v=4?s=100" width="100px;" alt="Samir Ghosh"/><br /><sub><b>Samir Ghosh</b></sub></a><br /><a href="https://github.com/stalgiag/p5.xr/commits?author=smrghsh" title="Code">💻</a> <a href="#design-smrghsh" title="Design">🎨</a> <a href="https://github.com/stalgiag/p5.xr/commits?author=smrghsh" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://tiborudvari.com"><img src="https://avatars.githubusercontent.com/u/1434442?v=4?s=100" width="100px;" alt="Tibor Udvari"/><br /><sub><b>Tibor Udvari</b></sub></a><br /><a href="https://github.com/stalgiag/p5.xr/commits?author=TiborUdvari" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
