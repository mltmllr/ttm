import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { locales } from './i18n/locales';
import { topics } from './lib/topics';

const httpUrl = z.url({ protocol: /^https?$/ });

const articles = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/articles',
  }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    lang: z.enum(locales),
    topics: z.array(z.enum(topics)).min(1),
    sources: z.array(
      z.object({
        title: z.string().min(1),
        url: httpUrl,
      }),
    ),
    draft: z.boolean(),
    placeholder: z.boolean().default(false),
    translationKey: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  }),
});

const pages = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.md',
    base: './src/content/pages',
  }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    lang: z.enum(locales),
  }),
});

export const collections = { articles, pages };
