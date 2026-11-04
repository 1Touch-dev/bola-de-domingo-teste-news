import Link from "next/link";
import {
  categorias,
  categoriaName,
  parseScore,
  pracas,
  sideHref,
  sideName,
  sideShort,
  tardes,
} from "@/data";
import { ArticleCard } from "@/components/ArticleCard";
import { ArticleCardImage } from "@/components/ArticleCardImage";
import { FooterNewsletter } from "@/components/FooterNewsletter";
import { StandingsTable } from "@/components/StandingsTable";
import { TeamLogo } from "@/components/TeamLogo";
import { Container, Crest, SectionHeading } from "@/components/ui";
import { loadDeskArticles } from "@/lib/deskArticles";
import { getContextMatches, getScheduledContextMatches } from "@/lib/contextFixtures";
import { finishedDeskFixtures, loadDeskFixtures, pracaDeskTable, scheduledDeskFixtures, upcomingDeskFixtures } from "@/lib/deskFixtures";
import { formatKickoff, formatPublished, readingMinutes } from "@/lib/format";
import { FixtureStatusEnum } from "@/types";
import type { IFixture } from "@/types";

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
      <p className="utility-label max-w-28 truncate text-[10px] text-panel/50">{fixture.competition}</p>
      <Crest slug={fixture.homeSlug} size="xs" />
      <p className="text-xs font-semibold text-panel">{sideShort(fixture.homeSlug)}</p>
      <p className={`score-text min-w-12 px-2 py-0.5 text-center text-sm font-semibold ${live ? "bg-white/10 text-panel" : "bg-accent text-panel"}`}>
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
      <p className="score-text text-3xl font-semibold text-panel">{value}</p>
      <p className="utility-label text-[11px] font-semibold text-panel/70">{label}</p>
    </div>
  );
};

