function getRayFromScreen(screenX, screenY) {
  // ray origin in View space is (0, 0, 0)
  let ray = {
    origin: new p5.Vector(0, 0, 0),
    direction: new p5.Vector()
  };
    // Normalised Device Coordinates
  ray.direction.x = screenX;
  ray.direction.y = screenY;
  ray.direction.z = 1;
  // homogeneous clip coordinates
  ray.direction.z = -1;

  // Eye (camera) coordinates
  let uPMatrixInverse = new p5.Matrix();
  uPMatrixInverse.invert(p5.instance._renderer.uPMatrix);
  uPMatrixInverse.transpose(uPMatrixInverse);
  uPMatrixInverse = uPMatrixInverse.mat4;

  let rayDirectionCopy = ray.direction.copy();
  ray.direction.x = uPMatrixInverse[0] * rayDirectionCopy.x + uPMatrixInverse[1] * rayDirectionCopy.y + uPMatrixInverse[2] * rayDirectionCopy.z + uPMatrixInverse[3];
  ray.direction.y = uPMatrixInverse[4] * rayDirectionCopy.x + uPMatrixInverse[5] * rayDirectionCopy.y + uPMatrixInverse[6] * rayDirectionCopy.z + uPMatrixInverse[7];
  ray.direction.normalize();

  return ray;
}

// TODO: check what happens when called twice (one for each eye) and screenX and screenY are offset

p5.prototype.intersectsSphere = function(radius, screenX, screenY) {
  let ray = getRayFromScreen(screenX, screenY);
    
  // sphere in View space
  let uMVMatrix = p5.instance._renderer.uMVMatrix.copy();
  uMVMatrix.transpose(uMVMatrix);
  uMVMatrix = uMVMatrix.mat4;
    
  let sphereCenter = new p5.Vector(0, 0, 0);
  sphereCenter.x = uMVMatrix[3];
  sphereCenter.y = uMVMatrix[7];
  sphereCenter.z = uMVMatrix[11];
  // TODO: scaling sphere radius

  // ray sphere intersection algorithm
  // let t = p5.Vector.dot(p5.Vector.sub(sphereCenter, ray.origin), ray.direction);
  // let p = p5.Vector.add(ray.origin, );

  let sphereToRayOrigin = p5.Vector.sub(ray.origin, sphereCenter);
  let b = 2 * p5.Vector.dot(ray.direction, sphereToRayOrigin);
  let c = p5.Vector.mag(sphereToRayOrigin) * p5.Vector.mag(sphereToRayOrigin) - radius * radius;

  let det = b * b - 4 * c;

  return det >= 0;
};
