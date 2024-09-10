# Immersive Web Emulator

The [Immersive Web Emulator](https://github.com/meta-quest/immersive-web-emulator) is a Chrome extension that allows you to simulate a WebXR device in a desktop browser using a polyfill. It closely aligns with the features of the Meta Quest, enabling the simulation of features like hand tracking. This tool helps develop locally on a desktop before testing an actual device.

Currently, the version available in the Chrome extension store does not work with the p5 Web Editor (awaiting merging of [PR #65](https://github.com/meta-quest/immersive-web-emulator/pull/65)). However, you can make it work by loading a patched version. 

## Installation

To install the patched version, follow these steps:
1. Download the [patched release zip file](https://github.com/TiborUdvari/immersive-web-emulator/releases/tag/1.5.1) and unzip it 
1. Go to `chrome://extensions` and enable developer mode
1. Load the unpacked extension
1. Test a [working example](https://editor.p5js.org/TiborUdvari/sketches/G1S1g40xx)

<video controls>
  <source src="https://rawcdn.githack.com/TiborUdvari/p5.xr-videos/main/videos/emulator-installation.mp4">
</video>
