import { cache } from "react";
import { envConfig } from "@/config/env";
import { formatKickoff } from "@/lib/format";

/** API-Football via CMS proxy — Postman "API-Football CMS Collection". */
const API_BASE = envConfig.apiBaseUrl.replace(/\/$/, "");

export const SEASON = 2026;

export type LeagueSlug = "brasileirao" | "serie-b" | "copa-do-brasil" | "libertadores" | "selecao";

export type CompetitionMeta = {
  slug: LeagueSlug;
  name: string;
  leagueId: number;
  /** When set, fixtures are filtered by team instead of league standings. */
  teamId?: number;
};

/** Aligns with Brazil CMS desk feeds: Brasileirão, Série B, Copa, Libertadores, Seleção. */
export const COMPETITIONS: CompetitionMeta[] = [
  { slug: "brasileirao", name: "Brasileirão", leagueId: 71 },
  { slug: "serie-b", name: "Série B", leagueId: 72 },
  { slug: "copa-do-brasil", name: "Copa do Brasil", leagueId: 73 },
  { slug: "libertadores", name: "Libertadores", leagueId: 13 },
  { slug: "selecao", name: "Seleção", leagueId: 34, teamId: 6 },
];

const bySlug = new Map(COMPETITIONS.map((item) => [item.slug, item]));

export const competitionForSlug = (slug: string) => bySlug.get(slug as LeagueSlug);

const FINISHED = new Set(["FT", "AET", "PEN", "AWD", "WO"]);
const LIVE = new Set(["1H", "HT", "2H", "ET", "BT", "P", "LIVE", "INT", "SUSP"]);

export interface IFootballSide {
  id: number;
  name: string;
  logo?: string;
  score: number | null;
}

export interface IFootballMatch {
  id: number;
  date: string;
  kickoffLabel: string;
  status: "upcoming" | "live" | "finished";
  statusLabel: string;
  detail: string;
  round?: string;
  venue?: string;
  elapsed: number | null;
  home: IFootballSide;
  away: IFootballSide;
}

export interface IStanding {
  rank: number;
  teamId: number;
  name: string;
  logo?: string;
  played: number;
  win: number;
  draw: number;
  lose: number;
  goalsDiff: number;
  points: number;
  form: string;
}

export interface IScorer {
  id: number;
  name: string;
  photo?: string;
  teamId: number;
  teamName: string;
  teamLogo?: string;
  goals: number;
  assists: number;
}

export interface IFootballTeamRef {
  id: number;
  name: string;
  logo?: string;
}

export interface ILeagueBoard {
  competition: CompetitionMeta;
  upcoming: IFootballMatch[];
  completed: IFootballMatch[];
  standings: IStanding[];
  teams: IFootballTeamRef[];
  scorers: IScorer[];
}

export interface IMatchEvent {
  minute: string;
  teamName: string;
  player: string;
  detail: string;
  kind: "goal" | "card";
}

export interface IMatchPage {
  match: IFootballMatch;
  events: IMatchEvent[];
}

export interface ISquadPlayer {
  id: number;
  name: string;
  age?: number;
  number?: number;
  position: string;
  photo?: string;
}

export interface ITeamPage {
  id: number;
  name: string;
  logo?: string;
  code?: string;
  founded?: number;
  venue?: string;
  city?: string;
  capacity?: number;
  upcoming: IFootballMatch[];
  recent: IFootballMatch[];
  squad: ISquadPlayer[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const str = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

const num = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
  return null;
};

const listFrom = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (isRecord(value) && Array.isArray(value.response)) return value.response;
  return [];
};

const footballGet = async (path: string): Promise<unknown> => {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10000),
      next: { revalidate: 120 },
    });
    if (!response.ok) return null;
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
};

const classify = (short: string, long: string): IFootballMatch["status"] => {
  const code = short.toUpperCase();
  if (FINISHED.has(code) || /finished|after extra|after pen/i.test(long)) return "finished";
  if (LIVE.has(code) || (/half|live|extra time/i.test(long) && !/not started/i.test(long))) return "live";
  return "upcoming";
};

