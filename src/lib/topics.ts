/**
 * Feste Topic-Tags. Ein neues Topic ist ein Eintrag hier.
 * `id` steht im Frontmatter (`topics`) und in der URL /de/themen/<id>/.
 */
export const topicList = [
  { id: 'ga4', label: 'GA4', description: 'Google Analytics 4: Funktionen, Änderungen und Fristen.' },
  { id: 'gtm', label: 'Google Tag Manager', description: 'Container, Tags, Vorlagen und Server-Container.' },
  { id: 'stape', label: 'Stape', description: 'Server-seitiges Tagging mit Stape.' },
  { id: 'looker-studio', label: 'Looker Studio', description: 'Berichte, Datenquellen und Konnektoren.' },
  { id: 'ki', label: 'KI', description: 'KI-Tools und Modelle für Marketing und Analyse.' },
  { id: 'grok-bot', label: 'Grok Bot', description: 'Meldungen rund um den Grok Bot.' },
  { id: 'seo', label: 'SEO', description: 'Suchmaschinenoptimierung.' },
  { id: 'geo', label: 'GEO', description: 'Sichtbarkeit in KI-Antworten (Generative Engine Optimization).' },
  { id: 'sonstiges', label: 'Sonstiges', description: 'Meldungen, die in kein anderes Topic passen.' },
] as const;

export type Topic = (typeof topicList)[number]['id'];

/** Für `z.enum(...)`. */
export const topics = topicList.map((topic) => topic.id) as [Topic, ...Topic[]];

export function topicInfo(id: Topic) {
  const found = topicList.find((topic) => topic.id === id);
  if (!found) throw new Error(`Unbekanntes Topic: ${id}`);
  return found;
}
