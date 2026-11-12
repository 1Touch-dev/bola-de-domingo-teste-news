import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { HOME_ARTICLE_ENDPOINT } from "@/lib/cmsEndpoints";
import { loadArticlesByEndpoint } from "@/lib/deskArticles";
import { pageMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/ui";

export const revalidate = 120;

export const metadata: Metadata = pageMetadata({
  title: "Notícias",
  description: "Crônicas da Taça de Domingo, do Circuito da Tarde, da copa da manhã e da semana de seleção.",
  path: "/noticias",
});

const NewsPage = async () => {
  const [section, home] = await Promise.all([
    loadArticlesByEndpoint("Notícias", 40),
    loadArticlesByEndpoint(HOME_ARTICLE_ENDPOINT, 40),
  ]);
  const seen = new Set(section.map((article) => article.slug));
  const stories = [...section, ...home.filter((article) => !seen.has(article.slug))];

  return (
    <Container className="py-10">
      <PageHeader
        kicker="Mesa de redação"
        title="Notícias"
        lede="O que a súmula confirma: praças, tardes e a semana de seleção que a mesa não transforma em tabela oficial."
      />
      {stories.length === 0 ? <p className="mt-8 max-w-2xl text-muted">Nenhuma nota publicada na mesa por enquanto.</p> : null}
      <div className="mt-8 divide-y divide-line border-y border-line">
        {stories.map((article) => (
          <ArticleCard key={article.slug} article={article} variant="list" />
        ))}
      </div>
    </Container>
  );
};

export default NewsPage;
