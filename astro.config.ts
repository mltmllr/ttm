import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { defaultLocale, localeConfig, locales } from './src/i18n/locales';

/**
 * Deutsch ist die Standardsprache und liegt unter /de/.
 * "/" leitet dorthin um, damit jede Sprache denselben Präfix hat.
 * Eine weitere Sprache ist ein Eintrag in src/i18n/locales.ts plus Inhalte.
 * Kein `base`: die Site hängt an der Domain, nicht unter /ttm/.
 */
const sitemapLocales = Object.fromEntries(
  locales.map((locale) => [locale, localeConfig[locale].hreflang]),
);

export default defineConfig({
  site: 'https://ttm.agentunit.com',
  trailingSlash: 'always',
  i18n: {
    defaultLocale,
    locales: [...locales],
    routing: {
      prefixDefaultLocale: true,
      // "/" leitet src/pages/index.astro weiter. Die eingebaute
      // Weiterleitung würde dieselbe Route ein zweites Mal beanspruchen.
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page);
        if (pathname === '/') return false;
        if (pathname.endsWith('/rss.xml')) return false;
        if (pathname.includes('/404')) return false;
        return true;
      },
      i18n: {
        defaultLocale,
        locales: sitemapLocales,
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
