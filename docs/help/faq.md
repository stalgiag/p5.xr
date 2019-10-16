Why does't my ___device name here___ work?

- Not all device + browser combos work with every mode currently. Please open a Github issue with a code example, your device name, OS, and code example.

Why doesn't plane detection, hit detection, or anchoring work in ARCore mode yet?

- These features are currently unstable in the WebXR Spec. Once that is stabilized work can begin on implementing those features.

How can I make my own .patt file to use as a marker?

- p5.xr uses a slightly-modified version of jsartoolkit for marker-detection. [AR.JS](https://github.com/jeromeetienne/AR.js), which is another, more robust AR framework for the web, also uses jsartoolkit. Jerome Etienne, the initiator of AR.js, [hosts an awesome tool that can be used to make .patt files](https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html).