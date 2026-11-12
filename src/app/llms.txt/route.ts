import { nav, site } from "@/config/site";
import { loadDeskArticles } from "@/lib/deskArticles";

export const revalidate = 120;

export const GET = async () => {
  const recent = (await loadDeskArticles()).slice(0, 5);
  const sections = nav.map((item) => `- [${item.label}](${site.url}${item.href})`).join("\n");
  const notes = recent.map((article) => `- [${article.title}](${site.url}/noticias/${article.slug})`).join("\n");

  const body = `# ${site.name}

> ${site.tagline}. Mesa independente em São Paulo. Cobre o futebol de domingo no Brasil: praças da Taça de Domingo, tardes do Circuito da Tarde e a semana de seleção. Idioma: pt-BR. Não publica tabela da CBF, elenco, nem classificação oficial de Brasileirão, Copa do Brasil ou Libertadores.

## Key Sections
${sections}
- [RSS](${site.url}/rss.xml)
- [Sitemap](${site.url}/sitemap.xml)
- [Google News sitemap](${site.url}/news-sitemap.xml)
- [Robots](${site.url}/robots.txt)

## Recent Content
${notes || "- A mesa ainda não publicou notas neste ciclo."}

## Language Editions
- [pt-BR](${site.url}/) is the only edition. /en, /pt and /es redirect to the same path.

## About / Publisher Info
- Publisher: ${site.name}
- City: ${site.city}, ${site.country}
- Contact: ${site.email}
- [Quem somos](${site.url}/sobre)
- [Contato](${site.url}/contato)
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
