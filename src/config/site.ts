export const site = {
  name: "Bola de Domingo",
  folder: "boladedomingo.com",
  domain: "boladedomingo.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://boladedomingo.com",
  email: "redacao@boladedomingo.com",
  gaId: "G-2N66EYN8XN",
  city: "São Paulo",
  country: "Brasil",
  category: "Football",
  niche: "Sunday football across Brazil",
  vertical: "Sports",
  tagline: "O futebol do domingo, o ano inteiro",
  description:
    "Notas, calendário e placares que a mesa assina: praças da Taça de Domingo, tardes do circuito e a semana de seleção, sem tabela da CBF e sem elenco.",
  keywords: [
    "Bola de Domingo",
    "boladedomingo.com",
    "futebol de domingo",
    "Taça de Domingo",
    "futebol brasileiro",
    "São Paulo",
    "mesa de domingo",
  ],
} as const;

export const nav = [
  { href: "/noticias", label: "Notícias" },
  { href: "/futebol", label: "Futebol" },
  { href: "/pracas", label: "Praças" },
  { href: "/tardes", label: "Tardes" },
  { href: "/calendario", label: "Calendário" },
  { href: "/resultados", label: "Resultados" },
  { href: "/categorias", label: "Categorias" },
] as const;
