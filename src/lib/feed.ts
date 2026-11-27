import rss from '@astrojs/rss';
import { localeConfig, type Locale } from '../i18n/locales';
import type { NewsPost } from './news';
import { newsPath } from './paths';

/**
 * RSS-Feed aus Beiträgen. Eine leere Liste ergibt einen gültigen, leeren Feed.
 * `channelLink` ist die absolute URL der Seite, die der Feed beschreibt.
 */
export function buildFeed(options: {
  locale: Locale;
  channelLink: URL;
  posts: NewsPost[];
  title: string;
  description: string;
}) {
  const { locale, channelLink, posts, title, description } = options;
  return rss({
    title,
    description,
    site: channelLink,
    customData: `<language>${localeConfig[locale].hreflang}</language>`,
    items: posts.map((post) => {
      const { data } = post.entry;
      return {
        title: data.title,
        description: data.description,
        pubDate: data.date,
        link: newsPath(locale, post.slug),
        categories: [post.category.label, ...post.topics],
      };
    }),
  });
}
