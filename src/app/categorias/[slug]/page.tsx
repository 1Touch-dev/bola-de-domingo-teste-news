import AffiliateBanner from "@/components/affiliate/AffiliateBanner";
import { AffiliateFeed } from "@/components/affiliate/AffiliateFeed";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { byCategoria, categorias, fixtures, getCategoria } from "@/data";
import { loadDeskArticles } from "@/lib/deskArticles";
import { pageMetadata } from "@/lib/seo";
import { CategoriaSlugEnum, type ISlugPageProps } from "@/types";
import { Container, Crumb, FixtureRow, PageHeader } from "@/components/ui";

const noteOnly = new Set<CategoriaSlugEnum>([
  CategoriaSlugEnum.SELECAO,
  CategoriaSlugEnum.MERCADO,
  CategoriaSlugEnum.BASTIDORES,
]);

export const generateStaticParams = () => categorias.map((item) => ({ slug: item.slug }));

export const generateMetadata = async (props: ISlugPageProps): Promise<Metadata> => {
  const { params } = props;
  const { slug } = await params;
  const categoria = getCategoria(slug);
  if (!categoria) return {};
  return pageMetadata({
    title: categoria.name,
    description: categoria.pitch,
    path: `/categorias/${categoria.slug}`,
  });
};

const CategoriaPage = async (props: ISlugPageProps) => {
  const { params } = props;
  const { slug } = await params;
  const categoria = getCategoria(slug);
  if (!categoria) notFound();

  const games = byCategoria(categoria.slug, fixtures);
  const stories = byCategoria(categoria.slug, await loadDeskArticles());

  return (
    <Container className="py-10">
      <Crumb
        items={[
          { href: "/", label: "Início" },
          { href: "/categorias", label: "Categorias" },
          { label: categoria.name },
        ]}
      />
      <div className="mt-6">
        <PageHeader kicker={categoria.where} title={categoria.name} lede={categoria.pitch} />
      </div>
      <section className="mt-8">
        <h2 className="font-display text-3xl">Jogos</h2>
        {games.length > 0 ? (
          games.map((fixture) => <FixtureRow key={fixture.id} fixture={fixture} />)
        ) : (
          <p className="mt-3 max-w-2xl text-muted">
            {noteOnly.has(categoria.slug)
              ? "Nesta categoria a mesa não assina placar oficial. A semana entra nas notas, não numa tabela."
              : "Ainda não há jogo assinado nesta categoria."}
          </p>
        )}
      </section>
      <section className="mt-8">
        <h2 className="font-display text-3xl">Notas</h2>
        <ul className="mt-3 space-y-2">
          <AffiliateFeed list>{stories.map((article) => (
            <li key={article.slug}>
              <Link href={`/noticias/${article.slug}`} className="hover:text-accent">
                {article.title}
              </Link>
            </li>
          ))}</AffiliateFeed>
        </ul>
      </section>
      {stories.length < 6 && (stories.length > 0 || games.length > 0) ? <AffiliateBanner preset="strip" className="mt-8" /> : null}
    </Container>
  );
};

export default CategoriaPage;
