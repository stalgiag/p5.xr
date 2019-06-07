// Setup chai
var expect = chai.expect;
var assert = chai.assert;


// a custom assertion for validation errors that correctly handles
// minified p5 libraries.
assert.validationError = function(fn) {
  if (p5.ValidationError) {
    assert.throws(fn, p5.ValidationError);
  } else {
    assert.doesNotThrow(fn, Error, 'got unwanted exception');
  }
};
