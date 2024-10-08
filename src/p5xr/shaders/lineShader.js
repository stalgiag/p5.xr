export const lineFrag = `
#ifdef WEBGL2

#define IN in
#define OUT out

#ifdef FRAGMENT_SHADER
out vec4 outColor;
#define OUT_COLOR outColor
#endif
#define TEXTURE texture

#else

#ifdef FRAGMENT_SHADER
#define IN varying
#else
#define IN attribute
#endif
#define OUT varying
#define TEXTURE texture2D

#ifdef FRAGMENT_SHADER
#define OUT_COLOR gl_FragColor
#endif

#endif
#define STROKE_CAP_ROUND 0
#define STROKE_CAP_PROJECT 1
#define STROKE_CAP_SQUARE 2
#define STROKE_JOIN_ROUND 0
#define STROKE_JOIN_MITER 1
#define STROKE_JOIN_BEVEL 2
precision mediump int;

uniform vec4 uMaterialColor;
uniform int uStrokeCap;
uniform int uStrokeJoin;
uniform float uStrokeWeight;

IN vec4 vColor;
IN vec2 vTangent;
IN vec2 vCenter;
IN vec2 vPosition;
IN float vMaxDist;
IN float vCap;
IN float vJoin;

float distSquared(vec2 a, vec2 b) {
  vec2 aToB = b - a;
  return dot(aToB, aToB);
}

void main() {
  if (vCap > 0.) {
    if (
      uStrokeCap == STROKE_CAP_ROUND &&
      distSquared(vPosition, vCenter) > uStrokeWeight * uStrokeWeight * 0.25
    ) {
      discard;
    } else if (
      uStrokeCap == STROKE_CAP_SQUARE &&
      dot(vPosition - vCenter, vTangent) > 0.
    ) {
      discard;
    }
    // Use full area for PROJECT
  } else if (vJoin > 0.) {
    if (
      uStrokeJoin == STROKE_JOIN_ROUND &&
      distSquared(vPosition, vCenter) > uStrokeWeight * uStrokeWeight * 0.25
    ) {
      discard;
    } else if (uStrokeJoin == STROKE_JOIN_BEVEL) {
      vec2 normal = vec2(-vTangent.y, vTangent.x);
      if (abs(dot(vPosition - vCenter, normal)) > vMaxDist) {
        discard;
      }
    }
    // Use full area for MITER
  }
  OUT_COLOR = vec4(vColor.rgb, 1.) * vColor.a;
}
`;

/*
 * Line vert shader from p5 v1.9.4
 */
