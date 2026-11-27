import type { APIContext } from 'astro';
import { localeFromParam, locales } from '../../../../i18n/locales';
import { ui } from '../../../../i18n/ui';
import { categories, categoryBySlug } from '../../../../lib/categories';
import { buildFeed } from '../../../../lib/feed';
import { newsForLocale } from '../../../../lib/news';
import { categoryPath } from '../../../../lib/paths';

export function getStaticPaths() {
  return locales.flatMap((lang) =>
    categories.map((category) => ({ params: { lang, category: category.slug } })),
  );
}

export async function GET(context: APIContext) {
  const locale = localeFromParam(context.params.lang);
  if (!context.site) throw new Error('In astro.config.ts fehlt `site`.');
  const category = categoryBySlug(context.params.category ?? '');
  const posts = (await newsForLocale(locale)).filter((post) => post.category.slug === category.slug);

  return buildFeed({
    locale,
    channelLink: new URL(categoryPath(locale, category.slug), context.site),
    posts,
    title: `${ui[locale]['site.title']}: ${category.label}`,
    description: category.description,
  });
}
