import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/locales';
import { assertLocaleFolder } from './content';
import type { Topic } from './topics';

export type Article = CollectionEntry<'articles'>;

export function articleSlug(article: Article): string {
  const slug = article.id.split('/').pop();
  if (!slug) throw new Error(`Artikel ohne Slug: ${article.id}`);
  return slug;
}

export function isVisible(article: Article): boolean {
  return import.meta.env.DEV || article.data.draft === false;
}

export async function getArticles(): Promise<Article[]> {
  const articles = await getCollection('articles');
  const translationKeys = new Set<string>();
  const slugs = new Set<string>();

  for (const article of articles) {
    assertLocaleFolder(article.id, article.data.lang);

    const translation = `${article.data.lang}:${article.data.translationKey}`;
    if (translationKeys.has(translation)) {
      throw new Error(
        `translationKey "${article.data.translationKey}" ist in "${article.data.lang}" mehrfach vergeben.`,
      );
    }
    translationKeys.add(translation);

    const slug = `${article.data.lang}:${articleSlug(article)}`;
    if (slugs.has(slug)) {
      throw new Error(`Slug "${articleSlug(article)}" ist in "${article.data.lang}" mehrfach vergeben.`);
    }
    slugs.add(slug);
  }

  return articles;
}

export function articlesForLocale(articles: Article[], locale: Locale): Article[] {
  return articles
    .filter((article) => article.data.lang === locale && isVisible(article))
    .sort((a, b) => {
      const byDate = b.data.pubDate.getTime() - a.data.pubDate.getTime();
      if (byDate !== 0) return byDate;
      return a.data.title.localeCompare(b.data.title, locale);
    });
}

export function articlesForTopic(articles: Article[], locale: Locale, topic: Topic): Article[] {
  return articlesForLocale(articles, locale).filter((article) => article.data.topics.includes(topic));
}

export function translationsFor(articles: Article[], article: Article): Article[] {
  return articles.filter(
    (candidate) =>
      candidate.data.translationKey === article.data.translationKey &&
      candidate.id !== article.id &&
      isVisible(candidate),
  );
}
