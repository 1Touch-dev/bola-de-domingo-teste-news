import { CategoriaSlugEnum } from "@/types";

/** Exact CMS `endpoint` query values from Postman "Brazil CMS — desk sites" → Bola de Domingo. */
export const HOME_ARTICLE_ENDPOINT = "HomePage";

export interface ICmsEndpoint {
  name: string;
  slug: string;
  /** Desk category when the feed maps into `/categorias/[slug]`. */
  categoria?: CategoriaSlugEnum;
  /** Existing public route that should surface this feed. */
  href?: string;
}

export const cmsEndpoints: ICmsEndpoint[] = [
  { name: "Brasileirão", slug: "brasileirao", categoria: CategoriaSlugEnum.DOMINGO, href: "/categorias/domingo" },
  { name: "Série B", slug: "serie-b", categoria: CategoriaSlugEnum.DOMINGO, href: "/categorias/domingo" },
  { name: "Copa do Brasil", slug: "copa-do-brasil", categoria: CategoriaSlugEnum.COPA, href: "/categorias/copa" },
  { name: "Libertadores", slug: "libertadores", categoria: CategoriaSlugEnum.TARDE, href: "/categorias/tarde" },
  { name: "Seleção", slug: "selecao", categoria: CategoriaSlugEnum.SELECAO, href: "/categorias/selecao" },
  { name: "Mercado da Bola", slug: "mercado-da-bola", categoria: CategoriaSlugEnum.MERCADO, href: "/categorias/mercado" },
  { name: "Bastidores", slug: "bastidores", categoria: CategoriaSlugEnum.BASTIDORES, href: "/categorias/bastidores" },
  { name: "Calendário", slug: "calendario", href: "/calendario" },
  { name: "Tabela de classificação", slug: "tabela-de-classificacao", href: "/pracas" },
  { name: "Partidas", slug: "partidas", href: "/resultados" },
  { name: "Equipes", slug: "equipes", href: "/pracas" },
  { name: "Jogadores", slug: "jogadores", categoria: CategoriaSlugEnum.BASTIDORES, href: "/categorias/bastidores" },
  { name: "Estaduais", slug: "estaduais", categoria: CategoriaSlugEnum.DOMINGO, href: "/categorias/domingo" },
  { name: "Notícias", slug: "noticias", href: "/noticias" },
  { name: "Other", slug: "other" },
];

/** Section feeds used on the desk (excludes CMS catch-all `Other`). */
export const deskFeedEndpoints = cmsEndpoints
  .filter((item) => item.name !== "Other")
  .map((item) => item.name);

const byName = new Map(cmsEndpoints.map((item) => [item.name.toLowerCase(), item]));

export const cmsEndpointByName = (name: string) => byName.get(name.trim().toLowerCase());

export const endpointsForCategoria = (categoria: CategoriaSlugEnum): string[] =>
  cmsEndpoints.filter((item) => item.categoria === categoria).map((item) => item.name);

export const endpointsForHref = (href: string): string[] =>
  cmsEndpoints.filter((item) => item.href === href).map((item) => item.name);

export const isNoiseAssignment = (name: string) => {
  const key = name.trim().toLowerCase();
  return key === "league" || key === "other";
};
