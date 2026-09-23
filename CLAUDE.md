# Custom Shopify Theme (basierend auf Dawn)

Dieses Theme ist ein Fork von Shopify Dawn (`upstream` = `Shopify/dawn`), verbunden mit dem
Shopify-Store über die GitHub-Theme-Integration (`dawn/main`). Ziel: Jederzeit updatefähig
gegenüber neuen Dawn-Versionen bleiben.

## Goldene Regeln für jede Änderung

1. **Nie Original-Dawn-Dateien direkt inhaltlich ändern.** Vor einer Änderung an einer
   bestehenden Datei (sections/, snippets/, templates/, assets/, locales/, …) erst eine Kopie
   mit Präfix `custom-` anlegen (z.B. `sections/main-product.liquid` →
   `sections/custom-product.liquid`) und nur dort arbeiten. Referenzen in JSON-Templates
   entsprechend auf die neue Datei umstellen.
   - Ausnahme: Bugfixes an einer bereits existierenden `custom-`-Datei.
   - Bei Unsicherheit, ob eine Änderung ohne Anfassen der Originaldatei möglich ist: nachfragen,
     nicht stillschweigend gegen diese Regel verstoßen.

2. **Kleine, einzeln testbare Schritte.** Eine Anfrage = eine überschaubare, in sich
   abgeschlossene Änderung. Keine "mach das ganze Theme neu"-Aufgaben in einem Rutsch.

3. **Nach jeder Änderung klar benennen, welche Datei(en) geändert wurden** (Pfad angeben), damit
   der Diff in GitHub Desktop leicht nachvollziehbar ist.

4. **Kein eigenständiges `git commit` / `git push` durch Claude.** Commit und Push macht der
   Nutzer bewusst über GitHub Desktop (dort reicht ein Klick, Zugangsdaten sind dort bereits
   hinterlegt — command-line Git in Claudes Sandbox hat keinen Zugriff auf GitHub-Credentials).
   `dawn/main` ist in Shopify ohnehin nur als Theme-Entwurf verbunden (nicht live, siehe Setup
   unten), ein Push aktualisiert also nur die Vorschau — aber der manuelle Schritt bleibt beim
   Nutzer.

## Setup: Shopify-Store ↔ GitHub ↔ Live-Theme

Es gibt bewusst zwei getrennte Theme-Stände in Shopify, damit ein Push nie versehentlich live
geht:

- **`dawn/main`** (unter "Theme-Entwürfe" in Shopify): dauerhaft mit diesem GitHub-Branch
  verbunden. Das ist der Arbeitsstand — hier landet jeder Push, testbar über die
  Shopify-Vorschau. Wird **nie** direkt veröffentlicht.
- **Live-Theme**: eine von `dawn/main` erstellte, **entkoppelte Kopie** (keine GitHub-Verbindung
  mehr) — das ist das, was Kunden sehen.

### Go-Live-Workflow (macht der Nutzer manuell im Shopify-Admin, nicht Claude)

1. Änderungen in `dawn/main` über die Shopify-Vorschau testen.
2. Wenn der Stand passt: `dawn/main` → "..." → "Duplizieren". Die Kopie hat keine
   GitHub-Verknüpfung mehr.
3. Kopie sinnvoll mit laufender Nummer umbenennen (z.B. "Northern Links v3").
4. Kopie veröffentlichen ("Veröffentlichen") — das wird das neue Live-Theme.
5. `dawn/main` bleibt unverändert als Entwicklungstheme für die nächste Runde bestehen.

## Update-Workflow (wenn Shopify eine neue Dawn-Version veröffentlicht)

- Auf GitHub.com im Fork auf "Sync fork" → "Update branch" klicken (zieht Shopify/dawn-Änderungen
  in den Fork; der verbundene Theme-Entwurf `dawn/main` aktualisiert sich automatisch).
- Danach lokal in GitHub Desktop "Fetch origin" → "Pull origin", damit dieser Ordner aktuell ist.
- Bei Merge-Konflikten (sollte dank Regel 1 selten vorkommen): den Nutzer informieren und den
  Konflikt über Git direkt auflösen.