const statusLabelFor = (status: IFootballMatch["status"]) => {
  if (status === "live") return "Ao vivo";
  if (status === "finished") return "Encerrado";
  return "Não iniciado";
};

const detailLabelFor = (long: string, status: IFootballMatch["status"]) => {
  const known: Record<string, string> = {
    "Match Finished": "Encerrado",
    "Not Started": "Não iniciado",
    "First Half": "Primeiro tempo",
    "Second Half": "Segundo tempo",
    Halftime: "Intervalo",
    "Extra Time": "Prorrogação",
    "Break Time": "Intervalo",
    "Penalty In Progress": "Pênaltis",
    "Match Postponed": "Adiado",
    "Match Suspended": "Suspenso",
    "Time to be defined": "Horário a definir",
  };
  return known[long] ?? statusLabelFor(status);
};

const roundLabel = (round?: string) => {
  if (!round) return undefined;
  const regular = round.match(/regular season\s*-\s*(\d+)/i);
  return regular ? `Rodada ${regular[1]}` : round;
};

const mapSide = (value: unknown, score: unknown): IFootballSide | null => {
  if (!isRecord(value)) return null;
  const id = num(value.id);
  const name = str(value.name);
  if (id == null || !name) return null;
  return { id, name, logo: str(value.logo), score: num(score) };
};

const mapApiFixture = (raw: Record<string, unknown>): IFootballMatch | null => {
  const fixture = isRecord(raw.fixture) ? raw.fixture : null;
  const teams = isRecord(raw.teams) ? raw.teams : null;
  if (!fixture || !teams) return null;
  const id = num(fixture.id);
  const goals = isRecord(raw.goals) ? raw.goals : {};
  const home = mapSide(teams.home, goals.home);
  const away = mapSide(teams.away, goals.away);
  if (id == null || !home || !away) return null;
  const status = isRecord(fixture.status) ? fixture.status : {};
  const short = str(status.short) ?? "";
  const long = str(status.long) ?? short;
  const kind = classify(short, long);
  const league = isRecord(raw.league) ? raw.league : null;
  const venue = isRecord(fixture.venue) ? str(fixture.venue.name) : undefined;
  const date = str(fixture.date) ?? "";
  return {
    id,
    date,
    kickoffLabel: date ? formatKickoff(date) : "",
    status: kind,
    statusLabel: statusLabelFor(kind),
    detail: detailLabelFor(long, kind),
    round: roundLabel(league ? str(league.round) : undefined),
    venue,
    elapsed: num(status.elapsed),
    home,
    away,
  };
};

const mapMatch = (value: unknown): IFootballMatch | null => {
  if (!isRecord(value)) return null;
  if (isRecord(value.fixture) && isRecord(value.teams)) return mapApiFixture(value);
  return null;
};

const matchesFrom = (payload: unknown): IFootballMatch[] =>
  listFrom(payload).flatMap((row) => {
    const match = mapMatch(row);
    return match ? [match] : [];
  });

const mapStanding = (value: unknown): IStanding | null => {
  if (!isRecord(value) || !isRecord(value.team)) return null;
  const id = num(value.team.id);
  const name = str(value.team.name);
  const rank = num(value.rank);
  if (id == null || !name || rank == null) return null;
  const all = isRecord(value.all) ? value.all : {};
  return {
    rank,
    teamId: id,
    name,
    logo: str(value.team.logo),
    played: num(all.played) ?? 0,
    win: num(all.win) ?? 0,
    draw: num(all.draw) ?? 0,
    lose: num(all.lose) ?? 0,
    goalsDiff: num(value.goalsDiff) ?? 0,
    points: num(value.points) ?? 0,
    form: str(value.form) ?? "",
  };
};

