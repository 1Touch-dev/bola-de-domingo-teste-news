import AffiliateBanner from "@/components/affiliate/AffiliateBanner";
import type { Metadata } from "next";
import { SectionNotes } from "@/components/SectionNotes";
import { site } from "@/config/site";
import { sideName } from "@/data";
import { loadArticlesForPath } from "@/lib/deskArticles";
import { loadDeskFixtures, scheduledDeskFixtures, upcomingDeskFixtures } from "@/lib/deskFixtures";
import { dayKey, formatDay } from "@/lib/format";
import { getScheduledContextMatches } from "@/lib/contextFixtures";
import { pageMetadata } from "@/lib/seo";
import { Container, ContextRow, FixtureRow, PageHeader } from "@/components/ui";
import type { IFixture } from "@/types";

export const metadata: Metadata = pageMetadata({
  title: "Calendário",
  description: "Próximos jogos de praças e tardes: taça, rodada da copa e o circuito da tarde.",
  path: "/calendario",
});

interface IDayListProps {
  rows: IFixture[];
}

const groupByDay = (rows: IFixture[]) => {
  const groups = new Map<string, IFixture[]>();
  rows.forEach((fixture) => {
    const key = dayKey(fixture.startsAt);
    groups.set(key, [...(groups.get(key) ?? []), fixture]);
  });
  return [...groups.entries()];
};

const DayList = (props: IDayListProps) => {
  const { rows } = props;
  return (
    <div className="mt-6 space-y-8">
      {groupByDay(rows).map(([key, dayRows]) => (
        <section key={key}>
          <h2 className="font-sans text-2xl capitalize font-semibold text-ink">{formatDay(dayRows[0].startsAt)}</h2>
          {dayRows.map((fixture) => (
            <FixtureRow key={fixture.id} fixture={fixture} />
          ))}
        </section>
      ))}
    </div>
  );
};

const CalendarPage = async () => {
  const [marked, liveFixtures, notes] = await Promise.all([
    getScheduledContextMatches(),
    loadDeskFixtures(),
    loadArticlesForPath("/calendario", 20),
  ]);
  const games = scheduledDeskFixtures(liveFixtures);
  const ahead = upcomingDeskFixtures(liveFixtures);
  const aheadIds = new Set(ahead.map((fixture) => fixture.id));
  const open = games.filter((fixture) => !aheadIds.has(fixture.id));

  const events = {
    "@context": "https://schema.org",
    "@graph": games.slice(0, 20).map((fixture) => ({
      "@type": "SportsEvent",
      name: `${sideName(fixture.homeSlug)} vs ${sideName(fixture.awaySlug)}`,
      startDate: fixture.startsAt,
      sport: "Soccer",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: { "@type": "Place", name: fixture.venue },
      organizer: { "@type": "NewsMediaOrganization", name: site.name, url: site.url },
    })),
  };

  return (
    <Container className="py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(events).replace(/</g, "\\u003c") }} />
      <PageHeader
        kicker="A disputar"
        title="Calendário"
        lede="A copa se joga de manhã. A taça, às 16h. O circuito fecha o domingo às 17:30. A semana de seleção não entra como jogo oficial."
      />
      {marked.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-sans text-2xl font-semibold text-ink">Seleção</h2>
          <p className="mt-2 text-sm text-muted">Jogos do feed. Não entram na Taça de Domingo.</p>
          {marked.map((match) => (
            <ContextRow key={match.id} match={match} />
          ))}
        </section>
      ) : null}
      {ahead.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-sans text-2xl font-semibold text-ink">Marcados</h2>
          <DayList rows={ahead} />
        </section>
      ) : null}
      {marked.length + ahead.length + open.length > 0 ? <AffiliateBanner preset="landscape" className="mt-8" /> : null}
      {open.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-sans text-2xl font-semibold text-ink">Súmula em aberto</h2>
          <p className="mt-2 text-sm text-muted">A data já passou. O placar entra quando a mesa assinar.</p>
          <DayList rows={open} />
        </section>
      ) : null}
      {marked.length === 0 && ahead.length === 0 && open.length === 0 ? (
        <p className="mt-8 max-w-2xl text-muted">Nenhum jogo programado na mesa por enquanto.</p>
      ) : null}
      <SectionNotes title="Notas do calendário" notes={notes} empty="Ainda não há notas do endpoint Calendário." />
    </Container>
  );
};

export default CalendarPage;
