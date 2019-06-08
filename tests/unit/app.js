import p5vr from "../../src/p5xr/p5vr/p5vr";

suite('app', function() {
    suite('createVRCanvas()', function() {
        let myp5;
        test('p5vr is initialised', function() {
            return new Promise(function(resolve, reject) {
                window.setup = function() {
                    console.log()
                    createVRCanvas();
                    resolve();
                };
                window.vrGlobals = {};
                myp5 = new p5();
            }).then(function() {
                assert.instanceOf(p5xr.instance, p5vr);
            });
        });
    });
});
