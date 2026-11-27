# Beitragsvorlage TTM

Verbindlich für Positionierung, Ton und Inhalt ist die Notion-Seite [Redaktionsleitfaden TTM: Positionierung und Beitragsvorlage](https://app.notion.com/p/425d60e0a75c81ba966ff9e9b16c6087). Diese Datei beschreibt nur das technische Format, das die Website prüft. Verstöße brechen den Build ab.

## Datei

Pfad: `src/content/news/de/JJJJ-MM-TT-slug.md`

- Der Dateiname ohne `.md` ist der Slug und die Adresse: `2026-11-27-ga4-neue-funktion.md` wird zu `/de/news/2026-11-27-ga4-neue-funktion/`.
- Muster: Datum, Bindestrich, Slug aus Kleinbuchstaben, Ziffern und Bindestrichen. Keine Umlaute, keine Leerzeichen, keine Unterstriche.
- Das Datum im Dateinamen muss dem Feld `date` entsprechen.
- Der Ordner muss zu `lang` passen (`de` liegt unter `src/content/news/de/`).
- Dateien, die auf `-geglaettet.md` enden, und Dateien, die mit `_` beginnen, werden ignoriert. Zur Veröffentlichung wird die geprüfte Fassung unter dem normalen Dateinamen abgelegt.
- Keine Teaserbilder.

## Frontmatter

```yaml
---
title: "GA4: Neue Funktion X für Y"
description: "Ein Satz: was sich ändert und warum es Marketer betrifft."
date: 2026-11-27
type: eil
category: "Analytics und Tracking"
topics: [ga4]
lang: de
sources:
  - title: "Google Analytics Hilfe: Release Notes"
    url: "https://support.google.com/..."
    date: 2026-11-26
---
```

| Feld | Pflicht | Erlaubte Werte |
| --- | --- | --- |
| `title` | ja | Text, möglichst höchstens ca. 70 Zeichen. Fakt statt Clickbait. |
| `description` | ja | Ein Satz, möglichst höchstens ca. 160 Zeichen. Erscheint in Liste, RSS und Meta-Description. |
| `date` | ja | `JJJJ-MM-TT`, muss zum Dateinamen passen. |
| `type` | ja | `eil` (Label „Eilmeldung“) oder `wochen-update` (Label „Wochen-Update KW 48“, die Kalenderwoche wird aus `date` berechnet). |
| `category` | ja | Genau einer der Werte: `"Analytics und Tracking"`, `"KI"`, `"SEO/GEO"`. Die Liste steht in `src/lib/categories.ts` und ist erweiterbar. |
| `topics` | ja, mind. 1 | Aus: `ga4`, `gtm`, `stape`, `looker-studio`, `ki`, `grok-bot`, `seo`, `geo`, `sonstiges`. `geo` nur bei Bedarf. |
| `lang` | ja | `de`. Muss zum Ordner passen. |
| `sources` | ja, mind. 1 | Liste aus `title` (Pflicht), `url` (Pflicht, `http` oder `https`), `date` (optional, Stand der Quelle). |
| `updated` | nein | Datum der letzten inhaltlichen Änderung. |

Es gibt kein Feld `status` und kein Feld `draft`. Freigabe ist der Merge des Pull Requests: Was auf `main` liegt, ist veröffentlicht.

Quellen im Frontmatter erscheinen als Quellenliste unter dem Beitrag und im Schema.org-Markup. Ein zusätzlicher Abschnitt „Quelle“ im Text ist bei Eilmeldungen laut Leitfaden üblich und schadet nicht.

## Textaufbau

Länge und Abschnitte regelt der Notion-Leitfaden. Kurzfassung:

- **Eilmeldung:** erster Satz sagt, was passiert ist, wen es betrifft und ab wann. Dann zwei bis vier Sätze Details, `## Was das für dich heißt`, `## Quelle`, `## FAQ`.
- **Wochen-Update:** ein Satz Überblick, Zwischenüberschriften nur für Themen mit echten Neuigkeiten, `## Was das für dich heißt`, `## FAQ`. Ein Beitrag pro Kategorie.

Überschriften im Text beginnen bei `##`. Die Überschrift `#` setzt die Website aus `title`.

## FAQ-Format

Jeder Beitrag endet mit einem FAQ-Abschnitt. Daraus erzeugt der Build automatisch FAQPage-Markup (Schema.org). Es gibt kein Frontmatter-Feld dafür.

```markdown
## FAQ

### Kurze Frage, die einem Online-Marketer in den Kopf kommt?

Kurze Antwort nur aus den Quellen. Ist etwas unklar, das ausdrücklich so sagen.

### Zweite Frage?

Antwort als Absatz.
```

Regeln:

- Die Überschrift heißt genau `## FAQ` (zwei `#`, Leerzeichen, `FAQ`). Nicht `### FAQ`, nicht `## FAQs`.
- Darunter höchstens 10 Fragen, jede als `### Frage`.
- Die Antwort steht als Absatz direkt unter der Frage. Mehrere Absätze sind möglich. Im Schema steht die Antwort als reiner Text, Markdown-Syntax wie Links oder Fettdruck wird entfernt.
- Der Abschnitt endet an der nächsten `## `-Überschrift oder am Dateiende. Am besten steht `## FAQ` ganz am Ende.
- Jede Frage braucht eine Antwort.
- `## FAQ` ohne Fragen oder mehr als 10 Fragen brechen den Build ab. Fehlt `## FAQ` ganz, gibt der Build nur eine Warnung aus. Der Leitfaden verlangt die FAQ trotzdem.

## Vollständiges Beispiel

```markdown
---
title: "GA4: Beispiel-Funktion ändert die Berichte"
description: "Beispiel: Was sich ändert und warum es Marketer betrifft."
date: 2026-12-02
type: eil
category: "Analytics und Tracking"
topics: [ga4, looker-studio]
lang: de
sources:
  - title: "Beispiel-Quelle: Release Notes"
    url: "https://example.com/release-notes"
    date: 2026-12-01
---

Beispiel: Erster Satz mit dem, was passiert ist, wen es betrifft und ab wann.

Zwei bis vier Sätze Details.

## Was das für dich heißt

Reporting: Prüfe bis zum Beispieldatum, ob deine Looker-Studio-Berichte betroffen sind.

## Quelle

[Beispiel-Quelle: Release Notes](https://example.com/release-notes), Stand 01.12.2026.

## FAQ

### Gilt die Änderung für alle Properties?

Laut Quelle ja. Zu Ausnahmen macht die Quelle keine Angaben, das ist unklar.
```

## Prüfen

```bash
npm run build           # leere/echte Beiträge, bricht bei Fehlern ab
npm run build:fixtures  # zusätzlich Testbeiträge aus tests/fixtures
npm run dev             # lokale Vorschau
```

Der Dev-Server zeigt Fehler im Frontmatter direkt im Browser und im Terminal.