export const HomeView = async () => {
  const [stories, matches, marked, fixtures] = await Promise.all([
    loadDeskArticles(),
    getContextMatches(),
    getScheduledContextMatches(),
    loadDeskFixtures(),
  ]);

  const [featured, ...rest] = stories;
  const rail = rest.slice(0, 4);
  const latest = rest.slice(4);
  const ahead = upcomingDeskFixtures(fixtures);
  const scheduled = scheduledDeskFixtures(fixtures);
  const upcoming = (ahead.length > 0 ? ahead : scheduled).slice(0, 4);
  const roundTitle = ahead.length > 0 ? "Marcados" : "Súmula em aberto";
  const ticker = [...finishedDeskFixtures(fixtures).slice(0, 6), ...scheduled.slice(0, 4)];
  const tableRows = pracaDeskTable(fixtures);
  const featuredMinutes = featured ? minutesFor(featured.excerpt, featured.paragraphs) : 0;

  return (
    <>
      <div className="bg-asphalt text-panel">
        <Container className="flex items-stretch">
          {ticker.length > 0 ? (
            <>
              <p className="utility-label hidden shrink-0 self-center bg-highlight px-3 py-2 text-[11px] font-semibold sm:block">
                Placar
              </p>
              <div className="score-strip flex min-w-0 flex-1 overflow-x-auto">
                {ticker.map((fixture) => (
                  <ScoreChip key={fixture.id} fixture={fixture} />
                ))}
              </div>
            </>
          ) : (
            <p className="px-4 py-3 text-sm text-panel/75">Nenhum placar da API no momento.</p>
          )}
        </Container>
      </div>

      {matches.length > 0 || marked.length > 0 ? (
        <Container className="py-6">
          <div className="mb-2 flex items-end justify-between gap-3">
            <h2 className="font-sans text-2xl font-semibold text-ink">Seleção</h2>
            <Link href="/resultados" className="utility-label-soft text-xs font-semibold text-accent">
              Resultados
            </Link>
          </div>

          {matches.length > 0 ? (
            <ul className="score-strip flex min-w-0 gap-3 overflow-x-auto pb-1">
              {matches.slice(0, 4).map((match) => (
                <li key={match.id} className="flex shrink-0 items-center gap-2 border border-line bg-panel px-3 py-3">
                  <TeamLogo src={match.homeLogo} label={match.homeName} size="xs" />
                  <span className="text-sm font-semibold">{match.homeName}</span>
                  <span className="score-text bg-asphalt px-2 py-0.5 text-xs font-semibold text-panel">{match.score}</span>
                  <span className="text-sm font-semibold">{match.awayName}</span>
                  <TeamLogo src={match.awayLogo} label={match.awayName} size="xs" />
                </li>
              ))}
            </ul>
          ) : null}

          {marked.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {marked.slice(0, 4).map((match) => (
                <li key={match.id} className="border border-line bg-panel px-3 py-3 text-sm text-muted">
                  {formatKickoff(match.startsAt)} · {match.homeName} vs {match.awayName}
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      ) : null}

      <Container className="grid min-w-0 gap-8 border-b border-line bg-panel py-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="min-w-0">
          {featured ? (
            <article className="py-12 lg:pr-12">
              <div className="overflow-hidden border border-line bg-panel">
                <ArticleCardImage src={featured.coverImage} alt={featured.title} sizes="(max-width: 1024px) 100vw, 70vw" />
                <div className="p-6 sm:p-8">
                  <p className="utility-label inline-block bg-accent px-2 py-1 text-[11px] font-semibold text-panel">
                    {featured.sectionLabel || categoriaName(featured.categoria)}
                  </p>
                  <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[0.94] font-semibold sm:text-[4.25rem]">
                    <Link href={`/noticias/${featured.slug}`} className="hover:text-accent">
                      {featured.title}
                    </Link>
                  </h1>
                  <p className="mt-6 max-w-2xl text-[1.35rem] leading-9 text-muted">{featured.excerpt}</p>
                  <p className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                    <Link href={`/noticias/${featured.slug}`} className="utility-label-soft font-semibold text-accent">
                      Ler a nota
                    </Link>
                    <span aria-hidden="true">|</span>
                    <span>{formatPublished(featured.publishedAt)}</span>
                    <span aria-hidden="true">|</span>
                    <span>{featuredMinutes} min</span>
                  </p>
                </div>
              </div>
            </article>
          ) : (
            <div className="py-12 lg:pr-12">
              <div className="border border-line bg-panel p-8">
                <p className="utility-label text-[11px] font-semibold text-accent">Notícias</p>
                <h1 className="mt-4 font-display text-4xl font-semibold text-ink">A mesa ainda está vazia</h1>
                <p className="mt-4 max-w-2xl text-muted">Nenhuma nota da API chegou para abrir a home neste momento.</p>
              </div>
            </div>
          )}
        </div>

        <aside className="border-l border-line lg:pl-8">
          {rail.length > 0 ? (
            <ul className="divide-y divide-line">
              {rail.map((article) => (
                <li key={article.slug}>
                  <ArticleCard article={article} variant="rail" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-sm text-muted">Sem manchetes adicionais da API no momento.</div>
          )}
        </aside>
      </Container>

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
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {latest.map((article) => (
              <li key={article.slug} className="h-full">
                <ArticleCard article={article} variant="latest" />
              </li>
            ))}
          </ul>
        </Container>
      ) : null}

      <Container className="pb-4">
        <div className="max-w-md border border-line bg-panel p-6">
          <p className="utility-label text-[11px] font-semibold text-accent">Newsletter</p>
          <FooterNewsletter id="home-newsletter-email" />
        </div>
      </Container>

      <Container className="grid min-w-0 gap-12 pb-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="min-w-0">
          <SectionHeading title={roundTitle} href="/calendario" />
          {upcoming.length > 0 ? (
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
          ) : (
            <p className="border border-line bg-panel px-4 py-4 text-sm text-muted">Nenhum jogo agendado veio da API no momento.</p>
          )}
        </section>

        <StandingsTable
          title="Taça de Domingo"
          rows={tableRows}
          href="/pracas"
          sideLabel="Praça"
          note="Tabela da mesa. Vitória vale três. Não é classificação da CBF, do Brasileirão nem de clube."
        />
      </Container>

      <Container className="pb-8">
        <SectionHeading eyebrow="Cobertura" title="Categorias" href="/categorias" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((item) => (
            <li key={item.slug} className="border border-line border-t-4 border-t-accent bg-panel p-5">
              <h3 className="font-sans text-[1.3rem] leading-7 font-semibold text-ink">
                <Link href={`/categorias/${item.slug}`} className="hover:text-accent">
                  {item.name}
                </Link>
              </h3>
              <p className="mt-2 text-[0.95rem] text-muted">{item.where}</p>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
};