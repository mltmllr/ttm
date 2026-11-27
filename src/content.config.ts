import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { locales } from './i18n/locales';
import { categoryLabels } from './lib/categories';
import { topics } from './lib/topics';

const httpUrl = z.url({ protocol: /^https?$/ });

/**
 * Beiträge liegen unter src/content/news/<lang>/JJJJ-MM-TT-slug.md.
 * Mit TTM_FIXTURES=1 (npm run build:fixtures / dev:fixtures) lädt die Collection
 * stattdessen die Testbeiträge aus tests/fixtures/news. Ein normaler Build
 * veröffentlicht sie nie.
 * Dateiname, Ordner und FAQ prüft src/lib/news.ts beim Laden.
 */
const useFixtures = process.env.TTM_FIXTURES === '1';

const news = defineCollection({
  loader: glob({
    // `*-geglaettet.md` sind Arbeitskopien der Redaktion und werden nie veröffentlicht.
    pattern: ['**/[^_]*.md', '!**/*-geglaettet.md'],
    base: useFixtures ? './tests/fixtures/news' : './src/content/news',
  }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    type: z.enum(['eil', 'wochen-update']),
    category: z.enum(categoryLabels),
    topics: z.array(z.enum(topics)).min(1),
    lang: z.enum(locales),
    sources: z
      .array(
        z.object({
          title: z.string().min(1),
          url: httpUrl,
          date: z.coerce.date().optional(),
        }),
      )
      .min(1),
  }),
});

export const collections = { news };
