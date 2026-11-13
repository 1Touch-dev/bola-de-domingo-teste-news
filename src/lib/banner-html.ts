import { envConfig } from "@/config/env";
import { site } from "@/config/site";

const escapedHost = envConfig.targetWebsite.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const absoluteSiteHref = new RegExp(`^https?:\\/\\/(?:www\\.)?${escapedHost}(?=$|[/?#])`, "i");

/** CMS often ships via.placeholder “Breaking News” art. */
export const PLACEHOLDER_IMG_SRC =
  /(?:via\.placeholder\.com|placehold\.co|placehold\.it|dummyimage\.com|(?:^|\/\/)placeholder\.com)|\bBreaking[\s+_%]*News\b/i;

export const BANNER_LOGO_SRC = "/brand/logo.png";

export function sameSitePath(href: string): string | null {
  const trimmed = href.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  if (trimmed.startsWith("//")) return sameSitePath(`https:${trimmed}`);
  const match = trimmed.match(absoluteSiteHref);
  if (!match) return null;
  const rest = trimmed.slice(match[0].length);
  if (!rest) return "/";
  return rest.startsWith("/") ? rest : `/${rest}`;
}

export function isLikelyImageUrl(value?: string | null): boolean {
  if (!value?.trim()) return false;
  const url = value.trim();
  if (url.startsWith("data:image/")) return true;
  return /\.(avif|webp|png|jpe?g|gif|svg)(\?|#|$)/i.test(url);
}

export function isPlaceholderImage(src?: string | null): boolean {
  if (!src?.trim()) return true;
  return PLACEHOLDER_IMG_SRC.test(src.trim());
}

export function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCharCode(parseInt(code, 16)));
}

export function stripTags(value: string): string {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, "")).trim();
}

export const bannerBrandLabel = site.name;
