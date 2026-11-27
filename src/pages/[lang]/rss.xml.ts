import type { APIContext } from 'astro';
import { localeFromParam, localeParams } from '../../i18n/locales';
import { ui } from '../../i18n/ui';
import { buildFeed } from '../../lib/feed';
import { newsForLocale } from '../../lib/news';
import { localePath } from '../../lib/paths';

export function getStaticPaths() {
  return localeParams();
}

export async function GET(context: APIContext) {
  const locale = localeFromParam(context.params.lang);
  if (!context.site) throw new Error('In astro.config.ts fehlt `site`.');
  const dictionary = ui[locale];

  return buildFeed({
    locale,
    channelLink: new URL(localePath(locale), context.site),
    posts: await newsForLocale(locale),
    title: dictionary['site.title'],
    description: dictionary['site.description'],
  });
}
