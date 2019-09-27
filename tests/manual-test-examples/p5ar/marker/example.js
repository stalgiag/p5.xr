
function setup() {
  createARCanvas(MARKER);
}

function draw() {
  background(0);
  processForMarker();

  if(isMarkerVisible(0)) {
    fill(0, 200, 0);
  } else {
    fill(200, 0, 0);
  }
  showVideoFeed();

  // let markerMat = getSmoothTrackerMatrix(0);
  let markerMat = getTrackerMatrix(0);

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
    -markerMat.mat4[14],
    markerMat.mat4[15]
  );

  box(50);
  // console.log(rot);
}