# Umsetzungsplan: Startseite

**Status:** offen
**Mockup:** [assets/homepage-mockup.webp](assets/homepage-mockup.webp)
**Basis-Theme:** Dawn-Fork (`onlysendgoodemails/dawn`)

## Kontext & Ansatz

Die Startseite wird **nicht** aus Dawns generischen Standard-Sections zusammengeklickt, sondern
als Reihe eigener, maßgeschneiderter Custom-Sections gebaut — pixelgenau zum Mockup. Wichtig
dabei: **jeder visuelle Block bekommt eine eigene, kleine Section**, nicht ein großes
Sammel-Modul. Jede Section hat nur die Felder, die wirklich variieren sollen (Text, Bild, ggf.
eine Layout-Option) — Design/Abstände/Typografie sind fest im Code, damit die Optik konsistent
bleibt, ohne dass man sich durch viele Einstellungen klicken muss.

Es gelten zusätzlich die Grundregeln aus [../CLAUDE.md](../CLAUDE.md) (u.a.: neue Dateien statt
Original-Dawn-Dateien ändern, kleine Schritte, geänderte Dateien benennen, kein eigenständiges
Commit/Push).

## Arbeitsweise für neue Chats

Jedes Paket unten wird in einem eigenen, neuen Chat abgearbeitet. Einstieg dafür z.B.:

> "Arbeite Paket 2 aus plans/startseite.md ab."

Nach Abschluss eines Pakets in diesem Dokument den Status auf `erledigt` setzen und kurz
notieren, welche Dateien entstanden sind (siehe Tabelle je Paket).

## Pakete

### Paket 1 — Design-Grundlage
**Status:** erledigt
**Ziel:** Theme-weite Basis, auf der alle folgenden Sections aufbauen.
- Farbpalette (Schwarz/Cream/Beige-Töne wie im Mockup) als Farbschemata in `config/settings_schema.json`
- Serif-Headline-Schrift + Sans-Body-Schrift als Theme-Fonts
- Einheitlicher Button-Stil (schwarz, eckig, wie im Mockup)
- Abstands-/Typografie-Skala für Section-Überschriften ("Eyebrow" + große Headline + Fließtext),
  wie in mehreren Sections wiederkehrend zu sehen
**Abhängigkeiten:** keine — sollte zuerst gemacht werden.
**Entstehende/geänderte Dateien:**
- `config/settings_data.json` (geändert): 6 Farbschemata nach dem "Northern Forest"-Farbkonzept
  angelegt — scheme-1 Arctic White (Seitenhintergrund), scheme-2 Glacier Mist
  (Abschnittswechsel/Details), scheme-3 Forest Green (Editorial/Newsletter, dunkel), scheme-4
  Fjord Navy (Footer/Trust-Bar/primäre Buttons, dunkel), scheme-5 Snow White (Produktflächen),
  scheme-6 Northern Electric (Markenakzent/aktive Zustände). Text/Icons durchgängig Polar Ink.
  Karten-Farbschemata (`card_color_scheme`, `collection_card_color_scheme`,
  `blog_card_color_scheme`) auf scheme-5 (Snow White), `sale_badge_color_scheme` auf scheme-6
  (Northern Electric), `sold_out_badge_color_scheme` auf scheme-3 (Forest Green).
  `type_header_font` auf Serif (`libre_caslon_display_n4`), `buttons_border_thickness` auf 0
  (randlose, flache Buttons).
- `snippets/custom-section-heading.liquid` (neu): wiederverwendbarer Baustein für
  Eyebrow + Headline + Fließtext, den Paket 2–8 einbinden.
- `assets/custom-section-heading.css` (neu): zugehörige Typografie-/Abstands-Skala; muss von
  jeder Section, die das Snippet nutzt, selbst per `stylesheet_tag` eingebunden werden.

**Hinweis zur Prüfung:** Farben/Font/Buttons sind sofort im Theme-Editor sichtbar (z.B. an
Buttons oder der Passwort-Seite). Die Eyebrow/Headline-Komponente selbst wird erst sichtbar,
sobald eine Section aus Paket 2–8 sie einbindet.

