import { getCollection, type CollectionEntry } from 'astro:content';
import path from 'node:path';
import { isLocale, type Locale } from '../i18n/locales';
import { categoryByLabel, type Category } from './categories';
import { assertValidFaq, parseFaq, type FaqItem } from './faq';
import { assertDateMatchesFilename, isoWeek, parseNewsFilename } from './news-meta';
import type { Topic } from './topics';

export type NewsEntry = CollectionEntry<'news'>;

export interface NewsPost {
  entry: NewsEntry;
  slug: string;
  locale: Locale;
  category: Category;
  topics: Topic[];
  /** Kalenderwoche (ISO) aus `date`. */
  week: number;
  faq: FaqItem[];
  /** Fehlt `## FAQ`, steht hier true (Build-Log-Warnung). */
  faqMissing: boolean;
}

let cache: Promise<NewsPost[]> | undefined;

function prepare(entry: NewsEntry): NewsPost {
  const file = entry.filePath ?? entry.id;
  const { slug, date } = parseNewsFilename(path.basename(file), file);

  // Ordner = erstes Segment der Entry-ID (`de/2026-…`).
  const folder = entry.id.split('/')[0] ?? '';
  if (!isLocale(folder)) {
    throw new Error(`${file}: Ordner "${folder}" ist keine konfigurierte Sprache.`);
  }
  if (entry.data.lang !== folder) {
    throw new Error(
      `${file}: \`lang: ${entry.data.lang}\` passt nicht zum Ordner "${folder}". Datei verschieben oder \`lang\` korrigieren.`,
    );
  }
  assertDateMatchesFilename(date, entry.data.date, file);

  const faq = parseFaq(entry.body ?? '');
  assertValidFaq(faq, file);
  if (!faq.found) {
    console.warn(`[news] Warnung: ${file} hat keinen Abschnitt "## FAQ" (kein FAQPage-Markup).`);
  }

  return {
    entry,
    slug,
    locale: folder,
    category: categoryByLabel(entry.data.category),
    topics: entry.data.topics,
    week: isoWeek(entry.data.date),
    faq: faq.items,
    faqMissing: !faq.found,
  };
}

/** Alle Beiträge, geprüft, neueste zuerst. Wirft bei Regelverstößen (bricht den Build ab). */
export function getNews(): Promise<NewsPost[]> {
  // Im Dev-Server nicht cachen, damit Änderungen an Beiträgen sofort greifen.
  if (!import.meta.env.PROD) cache = undefined;
  cache ??= getCollection('news').then((entries) => {
    const posts = entries.map(prepare);
    const seen = new Map<string, string>();
    for (const post of posts) {
      const key = `${post.locale}/${post.slug}`;
      const other = seen.get(key);
      if (other) throw new Error(`Doppelter Slug "${post.slug}": ${other} und ${post.entry.filePath}`);
      seen.set(key, post.entry.filePath ?? key);
    }
    return posts.sort(
      (a, b) =>
        b.entry.data.date.getTime() - a.entry.data.date.getTime() || b.slug.localeCompare(a.slug),
    );
  });
  return cache;
}

export async function newsForLocale(locale: Locale): Promise<NewsPost[]> {
  return (await getNews()).filter((post) => post.locale === locale);
}
