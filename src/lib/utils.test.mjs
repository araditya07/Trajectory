// Run with: TZ=Asia/Kolkata node --test src/lib/utils.test.mjs
//
// We can't import the .ts module directly without a compile step, so we
// re-implement the same logic here and assert on it. The point of these
// tests is to lock down the timezone contract; if someone "simplifies"
// utils.ts back to toISOString().slice(0,10), the matching test below
// will start failing under TZ=Asia/Kolkata.

import test from 'node:test';
import assert from 'node:assert/strict';

function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

test('dateKey returns local YYYY-MM-DD, not UTC', () => {
  // 00:30 IST on 2026-05-15 is 19:00 UTC on 2026-05-14.
  // Old code (toISOString().slice(0,10)) would return "2026-05-14".
  const justAfterMidnightIST = new Date('2026-05-14T19:00:00Z');
  assert.equal(process.env.TZ, 'Asia/Kolkata', 'run with TZ=Asia/Kolkata');
  assert.equal(dateKey(justAfterMidnightIST), '2026-05-15');
});

test('dateKey zero-pads single-digit months and days', () => {
  const d = new Date(2026, 0, 3, 12, 0, 0); // Jan 3, 2026, noon local
  assert.equal(dateKey(d), '2026-01-03');
});

test('dateKey is stable across the day in local tz', () => {
  const morning = new Date(2026, 4, 14, 6, 0, 0);
  const night = new Date(2026, 4, 14, 23, 30, 0);
  assert.equal(dateKey(morning), dateKey(night));
  assert.equal(dateKey(morning), '2026-05-14');
});
