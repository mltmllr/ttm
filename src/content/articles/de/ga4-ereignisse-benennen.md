---
title: "GA4: Ereignisse und Parameter benennen"
description: "Platzhalter. Was ein Ereignis in Google Analytics 4 ausmacht und wie Namen und Parameter stabil bleiben. Ohne Kennzahlen."
pubDate: "2026-11-12"
lang: de
topics:
  - ga4
sources:
  - title: "Ereignisse einrichten (GA4)"
    url: "https://developers.google.com/analytics/devguides/collection/ga4/events?hl=de"
  - title: "Empfohlene Ereignisse"
    url: "https://developers.google.com/analytics/devguides/collection/ga4/reference/events?hl=de"
draft: false
placeholder: true
translationKey: ga4-event-naming
---

Ein Ereignis in Google Analytics 4 ist ein Aufruf mit einem Namen und, wenn es nötig ist, mit Parametern. Der Name sagt, was passiert ist. Die Parameter sagen, woran sich dieser Fall von einem anderen unterscheidet.

Google führt empfohlene Ereignisnamen und lässt daneben eigene Namen zu. Steht in der Referenz ein Name, der die Handlung trifft, ist er die bessere Wahl: Berichte und spätere Auswertungen kennen ihn schon. Ein eigener Name ist dann richtig, wenn keiner der empfohlenen Namen passt.

## Namen, die stehen bleiben

Ein Ereignisname ist eine Schnittstelle. Wer ihn später ändert, trennt die neue Messung von der alten, auch wenn auf der Seite dieselbe Handlung passiert.

Als Konvention für dieses Magazin, solange ein Artikel sie nicht begründet ersetzt:

- Kleinbuchstaben und Unterstriche, zum Beispiel `generate_lead`.
- Keine Leerzeichen, keine Umlaute, kein Name, der nur in einem Kampagnenmonat stimmt.
- Dieselbe Handlung bekommt immer denselben Namen, unabhängig von der Seite. Welche Seite es war, gehört in einen Parameter.

Das folgende Snippet ist Syntax, kein Messwert. Es setzt absichtlich keinen Wert und keine Währung.

```html
<script>
  gtag("event", "generate_lead", {
    method: "formular",
    form_id: "kontakt"
  });
</script>
```

`generate_lead` steht in der Referenz der empfohlenen Ereignisse. `method` und `form_id` zeigen hier nur die Form eines Parameters. Welche Parameter ein empfohlenes Ereignis vorsieht, steht in derselben Referenz, nicht in diesem Beispiel.

## Parameter

Ein Parameter hat einen Namen und einen Wert. Der Name bleibt stabil, der Wert ändert sich je Fall. In den Wert gehört das, was man unterscheiden will, etwa die Kennung eines Formulars. Nicht hinein gehört etwas, das eine Person direkt bezeichnet, etwa eine E-Mail-Adresse oder ein Name.

Ob ein Parameter in der Property als benutzerdefinierte Dimension oder Metrik registriert werden muss, hängt davon ab, ob er in Berichten auftauchen soll. Das Registrieren ist ein eigener Schritt. Es ist nicht dasselbe wie das Senden des Parameters. Grenzen und Feldnamen stehen in der Entwicklerdokumentation und werden hier nicht nachgeschrieben, weil sie sich ändern.

## Was dieser Text nicht entscheidet

Er richtet keine Property ein, beschreibt keine Einwilligung und ersetzt nicht die DebugView. Er sagt auch nicht, welche Ereignisse eine bestimmte Website senden sollte. Das folgt aus der Handlung, die man verstehen will, und aus dem Eintrag in der Referenz.
