---
title: "Stape 5.23 bringt Multidomain-CMP"
description: "Stape erweitert Consent im sGTM-Container und stoppt neue TikTok Gateways."
date: 2026-11-27
type: wochen-update
category: "Analytics und Tracking"
topics: [stape]
lang: de
sources:
  - title: "Stape Release Notes 5.23"
    url: "https://stape.io/helpdesk/documentation/release-notes"
    date: 2026-11-23
  - title: "Stape Blog: Website tracking and privacy for publishers"
    url: "https://stape.io/blog/website-tracking-and-privacy-for-publishers"
    date: 2026-11-23
  - title: "Stape Blog: WordPress consent management"
    url: "https://stape.io/blog/wordpress-consent-management"
    date: 2026-11-24
---

Wer Stape für serverseitiges Tracking oder als Consent-Banner nutzt, sollte Release 5.23 vom 23. November 2026 kennen, denn es bringt ab dem Business-Plan mehrere Consent-Banner pro sGTM-Container und stoppt das Anlegen neuer TikTok Gateways.

## Multidomain-CMP: eine CMP pro Domain in einem Container

Seit Release 5.23 kannst du in einem sGTM-Container mehrere CMPs anlegen, eine pro Domain. Eine CMP ist die Consent-Management-Plattform, die Einwilligungen speichert und an Tools weitergibt. Neue CMPs legst du aus den Standardeinstellungen an oder kopierst eine bestehende. Die Funktion gibt es ab dem Business-Plan. Relevant ist das für dich, wenn du schon mehrere Websites über einen Container betreibst und Consent dort pro Domain pflegen willst. ([Release Notes 5.23](https://stape.io/helpdesk/documentation/release-notes))

## Consent-Banner: neuer Blocker-Schutz und eigenes CSS

Das Stape-Banner nutzt nicht mehr die öffentlichen Klassen `stape-cmp-*`. Stattdessen erzeugt es für jeden Container eigene Namen. So sollen generische Cookie-Notice-Blocker das Banner nicht mehr ausblenden. Neu ist außerdem ein Feld für eigenes CSS im Consent Builder, angewendet über `window.__stapeCmp.applyCss()`. Für dich zählt: Ein ausgeblendetes Banner fragt keine Einwilligung ab. Wie stark sich der Schutz auf deine Consent-Raten auswirkt, sagt die Quelle allerdings nicht. ([Release Notes 5.23](https://stape.io/helpdesk/documentation/release-notes))

## TikTok Gateway: keine neuen Setups mehr

Stape kündigt das TikTok Gateway ab. Bestehende Gateways kannst du weiter nutzen, neue lassen sich nicht mehr anlegen. Ein Abschaltdatum und eine empfohlene Alternative nennen die Release Notes nicht. Für dich heißt das: Laufende Kampagnen sind nicht betroffen. Für neue Konten oder Kunden mit serverseitigem TikTok-Tracking brauchst du aber einen anderen Weg. ([Release Notes 5.23](https://stape.io/helpdesk/documentation/release-notes))

## WordPress: Einwilligung sauber an GA4 und Ads weitergeben

Die [Anleitung zu Consent und Cookie-Banner in WordPress](https://stape.io/blog/wordpress-consent-management) vom 24. November 2026 zeigt Schritt für Schritt, wie du die Stape-CMP einrichtest und die Einwilligung an GA4, Google Ads und Meta Ads weitergibst. Auf eine Falle weist der Text ausdrücklich hin: In der Stape Conversion Tracking App für WordPress muss „Load GTM with consent“ ausgeschaltet sein. Sonst kann GTM blockiert werden, und das Banner erscheint nicht. Zum Testen empfiehlt Stape den Vorschaumodus in Web- und Server-GTM sowie die Consent-Logs. Relevant ist das für dich, wenn dein Shop oder deine Leadseiten auf WordPress laufen und du Stape nutzt oder einführen willst.

## Publisher-Leitfaden: Datenflüsse prüfen

Der [Leitfaden zu Tracking und Leserprivatsphäre für Publisher](https://stape.io/blog/website-tracking-and-privacy-for-publishers) vom 23. November 2026 ist ein PDF. Du forderst es per Formular mit Vorname, Firma, Arbeits-E-Mail und Jobtitel an. Es enthält vier Leitfragen und fünf Checks für ein Tracking-Audit: welche Tags laufen, welche Daten sie senden und ob das zu deinen Consent-Einstellungen passt. Zielgruppe sind Medienhäuser, Publisher und Agenturen, die solche Kunden betreuen. Für Shops ohne Publisher-Geschäft taugt er eher als Hintergrund für das Gespräch zwischen Marketing, Datenschutz und Technik.

## Was das für dich heißt

- **Tracking (TikTok):** Prüfe in deinen Stape-Konten, ob ein TikTok Gateway läuft. Plane für neue Konten oder Kunden einen anderen Weg ein. Frist: keine, die Quelle nennt kein Abschaltdatum.
- **Consent (mehrere Domains):** Laufen mehrere Websites über einen Container, überlege, ob du pro Domain eine eigene CMP anlegen willst. Voraussetzung ist der Business-Plan oder höher. Den Preis nennt die Quelle nicht. Frist: keine.
- **Consent-Banner:** Hast du das Banner bisher über die Klassen `stape-cmp-*` gestaltet, prüfe die Darstellung. Nutze für Anpassungen künftig das CSS-Feld. Frist: keine bekannt.
- **Kampagnen (WordPress):** Stelle sicher, dass „Load GTM with consent“ in der Stape-App aus ist. Teste dann im Vorschaumodus, ob die Einwilligung bei GA4, Google Ads und Meta ankommt. Frist: keine.
- **Datenschutz:** Die neue Option, „Reject all“ und „Customize“ auszublenden, nutzt du am besten erst nach Rücksprache mit deinem Datenschutz. Ob das zulässig ist, sagt die Quelle nicht. Frist: keine.

## FAQ

### Betrifft mich Stape 5.23?

Ja, wenn du Stape für serverseitiges Tagging oder die Stape-CMP als Consent-Banner nutzt. Die Multidomain-CMP betrifft nur Business-Pläne und höher. Die Abkündigung des TikTok Gateways betrifft alle, die serverseitiges TikTok-Tracking über Stape betreiben oder planen. Laut Release Notes ist das Release am 23. November 2026 erschienen. Regionale Einschränkungen, etwa für Deutschland, nennt die Quelle nicht.

### Wofür genau eignet sich die Multidomain-CMP?

Für Setups, in denen mehrere Websites über einen sGTM-Container laufen. Du legst dann pro Domain eine eigene CMP an, aus den Standardeinstellungen oder als Kopie einer bestehenden. Ob du dadurch Container zusammenlegen kannst und wie weit sich die CMPs je Domain unterscheiden lassen, beschreibt die Release-Note nicht.

### Was kostet das, und in welchem Plan ist es enthalten?

Die Multidomain-CMP gibt es laut Release Notes in Business-Plänen und höher. Was der Business-Plan kostet, nennen die Quellen nicht. Laut WordPress-Anleitung verlangt Stape für die CMP selbst keine separate Lizenzgebühr. Die Aufrufe des CMP-Skripts zählen aber zu deinem Request-Verbrauch. Ob Blocker-Schutz und CSS-Feld in allen Plänen enthalten sind, geht aus dem Eintrag zu 5.23 nicht hervor.

### Was passiert mit meinem bestehenden Stape-Banner?

Das Banner nutzt jetzt pro Container erzeugte Namen statt der öffentlichen Klassen `stape-cmp-*`. Ob eigene Styles oder Skripte, die auf diese Klassen zielten, weiter greifen, lässt die Quelle offen. Prüfe deshalb die Darstellung. Dazu kommen kleinere Optionen: Du kannst die Buttons „Reject all“ und „Customize“ ausblenden. Außerdem zeigt das Banner nur noch die Datenschutz-Kontaktfelder, die die jeweilige Regulierung verlangt. Ob das Ausblenden des Ablehnen-Buttons in deinem Fall zulässig ist, beantwortet die Quelle nicht.

### Laufen bestehende TikTok Gateways weiter, und wie lange?

Ja. Laut Release Notes kannst du vorhandene Gateways weiter nutzen, nur neue lassen sich nicht mehr anlegen. Ein Abschaltdatum nennen die Release Notes nicht. Ob bestehende Gateways dauerhaft laufen, geht aus der Quelle nicht hervor.

### Was nehme ich für neues serverseitiges TikTok-Tracking?

Die Release Notes nennen keinen Ersatz, und auch die anderen Quellen dieser Woche beantworten das nicht. Frag am besten direkt bei Stape nach, bevor du neue TikTok-Kampagnen mit serverseitigem Tracking planst.

### Was muss ich bis wann tun?

Eine harte Frist nennen die Quellen nicht. Bestehende TikTok Gateways laufen weiter, und die Multidomain-CMP ist eine zusätzliche Option. Handlungsbedarf hast du vor allem, wenn du ein neues TikTok Gateway brauchst oder dein Banner über die alten Klassennamen gestaltet hast.

### Reicht ein Cookie-Banner in WordPress, damit GA4 und Ads die Einwilligung beachten?

Nein. Die [Anleitung](https://stape.io/blog/wordpress-consent-management) trennt das klar: Das Banner ist die Oberfläche für die Auswahl. Die CMP speichert die Entscheidung und gibt Signale weiter, etwa an Google Consent Mode v2. Zusätzlich müssen die Tags in GTM die Einwilligung respektieren. Und der Consent-Status sollte gesetzt sein, bevor Events wie `page_view` verarbeitet werden.

### Wie aufwendig ist die Einrichtung der Stape-CMP in WordPress?

Die Anleitung beschreibt acht Schritte: CMP im Stape-Konto anlegen, Integrationen wie Google Consent Mode v2 aktivieren, „Load GTM with consent“ ausschalten, Container-ID prüfen, Datenschutzangaben eintragen, Cookie-Scan übernehmen, Banner gestalten und Web-GTM anpassen. Voraussetzung sind ein aktives Stape-Konto und der Custom Loader Power-up, den Stape als kostenlos beschreibt. Ein zusätzliches Consent-Plugin oder Code auf der Website brauchst du laut Stape nicht. Änderungen im Web-GTM-Container sind aber nötig. Wie lange das dauert, sagt die Quelle nicht.

### Was bedeutet das für den Datenschutz?

Der [Publisher-Leitfaden](https://stape.io/blog/website-tracking-and-privacy-for-publishers) stellt klar: Serverseitiges Tracking kann helfen, Datenweitergaben zu steuern. Es ersetzt aber weder Consent-Management noch rechtliche Prüfung. Laut WordPress-Anleitung speichert die Stape-CMP Consent-Logs drei Jahre lang, gedacht als Nachweis bei Audits. Ob dein Setup damit den Vorgaben der DSGVO entspricht, beantworten die Quellen nicht. Das klärst du mit deinem Datenschutz.

## Quellen

- [Stape Release Notes 5.23](https://stape.io/helpdesk/documentation/release-notes), 23.11.2026
- [Stape Blog: Website tracking and privacy for publishers](https://stape.io/blog/website-tracking-and-privacy-for-publishers), 23.11.2026
- [Stape Blog: WordPress consent management](https://stape.io/blog/wordpress-consent-management), 24.11.2026
