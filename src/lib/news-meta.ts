/**
 * Reine Hilfsfunktionen für Beitragsdateien: Dateiname, Datum, Kalenderwoche.
 * Ohne Abhängigkeiten, damit `node --test` sie direkt lädt.
 */

export const FILENAME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)$/;

export interface ParsedFilename {
  /** Dateiname ohne `.md`; zugleich der URL-Slug. */
  slug: string;
  /** `JJJJ-MM-TT` aus dem Dateinamen. */
  date: string;
}

/** `JJJJ-MM-TT` eines UTC-Datums. */
export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Prüft Muster und Kalenderdatum; wirft mit klarer Meldung. */
export function parseNewsFilename(baseName: string, file: string): ParsedFilename {
  const slug = baseName.replace(/\.md$/, '');
  const match = FILENAME_PATTERN.exec(slug);
  if (!match) {
    throw new Error(
      `${file}: Dateiname "${baseName}" passt nicht zum Muster JJJJ-MM-TT-slug.md ` +
        `(Kleinbuchstaben, Ziffern und Bindestriche, zum Beispiel 2026-11-27-ga4-neue-funktion.md).`,
    );
  }
  const date = `${match[1]}-${match[2]}-${match[3]}`;
  const check = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(check.getTime()) || toIsoDate(check) !== date) {
    throw new Error(`${file}: Das Datum ${date} im Dateinamen ist kein gültiges Kalenderdatum.`);
  }
  return { slug, date };
}

/** Das Datum im Dateinamen muss zu `date` im Frontmatter passen. */
export function assertDateMatchesFilename(filenameDate: string, date: Date, file: string): void {
  const frontmatter = toIsoDate(date);
  if (frontmatter !== filenameDate) {
    throw new Error(
      `${file}: Datum im Dateinamen (${filenameDate}) und \`date\` im Frontmatter (${frontmatter}) stimmen nicht überein.`,
    );
  }
}

/** ISO-8601-Kalenderwoche (Woche beginnt am Montag, KW 1 enthält den 4. Januar). */
export function isoWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNumber = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNumber);
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart) / 86_400_000 + 1) / 7);
}
