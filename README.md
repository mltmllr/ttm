# The Technical Marketer

Ein Magazin über technisches Marketing. Der Zuschnitt ist eng: Google Analytics 4, Google Tag Manager und Looker Studio. Die Seite ist statisch (Astro). Artikel sind Markdown oder MDX im Repository. Oft schreibt ein Bot den Entwurf, ein Mensch gibt ihn per Pull Request frei.

## Lokal starten

Voraussetzung ist Node.js 22.23.4 oder neuer.

```bash
npm install
npm run dev
```

Der Dev-Server liegt auf <http://localhost:4321/> und leitet auf `/de/` um. `npm run dev` zeigt auch Entwürfe (`draft: true`).

```bash
npm run build
npm run preview
```

`npm run build` ist der Maßstab. Entwürfe fehlen in `dist/`. Schemafehler brechen den Build ab.

## Adressen

Deutsch ist `defaultLocale` und wird unter `/de/` ausgeliefert (`prefixDefaultLocale: true` in `astro.config.ts`). `/` leitet auf `/de/` um. Jede Sprache bekommt denselben Präfix. Englisch wäre später `/en/…`, ohne dass die deutschen Adressen umziehen.

Die Pfadsegmente bleiben in allen Sprachen gleich: `artikel`, `themen`, `ueber`. Übersetzt werden die Oberflächentexte und die Inhalte, nicht die Routen. Deshalb braucht eine neue Sprache keine neue Datei unter `src/pages/`.

| Seite | Pfad |
| --- | --- |
| Magazin | `/de/` |
| Artikel | `/de/artikel/<slug>/` |
| Themen | `/de/themen/` und `/de/themen/<thema>/` |
| Über / Impressum | `/de/ueber/` |
| RSS | `/de/rss.xml` |
| Sitemap | `/sitemap-index.xml` |

Kanonische URLs, Open Graph, `hreflang` und die Sitemap zeigen auf `https://ttm.agentunit.com`. Es gibt keinen `base`-Pfad: die Site hängt an der Domain, nicht unter `/ttm/`.

## Artikel hinzufügen

1. `templates/artikel.md` nach `src/content/articles/<lang>/<slug>.md` kopieren. `.mdx` geht genauso, wenn Komponenten nötig sind. Für normalen Text reicht Markdown.
2. Frontmatter ausfüllen. Der Dateiname ist der Slug: klein, ASCII, Bindestriche. `ga4-ereignisse-benennen.md` wird zu `/de/artikel/ga4-ereignisse-benennen/`.
3. Der Ordner muss `lang` entsprechen. `lang: de` liegt unter `src/content/articles/de/`.
4. `draft: true` lassen, bis ein Mensch den Text freigibt. Dann `draft: false`.
5. `placeholder: true` nur für Beispieltexte. Beim echten Artikel entfernen oder auf `false` setzen. Die Seite zeigt dann den Hinweis „Platzhalter“.
6. `npm run build` muss durchlaufen.

`draft` ist Pflicht und hat keinen Default. Fehlt es, schlägt der Build fehl, statt den Text still zu veröffentlichen.

### Felder

| Feld | Pflicht | Bedeutung |
| --- | --- | --- |
| `title` | ja | Überschrift. |
| `description` | ja | Kurztext für die Liste, RSS und die Meta-Description. |
| `pubDate` | ja | Kalenderdatum, `YYYY-MM-DD`, in Anführungszeichen. |
| `updatedDate` | nein | Nur setzen, wenn der Text danach geändert wurde. |
| `lang` | ja | Muss ein Schlüssel aus `src/i18n/locales.ts` sein und zum Ordner passen. |
| `topics` | ja | Mindestens eins von `ga4`, `gtm`, `looker-studio`. |
| `sources` | ja | Liste aus `{ title, url }`. `url` ist `http` oder `https`. Darf leer sein, ein echter Artikel sollte zitieren. |
| `draft` | ja | `true` blendet den Artikel im Production-Build aus. |
| `placeholder` | nein | Default `false`. `true` markiert ein Beispiel. |
| `translationKey` | ja | Stabiler, sprachneutraler Schlüssel (`kleinbuchstaben-und-bindestriche`). Dieselbe Sache hat in jeder Sprache denselben Schlüssel, auch wenn der Slug abweicht. Pro Sprache nur einmal. |

Keine erfundenen Kennzahlen, Prozente, Benchmarks oder Studien. Was eine Zahl wäre, bleibt ein Verweis auf eine Quelle. Codebeispiele sind Syntax, keine Messergebnisse.

### Vorlage

Die vollständige Datei liegt unter `templates/artikel.md`. Auszug:

