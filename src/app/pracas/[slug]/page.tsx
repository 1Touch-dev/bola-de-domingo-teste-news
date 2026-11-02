import AffiliateBanner from "@/components/affiliate/AffiliateBanner";
import { AffiliateFeed } from "@/components/affiliate/AffiliateFeed";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articlesFor, categoriaName, fixturesFor, getPraca, pracas } from "@/data";
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

  const games = fixturesFor(praca.slug);
  const stories = articlesFor(praca.slug);

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
        <h2 className="font-display text-3xl">Jogos</h2>
        <div className="mt-2">
          {games.map((fixture) => (
            <FixtureRow key={fixture.id} fixture={fixture} />
          ))}
        </div>
      </section>
      {stories.length > 0 ? (
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
      ) : null}
      {stories.length < 6 && (stories.length > 0 || games.length > 0) ? <AffiliateBanner preset="strip" className="mt-8" /> : null}
    </Container>
  );
};

export default PracaPage;
