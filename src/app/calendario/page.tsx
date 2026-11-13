import AffiliateBanner from "@/components/affiliate/AffiliateBanner";
import type { Metadata } from "next";
import Link from "next/link";
import { MatchRow } from "@/components/football/FootballBoard";
import { SectionNotes } from "@/components/SectionNotes";
import { site } from "@/config/site";
import { loadArticlesForPath } from "@/lib/deskArticles";
import type { IFootballMatch } from "@/lib/football";
import { getCrossLeagueFixtures } from "@/lib/football";
import { dayKey, formatDay } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/ui";

export const revalidate = 120;

export const metadata: Metadata = pageMetadata({
  title: "Calendário",
  description: "Próximos jogos de Brasileirão, Série B, Copa do Brasil, Libertadores e Seleção.",
  path: "/calendario",
});

const groupByDay = (rows: IFootballMatch[]) => {
  const groups = new Map<string, IFootballMatch[]>();
  rows.forEach((match) => {
    const key = dayKey(match.date);
    groups.set(key, [...(groups.get(key) ?? []), match]);
  });
  return [...groups.entries()];
};

interface IDayListProps {
  rows: IFootballMatch[];
}

const DayList = (props: IDayListProps) => {
  const { rows } = props;
  return (
    <div className="mt-6 space-y-8">
      {groupByDay(rows).map(([key, dayRows]) => (
        <section key={key}>
          <h2 className="font-sans text-2xl capitalize font-semibold text-ink">{formatDay(dayRows[0].date)}</h2>
          {dayRows.map((match) => (
            <MatchRow key={match.id} match={match} />
          ))}
        </section>
      ))}
    </div>
  );
};

const CalendarPage = async () => {
  const [{ upcoming }, notes] = await Promise.all([
    getCrossLeagueFixtures(),
    loadArticlesForPath("/calendario", 20),
  ]);

  const events = {
    "@context": "https://schema.org",
    "@graph": upcoming.slice(0, 20).map((match) => ({
      "@type": "SportsEvent",
      name: `${match.home.name} vs ${match.away.name}`,
      startDate: match.date,
      sport: "Soccer",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: { "@type": "Place", name: match.venue || site.city },
      organizer: { "@type": "NewsMediaOrganization", name: site.name, url: site.url },
    })),
  };

  return (
    <Container className="py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(events).replace(/</g, "\\u003c") }} />
      <PageHeader
        kicker="A disputar"
        title="Calendário"
        lede="Próximos jogos das competições cobertas pela mesa via API-Football CMS. Abra o jogo para a súmula."
      />
      {upcoming.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-sans text-2xl font-semibold text-ink">Marcados</h2>
          <DayList rows={upcoming} />
        </section>
      ) : (
        <p className="mt-8 max-w-2xl text-muted">Nenhum jogo programado nas competições cobertas por enquanto.</p>
      )}
      {upcoming.length > 0 ? <AffiliateBanner preset="landscape" className="mt-8" /> : null}
      <p className="mt-6">
        <Link href="/futebol" className="utility-label text-xs font-semibold text-accent">
          Ver futebol completo
        </Link>
      </p>
      <SectionNotes
        title="Notas do calendário"
        notes={notes}
        empty="Ainda não há notas dos feeds Brasileirão, Libertadores ou Seleção."
      />
    </Container>
  );
};

export default CalendarPage;
