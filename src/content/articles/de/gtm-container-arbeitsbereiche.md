---
title: "GTM: Container, Arbeitsbereich, Version"
description: "Platzhalter. Wie ein Web-Container im Google Tag Manager Änderung, Version und Umgebung trennt. Ohne Kennzahlen."
pubDate: "2026-11-18"
lang: de
topics:
  - gtm
sources:
  - title: "Tag Manager für Webseiten"
    url: "https://developers.google.com/tag-platform/tag-manager/web"
  - title: "Arbeitsbereiche"
    url: "https://support.google.com/tagmanager/answer/7059647?hl=de"
  - title: "Umgebungen"
    url: "https://support.google.com/tagmanager/answer/6311518?hl=de"
  - title: "Veröffentlichen, Versionen und Freigaben"
    url: "https://support.google.com/tagmanager/answer/6107163?hl=de"
draft: false
placeholder: true
translationKey: gtm-container-workspace
---

Ein Web-Container im Google Tag Manager ist die Konfiguration, die auf einer Website laufen kann: Tags, Trigger und Variablen. Die Seite lädt das Container-Snippet. Was danach geschieht, steht im Container, nicht im Artikel.

Gearbeitet wird nicht direkt an der laufenden Fassung. Eine Änderung entsteht in einem Arbeitsbereich. Beim Veröffentlichen wird daraus eine Version. Eine Version ist der Stand zu einem Zeitpunkt und lässt sich später nachvollziehen.

## Drei Dinge, die oft ineinander rutschen

| Begriff | Was er ist |
| --- | --- |
| Arbeitsbereich | Die Änderung, solange sie noch nicht veröffentlicht ist. |
| Version | Der festgehaltene Stand dieser Änderung. |
| Umgebung | Das Ziel, in dem eine Version läuft. |

Mehrere Arbeitsbereiche können nebeneinander existieren. Wie viele, hängt vom Konto ab. Die verlinkte Hilfe nennt den aktuellen Rahmen. Dieser Text wiederholt ihn nicht.

Jeder Container hat eine Live-Umgebung. Weitere Umgebungen, etwa für eine Testseite, legt man selbst an. Eine Version, die nur in einer eigenen Umgebung liegt, ist damit nicht live. Die Testseite braucht dafür das Snippet dieser Umgebung, oder jemanden mit dem Vorschaulink.

Die Klicks stehen in den Hilfeartikeln. Sie hier nachzubauen würde nur eine zweite Anleitung ergeben, die beim nächsten Umbau der Oberfläche veraltet.

## Der dataLayer ist die Übergabe

Der Container sieht von der Seite vor allem den `dataLayer`. Eine Handlung, die die Seite melden will, wird dorthin gelegt. Auch das ist Syntax, kein Messwert:

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: "generate_lead",
  form_id: "kontakt"
});
```

Ein Trigger kann auf den Ereignisnamen `generate_lead` hören. Ein Tag kann dann feuern und Variablen aus demselben Push lesen. Ob dieses Tag ein GA4-Ereignis ist, ein anderes Werkzeug oder gar keins, entscheidet die Konfiguration im Container.

## Reihenfolge

Zuerst die Handlung auf der Seite benennen. Dann den Push. Dann Trigger und Tag. Zum Schluss veröffentlichen, und zwar in die Umgebung, die gemeint ist. Die Vorschau zeigt, was der Container auf dieser Seite tun würde. Sie ersetzt nicht die veröffentlichte Version. Ob ein Tag feuern darf, hängt außerdem von der Einwilligung ab. Die beschreibt dieser Text nicht.