````md
---
title: ""
description: ""
pubDate: "2026-11-26"
# updatedDate: "2026-11-26"
lang: de
topics:
  - ga4
  # erlaubt: ga4, gtm, looker-studio
sources:
  - title: "Titel der Quelle"
    url: "https://example.com/dokumentation"
draft: true
placeholder: true
translationKey: kurzer-stabiler-schluessel
---

Der erste Absatz sagt, worum es geht.
````

Eine Übersetzung ist eine neue Datei in der anderen Sprache mit demselben `translationKey`. Der Slug darf anders sein. `hreflang` verknüpft die Fassungen über diesen Schlüssel. Die Sprachumschaltung erscheint, sobald eine zweite sichtbare Fassung existiert.

## Sprache hinzufügen

Keine neue Route und keine neue Komponente. Drei Stellen:

1. In `src/i18n/locales.ts` einen Eintrag ergänzen. Das ist die Konfiguration. `astro.config.ts` liest `locales` und `defaultLocale` von dort.

   ```ts
   en: {
     label: 'English',
     hreflang: 'en',
     ogLocale: 'en_US',
   },
   ```

   `defaultLocale` bleibt `de`, solange Deutsch die Hauptsprache ist.

2. In `src/i18n/ui.ts` für `en` dieselben Schlüssel wie unter `de` ausfüllen. Fehlt ein Text, bricht der Build ab.
3. Inhalte anlegen: `src/content/pages/en/ueber.md` und Artikel unter `src/content/articles/en/`.

Danach gibt es `/en/`, `/en/rss.xml` und die `hreflang`-Einträge ohne weitere Verdrahtung. Die Oberflächentexte kommen nur aus `src/i18n/ui.ts`.

Die Sprachumschaltung im Kopf erscheint, sobald eine Seite mehr als eine Sprache hat. Bei Artikeln nur, wenn eine sichtbare Übersetzung denselben `translationKey` trägt. Eine fehlende Übersetzung wird nicht verlinkt.

Ein neues Thema ist ein Wert in `src/lib/topics.ts` plus die Schlüssel `topic.<id>` und `topic.<id>.description` in `ui.ts`.

## Aufbau

```text
src/content.config.ts          Sammlung articles und pages
src/content/articles/<lang>/   Artikel
src/content/pages/<lang>/      Über-Seite
src/i18n/locales.ts            Sprachen
src/i18n/ui.ts                 Oberflächentexte
src/pages/[lang]/              ein Satz Seiten für jede Sprache
src/pages/index.astro          leitet / auf die Standardsprache um
templates/artikel.md           Vorlage
public/CNAME                   ttm.agentunit.com
```

Schriften kommen vom System. Es wird nichts von einem Font-Host geladen. Hell und dunkel folgen `prefers-color-scheme`. Codeblöcke nutzen Shiki (`github-light` / `github-dark`).

## Deployment

Zwei Workflows:

- `.github/workflows/ci.yml` baut bei jedem Pull Request (`npm ci`, `npm run build`).
- `.github/workflows/deploy.yml` baut bei einem Push auf `main` und veröffentlicht mit `actions/upload-pages-artifact` und `actions/deploy-pages`.

`site` in `astro.config.ts` ist `https://ttm.agentunit.com`. `public/CNAME` enthält `ttm.agentunit.com`. Der Build schreibt die kanonischen URLs deshalb auf diese Domain, nicht auf `mltmllr.github.io/ttm`.

## Einmalige Schritte

M M erledigt das einmal in GitHub und beim DNS von `agentunit.com`. Der Workflow kann erst veröffentlichen, wenn die Pages-Quelle auf GitHub Actions steht.

1. Im Repository **Settings → Pages → Build and deployment** bei **Source** **GitHub Actions** wählen.
2. Ebenfalls unter **Settings → Pages** als **Custom domain** `ttm.agentunit.com` eintragen und speichern. Die Datei `public/CNAME` liegt im Build, GitHub übernimmt eine Domain bei einem Actions-Deploy aber nicht zuverlässig allein aus dieser Datei. Die Domain im Repository einzutragen, bevor der DNS-Eintrag existiert, ist auch der von GitHub empfohlene Schutz davor, dass jemand anderes die Subdomain belegt.
3. Beim DNS von `agentunit.com` einen **CNAME** `ttm` auf `mltmllr.github.io` setzen.
4. Sobald das Zertifikat ausgestellt ist, unter **Settings → Pages** **Enforce HTTPS** einschalten.

Bis Domain und Zertifikat stehen, kann die Aktion schon bauen. Aufrufbar ist die Site unter der endgültigen Adresse erst danach.
