# Progress

## Works

`yarn lint` and `yarn build` passed (41 static pages). `/en`, `/pt`, and `/es` redirect in middleware.

Launch desk for Bola de Domingo / `boladedomingo.com`.

- Home is a sports-news front: ticker, lead story, headline rail, stat strip, note cards, fixtures, Taça de Domingo table, category grid
- Sections: notícias, praças, tardes, calendário, resultados, categorias, sobre, contato, privacidade, termos
- Local search over praças, tardes, and notes
- Favicon and Open Graph image with BD
- Masthead mark is the generated `/logo.png`, loaded without the image optimizer so the BD block renders
- Canonical `pt-BR` + `x-default`, sitemap, robots, RSS, llms.txt, NewsArticle JSON-LD, manifest
- Google Analytics tag `G-2N66EYN8XN` on every page (`site.gaId`, root layout)
- `/en`, `/pt`, `/es` 308 to the unprefixed path
- Newsletter client posts to the Brazil CMS `/subscriptions/subscribe`
- Footer signup uses React Hook Form (`useForm`, `register`, `isSubmitting`)
- News catalog: `GET /ai-articles?targetWebsite=boladedomingo.com` on `api.football360brazil.com`. Home, notícias, categorias, search, sitemap, and RSS use it. Seed notes remain the fallback.
- Husky 9.1.7 with `yarn precommit`
- Memory bank and `.cursorrules`

## Left

- CMS to replace seed data in `src/data/domingo.ts`
- IndexNow key file (this host is not in the CMS key table)
- Swap desk pages from seed to query data when those routes return payloads

## Known

- Scores are the desk's own signed praças and tardes. They are not a CBF, Brasileirão, Copa do Brasil, Libertadores, or club table.
- No named rosters.
