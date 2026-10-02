# Umsetzungsplan: Startseite v2 (Kategorie-Aufbau)

**Status:** in Arbeit (Paket A + B erledigt; Badges/Unterzeile am Schluss)
**Referenz:** Desktop-PDF + Mobile-PNG vom 2026-10-02 (Prototyp, enthält ein paar Darstellungsfehler:
Hamburger-Icon direkt neben dem Logo, Shirts-Textfläche vom Sticky-Balken verdeckt, im PDF
doppelte Abschnitte — nicht übernehmen).
**Vorgänger:** [startseite.md](startseite.md) (Pakete 1–8, erledigt)

## Ausgangslage & Ziel

Nur 8–12 Produkte und wenige Kategorien → die Startseite wird zur Shop-Seite: Kategorien
untereinander statt Mega-Menü. Arbeitsweise wie gehabt: pro Paket ein neuer Chat, nur `custom-`
Dateien, kein Commit/Push durch Claude (siehe [../CLAUDE.md](../CLAUDE.md)).

Zielreihenfolge der Startseite:
1. Ticker-Bar (Announcement-Bar, unverändert)
2. Header: 4 dezente Links links, Logo mittig, Account + Warenkorb rechts, kein Dropdown/Mega-Menü
3. Hero, Vollbild (Mobil bereits 100svh abzüglich Header-Gruppe; Desktop noch nachziehen)
4. Branding-Text (`custom-intro-text`, nur Inhalt pflegen)
5. Navigation sticky (+ optional mobile Tab-Leiste unter dem Header)
6. + 7. je Kategorie: Split (Text links, Bild rechts) + Produktliste darunter
8. Brand-Teaser (`custom-image-text`, Bild links / Text rechts) + Icon-Row
9. Newsletter + Footer unverändert

## Pakete

### Paket A — Navigation + Sticky-Header
**Status:** erledigt
- Flache Desktop-Navigation (nur Ebene 1, keine Dropdowns), dezente Typografie (12px, Versalien,
  gesperrt). Mobil bleibt der Dawn-Drawer.
- Header dauerhaft sticky; Anker-Sprünge landen unter dem Header (`scroll-padding-top`), sanftes
  Scrollen nur ohne `prefers-reduced-motion`.

**Dateien:**
- `snippets/custom-header-menu.liquid` (neu)
- `assets/custom-header-menu.css` (neu)
- `sections/custom-header.liquid` (geändert): rendert `custom-header-menu` statt
  `header-dropdown-menu`, lädt das CSS, Scroll-Offset für Anker
- `sections/header-group.json` (geändert): `sticky_header_type` von `on-scroll-up` auf `always`

**Im Shopify-Admin (Nutzer):** Navigation → `main-menu` auf die 4 Punkte reduzieren, keine
Unterpunkte. Für Anker-Navigation als URL `/#shirts`, `/#sweatshirts-hoodies`, `/#caps-beanies`
eintragen (funktioniert auch von anderen Seiten aus). Im Theme-Editor prüfen, dass der Header
"Sticky: Immer" zeigt (Editor-Stand kann den JSON-Wert überschreiben).

### Paket B — Kategorie-Block (neue Section)
**Status:** erledigt (ohne Badge/Unterzeile — Badges bewusst als letzter Punkt vertagt)
**Neu:** `sections/custom-category-block.liquid` + `assets/custom-category-block.css`
**Umsetzung:** Karte = bestehendes `snippets/custom-product-card.liquid` (unverändert), Layout
im Block per CSS überschrieben (Titel + Preis in einer Zeile, Farbpunkte als Zeile darunter).
Karten-Basis-CSS kommt aus `custom-product-grid.css`. Split 50/50 und Produktliste liegen im
selben `page-width`-Container (gleiche Breite). Desktop 3 Spalten (Setting `columns_desktop`:
3 oder 4), mobil 2; Karten-Bild 4:5 Hochformat (zugeschnitten, `object-fit: cover`). Keine
Trennlinie, stattdessen viel Abstand (7rem mobil / 12rem Desktop). Hintergrund `#f7f6f2` und
Textfläche `#e5e8e5` als Farb-Settings der Section (kein Theme-Farbschema), Überschrift per
`font_picker` (Default Lora, Regular). Anker-ID über Setting `anchor_id`.
Noch nicht in `templates/index.json` eingebaut (Paket D).
- Eine Section pro Kategorie: Anker-ID (z.B. `shirts`), Überschrift, Kurztext, Bild, Collection,
  Anzahl Produkte, Farbschema der Textfläche.
- Oben Split: Textfläche links (Überschrift Serif + Kurztext, vertikal mittig, linksbündig),
  Bild rechts; mobil untereinander (Bild oben, Text darunter).
- Darunter Produktliste: 4 Spalten Desktop (linksbündig auffüllen, nicht strecken), 2 mobil;
  Karte laut Prototyp: Badge oben links (Linienname, z.B. RÅ/GRAN/FJÄRA), Titel + Preis in einer
  Zeile, darunter Unterzeile (Farbe · Print-Detail). Badge/Unterzeile aus Metafeldern oder
  Tags — vor Umsetzung entscheiden.
- Trennlinie zwischen den Kategorien, Abstand oben = `scroll-padding` des Headers beachten.

### Paket C — Mobile Tab-Leiste (optional)
**Status:** offen
**Neu:** `sections/custom-category-nav.liquid`: horizontal scrollbare, sticky Leiste unter dem
Header (nur < 990px), Blöcke = Label + Anker, aktiver Punkt per IntersectionObserver.
Nur bauen, wenn der Drawer allein mobil zu umständlich ist.

### Paket D — Startseite zusammensetzen
**Status:** offen
- `templates/index.json`: Reihenfolge Hero → Intro-Text → Kategorie-Blöcke → Brand-Teaser
  (`custom-image-text`) → Icon-Row → Newsletter; `featured_grid`, `details_triptych`,
  `essentials_grid` entfallen (Sections bleiben als Dateien erhalten).
- Hero Desktop auf Vollbild ziehen (`assets/custom-hero.css`, analog zur Mobil-Regel).
- Inhalte (Texte, Bilder, Collections) im Theme-Editor pflegen.
