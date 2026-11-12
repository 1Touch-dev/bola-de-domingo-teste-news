import { envConfig } from "@/config/env";
import { assignmentNames } from "@/lib/cmsArticle";
import { HOME_ARTICLE_ENDPOINT, isNoiseAssignment } from "@/lib/cmsEndpoints";
import httpService from "@/services/httpService";
import type { IApiSuccessResponse } from "@/types/api";
import type { IArticleListParams, ICmsArticle } from "./articles.type";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const asArticle = (value: unknown): ICmsArticle | null => {
  if (!isRecord(value)) return null;
  if (typeof value.slug !== "string" && typeof value.title !== "string") return null;
  return value as unknown as ICmsArticle;
};

const unwrapList = (body: unknown): { rows: ICmsArticle[]; total: number | null } => {
  if (Array.isArray(body)) {
    return { rows: body.map(asArticle).filter((row): row is ICmsArticle => row !== null), total: null };
  }
  if (!isRecord(body) || !Array.isArray(body.data)) return { rows: [], total: null };
  const meta = isRecord(body.meta) ? body.meta : {};
  const total = typeof meta.total === "number" ? meta.total : null;
  return {
    rows: body.data.map(asArticle).filter((row): row is ICmsArticle => row !== null),
    total,
  };
};

const unwrapOne = (body: unknown): ICmsArticle | null => {
  const direct = asArticle(body);
  if (direct) return direct;
  if (!isRecord(body)) return null;
  return asArticle(body.data);
};

const filterRows = (endpoint: string, rows: ICmsArticle[], total: number | null): ICmsArticle[] => {
  if (endpoint === HOME_ARTICLE_ENDPOINT) {
    return rows.filter((row) => {
      const names = assignmentNames(row);
      if (names.length === 0) return true;
      return !names.every((name) => isNoiseAssignment(name));
    });
  }

  const matched = rows.filter((row) =>
    assignmentNames(row).some((name) => name.trim().toLowerCase() === endpoint.trim().toLowerCase()),
  );
  if (matched.length > 0) return matched;
  if (total === 0) return [];
  if (total !== null && total > 0) return rows;
  return [];
};

const articlesApis = {
  getAll: async (params?: IArticleListParams): Promise<IApiSuccessResponse<ICmsArticle[]>> => {
    const endpoint = params?.endpoint?.trim() || HOME_ARTICLE_ENDPOINT;
    const body: unknown = await httpService.get<ICmsArticle[]>("/ai-articles", {
      params: {
        targetWebsite: envConfig.targetWebsite,
        endpoint,
        page: params?.page ?? 1,
        limit: params?.limit ?? 40,
        sort: "createdAt",
        order: "desc",
        ...(params?.category ? { category: params.category } : {}),
      },
    });

    const { rows, total } = unwrapList(body);
    return { success: true, message: "ok", data: filterRows(endpoint, rows, total) };
  },

  getById: async (slug: string): Promise<IApiSuccessResponse<ICmsArticle>> => {
    const body: unknown = await httpService.get<ICmsArticle>(`/ai-articles/slug/${encodeURIComponent(slug)}`, {
      params: { targetWebsite: envConfig.targetWebsite },
    });
    const article = unwrapOne(body);
    return { success: true, message: "ok", data: article ?? undefined };
  },
};

export default articlesApis;
