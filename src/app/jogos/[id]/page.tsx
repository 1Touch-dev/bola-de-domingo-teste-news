import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TeamLogo } from "@/components/TeamLogo";
import { Container, PageHeader } from "@/components/ui";
import { getMatchPage } from "@/lib/football";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const { id } = await props.params;
  const numeric = Number(id);
  if (!Number.isFinite(numeric)) {
    return pageMetadata({ title: "Jogo", description: "Detalhe da partida.", path: `/jogos/${id}` });
  }
  const page = await getMatchPage(numeric);
  if (!page) {
    return pageMetadata({ title: "Jogo", description: "Detalhe da partida.", path: `/jogos/${id}` });
  }
  const title = `${page.match.home.name} × ${page.match.away.name}`;
  return pageMetadata({
    title,
    description: `${page.match.statusLabel} — ${page.match.kickoffLabel || page.match.detail}`,
    path: `/jogos/${id}`,
  });
};

const MatchDetailPage = async (props: PageProps) => {
  const { id } = await props.params;
  const numeric = Number(id);
  if (!Number.isFinite(numeric)) notFound();
  const page = await getMatchPage(numeric);
  if (!page) notFound();
  const { match, events } = page;
  const score =
    match.home.score != null && match.away.score != null ? `${match.home.score}–${match.away.score}` : "vs";

  return (
    <Container className="py-10">
      <PageHeader
        kicker={match.round || match.statusLabel}
        title={`${match.home.name} × ${match.away.name}`}
        lede={match.kickoffLabel ? `${match.kickoffLabel}${match.venue ? ` · ${match.venue}` : ""}` : match.detail}
      />

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 border border-line bg-panel px-4 py-8">
        <Link href={`/times/${match.home.id}`} className="flex min-w-0 flex-col items-center gap-2 text-center">
          <TeamLogo src={match.home.logo} label={match.home.name} size="sm" />
          <span className="max-w-40 text-sm font-semibold text-ink">{match.home.name}</span>
        </Link>
        <p className="score-text text-4xl font-bold text-ink">{score}</p>
        <Link href={`/times/${match.away.id}`} className="flex min-w-0 flex-col items-center gap-2 text-center">
          <TeamLogo src={match.away.logo} label={match.away.name} size="sm" />
          <span className="max-w-40 text-sm font-semibold text-ink">{match.away.name}</span>
        </Link>
      </div>

      <p className="mt-4 text-center text-sm text-muted">{match.detail}</p>

      <section className="mt-10">
        <h2 className="mb-4 font-sans text-2xl font-semibold text-ink">Lances</h2>
        {events.length > 0 ? (
          <ol className="border border-line bg-panel">
            {events.map((event, index) => (
              <li key={`${event.minute}-${event.player}-${index}`} className="flex gap-3 border-b border-line px-3 py-3 last:border-b-0">
                <span className="w-12 shrink-0 text-sm font-semibold tabular-nums text-highlight">{event.minute || "—"}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">
                    {event.player || event.detail}
                    {event.player ? ` · ${event.detail}` : ""}
                  </p>
                  <p className="text-xs text-muted">{event.teamName}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted">Sem eventos detalhados para esta partida.</p>
        )}
      </section>

      <p className="mt-8">
        <Link href="/futebol" className="utility-label text-xs font-semibold text-accent">
          Voltar ao futebol
        </Link>
      </p>
    </Container>
  );
};

export default MatchDetailPage;
