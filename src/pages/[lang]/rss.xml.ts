import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { localeConfig, localeFromParam, locales } from '../../i18n/locales';
import { ui } from '../../i18n/ui';
import { articleSlug, articlesForLocale, getArticles } from '../../lib/articles';
import { articlePath, localePath } from '../../lib/paths';

export function getStaticPaths() {
  return locales.map((lang) => ({ params: { lang } }));
}

export async function GET(context: APIContext) {
  const locale = localeFromParam(context.params.lang);
  if (!context.site) throw new Error('In astro.config.ts fehlt `site`.');

  const articles = articlesForLocale(await getArticles(), locale);
  const dictionary = ui[locale];

  return rss({
    title: dictionary['site.title'],
    description: dictionary['site.description'],
    site: new URL(localePath(locale), context.site),
    customData: `<language>${localeConfig[locale].hreflang}</language>`,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.pubDate,
      link: articlePath(locale, articleSlug(article)),
      categories: article.data.topics.map((topic) => dictionary[`topic.${topic}`]),
    })),
  });
}
