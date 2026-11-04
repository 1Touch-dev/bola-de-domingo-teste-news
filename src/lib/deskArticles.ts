import { cache } from "react";
import { envConfig } from "@/config/env";
import { site } from "@/config/site";
import {
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

const categoriaFrom = (labels: string[], title: string): CategoriaSlugEnum => {
  const blob = `${labels.join(" ")} ${title}`.toLowerCase();
  if (blob.includes("mercado")) return CategoriaSlugEnum.MERCADO;
  if (blob.includes("seleç") || blob.includes("selec")) return CategoriaSlugEnum.SELECAO;
  if (blob.includes("libertadores")) return CategoriaSlugEnum.TARDE;
  if (blob.includes("copa")) return CategoriaSlugEnum.COPA;
  if (blob.includes("bastidor")) return CategoriaSlugEnum.BASTIDORES;
  return CategoriaSlugEnum.DOMINGO;
};

const plain = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const paragraphsFrom = (content: string): string[] =>
  plain(content)
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

export const mapCmsArticle = (article: ICmsArticle): IArticle | null => {
  if (!isListedArticle(article) || !article.slug || !article.title) return null;
  const labels = categoriesOf(article.category);
  const paragraphs = paragraphsFrom(article.content || "");
  const excerpt = article.summary?.trim() || article.description?.trim() || paragraphs[0] || "";

  return {
    slug: article.slug,
    title: article.title,
    excerpt,
    paragraphs: paragraphs.length > 0 ? paragraphs : [excerpt].filter(Boolean),
    category: ArticleCategoryEnum.MESA,
    categoria: categoriaFrom(labels, article.title),
    publishedAt: article.scheduledTime || article.createdAt || new Date().toISOString(),
    updatedAt: article.updatedAt || article.scheduledTime || article.createdAt,
    author: article.authorNames?.[0] || "Redação",
    relatedSlugs: [],
    coverImage: article.imageUrls?.find((url) => url.startsWith("http")),
    sectionLabel: labels[0],
  };
};

const fetchPage = async (page: number) => {
  const url = new URL(`${envConfig.apiBaseUrl}/ai-articles`);
  url.searchParams.set("targetWebsite", envConfig.targetWebsite);
  url.searchParams.set("endpoint", "HomePage");
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", "100");
  url.searchParams.set("sort", "createdAt");
  url.searchParams.set("order", "desc");

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 120 },
  });
  if (!response.ok) return { rows: [], totalPages: 1 };
  return readCmsList(await response.json());
};

const fetchCmsArticles = async (): Promise<IArticle[]> => {
  const first = await fetchPage(1);
  const rows = [...first.rows];
  const pages = Math.min(first.totalPages, 5);
  for (let page = 2; page <= pages; page += 1) {
    const next = await fetchPage(page);
    rows.push(...next.rows);
  }

  const seen = new Set<string>();
  return rows
    .map(mapCmsArticle)
    .filter((article): article is IArticle => article !== null)
    .filter((article) => {
      if (seen.has(article.slug)) return false;
      seen.add(article.slug);
      return true;
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
};

export const loadDeskArticles = cache(async (): Promise<IArticle[]> => {
  try {
    return await fetchCmsArticles();
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
    const response = await fetch(`${envConfig.apiBaseUrl}/ai-articles/slug/${encodeURIComponent(slug)}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 120 },
    });
    if (response.status === 404) return "missing";
    if (!response.ok) return "down";
    const article = readCmsArticle(await response.json());
    if (!article || !isListedArticle(article) || !article.slug || !article.title) return "missing";
    const canonical = `${site.url}/noticias/${article.slug}`;
    return {
      id: article._id || article.id || article.slug,
      slug: article.slug,
      title: article.title,
      summary: article.summary?.trim() || article.description?.trim() || "",
      sectionLabel: categoriesOf(article.category)[0] || "",
      authors: article.authorNames?.filter(Boolean) ?? [],
      publishedAt: article.scheduledTime || article.createdAt || new Date().toISOString(),
      html: prepareArticleHtml(article.content || "", article.videoUrls ?? []),
      cover: coverFrom(article),
      metaTitle: metaTitleOf(article),
      metaDescription: metaDescriptionOf(article),
      keywords: keywordsOf(article),
      faq: faqsFrom(article.faq),
      videos: videosFrom(article.videoUrls ?? []),
      jsonLd: jsonLdFor(article, canonical),
    };
  } catch {
    return "down";
  }
});
