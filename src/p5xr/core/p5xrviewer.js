export default class p5xrViewer {
    constructor() {
        this._pose = null;
        this._view = null;

        this.setPosition = function(x, y, z) {
            p5.instance._renderer.translate(-x, -y, -z);
        }
    }

    set pose(newPose) {
        this._pose = newPose;
    }

    get pose() {
        return this._pose;
    }

    set view(newView) {
        this._view = newView;
        if(p5xr.instance.injectedPolyfill) {
            p5.instance._renderer.uMVMatrix.set(this._pose.getViewMatrix(this._view));
            p5.instance._renderer.uPMatrix.set(this._view.projectionMatrix);
        } else {
            p5.instance._renderer.uMVMatrix.set(this._view.viewMatrix);
            p5.instance._renderer.uPMatrix.set(this._view.projectionMatrix);
        }
    }

    get view() {
        return this._view;
    }
}

p5.prototype.setViewerPosition = function(x, y, z) {
    let viewer = p5xr.instance.viewer;
    viewer.setPosition(x, y, z);
};
