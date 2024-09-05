import compareVersions from "../../../../src/p5xr/utilities/versionComparator"

suite('utilities', function() {
  test('version smaller than ', function() {
    const res = compareVersions('1.9.2', '1.10.0');
    assert.isBelow(res, 0);
  });
  
  test('version larger than ', function() {
    const res = compareVersions('1.10.0', '1.9.0');
    assert.isAbove(res, 0);
  });

  test('versions equal ', function() {
    const res = compareVersions('1.10.0', '1.10.0');
    assert.equal(res, 0);
  });
  
  test('invalid version NaN', function() {
    const res = compareVersions('v1.10.0', '1.10.0');
    assert.isNaN(res);
  });
});