const standingsFrom = (payload: unknown): IStanding[] => {
  const response = listFrom(payload);
  const flat: unknown[] = [];
  for (const item of response) {
    if (!isRecord(item)) continue;
    const league = isRecord(item.league) ? item.league : item;
    const groups = league.standings;
    if (!Array.isArray(groups)) continue;
    for (const group of groups) {
      if (Array.isArray(group)) flat.push(...group);
      else flat.push(group);
    }
  }
  return flat
    .flatMap((row) => {
      const standing = mapStanding(row);
      return standing ? [standing] : [];
    })
    .sort((a, b) => a.rank - b.rank);
};

const mapScorer = (value: unknown): IScorer | null => {
  if (!isRecord(value)) return null;
  const player = isRecord(value.player) ? value.player : value;
  const stats = Array.isArray(value.statistics) ? value.statistics[0] : value.statistics;
  const stat = isRecord(stats) ? stats : {};
  const id = num(player.id);
  const name = str(player.name);
  if (id == null || !name) return null;
  const team = isRecord(stat.team) ? stat.team : {};
  const goalsNode = isRecord(stat.goals) ? stat.goals : {};
  const assistsNode = isRecord(stat.assists) ? stat.assists : null;
  return {
    id,
    name,
    photo: str(player.photo),
    teamId: num(team.id) ?? 0,
    teamName: str(team.name) ?? "",
    teamLogo: str(team.logo),
    goals: num(goalsNode.total) ?? 0,
    assists: num(goalsNode.assists) ?? (assistsNode ? num(assistsNode.total) : num(stat.assists)) ?? 0,
  };
};

const scorersFrom = (payload: unknown): IScorer[] =>
  listFrom(payload).flatMap((row) => {
    const scorer = mapScorer(row);
    return scorer ? [scorer] : [];
  });

const mapTeam = (value: unknown): IFootballTeamRef | null => {
  if (!isRecord(value)) return null;
  const team = isRecord(value.team) ? value.team : value;
  const id = num(team.id);
  const name = str(team.name);
  if (id == null || !name) return null;
  return { id, name, logo: str(team.logo) };
};

const teamsFrom = (payload: unknown): IFootballTeamRef[] =>
  listFrom(payload).flatMap((row) => {
    const team = mapTeam(row);
    return team ? [team] : [];
  });

const byDateAsc = (a: IFootballMatch, b: IFootballMatch) => a.date.localeCompare(b.date);
const byDateDesc = (a: IFootballMatch, b: IFootballMatch) => b.date.localeCompare(a.date);

export const getLeagueBoard = cache(async (slug: string): Promise<ILeagueBoard | null> => {
  const competition = competitionForSlug(slug) ?? COMPETITIONS[0];
  const { leagueId, teamId } = competition;

  const fixtureBase = teamId
    ? `/football/fixtures?team=${teamId}&season=${SEASON}`
    : `/football/fixtures?league=${leagueId}&season=${SEASON}`;

  const [nextPayload, lastPayload, standingsPayload, scorersPayload, teamsPayload] = await Promise.all([
    footballGet(`${fixtureBase}&next=12`),
    footballGet(`${fixtureBase}&last=12`),
    teamId ? Promise.resolve(null) : footballGet(`/football/standings?league=${leagueId}&season=${SEASON}`),
    teamId ? Promise.resolve(null) : footballGet(`/football/topscorers?league=${leagueId}&season=${SEASON}`),
    teamId ? Promise.resolve(null) : footballGet(`/football/teams?league=${leagueId}&season=${SEASON}`),
  ]);

  const upcoming = matchesFrom(nextPayload)
    .filter((match) => match.status !== "finished")
    .sort(byDateAsc)
    .slice(0, 12);
  const completed = matchesFrom(lastPayload)
    .filter((match) => match.status === "finished")
    .sort(byDateDesc)
    .slice(0, 12);
  const standings = standingsFrom(standingsPayload);
  const scorers = scorersFrom(scorersPayload)
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
    .slice(0, 15);
  const teams =
    teamsFrom(teamsPayload).length > 0
      ? teamsFrom(teamsPayload)
      : standings.map((row) => ({ id: row.teamId, name: row.name, logo: row.logo }));

  if (!upcoming.length && !completed.length && !standings.length && !scorers.length) return null;

  return { competition, upcoming, completed, standings, teams, scorers };
});

