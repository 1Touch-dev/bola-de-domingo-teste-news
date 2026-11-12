"use client";

import { useQuery } from "@tanstack/react-query";
import articlesApis from "@/apis/articles/articlesApis";
import type { IArticleListParams } from "@/apis/articles/articles.type";
import queryKeys from "@/constants/queryKeys";
import { useIsClient } from "@/hooks/useIsClient";

export const useArticlesQuery = (params?: IArticleListParams) => {
  const isClient = useIsClient();

  return useQuery({
    queryKey: [queryKeys.articles, params?.page, params?.limit, params?.category, params?.endpoint],
    queryFn: () => articlesApis.getAll(params),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
    select: (res) => res.data,
    enabled: isClient,
  });
};

export const useArticleQuery = (slug: string) => {
  const isClient = useIsClient();

  return useQuery({
    queryKey: queryKeys.articleBySlug(slug),
    queryFn: () => articlesApis.getById(slug),
    staleTime: 1000 * 30,
    select: (res) => res.data,
    enabled: isClient && Boolean(slug),
  });
};
