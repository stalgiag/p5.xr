function getRayFromScreen(screenX, screenY) {
  let ray = {
    origin: new p5.Vector(0, 0, 0),
    direction: new p5.Vector()
  };

  let poseMatrix = p5xr.instance.viewer.poseMatrix.copy();
  poseMatrix.transpose(poseMatrix);
  poseMatrix = poseMatrix.mat4;

  // set origin of ray to pose position
  ray.origin.x = poseMatrix[3];
  ray.origin.y = poseMatrix[7];
  ray.origin.z = poseMatrix[11];
  
  let initialMVMatrix = p5xr.instance.viewer.initialMVMatrix.copy();
  initialMVMatrix.transpose(initialMVMatrix);
  initialMVMatrix = initialMVMatrix.mat4;

  
  // transform ray origin to view space
  let rayOriginCopy = ray.origin.copy();
  ray.origin.x = initialMVMatrix[0] * rayOriginCopy.x + initialMVMatrix[1] * rayOriginCopy.y + initialMVMatrix[2] * rayOriginCopy.z + initialMVMatrix[3];
  ray.origin.y = initialMVMatrix[4] * rayOriginCopy.x + initialMVMatrix[5] * rayOriginCopy.y + initialMVMatrix[6] * rayOriginCopy.z + initialMVMatrix[7];
  ray.origin.z = initialMVMatrix[8] * rayOriginCopy.x + initialMVMatrix[9] * rayOriginCopy.y + initialMVMatrix[10] * rayOriginCopy.z + initialMVMatrix[11];

  // get ray direction from left eye
  let leftDirection = new p5.Vector(screenX, screenY, -1);

  let leftPMatrixInverse = new p5.Matrix();
  leftPMatrixInverse.invert(p5xr.instance.viewer.leftPMatrix.copy());
  leftPMatrixInverse.transpose(leftPMatrixInverse);
  leftPMatrixInverse = leftPMatrixInverse.mat4;

  let leftDirectionCopy = leftDirection.copy();
  leftDirection.x = leftPMatrixInverse[0] * leftDirectionCopy.x + leftPMatrixInverse[1] * leftDirectionCopy.y + leftPMatrixInverse[2] * leftDirectionCopy.z + leftPMatrixInverse[3];
  leftDirection.y = leftPMatrixInverse[4] * leftDirectionCopy.x + leftPMatrixInverse[5] * leftDirectionCopy.y + leftPMatrixInverse[6] * leftDirectionCopy.z + leftPMatrixInverse[7];
  leftDirection.normalize();

  // get ray direction from right eye
  let rightDirection = new p5.Vector(screenX, screenY, -1);
  
  let rightPMatrixInverse = new p5.Matrix();
  rightPMatrixInverse.invert(p5xr.instance.viewer.rightPMatrix.copy());
  rightPMatrixInverse.transpose(rightPMatrixInverse);
  rightPMatrixInverse = rightPMatrixInverse.mat4;

  let rightDirectionCopy = rightDirection.copy();
  rightDirection.x = rightPMatrixInverse[0] * rightDirectionCopy.x + rightPMatrixInverse[1] * rightDirectionCopy.y + rightPMatrixInverse[2] * rightDirectionCopy.z + rightPMatrixInverse[3];
  rightDirection.y = rightPMatrixInverse[4] * rightDirectionCopy.x + rightPMatrixInverse[5] * rightDirectionCopy.y + rightPMatrixInverse[6] * rightDirectionCopy.z + rightPMatrixInverse[7];
  rightDirection.normalize();

  // combine both ray directions
  ray.direction = p5.Vector.add(leftDirection, rightDirection).normalize();

  return ray;
}

p5.prototype.intersectsSphere = function(radius, arg2, arg3) {
  let ray;
  if(arg3 !== undefined) {
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
