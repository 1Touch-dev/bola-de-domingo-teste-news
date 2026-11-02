import AffiliateBanner from "@/components/affiliate/AffiliateBanner";
import { AffiliateFeed } from "@/components/affiliate/AffiliateFeed";
import type { Metadata } from "next";
import Link from "next/link";
import { categoriaName } from "@/data";
import { loadDeskArticles } from "@/lib/deskArticles";
import { formatPublished } from "@/lib/format";
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
      <div className="mt-8 divide-y divide-line border-y border-line">
        <AffiliateFeed>{stories.map((article) => (
          <Link
            key={article.slug}
            href={`/noticias/${article.slug}`}
            className="group grid gap-2 py-5 hover:bg-panel sm:grid-cols-[9rem_1fr]"
          >
            <p className="text-sm text-muted">{formatPublished(article.publishedAt)}</p>
            <span>
              <span className="block text-[11px] font-semibold tracking-[0.12em] text-accent uppercase">
                {categoriaName(article.categoria)} · {article.author}
              </span>
              <h2 className="mt-1 font-display text-3xl leading-tight font-semibold group-hover:text-accent">
                {article.title}
              </h2>
              <p className="mt-2 max-w-2xl text-muted">{article.excerpt}</p>
            </span>
          </Link>
        ))}</AffiliateFeed>
      </div>
      {stories.length < 6 && stories.length > 0 ? <AffiliateBanner preset="strip" className="mt-8" /> : null}
    </Container>
  );
};

export default NewsPage;
