# Morning Steps — Path C Aktivierung

**Datum dieses Dokuments:** 2026-05-12 (overnight build)
**Was du morgens machen musst, damit alles scharf ist:**

---

## 1. Web3Forms Access-Key besorgen (2 Min)

Booking-API ist umgestellt von Cloudflare-Worker auf Web3Forms — keine Account-Setup-Hürde mehr.

1. Öffne https://web3forms.com
2. Trage `opheck@gmx.de` als Empfänger-Email ein (kein Account-Login nötig)
3. Klick "Create Access Key"
4. Du bekommst eine Bestätigungs-Email mit deinem **Access-Key** (langer alphanumerischer String, ~36 Zeichen)
5. Öffne lokal `src/config.ts`
6. Ersetze die Zeile:
   ```ts
   export const WEB3FORMS_ACCESS_KEY = "PLACEHOLDER_PASTE_WEB3FORMS_KEY_HERE"
   ```
   mit:
   ```ts
   export const WEB3FORMS_ACCESS_KEY = "DEIN-ECHTER-KEY-HIER"
   ```
7. `npm run build && git push origin main` → GitHub Pages deployed automatisch (1-2 Min)

**Wie die Site sich VOR diesem Step verhält:** im Booking-Bereich erscheint ein kleines gold-getöntes Banner *"Booking-API noch nicht aktiviert"*, Submit zeigt einen Inline-Fehler mit Direkt-Mail-CTA — kein Submit geht raus, Oskar's Inbox bleibt sauber.

**Wie die Site sich NACH diesem Step verhält:** Banner verschwindet, Submit POSTet zu Web3Forms, Mail kommt bei dir an, Frontend zeigt "Bestätigt." Success-State.

---

## 2. Voyage AI Key (für Overseer Memory-Embeddings — separater Repo, separate Aufgabe)

Das ist NICHT in diesem Repo (Bio-Website). Das ist im Overseer-App-Repo unter `c:\Users\Oskar\Desktop\app_all_plan_succes\oskar-overseer\`. Hat mit der Bio nichts zu tun.

Falls du das auch heute angehst:
- OpenAI-Key (Default per Phase 3 dieses Repos) oder Voyage AI Key besorgen
- In Overseer-Repo `.env`: `OPENAI_API_KEY=sk-...` setzen
- `npx tsx scripts/backfill-memories.ts` ausführen
- Service-Restart als Admin

---

## 3. TikTok / Instagram Bio-Links überprüfen (5 Min)

Wenn die Bio-Domain immer noch `https://oskar778838.github.io/oskar-marketing/` ist: nichts ändern. Falls du in der Zwischenzeit auf eine eigene Domain (`oskarmarketing.de`?) gewechselt bist:

1. TikTok-App → Profil → "Profil bearbeiten" → Website-Feld → neue URL
2. Instagram-App → Profil bearbeiten → Website
3. Twitter/X falls genutzt
4. Linktree falls noch genutzt: auf die neue URL umleiten

---

## Quick-Check nach allen Steps

Wenn du fertig bist, öffne https://oskar778838.github.io/oskar-marketing/ in einem privaten Tab:

- [ ] Hero zeigt "Oskar" + "Marketing" gestapelt asymmetrisch in Cormorant Garamond, KEINE 3D-Spirale mehr
- [ ] Beim Scrollen bleibt der Hero gepinnt für ~1.5 Viewport-Höhen, Wörter driften links/rechts auseinander, fade out
- [ ] Booking-Section: 7 Werktage × 3 Slots, Slot anklickbar, Form erscheint, Submit funktioniert → Success-Animation "Bestätigt."
- [ ] Du bekommst eine `[TERMIN]`-prefixed Email in opheck@gmx.de Inbox

Wenn was nicht stimmt: Browser-Console aufmachen, screenshot, schreib mir.
