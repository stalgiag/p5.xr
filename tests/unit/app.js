import p5vr from "../../src/p5xr/p5vr/p5vr";

suite('app', function() {
    suite('createVRCanvas()', function() {
        let myp5;
        test('p5vr is initialised', async () => {
            await new Promise((resolve, reject) => {
                window.vrGlobals = {};
                window.preload = () => {
                    createVRCanvas();
                    resolve();
                };
                myp5 = new p5();
            });
            assert.instanceOf(p5xr.instance, p5vr);
            myp5.remove();
        });
    });
});
