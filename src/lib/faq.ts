/**
 * FAQ-Abschnitt aus dem Markdown-Body lesen.
 * Format: Überschrift genau `## FAQ`, darunter `### Frage` mit Antwort-Absätzen.
 * Der Abschnitt endet an der nächsten `## `-Überschrift oder am Dateiende.
 * Reine Funktionen ohne Abhängigkeiten, damit `node --test` sie direkt lädt.
 */

export const MAX_FAQ_ITEMS = 10;

export interface FaqItem {
  question: string;
  /** Antwort als Plaintext (Absätze durch Leerzeile getrennt). */
  answer: string;
}

export interface FaqResult {
  /** Gibt es eine Überschrift `## FAQ`? */
  found: boolean;
  items: FaqItem[];
}

const FENCE = /^\s{0,3}(```|~~~)/;
const LIST_MARKER = /^([-*+]|\d+[.)])\s+/;

/** Markdown-Syntax aus einem Textstück entfernen. */
export function toPlainText(markdown: string): string {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1')
    .replace(/<[^>\n]+>/g, '')
    .replace(/`+([^`]*)`+/g, '$1')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(\*|_)(.+?)\1/g, '$2')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Zeilen einer Antwort zu Plaintext-Absätzen. Listenpunkte und Codeblöcke zählen als eigene Absätze. */
function answerToPlainText(lines: string[]): string {
  const paragraphs: string[] = [];
  let current: string[] = [];
  const flush = () => {
    if (current.length > 0) {
      const text = toPlainText(current.join(' '));
      if (text) paragraphs.push(text);
      current = [];
    }
  };
  let inFence = false;
  for (const raw of lines) {
    if (FENCE.test(raw)) {
      inFence = !inFence;
      flush();
      continue;
    }
    const line = raw.trim();
    if (inFence) {
      if (line) paragraphs.push(line);
      continue;
    }
    if (line === '') {
      flush();
      continue;
    }
    if (LIST_MARKER.test(line)) {
      flush();
      current.push(line.replace(LIST_MARKER, ''));
      flush();
      continue;
    }
    current.push(line.replace(/^>\s?/, ''));
  }
  flush();
  return paragraphs.join('\n\n');
}

export function parseFaq(markdown: string): FaqResult {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');

  let inFence = false;
  let start = -1;
  let end = lines.length;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (FENCE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (start === -1) {
      if (/^## FAQ[ \t]*$/.test(line)) start = i;
    } else if (/^#{1,2}[ \t]+\S/.test(line)) {
      end = i;
      break;
    }
  }
  if (start === -1) return { found: false, items: [] };

  const items: FaqItem[] = [];
  let question: string | null = null;
  let body: string[] = [];
  const push = () => {
    if (question !== null) {
      items.push({ question: toPlainText(question), answer: answerToPlainText(body) });
    }
  };

  inFence = false;
  for (const line of lines.slice(start + 1, end)) {
    if (FENCE.test(line)) {
      inFence = !inFence;
      if (question !== null) body.push(line);
      continue;
    }
    const heading = inFence ? null : /^###[ \t]+(.+?)[ \t]*#*[ \t]*$/.exec(line);
    if (heading) {
      push();
      question = heading[1]!;
      body = [];
    } else if (question !== null) {
      body.push(line);
    }
  }
  push();

  return { found: true, items };
}

/** Wirft mit Dateiname, wenn der FAQ-Abschnitt gegen die Regeln verstößt. */
export function assertValidFaq(result: FaqResult, file: string): void {
  if (!result.found) return;
  if (result.items.length === 0) {
    throw new Error(`${file}: "## FAQ" enthält keine Fragen ("### Frage").`);
  }
  if (result.items.length > MAX_FAQ_ITEMS) {
    throw new Error(
      `${file}: FAQ hat ${result.items.length} Fragen, erlaubt sind höchstens ${MAX_FAQ_ITEMS}.`,
    );
  }
  for (const item of result.items) {
    if (!item.question) throw new Error(`${file}: FAQ enthält eine leere Frage.`);
    if (!item.answer) {
      throw new Error(`${file}: FAQ-Frage ohne Antwort: "${item.question}".`);
    }
  }
}

export function faqJsonLd(items: FaqItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
