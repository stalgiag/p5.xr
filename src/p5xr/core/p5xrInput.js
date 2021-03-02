export default class p5xrInput {
  constructor(inputSource) {
    this._inputSource = inputSource;
    this._pose;
    this.hand = inputSource.handedness;
  }

  get pose() {
    this.updatePose();
    return this._pose.transform.matrix;
  }

  get position() {
    this.updatePose();
    let p = this._pose.transform.position
    return new p5.Vector(p.x, p.y, p.z);
  }

  updatePose() {
    this._pose = window.p5xr.instance.frame.getPose(this._inputSource.gripSpace, window.p5xr.instance.xrRefSpace);
  }
}
