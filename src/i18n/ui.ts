import { defaultLocale, locales, type Locale } from './locales';
import { topics, type Topic } from '../lib/topics';

const de = {
  'site.title': 'The Technical Marketer',
  'site.short': 'TTM',
  'site.description':
    'Das Magazin für technisches Marketing. Google Analytics 4, Google Tag Manager und Looker Studio.',
  'site.kicker': 'GA4 · Tag Manager · Looker Studio',
  'nav.skip': 'Zum Inhalt',
  'nav.menu': 'Navigation',
  'nav.home': 'Magazin',
  'nav.topics': 'Themen',
  'nav.about': 'Über',
  'nav.languages': 'Sprachen',
  'home.latest': 'Neueste Artikel',
  'home.intro':
    'Ein kleines Magazin darüber, wie Messung, Tagging und Berichte tatsächlich gebaut werden.',
  'home.empty': 'Noch keine Artikel in dieser Sprache.',
  'article.published': 'Veröffentlicht',
  'article.updated': 'Aktualisiert',
  'article.sources': 'Quellen',
  'article.draft': 'Entwurf, nur in der lokalen Vorschau',
  'article.placeholder':
    'Platzhalter. Dieser Text zeigt das Artikelformat. Er ist keine redaktionelle Veröffentlichung und enthält keine Kennzahlen.',
  'article.placeholderShort': 'Platzhalter',
  'article.translations': 'Andere Sprachen',
  'topics.title': 'Themen',
  'topics.lead': 'Zurzeit nur diese drei. Ein Artikel kann mehrere davon tragen.',
  'topics.empty': 'Zu diesem Thema gibt es noch keinen Artikel.',
  'topics.count.one': '1 Artikel',
  'topics.count.other': '{n} Artikel',
  'topic.ga4': 'Google Analytics 4',
  'topic.gtm': 'Google Tag Manager',
  'topic.looker-studio': 'Looker Studio',
  'topic.ga4.description': 'Ereignisse, Parameter und das, was eine Property tatsächlich empfängt.',
  'topic.gtm.description': 'Container, Arbeitsbereiche, Versionen und Umgebungen.',
  'topic.looker-studio.description': 'Berichte, die eine Datenquelle lesen, zum Beispiel eine GA4-Property.',
  'about.imprint': 'Impressum',
  'footer.note': 'Unabhängiges Magazin. Kein Angebot von Google.',
  'footer.rss': 'RSS',
  'footer.rights': '© {year} The Technical Marketer',
  'notFound.title': 'Seite nicht gefunden',
  'notFound.body': 'Diese Adresse gibt es hier nicht.',
  'notFound.home': 'Zur Startseite',
} as const;

export type UiKey = keyof typeof de;

export const ui: Record<Locale, { [K in UiKey]: string }> = { de };

for (const locale of locales) {
  const dictionary = ui[locale];
  if (!dictionary) {
    throw new Error(`Keine UI-Texte für "${locale}". Ergänze src/i18n/ui.ts.`);
  }
  for (const topic of topics) {
    for (const key of [`topic.${topic}`, `topic.${topic}.description`] as const) {
      if (!dictionary[key as UiKey]) {
        throw new Error(`UI-Text "${key}" fehlt für "${locale}".`);
      }
    }
  }
}

export function useTranslations(locale: Locale) {
  const dictionary = ui[locale] ?? ui[defaultLocale];
  return function t(key: UiKey): string {
    const value = dictionary[key] ?? ui[defaultLocale][key];
    if (!value) throw new Error(`UI-Text "${key}" fehlt für "${locale}".`);
    return value;
  };
}

export function topicLabelKey(topic: Topic): UiKey {
  return `topic.${topic}` as UiKey;
}

export function topicDescriptionKey(topic: Topic): UiKey {
  return `topic.${topic}.description` as UiKey;
}
