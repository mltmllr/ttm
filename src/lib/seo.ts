import { defaultLocale, localeConfig, locales, type Locale } from '../i18n/locales';

export function requireSite(site: URL | undefined): URL {
  if (!site) throw new Error('In astro.config.ts fehlt `site`.');
  return site;
}

export function absoluteUrl(pathname: string, site: URL): string {
  return new URL(pathname, site).href;
}

/** Dieselbe Unterseite in jeder Sprache. Artikel mit abweichendem Slug übergeben eigene Pfade. */
export function samePagePaths(pathname: string, current: Locale): Partial<Record<Locale, string>> {
  const prefix = `/${current}`;
  const rest = pathname.startsWith(prefix) ? pathname.slice(prefix.length) || '/' : pathname;
  const suffix = rest.startsWith('/') ? rest : `/${rest}`;
  return Object.fromEntries(locales.map((locale) => [locale, `/${locale}${suffix}`]));
}

export function hreflangAlternates(
  paths: Partial<Record<Locale, string>>,
  site: URL,
): { hreflang: string; href: string }[] {
  const links: { hreflang: string; href: string }[] = locales.flatMap((locale) => {
    const path = paths[locale];
    if (!path) return [];
    return [{ hreflang: localeConfig[locale].hreflang, href: absoluteUrl(path, site) }];
  });

  const fallback = paths[defaultLocale];
  if (fallback) {
    links.push({ hreflang: 'x-default', href: absoluteUrl(fallback, site) });
  }
  return links;
}

export function formatCount(template: string, count: number): string {
  return template.replaceAll('{n}', String(count));
}
