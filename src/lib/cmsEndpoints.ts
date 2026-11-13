import { CategoriaSlugEnum } from "@/types";

/** Exact CMS `endpoint` query values from Postman "Brazil CMS — desk sites" → Bola de Domingo. */
export const HOME_ARTICLE_ENDPOINT = "HomePage";

export interface ICmsEndpoint {
  name: string;
  slug: string;
  /** Desk category when the feed maps into `/categorias/[slug]`. */
  categoria?: CategoriaSlugEnum;
  /** Public routes that should surface this feed as section notes. */
  hrefs?: string[];
}

/** Postman "Bola de Domingo" folder section feeds. */
export const cmsEndpoints: ICmsEndpoint[] = [
  {
    name: "Brasileirão",
    slug: "brasileirao",
    categoria: CategoriaSlugEnum.DOMINGO,
    hrefs: ["/categorias/domingo", "/resultados", "/calendario", "/pracas"],
  },
  {
    name: "Série B",
    slug: "serie-b",
    categoria: CategoriaSlugEnum.DOMINGO,
    hrefs: ["/categorias/domingo", "/resultados", "/pracas"],
  },
  {
    name: "Copa do Brasil",
    slug: "copa-do-brasil",
    categoria: CategoriaSlugEnum.COPA,
    hrefs: ["/categorias/copa", "/resultados"],
  },
  {
    name: "Libertadores",
    slug: "libertadores",
    categoria: CategoriaSlugEnum.TARDE,
    hrefs: ["/categorias/tarde", "/calendario"],
  },
  {
    name: "Seleção",
    slug: "selecao",
    categoria: CategoriaSlugEnum.SELECAO,
    hrefs: ["/categorias/selecao", "/calendario"],
  },
  {
    name: "Mercado da Bola",
    slug: "mercado-da-bola",
    categoria: CategoriaSlugEnum.MERCADO,
    hrefs: ["/categorias/mercado"],
  },
];

/** Exact section feeds from Postman "Brazil CMS — desk sites" → Bola de Domingo. */
export const deskFeedEndpoints: string[] = cmsEndpoints.map((item) => item.name);

const byName = new Map(cmsEndpoints.map((item) => [item.name.toLowerCase(), item]));

export const cmsEndpointByName = (name: string) => byName.get(name.trim().toLowerCase());

export const endpointsForCategoria = (categoria: CategoriaSlugEnum): string[] =>
  cmsEndpoints.filter((item) => item.categoria === categoria).map((item) => item.name);

export const endpointsForHref = (href: string): string[] =>
  cmsEndpoints.filter((item) => item.hrefs?.includes(href)).map((item) => item.name);

export const isNoiseAssignment = (name: string) => {
  const key = name.trim().toLowerCase();
  return key === "league" || key === "other";
};
