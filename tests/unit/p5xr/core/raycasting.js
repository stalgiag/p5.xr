function approxEqual(arr1, arr2, epsilon = 0.0001) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (Math.abs(arr1[i] - arr2[i]) > epsilon) return false;
  }
  return true;
}

suite('raycasting', function() {
  let myp5;

  setup(function() {
    window.preload = function() {};
    window.setup = function() {};
    window.draw = function() {};
    myp5 = new p5();
    createVRCanvas();
    createCanvas(windowWidth, windowHeight, WEBGL);
  });

  teardown(function() {
    p5xr.instance.remove();
    myp5.remove();
    window.preload = undefined;
    window.setup = undefined;
    window.draw = undefined;
  });

  suite('intersectsSphere()', function() {
    test('parameters : radius, screenX, screenY', function() {
      let intersects = intersectsSphere(10, 0, 0);
      assert.isTrue(intersects);
    });

    test('parameters: radius', function() {
      let intersects = intersectsSphere(10, 0, 0);
      assert.isTrue(intersects);
    });

    test('parameters: radius, rayObject and detects true intersection', function() {
      let ray = {
        origin: new p5.Vector(-62.90438461303711, -46.86130905151367, -612.3146362304688),
        direction: new p5.Vector(-0.5999958517093528, 0.5874828640487207, 0.5430182891769677)
      };
      myp5._renderer.uMVMatrix.set([0.9989621639251709, -0.04046989604830742, 0.02090311609208584, 0, 0.014117139391601086, 0.7113948464393616, 0.702650785446167, 0, -0.04330657050013542, -0.7016263604164124, 0.7112278342247009, 0, -354.6215515136719, 320.1660461425781, -268.0046691894531, 1]);
      let intersects = intersectsSphere(70, ray);
      assert.isTrue(intersects);
    });

    test('detection of ray, sphere not intersecting', function() {
      let ray = {
        origin: new p5.Vector(-211.18516540527344, 197.80178833007812, -358.620361328125),
        direction: new p5.Vector(0.8334509850637538, 0.4288079136162737, 0.3485444429571597)
      };
      myp5._renderer.uMVMatrix.set([0.9991118311882019, 0.010332025587558746, 0.04085145890712738, -0, -0.032737694680690765, 0.8007082939147949, 0.5981592535972595, 0, -0.026529904454946518, -0.5989654064178467, 0.8003354072570801, 0, -43.66838073730469, 568.6730346679688, -75.510009765625, 1]);
      let intersects = intersectsSphere(70, ray);
      assert.isFalse(intersects);
    });

    test('uMVMatrix is preserved', function() {
      let uMVMatrix = [0.9991118311882019, 0.010332025587558746, 0.04085145890712738, -0, -0.032737694680690765, 0.8007082939147949, 0.5981592535972595, 0, -0.026529904454946518, -0.5989654064178467, 0.8003354072570801, 0, -43.66838073730469, 568.6730346679688, -75.510009765625, 1];
      myp5._renderer.uMVMatrix.set([...uMVMatrix]);
      let intersects = intersectsSphere(70);

      assert.isTrue(approxEqual(myp5._renderer.uMVMatrix.mat4, uMVMatrix), 'uMVMatrix is approximately equal');
    });
  });

  suite('intersectsBox()', function() {
    test('parameters : width, [height], [depth]', function() {
      let intersects = intersectsBox(50);
      assert.isTrue(intersects);
      intersects = intersectsBox(50, 50);
      assert.isTrue(intersects);
      intersects = intersectsBox(50, 50, 50);
      assert.isTrue(intersects);
    });

    test('parameters : width, height, depth, screenX, screenY', function() {
      let intersects = intersectsBox(50, 50, 50, 0, 0);
      assert.isTrue(intersects);
    });

    test('parameters : width, [height], [depth], rayObject and detects true intersection', function() {
      let ray = {
        origin: new p5.Vector(-379.7965087890625, 356.3955993652344, -370.9411315917969),
        direction: new p5.Vector(0.9012790193414948, -0.4332300690047571, 0.002799393678459774)
      };
      myp5._renderer.uMVMatrix.set([0.9810172915458679, 0.09549812227487564, 0.1687755137681961, -0, -0.13770757615566254, 0.9558517932891846, 0.2595842778682709, 0, -0.13653458654880524, -0.27789831161499023, 0.950857937335968, 0, -39.58851623535156, 146.8292694091797, -383.3383483886719, 1]);
      let intersects = intersectsBox(70, ray);
      assert.isTrue(intersects);
      intersects = intersectsBox(70, 70, ray);
      assert.isTrue(intersects);
      intersects = intersectsBox(70, 70, 70, ray);
      assert.isTrue(intersects);
    });

    test('detection of ray, box not intersecting', function() {
      let ray = {
        origin: new p5.Vector(-246.22828674316406, 90.79129028320312, -547.61376953125),
        direction: new p5.Vector(-0.9928132290940235, 0.0643936832001089, 0.10087291856500656)
      };
      myp5._renderer.uMVMatrix.set([0.9990965127944946, -0.018277179449796677, -0.03836707025766373, 0, 0.04172855615615845, 0.5929256677627563, 0.8041753172874451, -0, 0.008050763048231602, -0.8050497174263, 0.593152642250061, 0, -338.5563049316406, 150.32810974121094, -465.5549621582031, 1]);
      let intersects = intersectsBox(70, ray);
      assert.isFalse(intersects);
    });

    test('uMVMatrix is preserved', function() {
      let uMVMatrix = [0.9991118311882019, 0.010332025587558746, 0.04085145890712738, -0, -0.032737694680690765, 0.8007082939147949, 0.5981592535972595, 0, -0.026529904454946518, -0.5989654064178467, 0.8003354072570801, 0, -43.66838073730469, 568.6730346679688, -75.510009765625, 1];
      myp5._renderer.uMVMatrix.set([...uMVMatrix]);
      let intersects = intersectsBox(70);
      assert.isTrue(approxEqual(myp5._renderer.uMVMatrix.mat4, uMVMatrix), 'uMVMatrix is approximately equal');
    });
  });
});
