/**
 * Helper to compare p5 versions of form x.x.x (ex 1.10.0)
 * Used to conditionally monkey patch p5.js features when it breaks p5.xr
 * Result is negative if a < b, positive if a > b and 0 if a === b
 * @private
 * @ignore
 */
export default function compareVersions(a, b) {
  const an = a
    .split('.')
    .reverse()
    .reduce((acc, current, index) => acc + current * 1000 ** index, 0);
  const bn = b
    .split('.')
    .reverse()
    .reduce((acc, current, index) => acc + current * 1000 ** index, 0);
  if (an === bn) return 0;
  return (an - bn) / Math.abs(an - bn);
}
