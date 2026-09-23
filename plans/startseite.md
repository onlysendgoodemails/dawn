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
**Status:** in Arbeit (ein offener Punkt, siehe unten)
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

**Offener Punkt (noch nicht gelöst, für später gemerkt):** Trustbar (Announcement-Bar) und Footer
zeigen in der Live-Vorschau noch nicht die richtigen Farben (Footer wirkt blau statt grün,
Trustbar wirkt schwarz statt Fjord-Navy). Im Code/Repo ist es zweifach geprüft korrekt gesetzt:
- `sections/footer-group.json` → footer `color_scheme`: `scheme-3` (Forest Green `#1F382C`)
- `sections/header-group.json` → announcement-bar `color_scheme`: `scheme-4` (Fjord Navy `#0E2B38`)

`git status` zeigt `main` exakt auf Stand von `origin/main` — der Fix ist also gepusht. Nutzer
bestätigt, im richtigen (aktuellen, GitHub-verbundenen) Theme zu schauen, da die Hero-Bild-Anpassungen
dort sichtbar ankommen. Farb-Änderungen an Footer/Trustbar kommen dort aber (noch) nicht an, obwohl
andere Änderungen (Hero) im selben Zeitraum sehr wohl durchschlagen — das schließt einen reinen
"falsches Theme"-Fehler eher aus. Mögliche nächste Schritte für eine künftige Session:
- Prüfen, ob `footer`/`announcement-bar` evtl. per Shopify-Theme-Editor-Autosave wieder auf alte
  Werte zurückgeschrieben wurden (Race Condition zwischen GitHub-Push und offener
  Editor-Session) — dazu `sections/footer-group.json`/`header-group.json` im Theme-Editor direkt
  gegenchecken, nicht nur im Git-Repo.
- Prüfen, ob es einen CSS-Spezifitäts-/Kaskaden-Bug gibt, der `color-scheme-3`/`color-scheme-4`
  auf `.utility-bar`/Footer überschreibt (bisher nicht tief genug untersucht).
- Ggf. Screenshot/Live-URL vom Nutzer anfordern, um selbst per Browser zu prüfen statt nur den
  Code zu lesen.

**Update (2026-09-23), Screenshot-Auswertung Theme-Einstellungen → Farben → Schemata:**
Pixelgenaue Analyse eines vom Nutzer geschickten Screenshots der Schemata-Kartenübersicht zeigt:
- Nur **5 Farbschema-Karten** sichtbar (plus "Schema hinzufügen"-Button) statt der 6 in
  `config/settings_data.json` definierten Schemata.
- Die Farbtöne der sichtbaren Karten passen nicht zum Northern-Forest-Konzept: Karte 2 zeigt
  neutrales Grau (`#f3f3f3`/`#ebebeb`) statt des blaugrauen `#DCE8EC` (scheme-2 Glacier Mist);
  Karte 3 zeigt ein dunkles Blaugrau (`#252832`) statt des Waldgrüns `#1F382C` (scheme-3 Forest
  Green); Karte 4 zeigt reines Nahezu-Schwarz (`#121212`) statt des Navy-Tons `#0E2B38`
  (scheme-4 Fjord Navy).

Das bestätigt: Was im Theme-Editor unter "Theme-Einstellungen → Farben" zu sehen ist, stimmt
**nicht** mit `config/settings_data.json` in diesem Repo überein — weder Anzahl noch Farbwerte
passen.

**Nutzer hat per Screenshot bestätigt:** Es ist tatsächlich `dawn/main` geöffnet (Theme-Entwürfe
zeigt "dawn/main", GitHub-Icon, "Zuletzt gespeichert: 12:54", Version 16.0.0) — die "falsches
Theme"-Theorie ist damit widerlegt.

**Ursache gefunden (Abgleich mit Git-Historie):** Die 5 im Screenshot sichtbaren Farbwerte
(`#FFFFFF`, `#F3F3F3`, `#242833`, `#121212`, `#334FB4`) sind **exakt** die 5 Default-Farbschemata
von Stock-Dawn 16.0.0 vor der Paket-1-Anpassung (Commit `258f00f6`, zu sehen via
`git show 258f00f6:config/settings_data.json`) — nicht nur ähnlich, sondern identisch bis auf
minimale JPEG/Screenshot-Rundung. `git log`/`git status` bestätigen: Paket 1 (Commit `7801397f`)
ist Teil der Historie von `origin/main`, der lokale Stand ist "up to date with origin/main" — der
Push ist also nachweislich passiert. Das Repo/GitHub hat die richtigen 6 Northern-Forest-Schemata;
Shopify zeigt trotzdem die alten 5 Stock-Werte.

**Wahrscheinlichste Erklärung:** Race Condition zwischen Git-Push und einer offenen
Theme-Editor-Session, wie schon oben vermutet — der Theme-Editor autosaved beim Öffnen/Bearbeiten
der Theme-Einstellungen offenbar seinen eigenen (alten, im Browser zwischengespeicherten) Stand
zurück nach Shopify und überschreibt damit lokal, was der GitHub-Push gerade reingebracht hat.
Das ist ein reiner Shopify-Editor-Effekt, betrifft nur die Live-Kopie der Datei bei Shopify, nicht
das Git-Repo selbst (git bleibt korrekt).

**Empfohlener nächster Schritt für den Nutzer:**
1. Alle offenen Tabs/Fenster mit dem `dawn/main`-Theme-Editor schließen.
2. Kurz warten, dann den Theme-Editor frisch neu öffnen (harter Reload, kein Tab-Wiederherstellen)
   und direkt zu Theme-Einstellungen → Farben gehen, **ohne** vorher etwas zu ändern.
3. Zeigt es dann immer noch die 5 Stock-Werte: erneut pushen (z.B. eine minimale Änderung an
   `config/settings_data.json` committen/pushen, um den Sync zu erzwingen) und den Editor **nicht**
   öffnen, bevor der Sync durchgelaufen ist.
4. Danach gegenchecken, ob Footer/Trustbar (der ursprüngliche Auslöser dieses offenen Punkts) jetzt
   die richtigen Farben zeigen.

