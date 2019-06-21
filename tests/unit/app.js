import p5vr from '../../src/p5xr/p5vr/p5vr';

suite('app', function() {
  let myp5;

  suiteSetup(function() {
    window.vrGlobals = {};
    window.setup = function() {};
    window.draw = function() {};
    myp5 = new p5();
  });

  suiteTeardown(function() {
    myp5.remove();
    window.setup = undefined;
    window.draw = undefined;
    window.vrGlobals = undefined;
  });

  suite('createVRCanvas()', function() {
    test('should initialise p5vr', function() {
      createVRCanvas();
      assert.instanceOf(p5xr.instance, p5vr);
      p5xr.instance.remove();
    });
  });
    
  suite('setVRBackgroundColor()', function() {
    test('should set p5xr.curClearColor', function() {
      createVRCanvas();
      setVRBackgroundColor(10, 20, 30);
      assert.deepEqual(p5xr.instance.curClearColor, color(10, 20, 30));
      p5xr.instance.remove();
    });
  });
});
