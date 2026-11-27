# The Technical Marketer: News-Kanal

Statische Astro-Seite für <https://ttm.agentunit.com>. Deutsche News für Online-Marketer zu GA4, Google Tag Manager, Stape, SEO/GEO und KI-Tools. Beiträge sind Markdown-Dateien im Repository, veröffentlicht ist, was auf `main` liegt. Design: AgentUnit-Designsystem, nur Dark Mode, Schriften selbst gehostet.

## Lokal starten

Node.js 22 oder neuer (siehe `.nvmrc`).

```bash
npm install
npm run dev            # http://localhost:4321/ leitet auf /de/
npm run dev:fixtures   # mit Testbeiträgen aus tests/fixtures
npm test               # Unit-Tests (FAQ-Parser, Dateiname, Kalenderwoche)
npm run build          # Produktions-Build nach dist/
npm run build:fixtures # Build mit Testbeiträgen nach dist-fixtures/ (nie veröffentlichen)
npm run check:links    # interner Linkcheck über dist/ (ohne Netz)
```

Ein Build mit null Beiträgen ist gültig (Leerzustand, leere RSS-Feeds). Die Meldung „collection news does not exist or is empty“ ist dann normal.

## Beitrag hinzufügen

1. Datei `src/content/news/de/JJJJ-MM-TT-slug.md` anlegen. Vorlage, Frontmatter-Felder mit erlaubten Werten und das FAQ-Format stehen in [`docs/beitrag-vorlage.md`](docs/beitrag-vorlage.md). Verbindlich für Inhalt und Ton ist der [Notion-Leitfaden](https://app.notion.com/p/425d60e0a75c81ba966ff9e9b16c6087).
2. `npm run build` ausführen. Fehler im Frontmatter, im Dateinamen (Muster und Datum), beim Ordner/`lang` und im FAQ-Abschnitt brechen den Build ab. Fehlt `## FAQ`, gibt es eine Warnung.
   Aufbau am Ende: `… ## Was das für dich heißt`, `## FAQ`, `## Quellen` (Markdown-Liste mit Links). Die Quellen stehen zusätzlich im Frontmatter `sources` (Pflicht, nur für Schema.org-`citation` und Meta). Die Beitragsseite rendert diese Liste nicht noch einmal.
3. Pull Request öffnen. Der Merge auf `main` veröffentlicht den Beitrag.

Neue Kategorie: ein Eintrag in `src/lib/categories.ts`. Schema, Navigation, Kategorie-Seite und RSS ziehen nach. Neues Topic: ein Eintrag in `src/lib/topics.ts`.

## Struktur

```text
astro.config.ts                 Site, i18n (/de/), Sitemap, Shiki (github-dark)
src/config/site.ts              GA4-Measurement-ID (PUBLIC_GA4_ID)
src/content.config.ts           Collection news (zod-Schema, Fixture-Schalter)
src/content/news/de/            Beiträge (leer, nur .gitkeep)
src/lib/categories.ts           Kategorien (Slug, Label, Kurzbeschreibung)
src/lib/topics.ts               Topic-Tags
src/lib/faq.ts                  FAQ-Parser und FAQPage-JSON-LD
src/lib/news-meta.ts            Dateiname, Datum, ISO-Kalenderwoche
src/lib/news.ts                 Beiträge laden und prüfen
src/lib/jsonld.ts               NewsArticle-JSON-LD
src/i18n/                       Sprachen und UI-Texte
src/layouts, src/components     Layout, Header, Footer, Karten, Consent-Banner
src/styles/                     tokens/base/components aus AgentUnit, site.css, fonts.css
src/pages/[lang]/               Start, news/, kategorie/, themen/, impressum, datenschutz, rss.xml
src/pages/index.astro           leitet / auf /de/ um
tests/                          node:test-Tests und Fixtures (tests/fixtures/news/de)
scripts/check-links.mjs         interner Linkcheck
docs/beitrag-vorlage.md         Vorlage und Regeln für die Redaktion
public/CNAME                    ttm.agentunit.com
```

| Seite | Adresse |
| --- | --- |
| Start | `/de/` |
| Beitrag | `/de/news/<slug>/` |
| Kategorie | `/de/kategorie/<slug>/` (`analytics-und-tracking`, `ki`, `seo-geo`) |
| Themen | `/de/themen/` und `/de/themen/<topic>/` |
| Impressum, Datenschutz | `/de/impressum/`, `/de/datenschutz/` |
| RSS | `/de/rss.xml` und `/de/kategorie/<slug>/rss.xml` |
| Sitemap | `/sitemap-index.xml` |

Jeder Beitrag trägt NewsArticle-JSON-LD und, wenn ein `## FAQ`-Abschnitt vorhanden ist, FAQPage-JSON-LD. Der FAQ-Abschnitt endet an der nächsten `## `-Überschrift, die Quellen landen also nicht im FAQ-Markup.

## Fixtures

Die drei Testbeiträge unter `tests/fixtures/news/de/` (je eine Kategorie, eine Eilmeldung, zwei Wochen-Updates, alle als „Beispiel“ markiert) lädt die Collection nur mit `TTM_FIXTURES=1`, also über `npm run build:fixtures` und `npm run dev:fixtures`. In diesem Modus ersetzen sie die echten Beiträge. `npm run build` und der Deploy-Workflow veröffentlichen sie nie.

## Google Analytics 4 und Consent

Die Measurement-ID kommt aus `PUBLIC_GA4_ID` (lokal in `.env`, siehe `.env.example`; im Deploy aus der Repository-Variable `PUBLIC_GA4_ID`). Sie ist öffentlich und kein Secret.

- Leer (Standard): kein Banner, kein Google Analytics, kein Request an Google.
- Gesetzt: Opt-in-Banner mit gleichwertigen Schaltflächen „Akzeptieren“ und „Ablehnen“. `gtag.js` wird erst nach Zustimmung nachgeladen. Die Entscheidung liegt in `localStorage` (`ttm-consent`). Der Footer-Link „Cookie-Einstellungen“ öffnet das Banner erneut.

## Deployment

- `.github/workflows/ci.yml` (Pull Requests): `npm ci`, `npm test`, `npm run build`, Linkcheck, Fixture-Build, Linkcheck.
- `.github/workflows/deploy.yml` (Push auf `main`): Tests, Build, Linkcheck, Veröffentlichung auf GitHub Pages.

## Einmalige Schritte (Repo-Inhaber)

Der Deploy-Workflow kann erst veröffentlichen, wenn das eingerichtet ist:

1. **Settings → Pages → Build and deployment → Source:** GitHub Actions.
2. **Settings → Pages → Custom domain:** `ttm.agentunit.com` eintragen (`public/CNAME` liegt im Build).
3. **DNS** von `agentunit.com`: CNAME `ttm` auf `mltmllr.github.io`.
4. Nach der Zertifikatsausstellung **Enforce HTTPS** einschalten.
5. Optional für GA4: unter **Settings → Secrets and variables → Actions → Variables** die Variable `PUBLIC_GA4_ID` anlegen.

## Offene Platzhalter

- **GA4-Measurement-ID:** nicht gesetzt, bis `PUBLIC_GA4_ID` konfiguriert ist.
- **Impressum** (`src/pages/[lang]/impressum.astro`) und **Datenschutz** (`src/pages/[lang]/datenschutz.astro`): Inhalte sind mit `[PLATZHALTER: …]` markiert und müssen rechtlich geprüft und ersetzt werden. Beide Seiten sind bis dahin `noindex` und nicht in der Sitemap. Zum Freigeben `noindex` in den Seiten und den Ausschluss in `astro.config.ts` entfernen.
