# Active context

## Current focus

Launch desk for `boladedomingo.com`: Sunday football across Brazil, read from São Paulo, in Portuguese.

## Decisions

- Brand: Bola de Domingo. Mark: BD. Category: Football.
- Palette is Sunday sheet, asphalt, clay, and cocoa so the page does not read as the Guanabara bay sheet or the sibling blush, crimson, teal, steel, sage, pine, sand, rose, gold, or chartreuse skins.
- The home layout keeps the desk sections as a sports-news front: utility bar, masthead, ticker, lead, stat strip, cards, league table, asphalt newsletter.
- Praças are editorial places (Largo do Apito, Campinho da Tarde, Areia do Domingo, Terreiro do Apito, Rampa da Tarde, Calçada do Sol), not named clubs and not a player roster.
- Tardes are public stops of the Circuito da Tarde.
- Seleção is context. Taça de Domingo and Circuito da Tarde carry desk-signed scores. Taça de Domingo is not the Brasileirão.
- Rodada da Copa does not enter the Taça de Domingo table.
- Component props use an `I*Props` interface and destructure inside the arrow.
- Code shape follows the sibling desks: derived tables, isolated newsletter client, no `any`, arrow functions only.

## Next

- IndexNow key file only after CMS adds `boladedomingo.com` to `indexNowKeys.ts`. Do not invent a key.

## Recent

- Masthead mark now renders as an inline premium `BD` block in `SiteShell`, so the header no longer depends on `/logo.png` route resolution.

- Google tag `G-2N66EYN8XN` loads from the root layout via `next/script` (`afterInteractive`). Measurement id lives on `site.gaId`. Privacy page names the cookie.

- Resultados rows open `/resultados/[id]`. Fixtures, tables, and signed results now come from the website matches API when the two sides map to praças or tardes. Federation extracts stay off.

- Static descriptors for praças, tardes, and categorias live in `src/data/taxonomy.ts`. Runtime article and fixture content no longer falls back to local seed data.

- SEO/GEO pass on the existing pt-BR desk: sitemap priorities, Google News sitemap, AI crawler allows in robots, richer `llms.txt`, BreadcrumbList, SportsEvent on the calendar, `next/image` for covers, www and locale 308s, error boundaries. No IndexNow key and no extra locales.

- Frontend site contract: publish filter (`published` and legacy past schedule; `ready` and `needs_review` are 404), article meta from `seo`, one NewsArticle JSON-LD plus at most one FAQPage, FAQ accordion, comment-stripped body, YouTube embeds, newsletter POST to the CMS `/subscriptions/subscribe`, and `/newsletter/unsubscribe`.
