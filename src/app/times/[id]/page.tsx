import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TeamLogo } from "@/components/TeamLogo";
import { Container, Crumb, SectionHeading } from "@/components/ui";
import type { IFootballMatch, ISquadPlayer, ITeamPage } from "@/lib/football";
import { getTeamPage, SEASON } from "@/lib/football";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 120;

type PageProps = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const { id } = await props.params;
  const numeric = Number(id);
  if (!Number.isFinite(numeric)) {
    return pageMetadata({ title: "Time", description: "Perfil do clube.", path: `/times/${id}` });
  }
  const page = await getTeamPage(numeric);
  if (!page) {
    return pageMetadata({ title: "Time", description: "Perfil do clube.", path: `/times/${id}` });
  }
  return pageMetadata({
    title: page.name,
    description: `Elenco, jogos e perfil de ${page.name} na mesa da Bola de Domingo.`,
    path: `/times/${id}`,
  });
};

const scoreMark = (match: IFootballMatch) => {
  if (match.home.score == null || match.away.score == null) return "vs";
  return `${match.home.score}–${match.away.score}`;
};

const formFrom = (rows: IFootballMatch[], teamId: number): Array<"V" | "D" | "E"> => {
  const marks: Array<"V" | "D" | "E"> = [];
  for (const match of rows.slice(0, 5)) {
    const home = match.home.id === teamId;
    const us = home ? match.home.score : match.away.score;
    const them = home ? match.away.score : match.home.score;
    if (us == null || them == null) continue;
    if (us > them) marks.push("V");
    else if (us < them) marks.push("D");
    else marks.push("E");
  }
  return marks;
};

