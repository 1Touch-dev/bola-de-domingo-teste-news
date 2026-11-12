export enum CategoriaSlugEnum {
  DOMINGO = "domingo",
  COPA = "copa",
  TARDE = "tarde",
  SELECAO = "selecao",
  MERCADO = "mercado",
  BASTIDORES = "bastidores",
}

export enum FixtureStatusEnum {
  PROGRAMADO = "programado",
  FINAL = "final",
}

export enum ArticleCategoryEnum {
  PRACAS = "pracas",
  TARDES = "tardes",
  MESA = "mesa",
}

export enum SearchKindEnum {
  PRACA = "Praça",
  TARDE = "Tarde",
  NOTA = "Nota",
}

export interface IPraca {
  slug: string;
  name: string;
  shortName: string;
  kind: string;
  city: string;
  colors: [string, string];
  categorias: CategoriaSlugEnum[];
  blurb: string;
}

export interface ITarde {
  slug: string;
  name: string;
  note: string;
}

export interface ICategoria {
  slug: CategoriaSlugEnum;
  name: string;
  pitch: string;
  where: string;
}

export interface IFixture {
  id: string;
  categoria: CategoriaSlugEnum;
  competition: string;
  homeSlug: string;
  awaySlug: string;
  score?: string;
  venue: string;
  startsAt: string;
  status: FixtureStatusEnum;
}

export interface IArticle {
  slug: string;
  title: string;
  excerpt: string;
  paragraphs: string[];
  category: ArticleCategoryEnum;
  categoria: CategoriaSlugEnum;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  relatedSlugs: string[];
  coverImage?: string;
  sectionLabel?: string;
}

export interface IStandingRow {
  slug: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  pointsFor: number;
  pointsAgainst: number;
}

export interface ISearchItem {
  type: SearchKindEnum;
  title: string;
  subtitle: string;
  href: string;
  slug?: string;
  image?: string;
}

export interface ICrumbItem {
  href?: string;
  label: string;
}

export interface ISlugParams {
  slug: string;
}

export interface ISlugPageProps {
  params: Promise<ISlugParams>;
}

export interface IFixtureParams {
  id: string;
}

export interface IFixturePageProps {
  params: Promise<IFixtureParams>;
}
