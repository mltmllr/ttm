import assert from 'node:assert/strict';
import { test } from 'node:test';
import { assertDateMatchesFilename, isoWeek, parseNewsFilename } from '../src/lib/news-meta.ts';

test('gültiger Dateiname', () => {
  assert.deepEqual(parseNewsFilename('2026-11-27-ga4-neue-funktion.md', 'f'), {
    slug: '2026-11-27-ga4-neue-funktion',
    date: '2026-11-27',
  });
});

test('ungültige Dateinamen', () => {
  for (const name of [
    'ga4-neue-funktion.md',
    '2026-11-27.md',
    '2026-11-27-Gross.md',
    '2026-11-27-ga4_neu.md',
    '2026-1-27-ga4.md',
    '2026-11-27--doppelt.md',
  ]) {
    assert.throws(() => parseNewsFilename(name, 'src/x'), /JJJJ-MM-TT-slug/, name);
  }
  assert.throws(() => parseNewsFilename('2026-02-30-x.md', 'f'), /kein gültiges Kalenderdatum/);
});

test('Datum im Dateinamen muss zu `date` passen', () => {
  assert.doesNotThrow(() => assertDateMatchesFilename('2026-11-27', new Date('2026-11-27'), 'f'));
  assert.throws(
    () => assertDateMatchesFilename('2026-11-27', new Date('2026-11-28'), 'a.md'),
    /a\.md.*2026-11-27.*2026-11-28/,
  );
});

test('ISO-Kalenderwoche', () => {
  const kw = (d: string) => isoWeek(new Date(`${d}T00:00:00Z`));
  assert.equal(kw('2026-11-23'), 48);
  assert.equal(kw('2026-11-27'), 48);
  assert.equal(kw('2026-11-29'), 48);
  assert.equal(kw('2026-11-30'), 49);
  // Jahreswechsel
  assert.equal(kw('2026-01-01'), 1);
  assert.equal(kw('2024-12-30'), 1);
  assert.equal(kw('2021-01-03'), 53);
  assert.equal(kw('2020-12-31'), 53);
});
