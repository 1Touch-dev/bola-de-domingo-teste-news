import { cache } from "react";
import { envConfig } from "@/config/env";
import {
  isLikelyImageUrl,
  isPlaceholderImage,
  sameSitePath,
  stripTags,
} from "@/lib/banner-html";

export interface IEditorialBanner {
  _id?: string;
  type?: string;
  title?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  htmlContent?: string;
  ctaUrl?: string;
  isActive?: boolean;
  status?: string;
}

export type EditorialSlide = {
  id: string;
  title: string;
  excerpt?: string;
  category?: string;
  meta?: string;
  href?: string;
  external?: boolean;
  /** Real image URL; omit when placeholder / missing so UI shows logo + site name. */
  imageUrl?: string;
};

interface IBannerResponse {
  banner?: IEditorialBanner | null;
  banners?: IEditorialBanner[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const attr = (html: string, tag: string, name: string) => {
  const block = html.match(new RegExp(`<${tag}\\b[^>]*>`, "i"))?.[0] ?? "";
  return (
    block.match(new RegExp(`${name}\\s*=\\s*"([^"]+)"`, "i"))?.[1] ||
    block.match(new RegExp(`${name}\\s*=\\s*'([^']+)'`, "i"))?.[1] ||
    undefined
  );
};

const between = (html: string, className: string) => {
  const match = html.match(
    new RegExp(`class=["'][^"']*${className}[^"']*["'][^>]*>([\\s\\S]*?)<`, "i")
  );
  return match?.[1] ? stripTags(match[1]) : undefined;
};

const cleanTitle = (value?: string) => {
  if (!value) return undefined;
  return stripTags(value).replace(/^Banner:\s*/i, "").trim() || undefined;
};

const cleanDescription = (value?: string) => {
  if (!value) return undefined;
  const trimmed = stripTags(value).replace(/^Automated banner for:\s*/i, "").trim();
  return trimmed || undefined;
};

const isUsable = (banner: IEditorialBanner) => {
  if (banner.isActive === false || banner.status === "inactive") return false;
  if (banner.type === "html") {
    return Boolean(banner.htmlContent?.trim() || banner.title?.trim());
  }
  return Boolean(banner.imageUrl?.trim() || isLikelyImageUrl(banner.url) || banner.title?.trim());
};

export const toEditorialSlide = (
  banner: IEditorialBanner,
  index: number
): EditorialSlide | null => {
  if (!isUsable(banner)) return null;

  const html = banner.htmlContent?.trim() ?? "";
  const fromHtmlTitle =
    between(html, "banner-title") ||
    (html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1]
      ? stripTags(html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)![1])
      : undefined);
  const title = cleanTitle(banner.title) || fromHtmlTitle;
  if (!title) return null;

  const rawHref = banner.ctaUrl || banner.url || attr(html, "a", "href");
  const local = rawHref ? sameSitePath(rawHref) : null;
  const rawImage = banner.imageUrl || attr(html, "img", "src");
  const imageUrl =
    rawImage && !isPlaceholderImage(rawImage) && (isLikelyImageUrl(rawImage) || /^https?:\/\//i.test(rawImage))
      ? rawImage
      : undefined;

  return {
    id: banner._id || `${title}-${index}`,
    title,
    excerpt: cleanDescription(banner.description) || between(html, "banner-excerpt"),
    category: between(html, "banner-category"),
    meta: between(html, "banner-meta"),
    href: local || rawHref || undefined,
    external: Boolean(rawHref && !local),
    imageUrl,
  };
};

/**
 * Public editorial heroes — Brazil CMS `GET /banners/public/{websiteKey}`.
 * Same contract as Postman “GET Editorial hero” under Brazil CMS — Banners.
 */
export const getEditorialBanners = cache(async (): Promise<EditorialSlide[]> => {
  try {
    const url = `${envConfig.apiBaseUrl}/banners/public/${encodeURIComponent(envConfig.targetWebsite)}`;
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return [];

    const data: unknown = await response.json();
    if (!isRecord(data)) return [];

    const payload = data as IBannerResponse;
    const candidates =
      Array.isArray(payload.banners) && payload.banners.length > 0
        ? payload.banners
        : [payload.banner];

    return candidates
      .filter((banner): banner is IEditorialBanner => Boolean(banner))
      .map((banner, index) => toEditorialSlide(banner, index))
      .filter((slide): slide is EditorialSlide => Boolean(slide));
  } catch {
    return [];
  }
});