/** Recent finished + upcoming across desk competitions (Resultados / Calendário). */
export const getCrossLeagueFixtures = cache(async (): Promise<{ upcoming: IFootballMatch[]; completed: IFootballMatch[] }> => {
  const batches = await Promise.all(
    COMPETITIONS.map(async (competition) => {
      const fixtureBase = competition.teamId
        ? `/football/fixtures?team=${competition.teamId}&season=${SEASON}`
        : `/football/fixtures?league=${competition.leagueId}&season=${SEASON}`;
      const [nextPayload, lastPayload] = await Promise.all([
        footballGet(`${fixtureBase}&next=8`),
        footballGet(`${fixtureBase}&last=8`),
      ]);
      return {
        upcoming: matchesFrom(nextPayload).filter((match) => match.status !== "finished"),
        completed: matchesFrom(lastPayload).filter((match) => match.status === "finished"),
      };
    }),
  );

  const upcoming: IFootballMatch[] = [];
  const completed: IFootballMatch[] = [];
  const seenUp = new Set<number>();
  const seenDone = new Set<number>();

  for (const batch of batches) {
    for (const match of batch.upcoming) {
      if (seenUp.has(match.id)) continue;
      seenUp.add(match.id);
      upcoming.push(match);
    }
    for (const match of batch.completed) {
      if (seenDone.has(match.id)) continue;
      seenDone.add(match.id);
      completed.push(match);
    }
  }

  return {
    upcoming: upcoming.sort(byDateAsc).slice(0, 24),
    completed: completed.sort(byDateDesc).slice(0, 24),
  };
});

const eventDetailLabel = (detail: string) => {
  const labels: Record<string, string> = {
    "Normal Goal": "Gol",
    "Own Goal": "Gol contra",
    Penalty: "Pênalti",
    "Missed Penalty": "Pênalti perdido",
    "Yellow Card": "Amarelo",
    "Red Card": "Vermelho",
    "Second Yellow card": "Segundo amarelo",
  };
  return labels[detail] ?? detail;
};

const mapEvents = (value: unknown): IMatchEvent[] =>
  listFrom(value).flatMap((item) => {
    if (!isRecord(item)) return [];
    const type = str(item.type) ?? "";
    const kind = /goal/i.test(type) ? "goal" : /card/i.test(type) ? "card" : null;
    if (!kind) return [];
    const time = isRecord(item.time) ? item.time : {};
    const elapsed = num(time.elapsed);
    const extra = num(time.extra);
    const minute = elapsed == null ? "" : extra ? `${elapsed}+${extra}'` : `${elapsed}'`;
    const detail = str(item.detail) ?? type;
    return [
      {
        minute,
        teamName: isRecord(item.team) ? (str(item.team.name) ?? "") : "",
        player: isRecord(item.player) ? (str(item.player.name) ?? "") : "",
        detail: eventDetailLabel(detail),
        kind,
      },
    ];
  });

export const getMatchPage = cache(async (id: number): Promise<IMatchPage | null> => {
  const [fixturePayload, eventsPayload] = await Promise.all([
    footballGet(`/football/fixtures?id=${id}`),
    footballGet(`/football/events?fixture=${id}`),
  ]);
  const raw = listFrom(fixturePayload)[0];
  const match = mapMatch(raw);
  if (!match) return null;
  const embedded = isRecord(raw) ? mapEvents(raw.events) : [];
  const events = embedded.length > 0 ? embedded : mapEvents(eventsPayload);
  return { match, events };
});

const positionLabel = (value?: string) => {
  if (!value) return "Elenco";
  const labels: Record<string, string> = {
    Goalkeeper: "Goleiro",
    Defender: "Zagueiro",
    Midfielder: "Meia",
    Attacker: "Atacante",
    Forward: "Atacante",
  };
  return labels[value] ?? value;
};

