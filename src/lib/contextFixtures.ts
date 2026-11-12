import { cache } from "react";
import { envConfig } from "@/config/env";

export interface IContextMatch {
  id: string;
  competition: string;
  homeName: string;
  awayName: string;
  homeLogo: string;
  awayLogo: string;
  score?: string;
  startsAt: string;
}

const SEASON = 2026;
const TEAM_IDS = [6];
const FINISHED = new Set(["FT", "AET", "PEN"]);
const NAMES: Record<number, string> = { 6: "Brasil" };

const asRecord = (value: unknown) => (typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {});
const text = (value: unknown) => (typeof value === "string" ? value : "");

const logoOf = (team: Record<string, unknown>) => {
  const logo = text(team.logo);
  return logo.startsWith("https://") ? logo : "";
};

const teamName = (team: Record<string, unknown>) => {
  const id = typeof team.id === "number" ? team.id : 0;
  return NAMES[id] ?? text(team.name);
};

const toMatch = (value: unknown): IContextMatch | null => {
  const row = asRecord(value);
  const fixture = asRecord(row.fixture);
  const teams = asRecord(row.teams);
  const home = asRecord(teams.home);
  const away = asRecord(teams.away);
  const goals = asRecord(row.goals);
  const league = asRecord(row.league);
  const status = asRecord(fixture.status);
  const homeLogo = logoOf(home);
  const awayLogo = logoOf(away);
  const homeName = teamName(home);
  const awayName = teamName(away);
  if (!homeLogo || !awayLogo || !homeName || !awayName) return null;
  const short = text(status.short).toUpperCase();
  const homeGoals = goals.home;
  const awayGoals = goals.away;
  const score =
    FINISHED.has(short) && typeof homeGoals === "number" && typeof awayGoals === "number"
      ? `${homeGoals}–${awayGoals}`
      : undefined;
  return {
    id: String(fixture.id ?? `${homeName}-${awayName}-${text(fixture.date)}`),
    competition: text(league.name) || "Seleção",
    homeName,
    awayName,
    homeLogo,
    awayLogo,
    score,
    startsAt: text(fixture.date),
  };
};

const loadTeam = async (teamId: number, query: string): Promise<IContextMatch[]> => {
  try {
    const response = await fetch(
      `${envConfig.apiBaseUrl}/football/fixtures?team=${teamId}&season=${SEASON}&${query}`,
      { signal: AbortSignal.timeout(8000), next: { revalidate: 3600 } },
    );
    if (!response.ok) return [];
    const body = asRecord(await response.json());
    const rows = Array.isArray(body.response) ? body.response : [];
    return rows.flatMap((row) => {
      const match = toMatch(row);
      return match ? [match] : [];
    });
  } catch {
    return [];
  }
};

const loadFixtures = async (query: string) => {
  const batches = await Promise.all(TEAM_IDS.map((teamId) => loadTeam(teamId, query)));
  const seen = new Set<string>();
  return batches.flat().filter((match) => {
    if (seen.has(match.id)) return false;
    seen.add(match.id);
    return true;
  });
};

export const getContextMatches = cache(async () => {
  const rows = await loadFixtures("last=2");
  return rows.filter((match) => match.score).sort((a, b) => b.startsAt.localeCompare(a.startsAt));
});

export const getScheduledContextMatches = cache(async () => {
  const rows = await loadFixtures("next=2");
  return rows.filter((match) => !match.score).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
});
