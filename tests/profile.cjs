const assert=require('node:assert/strict'),{ageAt}=require('../dist/profile-core.js');
assert.equal(ageAt('2007-11-01','2026-10-31'),18);assert.equal(ageAt('2007-11-01','2026-11-01'),19);assert.equal(ageAt('2007-11-01','2026-11-02'),19);
assert.equal(ageAt('2004-02-29','2025-02-28'),20);assert.equal(ageAt('2004-02-29','2025-03-01'),21);assert.equal(ageAt('2007-02-29','2026-10-31'),null);assert.equal(ageAt('2027-01-01','2026-10-31'),null);assert.equal(ageAt('','2026-10-31'),null);
console.log('Profile age checks passed: birthday boundary, leap day, invalid and future birth dates.');