**Entscheidung Markenakzent (Northern Electric):** bewusst *nicht* global über
`layout/theme.liquid` eingebunden (würde Golden Rule 1 verletzen), sondern gezielt pro
Element/Section eingesetzt — aktuell z.B. als `sale_badge_color_scheme` (scheme-6). Künftige
Pakete können scheme-6 gezielt für einzelne Buttons/Hover-Effekte nutzen, wo es im Mockup/Konzept
passt.

### Paket 2 — Header + Hero
**Status:** erledigt
**Ziel:** Kopfbereich + erster Bildschirm.

**Abweichung vom ursprünglichen Mockup (auf Wunsch des Nutzers):**
- Header-Layout **nicht** wie im Mockup (Logo links, Icons rechts), sondern nach Vorbild
  [malbon.com](https://malbon.com): Navigation **links**, Logo **mittig**, rechts nur
  **Account- und Warenkorb-Icon** (kein Such-Icon).
- Hero **ohne Slider**: nur ein statisches Vollflächenbild, kein Pfeile/Zähler-UI (Paket war
  ursprünglich als Slideshow geplant, per Anweisung auf Einzelbild reduziert).

**Umsetzung:**
- Header: bestehende Dawn-Grid-Variante "middle-center" (Logo mittig) + Menütyp "dropdown"
  fest im Code verankert (Einstellungen dafür aus dem Schema entfernt, da nicht mehr
  variabel). Such-Icon komplett entfernt. Account- und Warenkorb-Icon unverändert von Dawn
  übernommen (bewusst *keine* Text-Links "ACCOUNT"/"CART", um
  [sections/cart-icon-bubble.liquid](../sections/cart-icon-bubble.liquid) nicht anfassen zu
  müssen — siehe Hinweis unten).
- Hero: eigene, schlanke Section ohne Blocks (direkte Settings statt Heading/Text/Buttons-Blocks),
  Position der Textbox fest unten links, kein Textbox-Hintergrund (Text direkt auf dem Bild),
  Button immer dunkel/schwarz mit hellem Label unabhängig vom gewählten Farbschema (siehe
  `assets/custom-hero.css`).

**Entstehende/geänderte Dateien:**
- `sections/custom-header.liquid` (neu): Kopie von `sections/header.liquid`, Layout auf
  „Navigation links / Logo mittig / Icons rechts" fixiert, Einstellungen `logo_position` und
  `menu_type_desktop` entfernt (nicht mehr wählbar), Suche entfernt.
- `sections/header-group.json` (geändert): `header`-Block nutzt jetzt `"type": "custom-header"`,
  `logo_position`/`menu_type_desktop` aus den Settings entfernt.
- `sections/custom-hero.liquid` (neu): Vollflächen-Bild-Hero ohne Slider/Blocks — Settings:
  Bild, Overlay-Opacity, Farbschema (steuert nur Headline/Text-Farbe), Heading, Text,
  Button-Label + -Link.
- `assets/custom-hero.css` (neu): erzwingt dunklen Button mit hellem Label im Hero, unabhängig
  vom gewählten Farbschema.
- `templates/index.json` (geändert): Dawns Standard-`image-banner`-Section durch `custom-hero`
  ersetzt (Platzhaltertexte, Bild muss im Theme-Editor noch hochgeladen werden).

**Bewusst nicht angefasst:** `sections/cart-icon-bubble.liquid` — hätte für Text-Links
"ACCOUNT"/"CART" direkt angepasst werden müssen (Dateiname ist in mehreren JS-Dateien fest
verdrahtet, keine `custom-`-Kopie möglich). Nutzer hat sich stattdessen für Icons entschieden.
Falls Text-Links später doch gewünscht sind: neue Anfrage/neuer Chat, dann diese Datei bewusst
direkt anpassen (Ausnahme von Golden Rule 1, siehe Diskussion in diesem Chat).

**Hinweis zur Prüfung:** Bild für den Hero im Theme-Editor hochladen (aktuell Platzhalter-SVG,
da `templates/index.json` noch kein Bild referenziert). Menü "main-menu" im Theme-Editor mit den
gewünschten Nav-Punkten (Shop/Our Story/Journal o.ä.) befüllen, falls noch nicht geschehen.

### Paket 3 — Intro-Text + Produktgrid (wiederverwendbar)
**Status:** offen
**Ziel:** Zwei Vorkommen im Mockup: "Featured" und "The Essentials".
- Zentrierte Intro-Text-Section (Eyebrow, Headline, Fließtext)
- Produktgrid-Section: Heading + "Shop All/View All"-Link, 5 Produkte mit Bild, Titel, Preis,
  Farbvarianten-Punkten — als **eine** wiederverwendbare Section gebaut, die zweimal mit
  unterschiedlicher Collection eingesetzt wird
**Abhängigkeit:** Paket 1
**Entstehende/geänderte Dateien:** _wird beim Umsetzen ergänzt_

### Paket 4 — Bild+Text-Section (wiederverwendbar, hell & dunkel)
**Status:** offen
**Ziel:** Zwei Vorkommen im Mockup: "Our Story" (hell) und Promo-Banner (dunkel).
- Bild links/rechts, Textblock mit Eyebrow, Headline, Fließtext, Button
- Farbschema (hell/dunkel) als Einstellung, damit eine Section beide Fälle abdeckt
**Abhängigkeit:** Paket 1
**Entstehende/geänderte Dateien:** _wird beim Umsetzen ergänzt_

### Paket 5 — Icon-Row (USP-Leiste)
**Status:** offen
**Ziel:** 4-spaltige Leiste mit Icon + Label (z.B. Nachhaltigkeit, Versand, weltweit, sicher).
- Schlanke Section, kein Dawn-Pendant vorhanden (Dawns `multicolumn` ist zu "schwer" dafür)
**Abhängigkeit:** Paket 1
**Entstehende/geänderte Dateien:** _wird beim Umsetzen ergänzt_

### Paket 6 — Details-Triptychon
**Status:** offen
**Ziel:** Dreispaltiger Bereich "Details make the difference." (Bild – Text – Bild, asymmetrisch,
teils dunkles Bild links/rechts).
- Prüfen, ob Dawns `collage`-Section als Basis taugt oder eine eigene Section nötig ist
**Abhängigkeit:** Paket 1
**Entstehende/geänderte Dateien:** _wird beim Umsetzen ergänzt_

### Paket 7 — Newsletter-Section
**Status:** offen
**Ziel:** Vollflächiges Hintergrundbild, zentrierter Text, Formular mit **Vorname + E-Mail** +
Button ("Anmelden").
- Basis: Aufbau ähnlich Dawns `email-signup-banner` (hat Hintergrundbild-Setting), zusätzlich
  ein Vorname-Feld ergänzen (in Dawn nativ nicht vorhanden)
**Abhängigkeit:** Paket 1
**Entstehende/geänderte Dateien:** _wird beim Umsetzen ergänzt_

### Paket 8 — Footer
**Status:** offen
**Ziel:** Logo + Beschreibung, Social-Icons, 3 Link-Spalten (Shop/About/Help), Copyright +
Legal-Links unten.
**Abhängigkeit:** Paket 1
**Entstehende/geänderte Dateien:** _wird beim Umsetzen ergänzt_

## Empfohlene Reihenfolge

1 → 2 → 3 → 4 → 5 → 6 → 7 → 8
(Paket 1 ist Voraussetzung für alle anderen; 2–8 sind untereinander unabhängig und könnten auch
in anderer Reihenfolge oder parallel in verschiedenen Chats bearbeitet werden.)

## Nach Fertigstellung aller Pakete

- Sections in `templates/index.json` in der Reihenfolge des Mockups zusammenstellen (das machst
  du selbst im Theme-Editor, sobald die Sections existieren)
- Kurzer visueller Abgleich gegen [assets/homepage-mockup.webp](assets/homepage-mockup.webp)
