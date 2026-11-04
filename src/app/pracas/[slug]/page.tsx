import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoriaName, getPraca, pracas } from "@/data";
import { loadDeskArticles } from "@/lib/deskArticles";
import { fixturesForSlug, loadDeskFixtures } from "@/lib/deskFixtures";
import { pageMetadata } from "@/lib/seo";
import { Container, Crumb, FixtureRow, PageHeader, Stripe } from "@/components/ui";
import type { ISlugPageProps } from "@/types";

export const generateStaticParams = () => pracas.map((praca) => ({ slug: praca.slug }));

export const generateMetadata = async (props: ISlugPageProps): Promise<Metadata> => {
  const { params } = props;
  const { slug } = await params;
  const praca = getPraca(slug);
  if (!praca) return {};
  return pageMetadata({
    title: praca.name,
    description: praca.blurb,
    path: `/pracas/${praca.slug}`,
  });
};

const PracaPage = async (props: ISlugPageProps) => {
  const { params } = props;
  const { slug } = await params;
  const praca = getPraca(slug);
  if (!praca) notFound();

  const [fixtures, stories] = await Promise.all([loadDeskFixtures(), loadDeskArticles()]);
  const games = fixturesForSlug(fixtures, praca.slug);
  const relatedStories = stories.filter((article) => article.relatedSlugs.includes(praca.slug));

  return (
    <Container className="py-10">
      <Crumb
        items={[
          { href: "/", label: "Início" },
          { href: "/pracas", label: "Praças" },
          { label: praca.shortName },
        ]}
      />
      <div className="mt-6 flex items-start gap-4">
        <Stripe colors={praca.colors} />
        <PageHeader kicker={`${praca.kind} · ${praca.city}`} title={praca.name} lede={praca.blurb} />
      </div>
      <p className="mt-4 text-sm text-muted">
        Categorias: {praca.categorias.map((categoria) => categoriaName(categoria)).join(" · ")}
      </p>
      <section className="mt-8">
        <h2 className="font-sans text-2xl font-semibold text-ink">Jogos</h2>
        <div className="mt-2">
          {games.map((fixture) => (
            <FixtureRow key={fixture.id} fixture={fixture} />
          ))}
        </div>
      </section>
      {relatedStories.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-sans text-2xl font-semibold text-ink">Notas</h2>
          <ul className="mt-3 space-y-2">
            {relatedStories.map((article) => (
              <li key={article.slug}>
                <Link href={`/noticias/${article.slug}`} className="hover:text-accent">
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </Container>
  );
};

export default PracaPage;