const MatchStrip = (props: { title: string; rows: IFootballMatch[]; empty: string }) => {
  const { title, rows, empty } = props;
  return (
    <section>
      <SectionHeading title={title} />
      {rows.length === 0 ? (
        <p className="text-sm text-muted">{empty}</p>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {rows.map((match) => (
            <li key={match.id}>
              <Link
                href={`/jogos/${match.id}`}
                className="grid min-w-0 items-center gap-3 py-3.5 transition-colors hover:bg-panel sm:grid-cols-[7.5rem_minmax(0,1fr)_auto]"
              >
                <div className="min-w-0">
                  <p className="text-xs capitalize text-muted">{match.kickoffLabel || match.statusLabel}</p>
                  {match.round ? <p className="utility-label mt-0.5 text-[10px] text-muted">{match.round}</p> : null}
                </div>
                <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                  <p className="flex min-w-0 items-center justify-end gap-2 text-right text-sm font-medium">
                    <span className="truncate">{match.home.name}</span>
                    <TeamLogo src={match.home.logo} label={match.home.name} size="xs" />
                  </p>
                  <span
                    className={`score-text min-w-12 px-2 py-0.5 text-center text-sm font-semibold ${
                      match.status === "finished" || match.status === "live" ? "bg-accent text-panel" : "bg-line text-ink"
                    }`}
                  >
                    {scoreMark(match)}
                  </span>
                  <p className="flex min-w-0 items-center gap-2 text-sm font-medium">
                    <TeamLogo src={match.away.logo} label={match.away.name} size="xs" />
                    <span className="truncate">{match.away.name}</span>
                  </p>
                </div>
                <p className="hidden text-xs text-muted sm:block">{match.statusLabel}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

const groupSquad = (squad: ISquadPlayer[]) => {
  const groups = new Map<string, ISquadPlayer[]>();
  for (const player of squad) {
    const key = player.position || "Elenco";
    groups.set(key, [...(groups.get(key) ?? []), player]);
  }
  return [...groups.entries()];
};

const SquadBlock = (props: { squad: ISquadPlayer[] }) => {
  const { squad } = props;
  const groups = groupSquad(squad);

  if (squad.length === 0) {
    return (
      <section>
        <SectionHeading title="Elenco" />
        <p className="text-sm text-muted">Elenco ainda não disponível para este clube nesta temporada.</p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3 border-b-2 border-asphalt pb-3">
        <h2 className="font-display text-2xl leading-tight font-semibold text-ink sm:text-[2rem]">Elenco</h2>
        <p className="utility-label text-[11px] font-semibold text-muted">{squad.length} jogadores</p>
      </div>
      <nav aria-label="Posições" className="mb-5 flex flex-wrap gap-1">
        {groups.map(([position, players]) => (
          <a
            key={position}
            href={`#pos-${position.toLowerCase()}`}
            className="utility-label border border-line bg-panel px-2.5 py-1.5 text-[10px] font-semibold text-muted hover:border-accent hover:text-accent"
          >
            {position} · {players.length}
          </a>
        ))}
      </nav>
      <div className="space-y-8">
        {groups.map(([position, players]) => (
          <div key={position} id={`pos-${position.toLowerCase()}`}>
            <div className="mb-2 flex items-end justify-between border-b border-asphalt pb-2">
              <h3 className="utility-label text-[11px] font-semibold text-accent">{position}</h3>
              <p className="text-xs text-muted">{players.length}</p>
            </div>
            <ul className="divide-y divide-line">
              {players.map((player) => (
                <li key={player.id} className="flex items-center gap-3 py-2.5">
                  <span className="score-text w-8 shrink-0 text-center text-sm font-semibold tabular-nums text-highlight">
                    {player.number != null ? player.number : "—"}
                  </span>
                  <TeamLogo src={player.photo} label={player.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{player.name}</p>
                    <p className="text-xs text-muted">{player.age != null ? `${player.age} anos` : position}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

const ClubHero = (props: { page: ITeamPage; form: string[] }) => {
  const { page, form } = props;
  const place = [page.venue, page.city].filter(Boolean).join(" · ");
  const meta = [
    page.code ? page.code : null,
    page.founded ? `Fundado em ${page.founded}` : null,
    page.capacity ? `${page.capacity.toLocaleString("pt-BR")} lugares` : null,
    `Temporada ${SEASON}`,
  ].filter(Boolean);

  return (
    <header className="border-b-2 border-asphalt pb-8">
      <Crumb
        items={[
          { href: "/", label: "Início" },
          { href: "/futebol", label: "Futebol" },
          { label: page.name },
        ]}
      />
      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 items-start gap-5">
          <div className="shrink-0 border border-line bg-panel p-3">
            <TeamLogo src={page.logo} label={page.name} size="lg" />
          </div>
          <div className="min-w-0">
            <p className="utility-label text-[11px] font-semibold text-accent">Clube</p>
            <h1 className="mt-2 font-display text-4xl leading-[1.02] font-semibold text-ink sm:text-5xl">{page.name}</h1>
            {place ? <p className="mt-3 max-w-xl text-[1.05rem] leading-7 text-muted">{place}</p> : null}
            {meta.length > 0 ? <p className="mt-2 text-sm text-muted">{meta.join(" · ")}</p> : null}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {form.length > 0 ? (
            <div className="flex items-center gap-1.5" aria-label="Últimos resultados">
              {form.map((mark, index) => (
                <span
                  key={`${mark}-${index}`}
                  className={`score-text grid size-8 place-items-center text-xs font-bold ${
                    mark === "V" ? "bg-accent text-panel" : mark === "D" ? "bg-asphalt text-panel" : "bg-line text-ink"
                  }`}
                >
                  {mark}
                </span>
              ))}
            </div>
          ) : null}
          <Link
            href="/futebol"
            className="utility-label bg-asphalt px-3 py-2.5 text-xs font-semibold text-panel hover:bg-accent"
          >
            Ver competições
          </Link>
        </div>
      </div>
      <dl className="mt-6 grid grid-cols-3 gap-px overflow-hidden border border-line bg-line sm:max-w-md">
        <div className="bg-panel px-3 py-3">
          <dt className="utility-label text-[10px] text-muted">Elenco</dt>
          <dd className="score-text mt-1 text-2xl font-semibold text-ink">{page.squad.length || "—"}</dd>
        </div>
        <div className="bg-panel px-3 py-3">
          <dt className="utility-label text-[10px] text-muted">Próximos</dt>
          <dd className="score-text mt-1 text-2xl font-semibold text-ink">{page.upcoming.length || "—"}</dd>
        </div>
        <div className="bg-panel px-3 py-3">
          <dt className="utility-label text-[10px] text-muted">Recentes</dt>
          <dd className="score-text mt-1 text-2xl font-semibold text-ink">{page.recent.length || "—"}</dd>
        </div>
      </dl>
    </header>
  );
};

const TeamDetailPage = async (props: PageProps) => {
  const { id } = await props.params;
  const numeric = Number(id);
  if (!Number.isFinite(numeric)) notFound();
  const page = await getTeamPage(numeric);
  if (!page) notFound();
  const form = formFrom(page.recent, page.id);

  return (
    <Container className="py-10">
      <ClubHero page={page} form={form} />
      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
        <div className="space-y-12">
          <MatchStrip title="Próximos" rows={page.upcoming} empty="Sem jogos marcados nesta janela." />
          <MatchStrip title="Recentes" rows={page.recent} empty="Sem resultados recentes nesta janela." />
        </div>
        <div id="elenco" className="lg:sticky lg:top-6">
          <SquadBlock squad={page.squad} />
        </div>
      </div>
    </Container>
  );
};

export default TeamDetailPage;
