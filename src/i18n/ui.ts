import { defaultLocale, locales, type Locale } from './locales';

const de = {
  'site.title': 'The Technical Marketer',
  'site.short': 'TTM',
  'site.description':
    'News-Kanal für Online-Marketer: Was sich bei GA4, Google Tag Manager, Stape, SEO/GEO und KI-Tools ändert und was das für die Arbeit heißt.',
  'nav.skip': 'Zum Inhalt',
  'nav.menu': 'Hauptnavigation',
  'nav.toggle': 'Menü öffnen oder schließen',
  'nav.home': 'Start',
  'nav.topics': 'Themen',
  'nav.languages': 'Sprachen',
  'home.title': 'News für Online-Marketer',
  'home.lead':
    'Knapp, verlässlich und mit Primärquelle: was sich bei Tracking, SEO/GEO und KI-Tools ändert, und was das für deine Arbeit heißt.',
  'home.latest': 'Neueste Beiträge',
  'home.categories': 'Kategorien',
  'home.empty.title': 'Noch keine Beiträge',
  'home.empty.body':
    'Der Kanal startet bald. Sobald der erste Beitrag erscheint, steht er hier. Per RSS bleibst du auf dem Laufenden.',
  'list.empty': 'In dieser Auswahl gibt es noch keinen Beitrag.',
  'list.all': 'Alle Beiträge',
  'label.eil': 'Eilmeldung',
  'label.weekly': 'Wochen-Update KW {week}',
  'post.published': 'Veröffentlicht',
  'post.updated': 'Aktualisiert',
  'post.category': 'Kategorie',
  'post.topics': 'Themen',
  'post.sources': 'Quellen',
  'post.sourceDate': 'Stand {date}',
  'post.back': 'Zurück zu {category}',
  'category.rss': 'RSS-Feed dieser Kategorie',
  'topics.title': 'Themen',
  'topics.lead': 'Jeder Beitrag trägt ein oder mehrere Themen. Wähle ein Thema, um alle passenden Beiträge zu sehen.',
  'topics.count.one': '1 Beitrag',
  'topics.count.other': '{n} Beiträge',
  'footer.note': 'Unabhängiger News-Kanal. Kein Angebot von Google.',
  'footer.rss': 'RSS',
  'footer.imprint': 'Impressum',
  'footer.privacy': 'Datenschutz',
  'footer.cookies': 'Cookie-Einstellungen',
  'footer.rights': '© {year} The Technical Marketer',
  'consent.title': 'Reichweitenmessung',
  'consent.body':
    'Mit deiner Einwilligung messen wir mit Google Analytics 4, wie die Seite genutzt wird. Ohne Einwilligung wird nichts an Google übertragen. Du kannst die Entscheidung jederzeit über „Cookie-Einstellungen“ im Footer ändern.',
  'consent.privacy': 'Mehr in der Datenschutzerklärung',
  'consent.accept': 'Akzeptieren',
  'consent.decline': 'Ablehnen',
  'notFound.title': 'Seite nicht gefunden',
  'notFound.body': 'Diese Adresse gibt es hier nicht.',
  'notFound.home': 'Zur Startseite',
  'legal.placeholder':
    'Platzhalter: Dieser Text ist nicht final und muss vor der Veröffentlichung rechtlich geprüft und ersetzt werden.',
} as const;

export type UiKey = keyof typeof de;

export const ui: Record<Locale, { [K in UiKey]: string }> = { de };

for (const locale of locales) {
  if (!ui[locale]) {
    throw new Error(`Keine UI-Texte für "${locale}". Ergänze src/i18n/ui.ts.`);
  }
}

export function useTranslations(locale: Locale) {
  const dictionary = ui[locale] ?? ui[defaultLocale];
  return function t(key: UiKey, values: Record<string, string | number> = {}): string {
    let value = dictionary[key] ?? ui[defaultLocale][key];
    if (!value) throw new Error(`UI-Text "${key}" fehlt für "${locale}".`);
    for (const [name, replacement] of Object.entries(values)) {
      value = value.replaceAll(`{${name}}`, String(replacement));
    }
    return value;
  };
}
