# Bola de Domingo — project brief

`boladedomingo.com` is a Next.js Sunday-football desk for Brazil, written from São Paulo.

Folder name: `boladedomingo.com`. Brand name: **Bola de Domingo**.

## Niche

The Sunday of Brazilian football: Taça de Domingo between editorial praças, Circuito da Tarde, a morning Rodada da Copa, and notes on seleção, mercado, and bastidores.

Out of scope: official CBF tables, the official Brasileirão, Copa do Brasil, or Libertadores classifications, club tables, and named rosters, especially minors.

## Brand

- Name: **Bola de Domingo**
- Folder / domain: **boladedomingo.com**
- Category: Football
- Niche: Sunday football across Brazil
- Vertical: Sports
- Tagline: **O futebol do domingo, o ano inteiro**
- City: São Paulo, Brasil
- Language: pt-BR
- Palette: Sunday sheet `#F1EFEA`, asphalt `#231910`, clay `#9A3412`, cocoa `#5B4636`
- Newsreader headlines, Outfit body. Initials on the mark: BD.

## Stack

Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4, Portuguese only (`pt-BR`), AWS Amplify (`amplify.yml` uses yarn).

## Must-ship

- Praça pages, circuit table, calendar, desk-signed scores
- SEO: canonical `pt-BR` + `x-default`, sitemap, robots, RSS, llms.txt, NewsArticle JSON-LD, manifest
- Live editorial and fixture data from the CMS / website APIs, with static taxonomy descriptors kept locally in `src/data/taxonomy.ts`
- Footer and homepage newsletter: browser POST to the Brazil CMS `/api/subscriptions/subscribe` with website `boladedomingo.com`
- Sports client: TanStack Query and Axios HttpService for `/articles`, `/matches`, and `/standings`. Desk pages render live API data and explicit empty states when APIs return nothing. Non-core extras like partner banners, popups, and reader reactions are not part of the current product surface.
- Husky pre-commit and pre-push run `yarn lint` then `yarn build`
