import assert from 'node:assert/strict';
import { test } from 'node:test';
import { assertValidFaq, faqJsonLd, MAX_FAQ_ITEMS, parseFaq, toPlainText } from '../src/lib/faq.ts';

const body = (faq: string) => `Einleitung.\n\n## Was das für dich heißt\n\nText.\n\n${faq}`;

test('liest Fragen und Antworten', () => {
  const result = parseFaq(
    body(`## FAQ

### Wann gilt das?

Ab dem 1. Dezember.

### Muss ich handeln?

Ja.

Zweiter Absatz.
`),
  );
  assert.equal(result.found, true);
  assert.deepEqual(result.items, [
    { question: 'Wann gilt das?', answer: 'Ab dem 1. Dezember.' },
    { question: 'Muss ich handeln?', answer: 'Ja.\n\nZweiter Absatz.' },
  ]);
});

test('Abschnitt endet an der nächsten ##-Überschrift', () => {
  const result = parseFaq(`## FAQ

### Frage eins?

Antwort eins.

## Quelle

### Das ist keine Frage

Gehört nicht zur FAQ.
`);
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0]!.answer, 'Antwort eins.');
});

test('FAQ muss genau "## FAQ" heißen', () => {
  for (const heading of ['### FAQ', '## FAQs', '## Faq', '# FAQ', '## FAQ Fragen']) {
    const result = parseFaq(`${heading}\n\n### Frage?\n\nAntwort.\n`);
    assert.equal(result.found, false, heading);
  }
});

test('fehlende FAQ ist kein Fehler, leere FAQ schon', () => {
  const none = parseFaq('Nur Text.\n');
  assert.deepEqual(none, { found: false, items: [] });
  assert.doesNotThrow(() => assertValidFaq(none, 'x.md'));

  const empty = parseFaq('## FAQ\n\nKeine Fragen hier.\n');
  assert.equal(empty.found, true);
  assert.throws(() => assertValidFaq(empty, 'x.md'), /x\.md.*keine Fragen/);
});

test('mehr als 10 Fragen sind ein Fehler mit Dateiname', () => {
  const questions = Array.from({ length: MAX_FAQ_ITEMS + 1 }, (_, i) => `### Frage ${i + 1}?\n\nAntwort.\n`);
  const result = parseFaq(`## FAQ\n\n${questions.join('\n')}`);
  assert.equal(result.items.length, 11);
  assert.throws(() => assertValidFaq(result, '2026-11-27-test.md'), /2026-11-27-test\.md.*11 Fragen/);

  const ok = parseFaq(`## FAQ\n\n${questions.slice(0, 10).join('\n')}`);
  assert.doesNotThrow(() => assertValidFaq(ok, 'x.md'));
});

test('Frage ohne Antwort ist ein Fehler', () => {
  const result = parseFaq('## FAQ\n\n### Frage?\n\n### Nächste?\n\nAntwort.\n');
  assert.throws(() => assertValidFaq(result, 'x.md'), /ohne Antwort.*Frage\?/);
});

test('Plaintext ohne Markdown-Syntax', () => {
  const result = parseFaq(`## FAQ

### Was ist **neu** in \`GA4\`?

Siehe die [Release Notes](https://example.com/notes) und *weitere* Hinweise mit <b>HTML</b>.
- Punkt eins
- Punkt zwei
`);
  const [item] = result.items;
  assert.equal(item!.question, 'Was ist neu in GA4?');
  assert.equal(
    item!.answer,
    'Siehe die Release Notes und weitere Hinweise mit HTML.\n\nPunkt eins\n\nPunkt zwei',
  );
  assert.doesNotMatch(item!.answer, /[*`\[\]<>]/);
});

test('Überschriften in Codeblöcken zählen nicht', () => {
  const result = parseFaq(`## FAQ

### Wie sieht das aus?

\`\`\`md
## Kein Ende
### Keine Frage
\`\`\`

Danach geht es weiter.
`);
  assert.equal(result.items.length, 1);
  assert.match(result.items[0]!.answer, /Danach geht es weiter\./);
});

test('CRLF und FAQ am Dateiende ohne Zeilenumbruch', () => {
  const result = parseFaq('## FAQ\r\n\r\n### Frage?\r\n\r\nAntwort.');
  assert.deepEqual(result.items, [{ question: 'Frage?', answer: 'Antwort.' }]);
});

test('FAQPage-JSON-LD', () => {
  const data = faqJsonLd([{ question: 'F?', answer: 'A.' }]);
  assert.deepEqual(data, {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'F?', acceptedAnswer: { '@type': 'Answer', text: 'A.' } },
    ],
  });
});

test('toPlainText', () => {
  assert.equal(toPlainText('![Bild](a.png) und [Link](https://x.de)'), 'Bild und Link');
});
