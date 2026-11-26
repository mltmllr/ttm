/**
 * Eine Sprache = ein Eintrag.
 * `astro.config.ts`, die Routen und das Artikelschema lesen nur diese Datei.
 * `defaultLocale` bleibt `de`, solange Deutsch die Hauptsprache ist.
 */
export const localeConfig = {
  de: {
    label: 'Deutsch',
    hreflang: 'de',
    ogLocale: 'de_DE',
  },
} as const;

export type Locale = keyof typeof localeConfig;

export const defaultLocale = 'de' satisfies Locale;

export const locales = Object.keys(localeConfig) as [Locale, ...Locale[]];

export function isLocale(value: string): value is Locale {
  return Object.prototype.hasOwnProperty.call(localeConfig, value);
}

export function localeFromParam(value: string | undefined): Locale {
  if (value && isLocale(value)) return value;
  throw new Error(`Unbekannte Sprache: ${value ?? '(leer)'}`);
}

/** Eine statische Route je konfigurierter Sprache. */
export function localeParams() {
  return locales.map((lang) => ({ params: { lang } }));
}
