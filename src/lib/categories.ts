/**
 * Kategorien des News-Kanals. Eine neue Kategorie ist genau ein Eintrag hier:
 * Schema (Frontmatter `category`), Hauptnavigation, Kategorie-Seite und RSS
 * lesen alle von dieser Liste. `label` ist der Wert im Frontmatter.
 */
export const categories = [
  {
    slug: 'analytics-und-tracking',
    label: 'Analytics und Tracking',
    description: 'GA4, Google Tag Manager, Stape, Looker Studio und vergleichbare Tracking-Themen.',
  },
  {
    slug: 'ki',
    label: 'KI',
    description: 'KI-Tools und Modelle für die Marketing-Arbeit, zum Beispiel Grok Bot.',
  },
  {
    slug: 'seo-geo',
    label: 'SEO/GEO',
    description: 'Suchmaschinenoptimierung und Sichtbarkeit in KI-Antworten.',
  },
] as const;

export type Category = (typeof categories)[number];
export type CategoryLabel = Category['label'];
export type CategorySlug = Category['slug'];

/** Für `z.enum(...)`: alle erlaubten Labels. */
export const categoryLabels = categories.map((category) => category.label) as [
  CategoryLabel,
  ...CategoryLabel[],
];

export function categoryByLabel(label: string): Category {
  const found = categories.find((category) => category.label === label);
  if (!found) throw new Error(`Unbekannte Kategorie: ${label}`);
  return found;
}

export function categoryBySlug(slug: string): Category {
  const found = categories.find((category) => category.slug === slug);
  if (!found) throw new Error(`Unbekannte Kategorie-Adresse: ${slug}`);
  return found;
}
