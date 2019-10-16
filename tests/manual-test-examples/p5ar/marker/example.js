let markerIndex;
let capture;

function setup() {
  createARCanvas(MARKER);
  addMarker('pattern-p5js.patt', (index) => {
    markerIndex = index;
  });
  capture = createCapture({
    audio: false,
    video: {
      facingMode: {
        exact: 'environment'
      }
    }
  });
  capture.hide();
}

function draw() {
  background(0);
  detectMarkers(capture);

  showVideoFeed(capture);

  let markerMat = getSmoothTrackerMatrix(0);
  // let markerMat = getTrackerMatrix(0);

  applyMatrix(
    markerMat.mat4[0],
    markerMat.mat4[1],
    markerMat.mat4[2],
    markerMat.mat4[3],
    markerMat.mat4[4],
    markerMat.mat4[5],
    markerMat.mat4[6],
    markerMat.mat4[7],
    markerMat.mat4[8],
    markerMat.mat4[9],
    markerMat.mat4[10],
    markerMat.mat4[11],
    markerMat.mat4[12],
    markerMat.mat4[13],
    markerMat.mat4[14],
    markerMat.mat4[15]
  );
  rotateX(frameCount * 0.02);

  box(100);
}