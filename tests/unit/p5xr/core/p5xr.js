import p5vr from '../../../../src/p5xr/p5vr/p5vr';
import p5xrButton from '../../../../src/p5xr/core/p5xrButton';

suite('p5xr', function() {
  let myp5;

  setup(function() {
    window.preload = function() {};
    window.setup = function() {};
    window.draw = function() {};
    myp5 = new p5();
  });
  
  teardown(function() {
    myp5.remove();
    window.preload = undefined;
    window.setup = undefined;
    window.draw = undefined;
  });
  
  suite('init()', function() {
    test('p5xr.isVR is true for VR sketch', function() {
      p5xr.instance = new p5vr();
      p5xr.instance.initVR();
      assert.isTrue(p5xr.instance.isVR);
      p5xr.instance.remove();
    });
    
    test('setup() is not called unless vr button clicked', function() {
      sinon.spy(window, 'setup');
      window.preload = function() {
        p5xr.instance = new p5vr();
        p5xr.instance.initVR();
      };
      myp5.remove();
      myp5 = new p5();
      sinon.assert.notCalled(window.setup);
      window.setup.restore();
      p5xr.instance.remove();
    });

    test('p5xr.removeLoadingElement() is called', function() {
      p5xr.instance = new p5vr();
      sinon.spy(p5xr.instance, 'removeLoadingElement');
      p5xr.instance.initVR();
      sinon.assert.called(p5xr.instance.removeLoadingElement);
      p5xr.instance.removeLoadingElement.restore();
      p5xr.instance.remove();
    });

    test('xrButton is set and added in DOM', function() {
      p5xr.instance = new p5vr();
      p5xr.instance.initVR();
      assert.instanceOf(p5xr.instance.xrButton, p5xrButton);
      let button = document.querySelector('header button');
      assert.equal(button.tagName, 'BUTTON');
      p5xr.instance.remove();
    });

    test('p5xr.sessionCheck() is called', function() {
      p5xr.instance = new p5vr();
      sinon.spy(p5xr.instance, 'sessionCheck');
      p5xr.instance.initVR();
      sinon.assert.called(p5xr.instance.sessionCheck);
      p5xr.instance.sessionCheck.restore();
      p5xr.instance.remove();
    });
  });

  suite('removeLoadingElement()', function() {
    test('removes p5 loading element from DOM', function() {
      window.preload = function() {
        p5xr.instance = new p5vr();
        p5xr.instance.initVR();
        let loading = document.getElementById(window._loadingScreenId);
        assert.isNull(loading);
      };
      myp5.remove();
      myp5 = new p5();
      p5xr.instance.remove();
    });
  });
});
