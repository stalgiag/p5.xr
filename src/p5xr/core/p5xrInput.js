export default class p5xrInput {
  constructor(inputSource) {
    this._inputSource = inputSource;
    this._pose = null;
    this.hand = inputSource.handedness || null;
  }

  get pose() {
    this.updatePose();
    return [...this._pose.transform.matrix];
  }

  updatePose() {
    this._pose = window.p5xr.instance.frame.getPose(this._inputSource.gripSpace, window.p5xr.instance.xrRefSpace);
  }
}