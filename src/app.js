
import p5vr from '../src/p5xr/p5vr/p5vr.js'
import p5ar from '../src/p5xr/p5ar/p5ar.js'

let _p5vr;

p5.prototype.createVRCanvas = function () {
    console.log('createVRCanvas');
    noLoop();
    _p5vr = new p5vr();
    _p5vr.initVR();
    // _p5vr = new p5vr();
    // p5vr.initVR(this);
};

p5.prototype.setVRBackgroundColor = function(r, g, b) {
    _p5vr.curClearColor = color(r, g, b);
};

p5.RendererGL.prototype._update = function () {
    /* TODO: Figure out how to avoid overwriting this function */
    /* IE: Override the resetting of cameraMatrices in _update */
    /*
    /*
    /*
    /*
    /*
    */

    // reset model view and apply initial camera transform
    // (containing only look at info; no projection).
    // this.uMVMatrix.set(
    //   this._curCamera.cameraMatrix.mat4[0],
    //   this._curCamera.cameraMatrix.mat4[1],
    //   this._curCamera.cameraMatrix.mat4[2],
    //   this._curCamera.cameraMatrix.mat4[3],
    //   this._curCamera.cameraMatrix.mat4[4],
    //   this._curCamera.cameraMatrix.mat4[5],
    //   this._curCamera.cameraMatrix.mat4[6],
    //   this._curCamera.cameraMatrix.mat4[7],
    //   this._curCamera.cameraMatrix.mat4[8],
    //   this._curCamera.cameraMatrix.mat4[9],
    //   this._curCamera.cameraMatrix.mat4[10],
    //   this._curCamera.cameraMatrix.mat4[11],
    //   this._curCamera.cameraMatrix.mat4[12],
    //   this._curCamera.cameraMatrix.mat4[13],
    //   this._curCamera.cameraMatrix.mat4[14],
    //   this._curCamera.cameraMatrix.mat4[15]
    // );
    // p5.instance._renderer.uMVMatrix.set(viewMat);
    // p5.instance._renderer.uPMatrix.set(projMat);
    // reset light data for new frame.

    /*
    /*
    /*
    /*
    /*
    */
    /* TODO: Figure out how to avoid overwriting this function */
    /* IE: Override the resetting of cameraMatrices in _update */

    this.ambientLightColors.length = 0;
    this.directionalLightDirections.length = 0;
    this.directionalLightColors.length = 0;

    this.pointLightPositions.length = 0;
    this.pointLightColors.length = 0;
};


// p5vr();
// p5ar();
