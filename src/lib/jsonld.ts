import { siteConfig } from '../config/site';
import { localeConfig } from '../i18n/locales';
import { faqJsonLd } from './faq';
import type { NewsPost } from './news';
import { topicInfo } from './topics';

export function organization(site: URL) {
  return { '@type': 'Organization', name: siteConfig.name, url: new URL('/', site).href };
}

/** NewsArticle-JSON-LD für einen Beitrag. `url` ist die absolute kanonische URL. */
export function newsArticleJsonLd(post: NewsPost, url: string, site: URL): Record<string, unknown> {
  const { data } = post.entry;
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: data.title,
    description: data.description,
    datePublished: data.date.toISOString(),
    dateModified: (data.updated ?? data.date).toISOString(),
    inLanguage: localeConfig[post.locale].hreflang,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: organization(site),
    publisher: organization(site),
    articleSection: post.category.label,
    keywords: post.topics.map((id) => topicInfo(id).label),
    citation: data.sources.map((source) => ({
      '@type': 'CreativeWork',
      name: source.title,
      url: source.url,
      ...(source.date ? { datePublished: source.date.toISOString().slice(0, 10) } : {}),
    })),
  };
}

/** Alle JSON-LD-Blöcke eines Beitrags: NewsArticle und, falls vorhanden, FAQPage. */
export function postJsonLd(post: NewsPost, url: string, site: URL): Record<string, unknown>[] {
  const blocks = [newsArticleJsonLd(post, url, site)];
  if (post.faq.length > 0) blocks.push(faqJsonLd(post.faq));
  return blocks;
}
