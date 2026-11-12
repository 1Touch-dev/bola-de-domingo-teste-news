import { cache } from "react";
import { envConfig } from "@/config/env";
import { site } from "@/config/site";
import {
  cmsEndpointByName,
  deskFeedEndpoints,
  endpointsForCategoria,
  endpointsForHref,
  HOME_ARTICLE_ENDPOINT,
  isNoiseAssignment,
} from "@/lib/cmsEndpoints";
import {
  assignmentNames,
  categoriesOf,
  coverFrom,
  faqsFrom,
  isListedArticle,
  jsonLdFor,
  keywordsOf,
  metaDescriptionOf,
  metaTitleOf,
  prepareArticleHtml,
  readCmsArticle,
  readCmsList,
  videosFrom,
  type IArticleVideo,
  type ICmsFaq,
} from "@/lib/cmsArticle";
import { ArticleCategoryEnum, CategoriaSlugEnum } from "@/types";
import type { IArticle } from "@/types";
import type { ICmsArticle } from "@/apis/articles/articles.type";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const namesIncludeEndpoint = (names: string[], endpoint: string) => {
  const target = endpoint.trim().toLowerCase();
  return names.some((name) => name.trim().toLowerCase() === target);
};

const categoriaFrom = (article: ICmsArticle, endpoint?: string): CategoriaSlugEnum => {
  const mapped = endpoint ? cmsEndpointByName(endpoint)?.categoria : undefined;
  if (mapped) return mapped;

  for (const name of assignmentNames(article)) {
    const hit = cmsEndpointByName(name)?.categoria;
    if (hit) return hit;
  }

  const labels = categoriesOf(article.category);
  const blob = `${labels.join(" ")} ${article.title || ""}`.toLowerCase();
  if (blob.includes("mercado")) return CategoriaSlugEnum.MERCADO;
  if (blob.includes("seleç") || blob.includes("selec")) return CategoriaSlugEnum.SELECAO;
  if (blob.includes("libertadores")) return CategoriaSlugEnum.TARDE;
  if (blob.includes("copa")) return CategoriaSlugEnum.COPA;
  if (blob.includes("bastidor") || blob.includes("jogador")) return CategoriaSlugEnum.BASTIDORES;
  if (blob.includes("série b") || blob.includes("serie b") || blob.includes("brasileir") || blob.includes("estadual")) {
    return CategoriaSlugEnum.DOMINGO;
  }
  return CategoriaSlugEnum.DOMINGO;
};

const plain = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const paragraphsFrom = (content: string): string[] =>
  plain(content)
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

export const mapCmsArticle = (article: ICmsArticle, endpoint?: string): IArticle | null => {
  if (!isListedArticle(article) || !article.slug || !article.title) return null;
  const labels = categoriesOf(article.category);
  const paragraphs = paragraphsFrom(article.content || "");
  const excerpt = article.summary?.trim() || article.description?.trim() || paragraphs[0] || "";
  const section =
    (endpoint && endpoint !== HOME_ARTICLE_ENDPOINT ? endpoint : undefined) ||
    assignmentNames(article).find((name) => !isNoiseAssignment(name)) ||
    labels[0];

  return {
    slug: article.slug,
    title: article.title,
    excerpt,
    paragraphs: paragraphs.length > 0 ? paragraphs : [excerpt].filter(Boolean),
    category: ArticleCategoryEnum.MESA,
    categoria: categoriaFrom(article, endpoint === HOME_ARTICLE_ENDPOINT ? undefined : endpoint),
    publishedAt: article.scheduledTime || article.createdAt || new Date().toISOString(),
    updatedAt: article.updatedAt || article.scheduledTime || article.createdAt,
    author: article.authorNames?.[0] || "Redação",
    relatedSlugs: [],
    coverImage: article.imageUrls?.find((url) => url.startsWith("http")),
    sectionLabel: section,
  };
};

interface IFetchPageResult {
  rows: ICmsArticle[];
  total: number | null;
  totalPages: number;
}

const ARTICLE_FETCH_TIMEOUT_MS = 12000;
const DESK_FEED_CONCURRENCY = 3;

const fetchEndpointPage = async (endpoint: string, page: number, limit: number): Promise<IFetchPageResult> => {
  const url = new URL(`${envConfig.apiBaseUrl}/ai-articles`);
  url.searchParams.set("targetWebsite", envConfig.targetWebsite);
  url.searchParams.set("endpoint", endpoint);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("sort", "createdAt");
  url.searchParams.set("order", "desc");

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(ARTICLE_FETCH_TIMEOUT_MS),
    next: { revalidate: 120 },
  });
  if (!response.ok) return { rows: [], total: null, totalPages: 1 };

  const body: unknown = await response.json();
  const list = readCmsList(body);
  const meta = isRecord(body) && isRecord(body.meta) ? body.meta : {};
  const total = typeof meta.total === "number" ? meta.total : null;

  return { rows: list.rows, total, totalPages: list.totalPages };
};

const rowsForEndpoint = (endpoint: string, rows: ICmsArticle[], total: number | null): ICmsArticle[] => {
  if (endpoint === HOME_ARTICLE_ENDPOINT) {
    return rows.filter((row) => {
      const names = assignmentNames(row);
      if (names.length === 0) return true;
      return !names.every((name) => isNoiseAssignment(name));
    });
  }

  const matched = rows.filter((row) => namesIncludeEndpoint(assignmentNames(row), endpoint));
  if (matched.length > 0) return matched;
  if (total === 0) return [];
  if (total !== null && total > 0) return rows;
  return [];
};

