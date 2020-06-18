export default class ARAnchor {
  constructor(x, y, z) {
    this.position = { x: x * 100, y: y * 100, z: z * 100 };
  }

  dispose() {
    delete this;
  }

  isTracking() {
  }

  isStopped() {
  }

  transform() {
    translate(this.position.x, this.position.y, this.position.z);
  }
}
