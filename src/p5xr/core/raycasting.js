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

p5.prototype.intersectsSphere = function(radius, arg2, arg3) {
  let ray;
  if(arg3) {
    ray = getRayFromScreen(arg2, arg3);
  }
  else {
    ray = arg2;
  }

  if(ray === null)
    return false;
    
  // sphere in View space
  let uMVMatrix = p5.instance._renderer.uMVMatrix.copy();
  uMVMatrix.transpose(uMVMatrix);
  uMVMatrix = uMVMatrix.mat4;
    
  let sphereCenter = new p5.Vector(0, 0, 0);
  sphereCenter.x = uMVMatrix[3];
  sphereCenter.y = uMVMatrix[7];
  sphereCenter.z = uMVMatrix[11];
  // TODO: scaling sphere radius

  let sphereToRayOrigin = p5.Vector.sub(ray.origin, sphereCenter);
  let b = 2 * p5.Vector.dot(ray.direction, sphereToRayOrigin);
  let c = p5.Vector.mag(sphereToRayOrigin) * p5.Vector.mag(sphereToRayOrigin) - radius * radius;

  let det = b * b - 4 * c;

  return det >= 0;
};

p5.prototype.generateRay = function(x1, y1, z1, x2, y2, z2) {
  let origin = new p5.Vector(x1, y1, z1);
  let direction = new p5.Vector(x2, y2, z2);
  direction = p5.Vector.sub(direction, origin);
  direction.normalize();
    
  let uMVMatrix = p5.instance._renderer.uMVMatrix.copy();
  uMVMatrix.transpose(uMVMatrix);
  uMVMatrix = uMVMatrix.mat4;

  let originCopy = origin.copy();
  origin.x = uMVMatrix[0] * originCopy.x + uMVMatrix[1] * originCopy.y + uMVMatrix[2] * originCopy.z + uMVMatrix[3];
  origin.y = uMVMatrix[4] * originCopy.x + uMVMatrix[5] * originCopy.y + uMVMatrix[6] * originCopy.z + uMVMatrix[7];
  origin.z = uMVMatrix[8] * originCopy.x + uMVMatrix[9] * originCopy.y + uMVMatrix[10] * originCopy.z + uMVMatrix[11];
    
  let uNMatrix = p5.instance._renderer.uMVMatrix.copy();
  uNMatrix.transpose(uNMatrix);
  uNMatrix.invert(uNMatrix);
  uNMatrix.transpose(uNMatrix);
  uNMatrix = uNMatrix.mat4;

  let directionCopy = direction.copy();
  direction.x = uNMatrix[0] * directionCopy.x + uNMatrix[1] * directionCopy.y + uNMatrix[2] * directionCopy.z + uNMatrix[3];
  direction.y = uNMatrix[4] * directionCopy.x + uNMatrix[5] * directionCopy.y + uNMatrix[6] * directionCopy.z + uNMatrix[7];
  direction.z = uNMatrix[8] * directionCopy.x + uNMatrix[9] * directionCopy.y + uNMatrix[10] * directionCopy.z + uNMatrix[11];

  direction.normalize();

  return {
    origin: origin,
    direction: direction
  };
};