### Paket 3 — Intro-Text + Produktgrid (wiederverwendbar)
**Status:** erledigt (eine Instanz der Produktgrid-Section im Template; zweite Instanz "The
Essentials" folgt, siehe Hinweis unten)
**Ziel:** Zwei Vorkommen im Mockup: "Featured" und "The Essentials".
- Zentrierte Intro-Text-Section (Eyebrow, Headline, Fließtext)
- Produktgrid-Section: Heading + "Shop All/View All"-Link, 5 Produkte mit Bild, Titel, Preis,
  Farbvarianten-Punkten — als **eine** wiederverwendbare Section gebaut, die zweimal mit
  unterschiedlicher Collection eingesetzt wird
**Abhängigkeit:** Paket 1

**Umsetzung:**
- Intro-Text: eigene, schlanke Section, nutzt das aus Paket 1 stammende Snippet
  `custom-section-heading` mit `alignment: 'center'` — kein eigener Text-Kram doppelt gebaut.
- Produktgrid: eigene Section mit Settings für Collection, Heading, "View all"-Label und
  Produktanzahl (Default 5) — Spaltenzahl/Abstände/Kartendesign sind fest im Code (Mobile 2,
  Tablet 3, Desktop 5 Spalten), damit beide Vorkommen ("Featured"/"The Essentials") optisch
  identisch bleiben und nur Collection + Texte variieren.
- Produktkarte als eigenes Snippet: Bild (Hintergrund nutzt das globale Theme-Setting
  `card_color_scheme`, aktuell scheme-5 Snow White — siehe Paket 1), Titel, Preis (über Dawns
  `snippets/price.liquid`), sowie Farbvarianten-Punkte über Dawns natives Swatch-Feature
  (`snippets/swatch.liquid`, gleiche Erkennung wie in `snippets/product-variant-picker.liquid`:
  erste Produktoption mit konfigurierten Swatches). Ohne Collection zeigt die Section
  Platzhalter-Karten (wie Dawns eigene `featured-collection`-Section im leeren Zustand).

**Entstehende/geänderte Dateien:**
- `sections/custom-intro-text.liquid` (neu): zentrierte Eyebrow/Headline/Text-Section.
- `sections/custom-product-grid.liquid` (neu): wiederverwendbare Produktgrid-Section
  (Settings: `heading`, `collection`, `products_to_show`, `view_all_label`, `color_scheme`,
  Padding).
- `snippets/custom-product-card.liquid` (neu): einzelne Produktkarte (Bild, Titel, Preis,
  Farbvarianten-Punkte) inkl. Platzhalter-Zustand ohne Produkt.
- `assets/custom-product-grid.css` (neu): Heading-Zeile mit "View all"-Link, Grid-Layout
  (2/3/5 Spalten je Breakpoint), Karten- und Swatch-Styling.
- `templates/index.json` (geändert): Dawns generische Platzhalter-Section `featured-collection`
  ersetzt durch `intro_text` (custom-intro-text) + `featured_grid` (custom-product-grid,
  Heading "Featured", Collection "all", Link "Shop All").

**Offener Punkt / nächster Schritt:** Die zweite Instanz "The Essentials" (gleiche Section,
anderes Heading/"View All"-Label/andere Collection) ist bewusst noch nicht in `templates/index.json`
platziert, weil ihre richtige Position im Layout von den noch fehlenden Paketen 4–6 abhängt
("Our Story", Icon-Row, Details-Triptychon liegen im Mockup dazwischen). Sobald diese Sections
existieren: im Theme-Editor einfach ein zweites Mal "Custom Product Grid" hinzufügen, Heading auf
"The Essentials" und Link-Label auf "View All" setzen, passende Collection wählen — kein weiterer
Code nötig, das ist der Zweck der wiederverwendbaren Section.

**Hinweis zur Prüfung:** Intro-Text und "Featured"-Grid sind über die Shopify-Vorschau direkt
sichtbar (Platzhalter-Produkte, falls noch keine Collection "all" mit Produkten existiert).
Farbvarianten-Punkte erscheinen nur bei Produkten, die Shopifys native Variantenfarben
(Options mit Swatch, z. B. Option "Color" mit hinterlegten Farb-/Bild-Swatches) konfiguriert
haben — ohne das bleibt die Punktreihe leer, das ist erwartet.

### Paket 4 — Bild+Text-Section (wiederverwendbar, hell & dunkel)
**Status:** erledigt (eine Instanz "Our Story" im Template; zweite Instanz Promo-Banner folgt,
siehe Hinweis unten)
**Ziel:** Zwei Vorkommen im Mockup: "Our Story" (hell) und Promo-Banner (dunkel).
- Bild links/rechts, Textblock mit Eyebrow, Headline, Fließtext, Button
- Farbschema (hell/dunkel) als Einstellung, damit eine Section beide Fälle abdeckt
**Abhängigkeit:** Paket 1

**Umsetzung:**
- Eine Section für beide Mockup-Vorkommen: Bild (fixes Seitenverhältnis über
  `.media`-Klasse/`object-fit: cover`) auf 60%, Textblock auf 40% der Breite (Desktop,
  `grid-template-columns: 3fr 2fr`), per Setting `image_position` links/rechts tauschbar. Mobile
  gestapelt (Bild oben, Text unten), unabhängig von `image_position`.
- Textblock nutzt das aus Paket 1 stammende Snippet `custom-section-heading` (Eyebrow, Headline,
  Fließtext — jedes Feld optional/leer lassbar) + eigener Button darunter. Für "Our Story":
  Eyebrow + Headline + Text + Button "Our Story". Für den kompakten Promo-Banner: nur Headline +
  Button (Eyebrow/Text leer lassen), siehe Hinweis unten.
- **Kein Farb-Hack nötig** (anders als beim Hero in Paket 2): Der Button nutzt Dawns normale
  `button button--primary`-Klasse, die ihre Farben automatisch vom umgebenden
  `color-scheme-*`-Wrapper bekommt. Da in `config/settings_data.json` jedes Farbschema
  passende Button-Farben definiert (z.B. scheme-2 Glacier Mist → dunkler Button/helles Label,
  scheme-4 Fjord Navy → heller Button/dunkles Label), kippt der Button automatisch korrekt je
  nach gewähltem Farbschema — exakt das Hell/Dunkel-Verhalten aus dem Mockup.
- Section ist randlos/vollflächig (wie der Hero aus Paket 2, kein `page-width`-Wrapper), da beide
  Mockup-Vorkommen bis an den Viewport-Rand reichen.

**Entstehende/geänderte Dateien:**
- `sections/custom-image-text.liquid` (neu): wiederverwendbare Bild+Text-Section (Settings:
  `image`, `image_position` links/rechts, `color_scheme`, `eyebrow`, `heading`, `text`,
  `button_label`, `button_link`).
- `assets/custom-image-text.css` (neu): Grid-Layout (60/40 Desktop, gestapelt Mobile),
  Innenabstände Textblock, Spalten-Tausch für `image_position: right`.
- `templates/index.json` (geändert): neue Instanz `our_story` (Typ `custom-image-text`) direkt
  nach `featured_grid` eingefügt — Farbschema scheme-2 (Glacier Mist, hell), Bild links,
  Texte/Button-Label passend zum Mockup ("Our Story"). Bild und finaler Button-Link sind im
  Theme-Editor noch zu ergänzen (aktuell Platzhalter-SVG, Link leer).

**Offener Punkt / nächster Schritt:** Die zweite Instanz "Promo-Banner" (dunkles Farbschema, z.B.
scheme-4 Fjord Navy oder scheme-3 Forest Green, nur Headline + Button, kein Eyebrow/Text) ist
bewusst noch nicht in `templates/index.json` platziert — ihre Position im Layout liegt laut
Mockup erst nach "The Essentials"-Grid, kurz vor der Newsletter-Section, und hängt damit von den
noch fehlenden Paketen 5–6 ab. Sobald diese Sections existieren: im Theme-Editor einfach ein
zweites Mal "Custom Image + Text" hinzufügen, dunkles Farbschema wählen, Bild hochladen, nur
Headline ("Lorem ipsum dolor sit amet, consectetur.") + Button-Label ("Learn More") setzen,
Eyebrow/Text-Feld leer lassen — kein weiterer Code nötig, das ist der Zweck der wiederverwendbaren
Section.

**Hinweis zur Prüfung:** "Our Story"-Section ist über die Shopify-Vorschau direkt nach dem
"Featured"-Grid sichtbar (Platzhalter-Bild, da `templates/index.json` noch kein Bild referenziert;
Button verlinkt noch nirgends). Im Theme-Editor testweise `image_position` auf "Right" und
`color_scheme` auf ein dunkles Schema (z.B. Fjord Navy) stellen, um zu prüfen, dass Bild-Seite und
Button-Farbe wie erwartet kippen.

### Paket 5 — Icon-Row (USP-Leiste)
**Status:** erledigt
**Ziel:** 4-spaltige Leiste mit Icon + Label (z.B. Nachhaltigkeit, Versand, weltweit, sicher).
- Schlanke Section, kein Dawn-Pendant vorhanden (Dawns `multicolumn` ist zu "schwer" dafür)
**Abhängigkeit:** Paket 1

**Umsetzung:**
- Eigene, blockbasierte Section (max. 4 Blöcke vom Typ "Icon"), damit Icon + Label im
  Theme-Editor frei befüllt/umsortiert werden können, das 4-spaltige Layout selbst aber fest im
  Code bleibt (Mobile 2 Spalten, ab 750px 4 Spalten).
- Icon-Auswahl nutzt Dawns vorhandenes Icon-Set (`assets/icon-*.svg`, ca. 44 Icons) über dieselbe
  Render-Logik wie Dawns eigene `icon_with_text`-Blöcke: `snippets/icon-accordion.liquid`
  (Icon-Name → `icon-<name>.svg` → `inline_asset_content`). Die Options-Liste im Schema
  referenziert bewusst dieselben `t:`-Übersetzungsschlüssel wie
  `sections/main-product.liquid` (`blocks.collapsible_tab.settings.icon.options__N.label`) —
  kein neues Locale-Wording nötig, mehrsprachig sofort korrekt.
- Icon-Farbe folgt automatisch dem Farbschema der Section (`fill: rgb(var(--color-foreground))`
  auf `.svg-wrapper`, analog zum Button-Verhalten aus Paket 4) — kein Farb-Hack nötig.
- Für "weltweit" gibt es in Dawns Icon-Set kein Globus-Icon; im Preset stattdessen `plane`
  verwendet (nächstliegende Bedeutung für internationalen Versand). Bei Bedarf im Theme-Editor
  auf ein anderes Icon aus der Liste umstellbar.

**Entstehende/geänderte Dateien:**
- `sections/custom-icon-row.liquid` (neu): Section mit Settings `color_scheme`, `padding_top`,
  `padding_bottom` sowie Block-Typ `icon` (Settings `icon` [Select, 44 Optionen + "Keins"],
  `label` [Text]), `max_blocks: 4`.
- `assets/custom-icon-row.css` (neu): Grid-Layout (2 Spalten Mobile, 4 Spalten ab 750px),
  Icon-Größe (2.8rem) inkl. Farb-Vererbung, Label-Typografie.
- `templates/index.json` (geändert): neue Instanz `icon_row` (Typ `custom-icon-row`) nach
  `our_story` eingefügt — Farbschema scheme-1 (Arctic White), 4 Platzhalter-Blöcke (Leaf/Truck/
  Plane/Lock, Label je "Lorem Ipsum").

**Hinweis zur Prüfung:** Icon-Row ist über die Shopify-Vorschau direkt nach der "Our Story"-Section
sichtbar (4 Icons mit Platzhaltertext "Lorem Ipsum"). Im Theme-Editor testweise ein Icon auf
"Keins" stellen (Block bleibt mit nur Label bestehen) sowie `color_scheme` auf ein dunkles Schema
stellen, um zu prüfen, dass Icon- und Textfarbe automatisch mitkippen.

### Paket 6 — Details-Triptychon
**Status:** erledigt
**Ziel:** Dreispaltiger Bereich "Details make the difference." (Bild – Text – Bild, asymmetrisch,
teils dunkles Bild links/rechts).
- Prüfen, ob Dawns `collage`-Section als Basis taugt oder eine eigene Section nötig ist

**Umsetzung:**
- Dawns `collage`-Section wurde bewusst **nicht** als Basis verwendet: Sie ist blockbasiert für
  bis zu 4 gemischte Medientypen (Bild/Produkt/Video) ausgelegt und dafür deutlich zu "schwer"
  für den hier gebrauchten, fest dreispaltigen Aufbau (Bild – Text – Bild) — passend zum
  Projekt-Ansatz aus Paket 1 (kleine, zweckgebundene Sections statt großer Sammel-Module).
- Eigene, schlanke Section ohne Blocks: zwei Bild-Settings (links/rechts) + Text-Settings für
  die mittlere Spalte, Layout/Abstände fest im Code. Bildpixelanalyse des Mockups
  (`plans/assets/homepage-mockup.webp`) bestätigt nahezu exakte Drittelung der Breite → Desktop
  fix auf `grid-template-columns: 1fr 1fr 1fr` (keine Einstellung für asymmetrische Breiten
  nötig). "Asymmetrisch" im Mockup bezieht sich nur auf die Bildmotive selbst (Nahaufnahme
  Rückenpartie vs. Cap), nicht auf die Spaltenbreiten.
- Mittlere Spalte nutzt wie Paket 2–5 das Snippet `custom-section-heading` (Eyebrow "Details",
  Headline "Details make the difference.", Fließtext) plus einen Link mit Pfeil-Icon
  ("Discover Our Products →") — exakt das `link animate-arrow` + `icon-arrow.svg`-Muster aus
  `sections/custom-product-grid.liquid` (kein neuer Link-Stil nötig).
- Bilder nutzen Dawns globale `.media`-Klasse (position:relative + object-fit:cover für
  Kind-Elemente), wie schon in Paket 4 (`custom-image-text`) — keine eigene Crop-Logik nötig.
- "Teils dunkles Bild" ist reine Bildmotiv-Eigenschaft, kein Code-Setting — Farbschema
  (`color_scheme`) steuert ausschließlich Hintergrund/Text der mittleren Spalte, nicht die
  Bilder.
- Mobile: einspaltig gestapelt (Bild – Text – Bild in DOM-Reihenfolge, keine Umsortierung nötig,
  da das bereits der gewünschten Lesereihenfolge entspricht).

**Entstehende/geänderte Dateien:**
- `sections/custom-triptych.liquid` (neu): dreispaltige Section (Settings: `image_left`,
  `image_right`, `color_scheme`, `eyebrow`, `heading`, `text`, `link_label`, `link_url`).
- `assets/custom-triptych.css` (neu): Grid-Layout (1 Spalte Mobile, 1fr 1fr 1fr ab 750px),
  Bild-Mindesthöhen, Innenabstand der Textspalte.
- `templates/index.json` (geändert): neue Instanz `details_triptych` (Typ `custom-triptych`)
  nach `icon_row` eingefügt — Farbschema scheme-1 (Arctic White), Platzhaltertexte passend zum
  Mockup, Bilder im Theme-Editor noch hochzuladen (aktuell Platzhalter-SVG), Link zeigt auf
  `shopify://collections/all` (ggf. im Theme-Editor auf eine spezifischere Collection anpassen).

**Hinweis zur Prüfung:** Triptychon ist über die Shopify-Vorschau direkt nach der Icon-Row
sichtbar (zwei Platzhalter-Bilder links/rechts, Textspalte mit Pfeil-Link in der Mitte). Im
Theme-Editor testweise `color_scheme` auf ein dunkles Schema stellen, um zu prüfen, dass
Textfarbe/Link automatisch mitkippen, ohne die Bilder zu beeinflussen.

### Paket 7 — Newsletter-Section
**Status:** erledigt
**Ziel:** Vollflächiges Hintergrundbild, zentrierter Text, Formular mit **Vorname + E-Mail** +
Button ("Anmelden").
- Basis: Aufbau ähnlich Dawns `email-signup-banner` (hat Hintergrundbild-Setting), zusätzlich
  ein Vorname-Feld ergänzen (in Dawn nativ nicht vorhanden)
**Abhängigkeit:** Paket 1

**Umsetzung:**
- Vollflächiges Bild wie beim Hero aus Paket 2 (`banner`/`banner--large`-Mechanik aus Dawns
  `section-image-banner.css` wiederverwendet), Text zentriert (`banner__content--middle-center`,
  `banner--desktop-transparent` — kein Textbox-Hintergrund, Text direkt auf dem Bild). Eyebrow +
  Headline + Fließtext über das aus Paket 1 stammende Snippet `custom-section-heading`
  (`alignment: 'center'`), `color_scheme` steuert wie beim Hero ausschließlich diese Textfarbe.
- Formular: Dawns natives `{% form 'customer' %}` (wie in `sections/email-signup-banner.liquid`)
  um ein zweites Feld `contact[first_name]` ergänzt — in Dawn nativ nicht vorhanden, aber vom
  zugrundeliegenden `/contact`-Endpunkt (Formular-Typ `customer`) unterstützt, da dieser jedes
  `contact[ATTRIBUT]`-Feld auf das entstehende Customer-Objekt schreibt (offiziell dokumentiert
  ist nur `contact[email]`, s. Hinweis zur Prüfung unten). Vorname-Feld optional (kein
  `required`), E-Mail-Feld wie im Original required + Fehler-/Erfolgsmeldungen 1:1 aus
  `email-signup-banner.liquid` übernommen.
- **Kein neuer Übersetzungsschlüssel nötig:** Vorname-Label/Placeholder nutzt den bereits
  vorhandenen Schlüssel `customer.register.first_name` ("First name"/"Vorname"), E-Mail nutzt
  `newsletter.label` ("Email"/"E-Mail"), Button nutzt `newsletter.button_label`
  ("Subscribe"/"Abonnieren") — exakt wie schon in `email-signup-banner.liquid`, keine
  `locales/*.json`-Änderung nötig (Golden Rule 1: Original-Locale-Dateien unangetastet).
- **Kein Farb-Hack nötig für die Felder/den Button:** Der Wrapper um Felder+Button trägt direkt
  die Klasse `color-scheme-5` (Snow White: weißer Feld-Hintergrund, dunkler Fjord-Navy-Button
  mit hellem Label) — unabhängig vom gewählten `color_scheme` der Section, analog zum
  Hero-Button aus Paket 2, aber über Dawns bestehende Farbschema-Klassen statt hartkodierter
  Hex-Werte gelöst.
- Formular-Zeile (Vorname-Feld, E-Mail-Feld, Button) per eigenem CSS als Reihe (Desktop) bzw.
  gestapelt (Mobile) — die Einzelfelder (`.field`/`.field__input`/`.field__label`) selbst kommen
  unverändert aus Dawns globalem `base.css`, keine eigene Feld-Optik gebaut.

**Entstehende/geänderte Dateien:**
- `sections/custom-newsletter.liquid` (neu): Section mit Settings `image`,
  `image_overlay_opacity`, `color_scheme`, `eyebrow`, `heading`, `text`; Formular fest im Code
  (Vorname + E-Mail + Button, keine weiteren Einstellungen nötig).
- `assets/custom-newsletter.css` (neu): Layout der Formular-Zeile (Reihe ab 750px, gestapelt
  darunter), Innenabstand des Feld-Wrappers.
- `templates/index.json` (geändert): neue Instanz `newsletter` (Typ `custom-newsletter`) nach
  `details_triptych` eingefügt — Farbschema scheme-4 (Fjord Navy, für die Textfarbe über dem
  Foto), Platzhaltertexte passend zum Mockup ("Stay in Touch"-Eyebrow), Bild im Theme-Editor noch
  hochzuladen (aktuell Platzhalter-SVG).

**Hinweis zur Prüfung:** Newsletter-Section ist über die Shopify-Vorschau direkt nach dem
Details-Triptychon sichtbar (Platzhalter-Bild, Vorname- und E-Mail-Feld nebeneinander mit
dunklem "Subscribe"/"Abonnieren"-Button). **Wichtig:** einmal testweise mit einer noch nicht
verwendeten E-Mail-Adresse durch das Formular gehen und danach im Shopify-Admin unter
Kunden prüfen, ob der neu angelegte Kunde tatsächlich mit Vorname gespeichert wurde — das
`contact[first_name]`-Feld auf dem `customer`-Formular ist ein in der Praxis verbreitetes,
aber von Shopify nicht offiziell in der Liquid-Referenz zugesichertes Verhalten. Falls der
Vorname dort NICHT ankommt, wäre ein Umbau auf eine externe Newsletter-App/-Integration nötig,
die eigene Formularfelder unterstützt (kein Liquid-Fix möglich, da rein serverseitiges
Shopify-Verhalten).

### Paket 8 — Footer
**Status:** erledigt
**Ziel:** Logo + Beschreibung, Social-Icons, 3 Link-Spalten (Shop/About/Help), Copyright +
Legal-Links unten.
**Abhängigkeit:** Paket 1

**Umsetzung:**
- Eigene, blockbasierte Section (`custom-footer`) statt Dawns Standard-`footer.liquid`: Dawns
  Footer kann zwar inhaltlich fast alles (Brand-Info-Block, `link_list`-Blöcke, automatische
  Copyright-/Policy-Zeile), aber sein Grid legt alle Spalten gleich breit an. Laut
  Pixelvermessung des Mockups (`plans/assets/homepage-mockup.webp`) ist die Logo-Spalte exakt
  doppelt so breit wie die drei Link-Spalten (`grid-template-columns: 2fr 1fr 1fr 1fr`) — dafür
  war eine eigene Section nötig, passend zum Projekt-Ansatz aus Paket 1 (kleine, zweckgebundene
  Sections statt große Sammel-Module anhand vieler Einstellungen zurechtzubiegen).
- Newsletter-Formular, "Follow on Shop"-Button, Länder-/Sprachauswahl und Zahlungsarten-Icons
  aus Dawns Original-Footer sind bewusst nicht übernommen — keines davon kommt im Mockup vor
  (Newsletter-Anmeldung gibt es bereits als eigene Section, Paket 7).
- Logo/Markenname: gleiche Fallback-Logik wie im Header aus Paket 2 (`settings.logo` aus den
  Theme-Einstellungen, sonst Textwortmarke aus `shop.name`) — kein separates Section-Setting
  fürs Logo, damit Header und Footer immer synchron bleiben, sobald ein Bild-Logo hochgeladen
  wird. Die Textwortmarke ist per `assets/custom-footer.css` bold/großgeschrieben/letter-spaced
  gestylt (`.custom-footer__brand-name`), passend zur "NORTHERN LINKS"-Optik im Mockup.
- Beschreibungstext unter dem Logo: eigenes Section-Setting `text` (Richtext, Platzhalter wie in
  den anderen Paketen).
- Social-Icons: Dawns vorhandenes Snippet `snippets/social-icons.liquid` (liest die globalen
  Theme-Einstellungen `settings.social_*_link`) unverändert wiederverwendet, wie schon in Paket 1
  für die Markenakzent-Entscheidung erwähnt — kein neuer Icon-Kram gebaut.
- 3 Link-Spalten: Block-Typ `link_list` (Heading-Text + Shopify-Menü-Picker), `max_blocks: 3` —
  gleiches Baukasten-Prinzip wie die Icon-Blöcke aus Paket 5. Jede Spalte zeigt die Links des im
  Theme-Editor ausgewählten Menüs (`block.settings.menu.links`), analog zu Dawns eigenem
  `link_list`-Blocktyp.
- Copyright-/Legal-Zeile: eigener, schlanker Nachbau von Dawns `footer__content-bottom`
  (Copyright-Text + `shop.policies`-Schleife für die rechtlichen Links Imprint/Privacy/Terms —
  diese kommen automatisch aus den in Shopify hinterlegten Richtlinien, kein neuer Inhalt nötig).
  Bewusst ohne die "·"-Trennpunkte aus Dawns `.policies`-Klasse, da das Mockup die Links nur mit
  Abstand zeigt, keine Bullets; ohne "Powered by Shopify"-Link (im Mockup nicht vorhanden), dafür
  fester Zusatztext "All rights reserved." (kein passender Dawn-Übersetzungsschlüssel vorhanden,
  daher wie schon andernorts im Theme hartkodierter Platzhaltertext auf Englisch statt einer
  Änderung an den Original-Locale-Dateien).
- Farbschema: `scheme-1` (Arctic White, hell) statt des bisherigen Platzhalterwerts `scheme-3`
  in `footer-group.json` — Pixelvermessung des Mockup-Hintergrunds an mehreren Stellen im
  Footer ergab `#F4F2F0`–`#F8F7F3`, das liegt sehr nah an scheme-1s definiertem Hintergrund
  `#F4F8F8` (siehe Paket 1). Der Footer im Mockup ist damit hell, nicht dunkelgrün wie zuvor in
  `footer-group.json` hinterlegt.

**Entstehende/geänderte Dateien:**
- `sections/custom-footer.liquid` (neu): Footer-Section (Settings: `color_scheme`, `text`,
  `padding_top`, `padding_bottom`; Block-Typ `link_list` mit `heading` + `menu`, `max_blocks: 3`).
  Per `enabled_on.groups: ["footer"]` bewusst nur in der Footer-Gruppe wählbar.
- `assets/custom-footer.css` (neu): Grid-Layout (1 Spalte Mobile, `2fr 1fr 1fr 1fr` ab 750px),
  Wortmarken-Typografie, Link-/Copyright-/Legal-Styling.
- `sections/footer-group.json` (geändert): `footer`-Block nutzt jetzt `"type": "custom-footer"`,
  3 `link_list`-Blöcke vorbelegt (Heading "Shop"/"About"/"Help", Menü noch leer), Farbschema auf
  `scheme-1`, Paddings auf 64/48 gesetzt. Alte, nicht mehr zutreffende Settings
  (`newsletter_enable`, `enable_follow_on_shop`, `enable_country_selector`,
  `enable_language_selector`, `payment_enable`, `show_policy`, `show_social`, `margin_top`)
  entfernt, da sie im neuen Section-Schema nicht mehr existieren.

**Offener Punkt:** Für das vierte Social-Icon im Mockup (sieht nach Spotify/Musik aus) gibt es in
Dawns Icon-Set kein passendes Icon — `snippets/social-icons.liquid` unterstützt nur Facebook,
Instagram, YouTube, TikTok, Twitter/X, Pinterest, Snapchat, Tumblr, Vimeo. Analog zum
Globus/Plane-Workaround aus Paket 5: einfach den am ehesten passenden der 9 vorhandenen Kanäle in
den Theme-Einstellungen unter "Social media" hinterlegen; ein echtes Spotify-Icon wäre nur über
ein neues, selbst gebautes SVG-Snippet möglich (bislang nicht umgesetzt).

**Hinweis zur Prüfung:** Footer ist am unteren Ende jeder Seite in der Shopify-Vorschau sichtbar
(Logo-Textwortmarke, Platzhaltertext, Social-Icons je nach hinterlegten Links, 3 leere
Link-Spalten "Shop"/"About"/"Help", Copyright-Zeile + rechtliche Links). Damit die 3 Spalten
Inhalte zeigen: im Shopify-Admin unter Navigation drei Menüs anlegen (z.B. "Footer – Shop",
"Footer – About", "Footer – Help") und im Theme-Editor je Block unter "Menu" zuweisen. Damit die
Legal-Links (Imprint/Privacy/Terms) erscheinen, müssen unter Shopify-Admin → Einstellungen →
Richtlinien die entsprechenden Seiten hinterlegt sein — ohne das bleibt die Zeile leer (Dawns
übliches Verhalten, kein Bug). Logo im Theme-Editor unter Theme-Einstellungen → Logo hochladen,
falls ein Bildlogo statt der Textwortmarke gewünscht ist.

**Nachtrag — Widerrufs-Link + großer Brand-Schriftzug (auf Wunsch, Vorbild dryll.co):**
- **Widerrufs-/Kündigungs-Link:** statt eines separaten Ghost-Buttons als weiterer Eintrag in der
  unteren Legal-Zeile ergänzt (wie im dryll.co-Screenshot: unauffälliger Text-Link neben
  Impressum/Datenschutz/AGB, kein eigenes Button-Element) — zwei neue Settings
  `cancellation_link_label` (Text, Default "Verträge hier widerrufen") und
  `cancellation_link_url` (URL, noch leer). Der Link erscheint erst, sobald im Theme-Editor eine
  URL hinterlegt ist (zeigt auf die tatsächliche Kündigungs-/Widerrufs-Seite bzw. den
  Self-Service-Flow, sobald diese existiert) — ohne URL bleibt er ausgeblendet, damit kein toter
  Link online geht. **Wichtig:** Das ist nur das Frontend-Element (§ 312k BGB verlangt zusätzlich
  eine funktionierende Kündigungsbestätigungsseite dahinter — die ist hier nicht Teil der
  Theme-Umsetzung).
- **Großer Brand-Schriftzug:** neue, volle Section-Breite (randlos, außerhalb `page-width`)
  zwischen den 4 Spalten oben und der Copyright-Zeile unten — `shop.name` sehr groß (fluid via
  `clamp()`, skaliert mit der Viewport-Breite) und sehr fett (`font-weight: 900`) dargestellt,
  per CSS Uppercase + enger Laufweite. Technik bewusst **ohne SVG/`textLength`-Streckung**
  gewählt: Ein SVG-Textpfad auf exakte Breite zu zwingen hätte bei "Northern Links" (14 Zeichen)
  zu sichtbar gestauchten/verzerrten Buchstaben geführt (anders als beim kurzen "DRYLL" im
  Vorbild) — stattdessen skaliert der Schriftzug natürlich mit und wird bei sehr schmalen
  Viewports/langen Namen einfach sauber am Rand abgeschnitten (`overflow: hidden`).
  Bild-durch-Text-Effekt wie im Vorbild-Screenshot über `background-clip: text` gelöst (ein neues
  optionales Setting `wordmark_image`): mit Bild scheint die Textur durch die Buchstaben, ohne
  Bild bleibt es ein einfarbiger fetter Schriftzug in der Vordergrundfarbe des Farbschemas — beide
  Fälle laufen über denselben CSS-Mechanismus, kein zusätzlicher Code-Pfad nötig.
- **Schriftfamilie bewusst `--font-body-family` (Sans) statt `--font-heading-family`:** Das
  aktuell hinterlegte Heading-Font (`assistant_n4`, siehe unten) hat vermutlich keinen echten
  900er-Schnitt; der Body-Font liefert für dieses dekorative Element ein zuverlässigeres,
  kräftigeres Ergebnis. **Unabhängig davon aufgefallen:** `config/settings_data.json` zeigt aktuell
  `type_header_font`/`type_body_font` beide als `assistant_n4` (Shopify-Standard), nicht wie in
  Paket 1 dokumentiert `libre_caslon_display_n4` für die Headline-Serife — passt zum bereits in
  Paket 2 offen notierten Editor-Sync-Bug (Race Condition zwischen GitHub-Push und offener
  Theme-Editor-Session). Nicht Teil dieser Änderung, aber relevant für eine künftige Session, die
  sich um den offenen Punkt aus Paket 2 kümmert.

**Geänderte Datei (Nachtrag):**
- `sections/custom-footer.liquid`: neue Settings `wordmark_text`, `wordmark_image`,
  `cancellation_link_label`, `cancellation_link_url`; neue Markup-Blöcke für den Schriftzug
  (zwischen Spalten und Copyright-Zeile) und den Widerrufs-Link (in `.custom-footer__legal`).
- `assets/custom-footer.css`: neue Regeln `.custom-footer__wordmark` /
  `.custom-footer__wordmark-text` (fluid Typografie, `background-clip: text`, `@supports`-Fallback
  für ältere Browser ohne `background-clip: text`).

**Korrektur nach erstem Test (1):** Schriftzug lief über die volle Breite hinaus (Overflow).
Ursache: `clamp(4.5rem, 13vw, 18rem)` war an "DRYLL" (5 Zeichen) angelehnt und damit für "Northern
Links" (14 Zeichen inkl. Leerzeichen) deutlich zu groß dimensioniert. Zusätzlich: Schriftzug nutzt
seither das neue Setting `wordmark_text` (Default "Northern Links") statt `shop.name` —
dynamischer Shop-Name im Shopify-Admin ändert den Schriftzug damit nicht mehr, nur der Wert im
Theme-Editor.

**Korrektur nach zweitem Test (2) — Umbau auf SVG:** Der CSS-`clamp()`-Ansatz (feste Höhe,
variable Breite mit Overflow-Risiko) durch inline-SVG ersetzt (Nutzerwunsch: "Höhe passt sich der
Breite an"). Technik: `<svg viewBox="0 0 1000 160">` mit `<text x="0" y="50%" textLength="1000"
lengthAdjust="spacing">` — `lengthAdjust="spacing"` (bewusst *nicht* `spacingAndGlyphs`) streckt
nur die Laufweite zwischen den Buchstaben auf exakt 1000 Einheiten (= volle viewBox-Breite),
verzerrt aber nicht die Buchstabenform selbst wie es `spacingAndGlyphs` bei einem langen
Markennamen tun würde. Das SVG selbst bekommt in `assets/custom-footer.css` nur `width: 100%;
height: auto;` — dadurch skaliert der komplette Schriftzug (inkl. Höhe) proportional zur
viewBox-Seitenverhältnis mit der Breite, exakt wie gewünscht, ohne dass Breite je über den
Container hinauslaufen kann (SVG clippt per Spezifikation automatisch an der viewBox-Grenze,
falls die Schätzung doch mal knapp daneben liegt — sicherer Fallback statt hartem Overflow-Bug wie
zuvor). Bild-Textur-Effekt (`wordmark_image`) weiterhin möglich, jetzt über `<clipPath>` +
`<image clip-path="...">` statt `background-clip: text`.

**Nachtrag — kuratierte Legal-Zeile + Ghost-Button (statt automatischer `shop.policies`):**
Die vorherige automatische `shop.policies`-Schleife (zeigte Shopifys volle Richtlinien-Titel wie
"Datenschutzerklärung", "Kontaktinformationen") durch 4 fest beschriftete, einzeln verlinkbare
Einträge ersetzt — "Datenschutz", "Cookies", "AGB", "Impressum" (exakte Wortwahl auf Wunsch, daher
als fester Text im Code statt als Setting; nur die Ziel-URLs sind Settings:
`privacy_link_url`/`cookies_link_url`/`terms_link_url`/`imprint_link_url`). "Datenschutz" und
"AGB" fallen ohne eigene URL automatisch auf `shop.privacy_policy.url`/`shop.terms_of_service.url`
zurück (Shopifys native Richtlinien-Objekte) — "Cookies" und "Impressum" haben kein Shopify-natives
Pendant und bleiben rein Custom-URL, ausgeblendet bis eine URL hinterlegt ist. Zusätzlich der
Widerrufs-Link aus dem vorherigen Nachtrag von einem reinen Text-Link zu einem echten
**Ghost-Button** gemacht (`custom-footer__cancel-button`: eckige Outline, transparenter
Hintergrund, dezenter Hover-Fill) — Label-Default zu "Bestellung widerrufen" geändert (Setting
`cancellation_link_label` bleibt editierbar, `cancellation_link_url` weiterhin leer bis eine
Ziel-URL gesetzt wird).

**Geänderte Dateien (Korrekturen):**
- `sections/custom-footer.liquid`: Schriftzug-Markup komplett auf `<svg>` umgestellt; Legal-Zeile
  von `shop.policies`-Loop auf 4 feste Links + Ghost-Button umgebaut; neue Settings
  `privacy_link_url`, `cookies_link_url`, `terms_link_url`, `imprint_link_url`; Default von
  `cancellation_link_label` auf "Bestellung widerrufen" geändert.
- `assets/custom-footer.css`: `.custom-footer__wordmark-text` (CSS-Text-Ansatz) entfernt, ersetzt
  durch `.custom-footer__wordmark-svg`; neue Klassen `.custom-footer__legal-group` (Flex-Wrapper
  für Links + Button) und `.custom-footer__cancel-button` (Ghost-Button-Styling).

**Hinweis zur Prüfung (Korrekturen):** Schriftzug sollte jetzt bei jeder Fensterbreite exakt
innerhalb der vollen Breite bleiben (kein horizontales Scrollen mehr). Damit Datenschutz/Cookies/
AGB/Impressum erscheinen: entweder Shopify-Richtlinien unter Einstellungen → Richtlinien pflegen
(deckt Datenschutz/AGB automatisch ab) oder im Theme-Editor unter "Legal" die jeweilige URL direkt
setzen. Ghost-Button erscheint erst mit gesetzter "Ghost-Button URL".

**Hinweis zur Prüfung (Nachtrag):** Schriftzug ist sofort sichtbar (Platzhalter: einfarbiger
"NORTHERN LINKS"-Schriftzug in Textfarbe des Farbschemas). Für den Bild-Effekt im Theme-Editor
unter dem neuen Setting "Texture image" ein Bild hochladen. Für den Widerrufs-Link im
Theme-Editor unter "Legal" → "Cancellation link URL" die Ziel-URL eintragen, sobald die
entsprechende Seite/der Flow existiert.

**Finale Variante (nach Design-Review mit 2 Chat-Entwürfen) — zweizeilig, breite Schrift,
Bild-Clip statt Volltonfarbe:** Nutzer hat sich für "Entwurf B" (zweizeilig: "NORTHERN" über
"LINKS", gleiche Schriftgröße für beide Zeilen, "Northern" bestimmt die Größe) entschieden, dann
noch eine Variante C angefragt (breitere Schrift, Bild scheint statt Volltonfarbe durch die
Buchstaben) — beide vorab als statische HTML-Vorschauen im Chat gezeigt (nicht im Repo), C wurde
final ausgewählt.

- **Layout:** `viewBox="0 0 1000 340"`, zwei `<text>`-Elemente (`y="85"`/`y="255"`, je die halbe
  Höhe), `dominant-baseline="central"`. Zeilenaufteilung per Liquid: `wordmark_text` wird bei
  Leerzeichen gesplittet, erstes Wort = Zeile 1, Rest = Zeile 2
  (`section.settings.wordmark_text | upcase | split: ' '`). Nur Zeile 1 bekommt
  `textLength="1000" lengthAdjust="spacingAndGlyphs"` (zwingt exakte Breite, verhindert
  Overflow wie beim vorherigen einzeiligen Versuch) — Zeile 2 läuft **ohne** `textLength` mit
  identischem `font-size` aus der Stylesheet-Regel, dadurch automatisch schmaler statt
  künstlich gestreckt: genau das geforderte "Northern gibt die Größe vor"-Verhalten. Bei einem
  einzelnen Wort (kein Leerzeichen in `wordmark_text`) bleibt Zeile 2 leer und wird nicht
  gerendert.
- **Schrift:** "Archivo Black" von Google Fonts geladen (`stylesheet_tag`-Filter auf die externe
  Google-Fonts-URL, wie ein normaler Asset-Stylesheet-Include) — bewusst nicht über Shopifys
  Font-Picker-System (`settings.type_header_font`), da es sich um eine einmalige, rein
  dekorative Display-Schrift nur für dieses eine Element handelt, kein theme-weites Setting
  nötig. Deutlich breitere/blockigere Großbuchstaben als das bisherige Body-Font, passend zum
  Wunsch nach "noch breiterer Schrift".
- **Bild-Clip:** Beide `<text>`-Zeilen liegen jetzt gemeinsam in **einem** `<clipPath>`, ein
  einzelnes `<image>` (volle 1000×340-Fläche, `preserveAspectRatio="xMidYMid slice"`) wird
  dadurch geclippt — das Foto läuft als eine zusammenhängende Fläche hinter beiden Zeilen durch,
  nicht zweimal einzeln zugeschnitten.
- **Bild-Quelle:** Vom Nutzer gelieferte Shopify-CDN-URL
  (`cdn.shopify.com/.../LandOfLinks.png`) fest als Default in `assign wordmark_image_url`
  hinterlegt — direkt als `<image href="...">` nutzbar, kein `image_url`-Filter nötig (der ist
  nur für Shopify-`image_picker`-Objekte da, nicht für fertige externe URLs). Das bestehende
  Setting `wordmark_image` bleibt als Override erhalten: sobald im Theme-Editor ein eigenes Bild
  hochgeladen wird, ersetzt das den Default.
- **Padding-Fix:** `.custom-footer__wordmark` trägt jetzt zusätzlich die Klasse `page-width`
  (wie die Spalten-Reihe und die Copyright-Zeile) statt randlos/full-bleed zu sein — behebt den
  gemeldeten Bug, dass der Schriftzug ohne seitlichen Abstand über die Content-Breite
  hinausragte. In `assets/custom-footer.css` dafür `padding: 0 0 4.8rem` auf `padding-bottom:
  4.8rem` reduziert, damit die von `page-width` gesetzten linken/rechten Ränder nicht
  überschrieben werden.

**Geänderte Dateien (finale Variante):**
- `sections/custom-footer.liquid`: Wordmark-Markup auf zwei `<text>`-Zeilen umgebaut, Google-Fonts-
  Include für Archivo Black ergänzt, `wordmark_image_url`-Fallback auf die gelieferte Foto-URL
  gesetzt, `.custom-footer__wordmark` um `page-width` ergänzt.
- `assets/custom-footer.css`: `.custom-footer__wordmark-svg text` auf `Archivo Black`,
  `font-size: 164px` umgestellt (kein `fill` mehr nötig, da Text nur noch als Clip-Geometrie
  dient); `.custom-footer__wordmark` Padding-Shorthand auf `padding-bottom` verengt.

**Hinweis zur Prüfung (finale Variante):** Schriftzug zeigt jetzt direkt das Nutzer-Foto
("Land of Links") durch beide Zeilen hindurch, mit demselben seitlichen Abstand wie die
Spalten-Reihe darüber. Eigenes Bild lässt sich weiterhin im Theme-Editor unter "Giant wordmark"
→ "Texture image" hochladen, um den Default zu ersetzen.

**Korrektur — Bildausschnitt:** `preserveAspectRatio` des `<image>`-Elements von `xMidYMid slice`
(mittig zugeschnitten) auf `xMidYMin slice` geändert, damit der obere Bildbereich (Meer/Dünen)
sichtbar bleibt statt vom mittigen Zuschnitt weggeschnitten zu werden — Crop wird jetzt komplett
von unten weggenommen, nicht mehr zu gleichen Teilen von oben und unten.

## Empfohlene Reihenfolge

1 → 2 → 3 → 4 → 5 → 6 → 7 → 8
(Paket 1 ist Voraussetzung für alle anderen; 2–8 sind untereinander unabhängig und könnten auch
in anderer Reihenfolge oder parallel in verschiedenen Chats bearbeitet werden.)

## Nach Fertigstellung aller Pakete

- Sections in `templates/index.json` in der Reihenfolge des Mockups zusammenstellen (das machst
  du selbst im Theme-Editor, sobald die Sections existieren)
- Kurzer visueller Abgleich gegen [assets/homepage-mockup.webp](assets/homepage-mockup.webp)
