import type { Metadata } from "next";
import { site } from "@/config/site";

export interface IPageMetaInput {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  exactTitle?: boolean;
  keywords?: string;
  image?: string;
}

export const pageMetadata = (props: IPageMetaInput): Metadata => {
  const { title, description, path, type = "website", publishedTime, exactTitle = false, keywords, image } = props;
  const url = `${site.url}${path}`;
  const fullTitle = exactTitle || title.includes(site.name) ? title : `${title} | ${site.name}`;

  return {
    title: exactTitle ? { absolute: fullTitle } : fullTitle,
    description,
    keywords: keywords || undefined,
    alternates: {
      canonical: url,
      languages: { "pt-BR": url, "x-default": url },
      types: { "application/rss+xml": "/rss.xml" },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      locale: "pt_BR",
      type,
      publishedTime,
      images: [{ url: image || `${site.url}/brand/fallback.png` }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image || `${site.url}/brand/fallback.png`],
    },
  };
};
