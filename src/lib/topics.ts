import { locales } from '../i18n/locales';

/** Die einzigen Themen des Magazins. Neue Themen hier ergänzen und in `ui.ts` benennen. */
export const topics = ['ga4', 'gtm', 'looker-studio'] as const;

export type Topic = (typeof topics)[number];

export function isTopic(value: string): value is Topic {
  return (topics as readonly string[]).includes(value);
}

export function topicFromParam(value: string | undefined): Topic {
  if (value && isTopic(value)) return value;
  throw new Error(`Unbekanntes Thema: ${value ?? '(leer)'}`);
}

/** Themenindex: jede Sprache × jedes Thema. */
export function topicParams() {
  return locales.flatMap((lang) => topics.map((topic) => ({ params: { lang, topic } })));
}
