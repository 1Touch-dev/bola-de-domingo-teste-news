import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { loadDeskArticles } from "@/lib/deskArticles";
import { pageMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/ui";

export const revalidate = 120;

export const metadata: Metadata = pageMetadata({
  title: "Notícias",
  description: "Crônicas da Taça de Domingo, do Circuito da Tarde, da copa da manhã e da semana de seleção.",
  path: "/noticias",
});

const NewsPage = async () => {
  const stories = await loadDeskArticles();

  return (
    <Container className="py-10">
      <PageHeader
        kicker="Mesa de redação"
        title="Notícias"
        lede="O que a súmula confirma: praças, tardes e a semana de seleção que a mesa não transforma em tabela oficial."
      />
      {stories.length === 0 ? <p className="mt-8 max-w-2xl text-muted">Nenhuma nota publicada veio da API no momento.</p> : null}
      <div className="mt-8 divide-y divide-line border-y border-line">
        {stories.map((article) => (
          <ArticleCard key={article.slug} article={article} variant="list" />
        ))}
      </div>
    </Container>
  );
};

export default NewsPage;
