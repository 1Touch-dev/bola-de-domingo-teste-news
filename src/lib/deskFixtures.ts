import { cache } from "react";
import type { IFootballMatch } from "@/apis/matches/matches.type";
import { envConfig } from "@/config/env";
import { sortTable, tableFrom, pracas, tardes } from "@/data";
import { CategoriaSlugEnum, FixtureStatusEnum } from "@/types";
import type { IFixture } from "@/types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isFootballMatch = (value: unknown): value is IFootballMatch => isRecord(value);

const asText = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const slugForName = (name: string): string | null => {
  const key = name.trim().toLowerCase();
  if (!key) return null;
  const praca = pracas.find(
    (item) => item.slug === key || item.name.toLowerCase() === key || item.shortName.toLowerCase() === key,
  );
  if (praca) return praca.slug;
  const tarde = tardes.find((item) => item.slug === key || item.name.toLowerCase() === key);
  return tarde ? tarde.slug : null;
};

const scoreOf = (team: unknown): number | null => {
  if (!isRecord(team) || typeof team.score !== "number" || !Number.isFinite(team.score)) return null;
  return team.score;
};

const categoriaFor = (homeSlug: string, awaySlug: string, matchday: string): CategoriaSlugEnum | null => {
  const homePraca = pracas.some((item) => item.slug === homeSlug);
  const awayPraca = pracas.some((item) => item.slug === awaySlug);
  const homeTarde = tardes.some((item) => item.slug === homeSlug);
  const awayTarde = tardes.some((item) => item.slug === awaySlug);
  if (matchday.toLowerCase().includes("copa") && homePraca && awayPraca) return CategoriaSlugEnum.COPA;
  if (homeTarde && awayTarde) return CategoriaSlugEnum.TARDE;
  if (homePraca && awayPraca) return CategoriaSlugEnum.DOMINGO;
  return null;
};

const competitionFor = (categoria: CategoriaSlugEnum) => {
  if (categoria === CategoriaSlugEnum.COPA) return "Rodada da Copa";
  if (categoria === CategoriaSlugEnum.TARDE) return "Circuito da Tarde";
  return "Taça de Domingo";
};

const statusFor = (status: string, home: number | null, away: number | null): FixtureStatusEnum => {
  const blob = status.toLowerCase();
  if (blob.includes("finished") || blob.includes("final") || blob === "ft") return FixtureStatusEnum.FINAL;
  if (home !== null && away !== null && !blob.includes("not started") && !blob.includes("scheduled")) {
    return FixtureStatusEnum.FINAL;
  }
  return FixtureStatusEnum.PROGRAMADO;
};

const fixtureFrom = (value: IFootballMatch): IFixture | null => {
  const home = isRecord(value.homeTeam) ? value.homeTeam : null;
  const away = isRecord(value.awayTeam) ? value.awayTeam : null;
  const homeSlug = slugForName(asText(home?.name));
  const awaySlug = slugForName(asText(away?.name));
  const startsAt = asText(value.date);
  const id = typeof value.id === "number" || typeof value.id === "string" ? String(value.id) : "";
  if (!homeSlug || !awaySlug || !startsAt || !id) return null;
  const categoria = categoriaFor(homeSlug, awaySlug, asText(value.matchday));
  if (!categoria) return null;
  const homeGoals = scoreOf(home);
  const awayGoals = scoreOf(away);
  const status = statusFor(asText(value.status), homeGoals, awayGoals);
  const venue =
    asText(value.venue) ||
    pracas.find((item) => item.slug === homeSlug)?.name ||
    tardes.find((item) => item.slug === homeSlug)?.name ||
    homeSlug;

  return {
    id,
    categoria,
    competition: competitionFor(categoria),
    homeSlug,
    awaySlug,
    score: status === FixtureStatusEnum.FINAL && homeGoals !== null && awayGoals !== null ? `${homeGoals}–${awayGoals}` : undefined,
    venue,
    startsAt,
    status,
  };
};

const readMatches = (body: unknown): IFootballMatch[] => {
  if (!isRecord(body) || !Array.isArray(body.response)) return [];
  return body.response.filter(isFootballMatch);
};

const fetchWebsiteFixtures = async (): Promise<IFixture[]> => {
  const url = new URL(`${envConfig.apiBaseUrl}/football/matches`);
  url.searchParams.set("website", envConfig.targetWebsite);
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
    next: { revalidate: 120 },
  });
  if (!response.ok) return [];
  return readMatches(await response.json())
    .map(fixtureFrom)
    .filter((fixture): fixture is IFixture => fixture !== null);
};

export const loadDeskFixtures = cache(async (): Promise<IFixture[]> => {
  try {
    return await fetchWebsiteFixtures();
  } catch {
    return [];
  }
});

export const loadDeskFixture = cache(async (id: string): Promise<IFixture | null> => {
  const rows = await loadDeskFixtures();
  return rows.find((fixture) => fixture.id === id) ?? null;
});

export const finishedDeskFixtures = (rows: IFixture[]) =>
  rows.filter((fixture) => fixture.status === FixtureStatusEnum.FINAL).sort((a, b) => b.startsAt.localeCompare(a.startsAt));

export const scheduledDeskFixtures = (rows: IFixture[]) =>
  [...rows].filter((fixture) => fixture.status === FixtureStatusEnum.PROGRAMADO).sort((a, b) => a.startsAt.localeCompare(b.startsAt));

export const upcomingDeskFixtures = (rows: IFixture[], now = Date.now()) =>
  scheduledDeskFixtures(rows).filter((fixture) => {
    const kickoff = Date.parse(fixture.startsAt);
    return Number.isFinite(kickoff) && kickoff >= now;
  });

export const pracaDeskTable = (rows: IFixture[]) =>
  sortTable(tableFrom(rows.filter((fixture) => fixture.competition.startsWith("Taça de Domingo")), pracas.map((praca) => praca.slug)));

export const tardeDeskTable = (rows: IFixture[]) =>
  sortTable(tableFrom(rows.filter((fixture) => fixture.competition.startsWith("Circuito da Tarde")), tardes.map((tarde) => tarde.slug)));

export const fixturesForSlug = (rows: IFixture[], slug: string) =>
  rows.filter((fixture) => fixture.homeSlug === slug || fixture.awaySlug === slug);
