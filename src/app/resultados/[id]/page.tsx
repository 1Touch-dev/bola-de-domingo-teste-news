import AffiliateBanner from "@/components/affiliate/AffiliateBanner";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { categoriaName, parseScore, sideHref, sideName } from "@/data";
import { loadDeskFixture, loadDeskFixtures } from "@/lib/deskFixtures";
import { formatKickoff } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { Container, Crest, Crumb, PageHeader } from "@/components/ui";
import { CategoriaSlugEnum, FixtureStatusEnum } from "@/types";
import type { IFixture, IFixturePageProps } from "@/types";

export const revalidate = 120;

const sumulaNote = (fixture: IFixture) => {
  if (fixture.status !== FixtureStatusEnum.FINAL) {
    return "A súmula ainda não foi assinada. O placar entra quando a mesa fechar o jogo.";
  }
  if (fixture.categoria === CategoriaSlugEnum.COPA) {
    return "Súmula assinada. A Rodada da Copa não entra na tabela da Taça de Domingo.";
  }
  if (fixture.categoria === CategoriaSlugEnum.TARDE) {
    return "Súmula assinada. Este placar entra na tabela do Circuito da Tarde.";
  }
  return "Súmula assinada. Vitória vale três, empate vale um, e o placar entra na Taça de Domingo.";
};

export const generateStaticParams = async () => {
  const fixtures = await loadDeskFixtures();
  return fixtures.map((fixture) => ({ id: fixture.id }));
};

export const generateMetadata = async (props: IFixturePageProps): Promise<Metadata> => {
  const { params } = props;
  const { id } = await params;
  const fixture = await loadDeskFixture(id);
  if (!fixture) return {};
  const home = sideName(fixture.homeSlug);
  const away = sideName(fixture.awaySlug);
  const score = fixture.score ?? "a disputar";
  return pageMetadata({
    title: `${home} ${score} ${away}`,
    description: `${fixture.competition} em ${fixture.venue}. ${sumulaNote(fixture)}`,
    path: `/resultados/${fixture.id}`,
  });
};

const SumulaPage = async (props: IFixturePageProps) => {
  const { params } = props;
  const { id } = await params;
  const fixture = await loadDeskFixture(id);
  if (!fixture) notFound();

  const home = sideName(fixture.homeSlug);
  const away = sideName(fixture.awaySlug);
  const goals = parseScore(fixture.score);
  const event = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${home} vs ${away}`,
    startDate: fixture.startsAt,
    sport: "Soccer",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: fixture.venue },
    homeTeam: { "@type": "SportsTeam", name: home },
    awayTeam: { "@type": "SportsTeam", name: away },
    organizer: { "@type": "NewsMediaOrganization", name: site.name, url: site.url },
  };

  return (
    <Container className="py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(event).replace(/</g, "\\u003c") }} />
      <Crumb
        items={[
          { href: "/", label: "Início" },
          { href: "/resultados", label: "Resultados" },
          { label: `${home} × ${away}` },
        ]}
      />
      <div className="mt-6">
        <PageHeader
          kicker={fixture.status === FixtureStatusEnum.FINAL ? "Súmula assinada" : "A disputar"}
          title={`${home} ${fixture.score ?? "vs"} ${away}`}
          lede={sumulaNote(fixture)}
        />
      </div>
      <p className="mt-6 text-sm text-muted">
        {categoriaName(fixture.categoria)} · {fixture.competition} · <span className="capitalize">{formatKickoff(fixture.startsAt)}</span>
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
        <Link href={sideHref(fixture.homeSlug)} className="flex items-center justify-end gap-3 text-right hover:text-accent">
          <span className="font-display text-2xl leading-tight font-semibold">{home}</span>
          <Crest slug={fixture.homeSlug} />
        </Link>
        <p className="score-text bg-asphalt px-4 py-3 text-center text-4xl font-semibold text-panel">
          {fixture.score ?? "vs"}
        </p>
        <Link href={sideHref(fixture.awaySlug)} className="flex items-center gap-3 hover:text-accent">
          <Crest slug={fixture.awaySlug} />
          <span className="font-display text-2xl leading-tight font-semibold">{away}</span>
        </Link>
      </div>
      <dl className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
        <div>
          <dt className="utility-label text-[11px] font-semibold text-muted">Praça / parada</dt>
          <dd className="mt-1 text-sm">{fixture.venue}</dd>
        </div>
        <div>
          <dt className="utility-label text-[11px] font-semibold text-muted">Gols</dt>
          <dd className="mt-1 text-sm tabular-nums">
            {goals ? `${home} ${goals[0]} · ${away} ${goals[1]}` : "Ainda sem gols na súmula"}
          </dd>
        </div>
        <div>
          <dt className="utility-label text-[11px] font-semibold text-muted">Mesa</dt>
          <dd className="mt-1 text-sm">{fixture.status === FixtureStatusEnum.FINAL ? "Placar fechado" : "Placar aberto"}</dd>
        </div>
      </dl>
      <AffiliateBanner preset="strip" className="mt-8" />
    </Container>
  );
};

export default SumulaPage;
