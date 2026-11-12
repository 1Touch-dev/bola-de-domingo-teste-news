import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { categorias, pracas } from "@/data";
import { loadDeskArticles } from "@/lib/deskArticles";
import { loadDeskFixtures } from "@/lib/deskFixtures";

export const revalidate = 3600;

type Freq = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

const entry = (
  path: string,
  lastModified: Date,
  changeFrequency: Freq,
  priority: number,
): MetadataRoute.Sitemap[number] => ({
  url: path === "/" ? site.url : `${site.url}${path}`,
  lastModified,
  changeFrequency,
  priority,
});

const staticRoutes: Array<{ path: string; changeFrequency: Freq; priority: number }> = [
  { path: "/", changeFrequency: "hourly", priority: 1 },
  { path: "/noticias", changeFrequency: "daily", priority: 0.9 },
  { path: "/pracas", changeFrequency: "daily", priority: 0.8 },
  { path: "/tardes", changeFrequency: "daily", priority: 0.8 },
  { path: "/calendario", changeFrequency: "daily", priority: 0.8 },
  { path: "/resultados", changeFrequency: "daily", priority: 0.8 },
  { path: "/categorias", changeFrequency: "daily", priority: 0.7 },
  { path: "/contato", changeFrequency: "monthly", priority: 0.3 },
  { path: "/sobre", changeFrequency: "monthly", priority: 0.3 },
  { path: "/privacidade", changeFrequency: "monthly", priority: 0.2 },
  { path: "/termos", changeFrequency: "monthly", priority: 0.2 },
];

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const now = new Date();
  const [articles, fixtures] = await Promise.all([loadDeskArticles(), loadDeskFixtures()]);

  const staticEntries = staticRoutes.map((route) =>
    entry(route.path, now, route.changeFrequency, route.priority),
  );

  const pracaEntries = pracas.map((praca) => entry(`/pracas/${praca.slug}`, now, "weekly", 0.6));

  const categoriaEntries = categorias.map((categoria) =>
    entry(`/categorias/${categoria.slug}`, now, "weekly", 0.55),
  );

  const articleEntries = articles.map((article) =>
    entry(
      `/noticias/${article.slug}`,
      new Date(article.updatedAt || article.publishedAt),
      "daily",
      0.8,
    ),
  );

  const resultadoEntries = fixtures.map((fixture) =>
    entry(`/resultados/${fixture.id}`, new Date(fixture.startsAt), "weekly", 0.5),
  );

  return [...staticEntries, ...pracaEntries, ...categoriaEntries, ...articleEntries, ...resultadoEntries];
};

export default sitemap;
