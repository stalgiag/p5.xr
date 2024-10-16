/*
 * @module HandTracking
 *
 * Hand Input Implementation (https://www.w3.org/TR/webxr-hand-input-1/)
 */

/**
 * One of the five possible values for mainFingerMode (THUMB, INDEX, MIDDLE, RING, PINKY).
 * Represents the thumb.
 * @property {number} THUMB
 * @final
 */
export const THUMB = 0;

/**
 * One of the five possible values for mainFingerMode (THUMB, INDEX, MIDDLE, RING, PINKY).
 * Represents the index finger.
 * @property {number} INDEX
 * @final
 */
export const INDEX = 1;

/**
 * One of the five possible values for mainFingerMode (THUMB, INDEX, MIDDLE, RING, PINKY).
 * Represents the middle finger.
 * @property {number} MIDDLE
 * @final
 */
export const MIDDLE = 2;

/**
 * One of the five possible values for mainFingerMode (THUMB, INDEX, MIDDLE, RING, PINKY).
 * Represents the ring finger.
 * @property {number} RING
 * @final
 */
export const RING = 3;

/**
 * One of the five possible values for mainFingerMode (THUMB, INDEX, MIDDLE, RING, PINKY).
 * Represents the pinky finger.
 * @property {number} PINKY
 * @final
 */
export const PINKY = 4;

p5.prototype._mainHandMode = p5.prototype.RIGHT;

const p = p5.prototype;
p5.prototype.hands = Array.from({ length: 50 }, () => ({
  x: 0,
  y: 0,
  z: 0,
  rad: 0.1,
  mat: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]), // Identity matrix
}));

// TODO: implement other fingers, currently index only
p5.prototype.fingerLeft = p.hands[9];
p5.prototype.fingerRight = p.hands[9 + 25];

/**
 * An Object representing the main finger tip
 * By default it is the right index finger tip
 */
p5.prototype.finger = p.fingerRight;
p5.prototype.fingerMain = p.fingerRight;
p5.prototype.fingerAlt = p.fingerLeft;

p5.prototype.fingers = [
  p.hands[4],
  p.hands[9],
  p.hands[14],
  p.hands[19],
  p.hands[24],
  p.hands[4 + 25],
  p.hands[9 + 25],
  p.hands[14 + 25],
  p.hands[19 + 25],
  p.hands[24 + 25],
];

p5.prototype.fingersLeft = p.fingers.slice(0, 5);
p5.prototype.fingersRight = p.fingers.slice(5, 10);

p5.prototype.fingersMain = p.fingersRight;
p5.prototype.fingersAlt = p.fingersLeft;

p5.prototype.handLeft = p.hands.slice(0, 25);
p5.prototype.handRight = p.hands.slice(25, 50);
p5.prototype.handMain = p.handRight;
p5.prototype.hand = p.handMain;
p5.prototype.handAlt = p.handLeft;

p5.prototype.flatMatrices = new Float32Array(16 * 25); // one 4x4 mat for 25 joints
p5.prototype.flatMatricesFull = new Float32Array(16 * 50); // one 4x4 mat for 25 joints
p5.prototype.radii = new Float32Array(25);
p5.prototype.radiiFull = new Float32Array(50);

p5.prototype._pinchTreshold = 25e-3; // about 25 mm
p5.prototype.fingersArePinched = false;
p5.prototype.pFingersArePinched = false;

p5.prototype._handleOnPinch = function () {
  const finger = this.fingerMain;
  const thumb = this.fingersRight[0];
  const dist = this.dist(
    finger.x,
    finger.y,
    finger.z,
    thumb.x,
    thumb.y,
    thumb.z,
  );

  this._setProperty('fingersArePinched', dist < this._pinchTreshold);

  if (!this.pFingersArePinched && this.fingersArePinched) {
    const context = this._isGlobal ? window : this;
    if (typeof context.fingersPinched === 'function') {
      context.fingersPinched();
    }
  }
};

p5.prototype._handleHandInput = function (frame, refSpace, inputSource) {
  // TODO: Refactor to only do this once
  this._setProperty('flatMatrices', this.flatMatrices);
  this._setProperty('radii', this.radii);
  this._setProperty('hands', this.hands);
  this._setProperty('fingerLeft', this.fingerLeft);
  this._setProperty('fingerRight', this.fingerRight);
  this._setProperty('finger', this.finger);
  this._setProperty('fingerMain', this.fingerMain);
  this._setProperty('fingerAlt', this.fingerAlt);

  this._setProperty('fingers', this.fingers);
  this._setProperty('fingersLeft', this.fingersLeft);
  this._setProperty('fingersRight', this.fingersRight);
  this._setProperty('fingersMain', this.fingersMain);
  this._setProperty('fingersAlt', this.fingersAlt);

  this._setProperty('handLeft', this.handLeft);
  this._setProperty('handRight', this.handRight);
  this._setProperty('hand', this.hand);
  this._setProperty('handMain', this.handMain);
  this._setProperty('handAlt', this.handAlt);

  if (!inputSource.hand) {
    return;
  }

  if (
    !frame.fillPoses(inputSource.hand.values(), refSpace, this.flatMatrices)
  ) {
    return;
  }

  // eslint-disable-next-line no-unused-vars
  const areRadiiFilled = frame.fillJointRadii(
    inputSource.hand.values(),
    this.radii,
  ); // todo - handle when we don't get them
  if (!areRadiiFilled) {
    console.log('radii not filled');
  }

  const off = inputSource.handedness === 'left' ? 0 : 25;
  this.flatMatricesFull.set(this.flatMatrices, off * 16);
  this.radiiFull.set(this.radii, off);

  for (let i = 0; i < 25; i++) {
    const mat = this.flatMatrices.slice(i * 16, (i + 1) * 16);
    this.hands[i + off].x = mat[12];
    this.hands[i + off].y = mat[13];
    this.hands[i + off].z = mat[14];
    this.hands[i + off].mat4 = mat;
    this.hands[i + off].rad = radii[i];
  }

  this._handleOnPinch();
  this._setProperty('pFingersArePinched', this.fingersArePinched);
};

/**
 * Changes default handedness
 *
 * Adjusts variables for `finger`, `fingerMain`, `fingerAlt`, `hand`, `handMain`, `handAlt`
 * @param  {Constant} mode either RIGHT, LEFT
 */
p5.prototype.mainHandMode = function (mode) {
  if (mode === this.LEFT) {
    this.finger = this.fingerLeft;
    this.fingerMain = this.fingerLeft;
    this.fingerAlt = this.fingerRight;
    this.hand = this.handLeft;
    this.handMain = this.handLeft;
    this.handAlt = this.handRight;
  } else if (mode === this.RIGHT) {
    this.finger = this.fingerRight;
    this.fingerMain = this.fingerRight;
    this.fingerAlt = this.fingerLeft;
    this.hand = this.handRight;
    this.handMain = this.handRight;
    this.handAlt = this.handLeft;
  }
};
