import Link from "next/link";
import { TeamLogo } from "@/components/TeamLogo";
import type { IFootballMatch, ILeagueBoard, IScorer, IStanding } from "@/lib/football";
import { COMPETITIONS } from "@/lib/football";

const scoreMark = (match: IFootballMatch) => {
  if (match.home.score == null || match.away.score == null) return "vs";
  return `${match.home.score}–${match.away.score}`;
};

interface IMatchRowProps {
  match: IFootballMatch;
}

export const MatchRow = (props: IMatchRowProps) => {
  const { match } = props;
  const live = match.status === "live";

  return (
    <Link
      href={`/jogos/${match.id}`}
      className="grid min-w-0 items-center gap-2 border-b border-line py-3 sm:grid-cols-[8.5rem_minmax(0,1fr)]"
    >
      <div className="min-w-0">
        <p className="text-xs capitalize text-muted">{match.kickoffLabel || match.statusLabel}</p>
        {match.round ? <p className="utility-label mt-0.5 text-[10px] text-muted">{match.round}</p> : null}
      </div>
      <div className="min-w-0">
        <p className={`utility-label text-[11px] font-semibold ${live ? "text-highlight" : "text-muted"}`}>
          {live && match.elapsed != null ? `${match.statusLabel} ${match.elapsed}'` : match.statusLabel}
        </p>
        <div className="mt-1 grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          <p className="flex min-w-0 items-center justify-end gap-2 text-right text-sm font-medium">
            <span className="truncate">{match.home.name}</span>
            <TeamLogo src={match.home.logo} label={match.home.name} size="xs" />
          </p>
          <p
            className={`score-text min-w-12 px-2 py-0.5 text-center text-sm font-semibold ${
              live || match.status === "finished" ? "bg-accent text-panel" : "bg-line text-ink"
            }`}
          >
            {scoreMark(match)}
          </p>
          <p className="flex min-w-0 items-center gap-2 text-sm font-medium">
            <TeamLogo src={match.away.logo} label={match.away.name} size="xs" />
            <span className="truncate">{match.away.name}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

interface IStandingsBlockProps {
  rows: IStanding[];
}

const StandingsBlock = (props: IStandingsBlockProps) => {
  const { rows } = props;
  if (rows.length === 0) return null;

  return (
    <section className="min-w-0">
      <h2 className="mb-4 font-sans text-2xl font-semibold text-ink">Classificação</h2>
      <div className="max-w-full overflow-x-auto border border-line bg-panel">
        <table className="w-full text-left text-[0.95rem]">
          <thead className="utility-label bg-asphalt text-[11px] text-panel">
            <tr>
              <th scope="col" className="px-2 py-2 font-semibold sm:px-3">
                #
              </th>
              <th scope="col" className="px-2 py-2 font-semibold sm:px-3">
                Time
              </th>
              <th scope="col" className="px-2 py-2 text-right font-semibold sm:px-3">
                J
              </th>
              <th scope="col" className="px-2 py-2 text-right font-semibold sm:px-3">
                SG
              </th>
              <th scope="col" className="px-2 py-2 text-right font-semibold sm:px-3">
                Pts
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.teamId} className="border-t border-line">
                <td className="px-2 py-3 font-semibold text-highlight tabular-nums sm:px-3">{row.rank}</td>
                <td className="px-2 py-3 sm:px-3">
                  <Link href={`/times/${row.teamId}`} className="flex min-w-0 items-center gap-2 font-medium hover:text-accent">
                    <TeamLogo src={row.logo} label={row.name} size="xs" />
                    <span className="truncate">{row.name}</span>
                  </Link>
                </td>
                <td className="px-2 py-3 text-right tabular-nums text-muted sm:px-3">{row.played}</td>
                <td className="px-2 py-3 text-right tabular-nums text-muted sm:px-3">
                  {row.goalsDiff > 0 ? `+${row.goalsDiff}` : row.goalsDiff}
                </td>
                <td className="score-text px-2 py-3 text-right text-base font-bold text-ink sm:px-3">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

interface IScorersBlockProps {
  rows: IScorer[];
}

const ScorersBlock = (props: IScorersBlockProps) => {
  const { rows } = props;
  if (rows.length === 0) return null;

  return (
    <section className="min-w-0">
      <h2 className="mb-4 font-sans text-2xl font-semibold text-ink">Artilharia</h2>
      <ol className="border border-line bg-panel">
        {rows.slice(0, 10).map((row, index) => (
          <li key={row.id} className="flex items-center gap-3 border-b border-line px-3 py-3 last:border-b-0">
            <span className="w-6 text-sm font-semibold text-highlight tabular-nums">{index + 1}</span>
            <TeamLogo src={row.photo || row.teamLogo} label={row.name} size="xs" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{row.name}</p>
              <p className="truncate text-xs text-muted">{row.teamName}</p>
            </div>
            <p className="score-text text-base font-bold text-ink">{row.goals}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};

interface ILeagueTabsProps {
  active: string;
}

export const LeagueTabs = (props: ILeagueTabsProps) => {
  const { active } = props;

  return (
    <ul className="flex flex-wrap gap-1 border-b border-line pb-3">
      {COMPETITIONS.map((item) => {
        const selected = item.slug === active;
        return (
          <li key={item.slug}>
            <Link
              href={`/futebol?liga=${item.slug}`}
              className={`utility-label block px-3 py-2 text-xs font-semibold ${
                selected ? "bg-accent text-panel" : "text-muted hover:bg-line hover:text-ink"
              }`}
              aria-current={selected ? "page" : undefined}
            >
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

interface IFootballBoardProps {
  board: ILeagueBoard;
}

export const FootballBoard = (props: IFootballBoardProps) => {
  const { board } = props;
  const { upcoming, completed, standings, scorers, teams } = board;

  return (
    <div className="mt-8 grid gap-10">
      <section>
        <h2 className="mb-2 font-sans text-2xl font-semibold text-ink">Próximos jogos</h2>
        {upcoming.length > 0 ? (
          <div>{upcoming.map((match) => <MatchRow key={match.id} match={match} />)}</div>
        ) : (
          <p className="text-sm text-muted">Sem jogos agendados nesta competição por enquanto.</p>
        )}
      </section>

      <section>
        <h2 className="mb-2 font-sans text-2xl font-semibold text-ink">Últimos resultados</h2>
        {completed.length > 0 ? (
          <div>{completed.map((match) => <MatchRow key={match.id} match={match} />)}</div>
        ) : (
          <p className="text-sm text-muted">Ainda não há resultados nesta janela.</p>
        )}
      </section>

      <div className="grid gap-10 lg:grid-cols-2">
        <StandingsBlock rows={standings} />
        <ScorersBlock rows={scorers} />
      </div>

      {teams.length > 0 ? (
        <section>
          <h2 className="mb-4 font-sans text-2xl font-semibold text-ink">Clubes</h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <li key={team.id}>
                <Link
                  href={`/times/${team.id}`}
                  className="flex items-center gap-3 border border-line bg-panel px-3 py-3 hover:border-accent"
                >
                  <TeamLogo src={team.logo} label={team.name} size="sm" />
                  <span className="truncate text-sm font-medium">{team.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
};
