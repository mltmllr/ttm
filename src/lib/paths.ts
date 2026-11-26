import { getRelativeLocaleUrl } from 'astro:i18n';
import type { Locale } from '../i18n/locales';
import type { Topic } from './topics';

function joinLocale(locale: Locale, path: string): string {
  const relative = getRelativeLocaleUrl(locale, path);
  return relative.startsWith('/') ? relative : `/${relative}`;
}

/** Seitenpfad mit abschließendem Schrägstrich, passend zu `trailingSlash: 'always'`. */
export function localePath(locale: Locale, path = ''): string {
  const url = joinLocale(locale, path);
  return url.endsWith('/') ? url : `${url}/`;
}

export function articlePath(locale: Locale, slug: string): string {
  return localePath(locale, `artikel/${slug}`);
}

export function topicsPath(locale: Locale): string {
  return localePath(locale, 'themen');
}

export function topicPath(locale: Locale, topic: Topic): string {
  return localePath(locale, `themen/${topic}`);
}

export function aboutPath(locale: Locale): string {
  return localePath(locale, 'ueber');
}

/** Feed-URL ohne abschließenden Schrägstrich. */
export function rssPath(locale: Locale): string {
  return joinLocale(locale, 'rss.xml').replace(/\/$/, '');
}
