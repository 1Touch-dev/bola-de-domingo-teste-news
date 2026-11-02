import AffiliateBanner from "@/components/affiliate/AffiliateBanner";
import { AffiliateFeed } from "@/components/affiliate/AffiliateFeed";
import Link from "next/link";
import {
  categorias,
  categoriaName,
  finishedFixtures,
  parseScore,
  pracaTable,
  pracas,
  scheduledFixtures,
  sideHref,
  sideName,
  sideShort,
  tardes,
  upcomingFixtures,
} from "@/data";
import { loadDeskArticles } from "@/lib/deskArticles";
import { loadEditorialBanners, loadPartnerBanners } from "@/lib/banners";
import { EditorialHero } from "@/components/EditorialHero";
import { FooterNewsletter } from "@/components/FooterNewsletter";
import { PartnerStrip } from "@/components/PartnerStrip";
import { formatKickoff, formatPublished, readingMinutes } from "@/lib/format";
import { FixtureStatusEnum, type IFixture } from "@/types";
import { Container, Crest, SectionHeading } from "@/components/ui";
import { TeamLogo } from "@/components/TeamLogo";
import { getContextMatches, getScheduledContextMatches } from "@/lib/contextFixtures";
import { StandingsTable } from "@/components/StandingsTable";

const minutesFor = (excerpt: string, paragraphs: string[]) => readingMinutes(`${excerpt} ${paragraphs.join(" ")}`);

const pairScore = (score?: string): [string, string] | null => {
  const parsed = parseScore(score);
  if (!parsed) return null;
  return [String(parsed[0]), String(parsed[1])];
};

interface IScoreChipProps {
  fixture: IFixture;
}

const ScoreChip = (props: IScoreChipProps) => {
  const { fixture } = props;
  const score = pairScore(fixture.score);
  const mark = score ? `${score[0]}–${score[1]}` : "vs";
  const live = fixture.status === FixtureStatusEnum.PROGRAMADO;

  return (
    <article className="flex shrink-0 items-center gap-3 border-r border-white/10 px-4 py-2">
      <p className="max-w-28 truncate text-[10px] tracking-wide text-panel/50 uppercase">{fixture.competition}</p>
      <Crest slug={fixture.homeSlug} size="xs" />
      <p className="text-xs font-semibold text-panel">{sideShort(fixture.homeSlug)}</p>
      <p className={`min-w-12 px-2 py-0.5 text-center text-sm font-semibold tabular-nums ${live ? "bg-white/10 text-panel" : "bg-accent text-panel"}`}>
        {mark}
      </p>
      <Crest slug={fixture.awaySlug} size="xs" />
      <p className="text-xs font-semibold text-panel">{sideShort(fixture.awaySlug)}</p>
    </article>
  );
};

interface IDeskStatProps {
  value: string;
  label: string;
}

const DeskStat = (props: IDeskStatProps) => {
  const { value, label } = props;
  return (
    <div className="px-4 py-4">
      <p className="font-display text-3xl font-semibold text-panel">{value}</p>
      <p className="text-[11px] font-semibold tracking-[0.14em] text-panel/70 uppercase">{label}</p>
    </div>
  );
};