const mapRows = (rows: ICmsArticle[], endpoint?: string): IArticle[] =>
  rows
    .map((row) => mapCmsArticle(row, endpoint))
    .filter((article): article is IArticle => article !== null);

const dedupeSort = (articles: IArticle[]): IArticle[] => {
  const seen = new Set<string>();
  return articles
    .filter((article) => {
      if (seen.has(article.slug)) return false;
      seen.add(article.slug);
      return true;
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
};

export const loadArticlesByEndpoint = cache(async (endpoint: string, limit = 40): Promise<IArticle[]> => {
  try {
    const pageSize = Math.min(Math.max(limit, 1), 100);
    const first = await fetchEndpointPage(endpoint, 1, pageSize);
    const rows = [...rowsForEndpoint(endpoint, first.rows, first.total)];
    // Cap HomePage walk to two pages so SSG stays under Next's 60s static timeout.
    const pages = endpoint === HOME_ARTICLE_ENDPOINT ? Math.min(first.totalPages, 2) : 1;

    for (let page = 2; page <= pages; page += 1) {
      const next = await fetchEndpointPage(endpoint, page, pageSize);
      rows.push(...rowsForEndpoint(endpoint, next.rows, next.total));
    }

    return dedupeSort(mapRows(rows, endpoint)).slice(0, limit);
  } catch {
    return [];
  }
});

export const loadArticlesByEndpoints = cache(async (endpoints: string[], limit = 40): Promise<IArticle[]> => {
  const unique = [...new Set(endpoints.map((item) => item.trim()).filter(Boolean))];
  if (unique.length === 0) return [];
  const batches = await Promise.all(unique.map((endpoint) => loadArticlesByEndpoint(endpoint, limit)));
  return dedupeSort(batches.flat()).slice(0, limit);
});

export const loadArticlesForCategoria = cache(async (categoria: CategoriaSlugEnum, limit = 40): Promise<IArticle[]> => {
  const endpoints = endpointsForCategoria(categoria);
  if (endpoints.length === 0) return [];
  return loadArticlesByEndpoints(endpoints, limit);
});

export const loadArticlesForPath = cache(async (href: string, limit = 40): Promise<IArticle[]> => {
  const endpoints = endpointsForHref(href);
  if (endpoints.length === 0) return [];
  return loadArticlesByEndpoints(endpoints, limit);
});

const mapPool = async <T, R>(items: T[], concurrency: number, mapper: (item: T) => Promise<R>): Promise<R[]> => {
  const results: R[] = [];
  for (let index = 0; index < items.length; index += concurrency) {
    const batch = items.slice(index, index + concurrency);
    results.push(...(await Promise.all(batch.map(mapper))));
  }
  return results;
};

const fetchDeskFeed = async (): Promise<IArticle[]> => {
  const home = await loadArticlesByEndpoint(HOME_ARTICLE_ENDPOINT, 100);
  const sections = await mapPool(deskFeedEndpoints, DESK_FEED_CONCURRENCY, (endpoint) =>
    loadArticlesByEndpoint(endpoint, 40),
  );
  return dedupeSort([...home, ...sections.flat()]);
};

export const loadDeskArticles = cache(async (): Promise<IArticle[]> => {
  try {
    return await fetchDeskFeed();
  } catch {
    return [];
  }
});

export interface ILoadedArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  sectionLabel: string;
  authors: string[];
  publishedAt: string;
  html: string;
  cover?: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  faq: ICmsFaq[];
  videos: IArticleVideo[];
  jsonLd: unknown[];
}

export const loadArticleDocument = cache(async (slug: string): Promise<ILoadedArticle | "missing" | "down"> => {
  try {
    const url = new URL(`${envConfig.apiBaseUrl}/ai-articles/slug/${encodeURIComponent(slug)}`);
    url.searchParams.set("targetWebsite", envConfig.targetWebsite);
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(ARTICLE_FETCH_TIMEOUT_MS),
      next: { revalidate: 120 },
    });
    if (response.status === 404) return "missing";
    if (!response.ok) return "down";
    const payload: unknown = await response.json();
    const article =
      readCmsArticle(payload) ??
      (typeof payload === "object" && payload !== null && "data" in payload
        ? readCmsArticle((payload as { data: unknown }).data)
        : null);
    if (!article || !isListedArticle(article) || !article.slug || !article.title) return "missing";
    const canonical = `${site.url}/noticias/${article.slug}`;
    const section =
      assignmentNames(article).find((name) => !isNoiseAssignment(name)) || categoriesOf(article.category)[0] || "";
    const faq = faqsFrom(article.faq);
    return {
      id: article._id || article.id || article.slug,
      slug: article.slug,
      title: article.title,
      summary: article.summary?.trim() || article.description?.trim() || "",
      sectionLabel: section,
      authors: article.authorNames?.filter(Boolean) ?? [],
      publishedAt: article.scheduledTime || article.createdAt || new Date().toISOString(),
      html: prepareArticleHtml(article.content || "", article.videoUrls ?? [], {
        stripFaq: faq.length > 0,
      }),
      cover: coverFrom(article),
      metaTitle: metaTitleOf(article),
      metaDescription: metaDescriptionOf(article),
      keywords: keywordsOf(article),
      faq,
      videos: videosFrom(article.videoUrls ?? []),
      jsonLd: jsonLdFor(article, canonical),
    };
  } catch {
    return "down";
  }
});