export const lineVert = `
#ifdef WEBGL2

#define IN in
#define OUT out

#ifdef FRAGMENT_SHADER
out vec4 outColor;
#define OUT_COLOR outColor
#endif
#define TEXTURE texture

#else

#ifdef FRAGMENT_SHADER
#define IN varying
#else
#define IN attribute
#endif
#define OUT varying
#define TEXTURE texture2D

#ifdef FRAGMENT_SHADER
#define OUT_COLOR gl_FragColor
#endif

#endif
#define STROKE_CAP_ROUND 0
#define STROKE_CAP_PROJECT 1
#define STROKE_CAP_SQUARE 2
#define STROKE_JOIN_ROUND 0
#define STROKE_JOIN_MITER 1
#define STROKE_JOIN_BEVEL 2
/*
  Part of the Processing project - http://processing.org
  Copyright (c) 2012-15 The Processing Foundation
  Copyright (c) 2004-12 Ben Fry and Casey Reas
  Copyright (c) 2001-04 Massachusetts Institute of Technology
  This library is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation, version 2.1.
  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Lesser General Public License for more details.
  You should have received a copy of the GNU Lesser General
  Public License along with this library; if not, write to the
  Free Software Foundation, Inc., 59 Temple Place, Suite 330,
  Boston, MA  02111-1307  USA
*/

#define PROCESSING_LINE_SHADER

precision mediump int;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uStrokeWeight;

uniform bool uUseLineColor;
uniform vec4 uMaterialColor;

uniform vec4 uViewport;
uniform int uPerspective;
uniform int uStrokeJoin;

IN vec4 aPosition;
IN vec3 aTangentIn;
IN vec3 aTangentOut;
IN float aSide;
IN vec4 aVertexColor;

OUT vec4 vColor;
OUT vec2 vTangent;
OUT vec2 vCenter;
OUT vec2 vPosition;
OUT float vMaxDist;
OUT float vCap;
OUT float vJoin;

vec2 lineIntersection(vec2 aPoint, vec2 aDir, vec2 bPoint, vec2 bDir) {
  // Rotate and translate so a starts at the origin and goes out to the right
  bPoint -= aPoint;
  vec2 rotatedBFrom = vec2(
    bPoint.x*aDir.x + bPoint.y*aDir.y,
    bPoint.y*aDir.x - bPoint.x*aDir.y
  );
  vec2 bTo = bPoint + bDir;
  vec2 rotatedBTo = vec2(
    bTo.x*aDir.x + bTo.y*aDir.y,
    bTo.y*aDir.x - bTo.x*aDir.y
  );
  float intersectionDistance =
    rotatedBTo.x + (rotatedBFrom.x - rotatedBTo.x) * rotatedBTo.y /
    (rotatedBTo.y - rotatedBFrom.y);
  return aPoint + aDir * intersectionDistance;
}

void main() {
  // Caps have one of either the in or out tangent set to 0
  vCap = (aTangentIn == vec3(0.)) != (aTangentOut == (vec3(0.)))
    ? 1. : 0.;

  // Joins have two unique, defined tangents
  vJoin = (
    aTangentIn != vec3(0.) &&
    aTangentOut != vec3(0.) &&
    aTangentIn != aTangentOut
  ) ? 1. : 0.;

  vec4 posp = uModelViewMatrix * aPosition;
  vec4 posqIn = uModelViewMatrix * (aPosition + vec4(aTangentIn, 0));
  vec4 posqOut = uModelViewMatrix * (aPosition + vec4(aTangentOut, 0));

  float facingCamera = pow(
    // The word space tangent's z value is 0 if it's facing the camera
    abs(normalize(posqIn-posp).z),

    // Using pow() here to ramp facingCamera up from 0 to 1 really quickly
    // so most lines get scaled and don't get clipped
    0.25
  );

  // using a scale <1 moves the lines towards the camera
  // in order to prevent popping effects due to half of
  // the line disappearing behind the geometry faces.
  float scale = mix(1.0, 0.995, facingCamera);
  // Moving vertices slightly toward the camera
  // to avoid depth-fighting with the fill triangles.
  // Discussed here:
  // http://www.opengl.org/discussion_boards/ubbthreads.php?ubb=showflat&Number=252848  
  posp.xyz = posp.xyz * scale;
  posqIn.xyz = posqIn.xyz * scale;
  posqOut.xyz = posqOut.xyz * scale;

  vec4 p = uProjectionMatrix * posp;
  vec4 qIn = uProjectionMatrix * posqIn;
  vec4 qOut = uProjectionMatrix * posqOut;
  vCenter = p.xy;

  // formula to convert from clip space (range -1..1) to screen space (range 0..[width or height])
  // screen_p = (p.xy/p.w + <1,1>) * 0.5 * uViewport.zw

  // prevent division by W by transforming the tangent formula (div by 0 causes
  // the line to disappear, see https://github.com/processing/processing/issues/5183)
  // t = screen_q - screen_p
  //
  // tangent is normalized and we don't care which aDirection it points to (+-)
  // t = +- normalize( screen_q - screen_p )
  // t = +- normalize( (q.xy/q.w+<1,1>)*0.5*uViewport.zw - (p.xy/p.w+<1,1>)*0.5*uViewport.zw )
  //
  // extract common factor, <1,1> - <1,1> cancels out
  // t = +- normalize( (q.xy/q.w - p.xy/p.w) * 0.5 * uViewport.zw )
  //
  // convert to common divisor
  // t = +- normalize( ((q.xy*p.w - p.xy*q.w) / (p.w*q.w)) * 0.5 * uViewport.zw )
  //
  // remove the common scalar divisor/factor, not needed due to normalize and +-
  // (keep uViewport - can't remove because it has different components for x and y
  //  and corrects for aspect ratio, see https://github.com/processing/processing/issues/5181)
  // t = +- normalize( (q.xy*p.w - p.xy*q.w) * uViewport.zw )

  vec2 tangentIn = normalize((qIn.xy*p.w - p.xy*qIn.w) * uViewport.zw);
  vec2 tangentOut = normalize((qOut.xy*p.w - p.xy*qOut.w) * uViewport.zw);

  vec2 curPerspScale;
  if(uPerspective == 1) {
    // Perspective ---
    // convert from world to clip by multiplying with projection scaling factor
    // to get the right thickness (see https://github.com/processing/processing/issues/5182)

    // The y value of the projection matrix may be flipped if rendering to a Framebuffer.
    // Multiplying again by its sign here negates the flip to get just the scale.
    curPerspScale = (uProjectionMatrix * vec4(1, sign(uProjectionMatrix[1][1]), 0, 0)).xy;
  } else {
    // No Perspective ---
    // multiply by W (to cancel out division by W later in the pipeline) and
    // convert from screen to clip (derived from clip to screen above)
    curPerspScale = p.w / (0.5 * uViewport.zw);
  }

  vec2 offset;
  if (vJoin == 1.) {
    vTangent = normalize(tangentIn + tangentOut);
    vec2 normalIn = vec2(-tangentIn.y, tangentIn.x);
    vec2 normalOut = vec2(-tangentOut.y, tangentOut.x);
    float side = sign(aSide);
    float sideEnum = abs(aSide);

    // We generate vertices for joins on either side of the centerline, but
    // the "elbow" side is the only one needing a join. By not setting the
    // offset for the other side, all its vertices will end up in the same
    // spot and not render, effectively discarding it.
    if (sign(dot(tangentOut, vec2(-tangentIn.y, tangentIn.x))) != side) {
      // Side enums:
      //   1: the side going into the join
      //   2: the middle of the join
      //   3: the side going out of the join
      if (sideEnum == 2.) {
        // Calculate the position + tangent on either side of the join, and
        // find where the lines intersect to find the elbow of the join
        vec2 c = (posp.xy/posp.w + vec2(1.,1.)) * 0.5 * uViewport.zw;
        vec2 intersection = lineIntersection(
          c + (side * normalIn * uStrokeWeight / 2.),
          tangentIn,
          c + (side * normalOut * uStrokeWeight / 2.),
          tangentOut
        );
        offset = (intersection - c);

        // When lines are thick and the angle of the join approaches 180, the
        // elbow might be really far from the center. We'll apply a limit to
        // the magnitude to avoid lines going across the whole screen when this
        // happens.
        float mag = length(offset);
        float maxMag = 3. * uStrokeWeight;
        if (mag > maxMag) {
          offset *= maxMag / mag;
        }
      } else if (sideEnum == 1.) {
        offset = side * normalIn * uStrokeWeight / 2.;
      } else if (sideEnum == 3.) {
        offset = side * normalOut * uStrokeWeight / 2.;
      }
    }
    if (uStrokeJoin == STROKE_JOIN_BEVEL) {
      vec2 avgNormal = vec2(-vTangent.y, vTangent.x);
      vMaxDist = abs(dot(avgNormal, normalIn * uStrokeWeight / 2.));
    } else {
      vMaxDist = uStrokeWeight / 2.;
    }
  } else {
    vec2 tangent = aTangentIn == vec3(0.) ? tangentOut : tangentIn;
    vTangent = tangent;
    vec2 normal = vec2(-tangent.y, tangent.x);

    float normalOffset = sign(aSide);
    // Caps will have side values of -2 or 2 on the edge of the cap that
    // extends out from the line
    float tangentOffset = abs(aSide) - 1.;
    offset = (normal * normalOffset + tangent * tangentOffset) *
      uStrokeWeight * 0.5;
    vMaxDist = uStrokeWeight / 2.;
  }
  vPosition = vCenter + offset;

  gl_Position.xy = p.xy + offset.xy * curPerspScale;
  gl_Position.zw = p.zw;
  
  vColor = (uUseLineColor ? aVertexColor : uMaterialColor);
}
`;
