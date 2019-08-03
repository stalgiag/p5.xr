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

p5.prototype.intersectsSphere = function() {
  let radius = arguments[0];
  let ray = {
    origin: null,
    direction: null
  };
  if(arguments.length !== 2 || !arguments[1].hasOwnProperty('origin')) {
    let screenX = arguments[1] || 0, screenY = arguments[2] || 0;
    ray = getRayFromScreen(screenX, screenY);
  }
  else {
    ray.origin = arguments[1].origin.copy();
    ray.direction = arguments[1].direction.copy();
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

  if(p5.Vector.sub(ray.origin, sphereCenter).mag() <= radius) {
    return true;
  }

  // check if sphere is in front of ray
  if(p5.Vector.dot(p5.Vector.sub(sphereCenter, ray.origin), ray.direction) < 0) {
    return false;
  }

  let sphereToRayOrigin = p5.Vector.sub(ray.origin, sphereCenter);
  let b = 2 * p5.Vector.dot(ray.direction, sphereToRayOrigin);
  let c = p5.Vector.mag(sphereToRayOrigin) * p5.Vector.mag(sphereToRayOrigin) - radius * radius;

  let det = b * b - 4 * c;

  return det >= 0;
};

p5.prototype.intersectsBox = function() {
  let width = arguments[0], height, depth;
  let ray = {
    origin: null,
    direction: null
  };
  if(arguments[arguments.length - 1].hasOwnProperty('origin')) {
    ray.origin = arguments[arguments.length - 1].origin.copy();
    ray.direction = arguments[arguments.length - 1].direction.copy();
    height = arguments.length > 2 ? arguments[1] : width;
    depth = arguments.length > 3 ? arguments[2] : height;
  }
  else {
    ray = getRayFromScreen(arguments[arguments.length - 2], arguments[arguments.length - 1]);
    height = arguments.length > 3 ? arguments[1] : width;
    depth = arguments.length > 4 ? arguments[2] : height;
  }
  
  // bounding box in view space will not be axis aligned
  // so we will transform ray to box space by applying inverse(uMVMatrix) to origin and direction

  let uMVMatrixInv = p5.instance._renderer.uMVMatrix.copy();
  uMVMatrixInv.transpose(uMVMatrixInv);
  uMVMatrixInv.invert(uMVMatrixInv);
  uMVMatrixInv = uMVMatrixInv.mat4;

  let rayOriginCopy = ray.origin.copy();
  ray.origin.x = uMVMatrixInv[0] * rayOriginCopy.x + uMVMatrixInv[1] * rayOriginCopy.y + uMVMatrixInv[2] * rayOriginCopy.z + uMVMatrixInv[3];
  ray.origin.y = uMVMatrixInv[4] * rayOriginCopy.x + uMVMatrixInv[5] * rayOriginCopy.y + uMVMatrixInv[6] * rayOriginCopy.z + uMVMatrixInv[7];
  ray.origin.z = uMVMatrixInv[8] * rayOriginCopy.x + uMVMatrixInv[9] * rayOriginCopy.y + uMVMatrixInv[10] * rayOriginCopy.z + uMVMatrixInv[11];

  let rayDirectionCopy = ray.direction.copy();
  ray.direction.x = uMVMatrixInv[0] * rayDirectionCopy.x + uMVMatrixInv[1] * rayDirectionCopy.y + uMVMatrixInv[2] * rayDirectionCopy.z;
  ray.direction.y = uMVMatrixInv[4] * rayDirectionCopy.x + uMVMatrixInv[5] * rayDirectionCopy.y + uMVMatrixInv[6] * rayDirectionCopy.z;
  ray.direction.z = uMVMatrixInv[8] * rayDirectionCopy.x + uMVMatrixInv[9] * rayDirectionCopy.y + uMVMatrixInv[10] * rayDirectionCopy.z;
  ray.direction.normalize();

  // representing AABB (Axis aligned bounding box) with 2 extreme points
  let min = new p5.Vector(-0.5 * width, -0.5 * height, -0.5 * depth);
  let max = new p5.Vector(0.5 * width, 0.5 * height, 0.5 * depth);

  // ray-AABB intersection algorithm
  let t1 = (min.x - ray.origin.x) / ray.direction.x;
  let t2 = (max.x - ray.origin.x) / ray.direction.x;
  let t3 = (min.y - ray.origin.y) / ray.direction.y;
  let t4 = (max.y - ray.origin.y) / ray.direction.y;
  let t5 = (min.z - ray.origin.z) / ray.direction.z;
  let t6 = (max.z - ray.origin.z) / ray.direction.z;

  let tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
  let tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));

  if(tmax < 0 || tmin > tmax) {
    return false;
  }
  return true;
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

  let directionCopy = direction.copy();
  direction.x = uMVMatrix[0] * directionCopy.x + uMVMatrix[1] * directionCopy.y + uMVMatrix[2] * directionCopy.z;
  direction.y = uMVMatrix[4] * directionCopy.x + uMVMatrix[5] * directionCopy.y + uMVMatrix[6] * directionCopy.z;
  direction.z = uMVMatrix[8] * directionCopy.x + uMVMatrix[9] * directionCopy.y + uMVMatrix[10] * directionCopy.z;

  direction.normalize();

  return {
    origin: origin,
    direction: direction
  };
};
