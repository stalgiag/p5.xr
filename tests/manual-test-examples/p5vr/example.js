let init = 0;


function preload() {
    console.log('here');
}

function setup() {
    createVRCanvas();
}

  
  function draw() {
      if(init > 4) {

      }
  }

  function mousePressed() {
      init++;
      console.log(init);
  }