const POSITION_ORDER = ["Goleiro", "Zagueiro", "Meia", "Atacante", "Elenco"];

const squadFrom = (payload: unknown): ISquadPlayer[] => {
  const players: ISquadPlayer[] = [];
  for (const row of listFrom(payload)) {
    if (!isRecord(row)) continue;
    const list = Array.isArray(row.players) ? row.players : [row];
    for (const item of list) {
      if (!isRecord(item)) continue;
      const player = isRecord(item.player) ? item.player : item;
      const id = num(player.id);
      const name = str(player.name);
      if (id == null || !name) continue;
      players.push({
        id,
        name,
        age: num(player.age) ?? undefined,
        number: num(player.number) ?? undefined,
        position: positionLabel(str(player.position)),
        photo: str(player.photo),
      });
    }
  }
  return players;
};

const seasonSquadFrom = (payload: unknown): ISquadPlayer[] =>
  listFrom(payload).flatMap((row) => {
    if (!isRecord(row) || !isRecord(row.player)) return [];
    const stats = Array.isArray(row.statistics) ? row.statistics.find(isRecord) : undefined;
    const games = stats && isRecord(stats.games) ? stats.games : {};
    const id = num(row.player.id);
    const name = str(row.player.name);
    if (id == null || !name) return [];
    return [
      {
        id,
        name,
        age: num(row.player.age) ?? undefined,
        number: num(games.number) ?? num(row.player.number) ?? undefined,
        position: positionLabel(str(games.position) ?? str(row.player.position)),
        photo: str(row.player.photo),
      },
    ];
  });

const sortSquad = (players: ISquadPlayer[]) =>
  [...players].sort((a, b) => {
    const pos = POSITION_ORDER.indexOf(a.position) - POSITION_ORDER.indexOf(b.position);
    if (pos !== 0) return pos;
    const numA = a.number ?? 999;
    const numB = b.number ?? 999;
    if (numA !== numB) return numA - numB;
    return a.name.localeCompare(b.name, "pt-BR");
  });

export const getSquad = cache(async (teamId: number): Promise<ISquadPlayer[]> => {
  const listed = squadFrom(await footballGet(`/football/players-squads?team=${teamId}`));
  if (listed.length > 0) return sortSquad(listed);
  for (const season of [SEASON, SEASON - 1]) {
    const players = seasonSquadFrom(await footballGet(`/football/players?team=${teamId}&season=${season}`));
    if (players.length > 0) return sortSquad(players);
  }
  return [];
});

export const getTeamPage = cache(async (teamId: number): Promise<ITeamPage | null> => {
  const [teamPayload, nextPayload, lastPayload, squad] = await Promise.all([
    footballGet(`/football/teams?id=${teamId}&season=${SEASON}`),
    footballGet(`/football/fixtures?team=${teamId}&season=${SEASON}&next=6`),
    footballGet(`/football/fixtures?team=${teamId}&season=${SEASON}&last=8`),
    getSquad(teamId),
  ]);
  const rows = listFrom(teamPayload);
  const found = rows.find((row) => isRecord(row) && isRecord(row.team) && num(row.team.id) === teamId);
  const row = isRecord(found) ? found : rows.find(isRecord);
  if (!isRecord(row) || !isRecord(row.team)) return null;
  const name = str(row.team.name);
  if (!name) return null;
  const venue = isRecord(row.venue) ? row.venue : {};
  return {
    id: teamId,
    name,
    logo: str(row.team.logo),
    code: str(row.team.code),
    founded: num(row.team.founded) ?? undefined,
    venue: str(venue.name),
    city: str(venue.city),
    capacity: num(venue.capacity) ?? undefined,
    upcoming: matchesFrom(nextPayload)
      .filter((match) => match.status !== "finished")
      .sort(byDateAsc)
      .slice(0, 5),
    recent: matchesFrom(lastPayload)
      .filter((match) => match.status === "finished")
      .sort(byDateDesc)
      .slice(0, 5),
    squad,
  };
});