export const HomeView = async () => {
  const [stories, hero, contentPartners, matches, marked] = await Promise.all([
    loadDeskArticles(),
    loadEditorialBanners(),
    loadPartnerBanners("content"),
    getContextMatches(),
    getScheduledContextMatches(),
  ]);
  const [featured, ...rest] = stories;
  const rail = rest.slice(0, 4);
  const latest = rest.slice(4);
  const ahead = upcomingFixtures();
  const upcoming = (ahead.length > 0 ? ahead : scheduledFixtures()).slice(0, 4);
  const roundTitle = ahead.length > 0 ? "Marcados" : "Súmula em aberto";
  const ticker = [...finishedFixtures().slice(0, 6), ...scheduledFixtures().slice(0, 4)];

  if (!featured) return null;

  const featuredMinutes = minutesFor(featured.excerpt, featured.paragraphs);

  return (
    <>
      <EditorialHero banners={hero} />
      <PartnerStrip banners={contentPartners} variant="content" />
      <div className="bg-asphalt text-panel">
        <Container className="flex items-stretch">
          <p className="hidden shrink-0 self-center bg-highlight px-3 py-2 text-[11px] font-semibold tracking-[0.16em] uppercase sm:block">
            Placar
          </p>
          <div className="score-strip flex min-w-0 flex-1 overflow-x-auto">
            {ticker.map((fixture) => (
              <ScoreChip key={fixture.id} fixture={fixture} />
            ))}
          </div>
        </Container>
      </div>

      {matches.length > 0 || marked.length > 0 ? (
        <Container className="py-6">
          <div className="mb-2 flex items-end justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold">Seleção</h2>
            <Link href="/resultados" className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
              Resultados
            </Link>
          </div>
          {matches.length > 0 ? (
            <ul className="score-strip flex min-w-0 gap-3 overflow-x-auto pb-1">
              {matches.slice(0, 4).map((match) => (
                <li key={match.id} className="flex shrink-0 items-center gap-2 border border-line bg-panel px-3 py-3">
                  <TeamLogo src={match.homeLogo} label={match.homeName} size="xs" />
                  <span className="text-sm font-semibold">{match.homeName}</span>
                  <span className="bg-asphalt px-2 py-0.5 text-xs font-semibold text-panel">{match.score}</span>
                  <span className="text-sm font-semibold">{match.awayName}</span>
                  <TeamLogo src={match.awayLogo} label={match.awayName} size="xs" />
                </li>
              ))}
            </ul>
          ) : null}
          {marked.length > 0 ? (
            <ul className="score-strip mt-3 flex min-w-0 gap-3 overflow-x-auto pb-1">
              {marked.slice(0, 4).map((match) => (
                <li key={match.id} className="flex shrink-0 items-center gap-2 border border-line bg-panel px-3 py-3">
                  <TeamLogo src={match.homeLogo} label={match.homeName} size="xs" />
                  <span className="text-sm font-semibold">{match.homeName}</span>
                  <span className="bg-accent px-2 py-0.5 text-xs font-semibold text-panel">A disputar</span>
                  <span className="text-sm font-semibold">{match.awayName}</span>
                  <TeamLogo src={match.awayLogo} label={match.awayName} size="xs" />
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-2 text-xs text-muted">Placar do feed. Não entra na Taça de Domingo.</p>
        </Container>
      ) : null}

      <section className="border-b border-line bg-panel">
        <Container className="grid lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.7fr)]">
          <article className="py-10 lg:pr-10">
            <p className="inline-block bg-accent px-2 py-1 text-[11px] font-semibold tracking-[0.14em] text-panel uppercase">
              {featured.sectionLabel || categoriaName(featured.categoria)}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.05] font-semibold sm:text-5xl">
              <Link href={`/noticias/${featured.slug}`} className="hover:text-accent">
                {featured.title}
              </Link>
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{featured.excerpt}</p>
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <Link href={`/noticias/${featured.slug}`} className="font-semibold text-accent">
                Ler a nota
              </Link>
              <span aria-hidden="true">|</span>
              <span>{formatPublished(featured.publishedAt)}</span>
              <span aria-hidden="true">|</span>
              <span>{featuredMinutes} min</span>
            </p>
          </article>
          <ol className="divide-y divide-line border-t border-line lg:border-t-0 lg:border-l">
            {rail.map((article) => (
              <li key={article.slug}>
                <Link href={`/noticias/${article.slug}`} className="group block py-4 hover:bg-page lg:px-6">
                  <p className="text-[11px] font-semibold tracking-[0.12em] text-highlight uppercase">
                    {article.sectionLabel || categoriaName(article.categoria)}
                  </p>
                  <h2 className="mt-1 font-display text-xl leading-snug font-semibold group-hover:text-accent">
                    {article.title}
                  </h2>
                  <p className="mt-1 text-xs text-muted">
                    {formatPublished(article.publishedAt)} · {minutesFor(article.excerpt, article.paragraphs)} min
                  </p>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <div className="bg-highlight text-panel">
        <Container className="grid grid-cols-2 divide-white/15 sm:grid-cols-4 sm:divide-x">
          <DeskStat value={String(pracas.length)} label="Praças" />
          <DeskStat value={String(tardes.length)} label="Tardes" />
          <DeskStat value={String(categorias.length)} label="Seções" />
          <DeskStat value="GMT-3" label="Brasília" />
        </Container>
      </div>

      {latest.length > 0 ? (
        <Container className="py-12">
          <SectionHeading title="Últimas notas" href="/noticias" />
          <ul className="grid gap-4 md:grid-cols-2">
            <AffiliateFeed cards list>{latest.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/noticias/${article.slug}`}
                  className="group block h-full border border-line bg-panel p-5 hover:border-accent hover:bg-page"
                >
                  <p className="text-[11px] font-semibold tracking-[0.12em] text-accent uppercase">
                    {article.sectionLabel || categoriaName(article.categoria)}
                  </p>
                  <h3 className="mt-2 font-display text-2xl leading-snug font-semibold group-hover:text-accent">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{article.excerpt}</p>
                  <p className="mt-3 text-xs text-muted">
                    {formatPublished(article.publishedAt)} · {minutesFor(article.excerpt, article.paragraphs)} min
                  </p>
                </Link>
              </li>
            ))}</AffiliateFeed>
          </ul>
        </Container>
      ) : null}

      <Container className="py-6"><AffiliateBanner preset="landscape" /></Container>

      <Container className="pb-4">
        <div className="max-w-md border border-line bg-panel p-5">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-accent uppercase">Newsletter</p>
          <FooterNewsletter id="home-newsletter-email" />
        </div>
      </Container>

      <Container className="grid min-w-0 gap-12 pb-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="min-w-0">
          <SectionHeading title={roundTitle} href="/calendario" />
          <ul className="divide-y divide-line border-y border-line bg-panel">
            {upcoming.map((fixture) => (
              <li key={fixture.id} className="grid gap-1 px-4 py-3 sm:grid-cols-[7.5rem_1fr] sm:items-center">
                <p className="text-xs text-muted capitalize">{formatKickoff(fixture.startsAt)}</p>
                <p className="flex min-w-0 flex-wrap items-center gap-2 text-sm break-words">
                  <Crest slug={fixture.homeSlug} size="xs" />
                  <Link href={sideHref(fixture.homeSlug)} className="font-medium hover:text-accent">
                    {sideName(fixture.homeSlug)}
                  </Link>
                  <span className="text-muted">vs</span>
                  <Crest slug={fixture.awaySlug} size="xs" />
                  <Link href={sideHref(fixture.awaySlug)} className="font-medium hover:text-accent">
                    {sideName(fixture.awaySlug)}
                  </Link>
                  <span className="mt-0.5 block text-xs text-muted">{fixture.competition}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>
        <StandingsTable
          title="Taça de Domingo"
          rows={pracaTable}
          href="/pracas"
          sideLabel="Praça"
          note="Tabela da mesa. Vitória vale três. Não é classificação da CBF, do Brasileirão nem de clube."
        />
      </Container>

      <Container className="pb-8">
        <SectionHeading eyebrow="Cobertura" title="Categorias" href="/categorias" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((item) => (
            <li key={item.slug} className="border border-line border-t-4 border-t-accent bg-panel p-4">
              <h3 className="font-display text-2xl font-semibold">
                <Link href={`/categorias/${item.slug}`} className="hover:text-accent">
                  {item.name}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-muted">{item.where}</p>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
};
