import { categorias, pracas, tardes } from "@/data/taxonomy";
import { FixtureStatusEnum } from "@/types";
import type { CategoriaSlugEnum, IFixture, IStandingRow } from "@/types";

const names = new Map<string, string>([
  ...pracas.map((praca) => [praca.slug, praca.shortName] as const),
  ...tardes.map((tarde) => [tarde.slug, tarde.name] as const),
]);

const shorts: Record<string, string> = {
  "largo-do-apito": "LAP",
  "campinho-da-tarde": "CAM",
  "areia-do-domingo": "ARE",
  "terreiro-do-apito": "TER",
  "rampa-da-tarde": "RAM",
  "calcada-do-sol": "CAL",
  "relogio-da-manha": "REL",
  "viaduto-da-tarde": "VIA",
  "feira-do-domingo": "FEI",
  "mercado-da-tarde": "MER",
  "estacao-do-apito": "EST",
  "orla-do-domingo": "ORL",
  "ponte-da-tarde": "PON",
  "alto-do-domingo": "ALT",
};

const tardeColors: Record<string, [string, string]> = {
  "relogio-da-manha": ["#231910", "#9A3412"],
  "viaduto-da-tarde": ["#9A3412", "#FAF8F5"],
  "feira-do-domingo": ["#231910", "#5B4636"],
  "mercado-da-tarde": ["#5B4636", "#231910"],
  "estacao-do-apito": ["#5B4636", "#9A3412"],
  "orla-do-domingo": ["#FAF8F5", "#5B4636"],
  "ponte-da-tarde": ["#231910", "#5B4636"],
  "alto-do-domingo": ["#9A3412", "#5B4636"],
};

export const parseScore = (score?: string): [number, number] | null => {
  if (!score) return null;
  const parts = score.split("–").map((part) => part.trim());
  if (parts.length !== 2) return null;
  const home = Number(parts[0]);
  const away = Number(parts[1]);
  if (!Number.isFinite(home) || !Number.isFinite(away)) return null;
  return [home, away];
};

export const sideName = (slug: string) => names.get(slug) ?? slug;

export const sideShort = (slug: string) => shorts[slug] ?? sideName(slug).slice(0, 3).toUpperCase();

export const sideColors = (slug: string): [string, string] =>
  pracas.find((praca) => praca.slug === slug)?.colors ?? tardeColors[slug] ?? ["#231910", "#9A3412"];

export const sideHref = (slug: string) => {
  if (pracas.some((praca) => praca.slug === slug)) return `/pracas/${slug}`;
  return `/tardes#${slug}`;
};

export const categoriaName = (slug: CategoriaSlugEnum) =>
  categorias.find((item) => item.slug === slug)?.name ?? slug;

export const points = (row: IStandingRow) => row.won * 3 + row.drawn;

export const pointsDiff = (row: IStandingRow) => row.pointsFor - row.pointsAgainst;

export const sortTable = (rows: IStandingRow[]) =>
  [...rows].sort(
    (a, b) => points(b) - points(a) || pointsDiff(b) - pointsDiff(a) || b.pointsFor - a.pointsFor,
  );

const emptyRow = (slug: string): IStandingRow => ({
  slug,
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  pointsFor: 0,
  pointsAgainst: 0,
});

export const tableFrom = (rows: IFixture[], slugs: string[]) => {
  const map = new Map(slugs.map((slug) => [slug, emptyRow(slug)] as const));

  rows.forEach((fixture) => {
    if (fixture.status !== FixtureStatusEnum.FINAL) return;
    const score = parseScore(fixture.score);
    const home = map.get(fixture.homeSlug);
    const away = map.get(fixture.awaySlug);
    if (!score || !home || !away) return;

    const [homeScore, awayScore] = score;
    home.played += 1;
    away.played += 1;
    home.pointsFor += homeScore;
    home.pointsAgainst += awayScore;
    away.pointsFor += awayScore;
    away.pointsAgainst += homeScore;

    if (homeScore > awayScore) {
      home.won += 1;
      away.lost += 1;
      return;
    }
    if (awayScore > homeScore) {
      away.won += 1;
      home.lost += 1;
      return;
    }
    home.drawn += 1;
    away.drawn += 1;
  });

  return [...map.values()];
};

export const getPraca = (slug: string) => pracas.find((praca) => praca.slug === slug);

export const getCategoria = (slug: string) => categorias.find((item) => item.slug === slug);

export const byCategoria = <T extends { categoria: CategoriaSlugEnum }>(slug: CategoriaSlugEnum, rows: T[]) =>
  rows.filter((row) => row.categoria === slug);

export { categorias, pracas, tardes };
