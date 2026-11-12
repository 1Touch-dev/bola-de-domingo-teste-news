import { site } from "@/config/site";
import type { ICmsArticle } from "@/apis/articles/articles.type";

export interface ICmsFaq {
  question: string;
  answer: string;
}

export interface IYoutubeVideo {
  kind: "youtube";
  id: string;
}

export interface IExternalVideo {
  kind: "link";
  href: string;
}

export type IArticleVideo = IYoutubeVideo | IExternalVideo;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const categoriesOf = (category: ICmsArticle["category"]): string[] => {
  if (Array.isArray(category)) return category.filter((item): item is string => typeof item === "string" && item.length > 0);
  if (typeof category === "string" && category) return [category];
  return [];
};

export const assignmentNames = (article: ICmsArticle): string[] => {
  const names: string[] = [];
  const assigned = article.endpointAssignments;
  if (Array.isArray(assigned)) {
    assigned.forEach((item) => {
      const name = item?.name?.trim();
      if (name) names.push(name);
    });
  } else if (assigned && typeof assigned.name === "string" && assigned.name.trim()) {
    names.push(assigned.name.trim());
  }
  if (typeof article.websiteSection === "string" && article.websiteSection.trim()) {
    names.push(article.websiteSection.trim());
  }
  return names;
};

export const isListedArticle = (article: ICmsArticle, now = Date.now()): boolean => {
  if (!article.slug || !article.title) return false;
  if (article.publishState === "needs_review" || article.publishState === "ready") return false;
  if (article.publishState === "published") return true;
  if (!article.scheduledTime) return true;
  const at = new Date(article.scheduledTime).getTime();
  if (Number.isNaN(at)) return true;
  return at <= now;
};

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const unescapeMarkdown = (value: string) => value.replace(/\\([\\`*_{}[\]()#+\-.!])/g, "$1");

const sanitizeHref = (href: string) => {
  const trimmed = href.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.protocol === "http:" || url.protocol === "https:") return url.href;
  } catch {
    return "";
  }
  return "";
};

const renderInline = (input: string) => {
  const links: string[] = [];
  const withLinks = unescapeMarkdown(input).replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_match, alt: string, href: string) => {
    const safeHref = sanitizeHref(href);
    const html = safeHref
      ? `<img src="${escapeHtml(safeHref)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" width="1200" height="675" />`
      : escapeHtml(alt);
    links.push(html);
    return `\u0000${links.length - 1}\u0000`;
  }).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, label: string, href: string) => {
    const safeHref = sanitizeHref(href);
    const external = safeHref.startsWith("http");
    const html = safeHref
      ? `<a href="${escapeHtml(safeHref)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${escapeHtml(label)}</a>`
      : escapeHtml(label);
    links.push(html);
    return `\u0000${links.length - 1}\u0000`;
  });

  return escapeHtml(withLinks)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\u0000(\d+)\u0000/g, (_match, index: string) => links[Number(index)] ?? "");
};

const markdownToHtml = (source: string) => {
  const lines = source.split("\n");
  const html: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const heading = /^(#{1,4})\s+(.+)$/.exec(line.trim());
    if (heading) {
      const level = Math.min(heading[1].length, 4);
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line.trim())) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test((lines[index] ?? "").trim())) {
        items.push(`<li>${renderInline((lines[index] ?? "").trim().replace(/^[-*]\s+/, ""))}</li>`);
        index += 1;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line.trim())) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test((lines[index] ?? "").trim())) {
        items.push(`<li>${renderInline((lines[index] ?? "").trim().replace(/^\d+\.\s+/, ""))}</li>`);
        index += 1;
      }
      html.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length) {
      const next = lines[index] ?? "";
      if (!next.trim()) break;
      if (/^(#{1,4})\s+/.test(next.trim()) || /^[-*]\s+/.test(next.trim()) || /^\d+\.\s+/.test(next.trim())) break;
      if (/<\/?[a-z][^>]*>/i.test(next)) break;
      paragraph.push(next.trim());
      index += 1;
    }
    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
  }

  return html.join("");
};

const dropBareYoutubeLines = (content: string) =>
  content
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      if (!/youtube\.com\/watch|youtu\.be\/|youtube\.com\/embed/i.test(trimmed)) return true;
      const withoutUrl = trimmed.replace(/https?:\/\/\S+/gi, "").replace(/[<>[\]()/\s"']/g, "");
      return withoutUrl.length > 0;
    })
    .join("\n");

const lazyImages = (html: string) =>
  html.replace(/<img\b([^>]*?)(\/?)>/gi, (_match, attrs: string, slash: string) => {
    let next = attrs;
    if (!/\bloading\s*=/i.test(attrs)) next += ' loading="lazy" decoding="async"';
    if (!/\bwidth\s*=/i.test(attrs) && !/\bheight\s*=/i.test(attrs)) next += ' width="1200" height="675"';
    return `<img${next}${slash}>`;
  });

const FILLER_HEADING_RE =
  /(?:^|\n)#{2,3}\s+(?:Por que isso importa(?: para o Brasil)?|O que vem a seguir|O que se sabe sobre)\b/i;

const KEYWORD_FOOTER_RE = /\nNo Brasil,[\s\S]*?entram nesta cobertura\.?\s*$/i;

const HTML_FAQ_RE = /<h[2-4][^>]*>\s*FAQs?\s*<\/h[2-4]>\s*<div[\s\S]*?<\/div>/gi;

const MD_FAQ_RE = /(?:^|\n)##\s+FAQ\b[\s\S]*?(?=\n##\s+(?!#)|$)/gi;

const looksLikeHtml = (value: string) => /<\/?[a-z][^>]*>/i.test(value);

const plainFingerprint = (value: string) =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_`>~\[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .slice(0, 180);

/** CMS often concatenates the article 2–3 times plus SEO filler markdown. Keep the first clean copy. */
const collapseCmsContent = (source: string, stripFaq: boolean) => {
  let text = source.replace(/<!--[\s\S]*?-->/g, "").replace(/\r\n/g, "\n").trim();
  if (!text) return "";

  text = text.replace(KEYWORD_FOOTER_RE, "").trim();

  const fillerAt = text.search(FILLER_HEADING_RE);
  if (fillerAt > 280) {
    text = text.slice(0, fillerAt).trim();
  }

  const htmlTitle = text.match(/<h2[^>]*>[\s\S]*?<\/h2>/i);
  if (htmlTitle?.index != null) {
    const second = text.indexOf(htmlTitle[0], htmlTitle.index + htmlTitle[0].length);
    if (second > 0) text = text.slice(0, second).trim();
  }

  const mdTitle = text.match(/^#{1,3}\s+.+$/m);
  if (mdTitle?.index != null) {
    const second = text.indexOf(mdTitle[0], mdTitle.index + mdTitle[0].length);
    if (second > 0) text = text.slice(0, second).trim();
  }

  if (stripFaq) {
    text = text.replace(HTML_FAQ_RE, "\n").replace(MD_FAQ_RE, "\n").trim();
  }

  // Drop trailing duplicate paragraphs (common CMS boilerplate doubles).
  const blocks = text.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const block of blocks) {
    const key = plainFingerprint(block);
    if (key.length > 40 && seen.has(key)) continue;
    if (key.length > 40) seen.add(key);
    unique.push(block);
  }

  return unique.join("\n\n").trim();
};

const convertSegment = (segment: string) => {
  const trimmed = segment.trim();
  if (!trimmed) return "";
  if (looksLikeHtml(trimmed) && !/^#{1,4}\s+/m.test(trimmed) && !/^[-*]\s+/m.test(trimmed)) {
    return trimmed;
  }
  if (looksLikeHtml(trimmed)) {
    // Mixed HTML + markdown in one segment: convert markdown lines, keep HTML lines.
    return trimmed
      .split("\n")
      .map((line) => {
        const value = line.trim();
        if (!value) return "";
        if (/<\/?[a-z][^>]*>/i.test(value)) return value;
        if (/^(#{1,4})\s+(.+)$/.test(value)) {
          const match = /^(#{1,4})\s+(.+)$/.exec(value);
          if (!match) return value;
          const level = Math.min(match[1].length, 4);
          return `<h${level}>${renderInline(match[2])}</h${level}>`;
        }
        if (/^[-*]\s+/.test(value)) return `<ul><li>${renderInline(value.replace(/^[-*]\s+/, ""))}</li></ul>`;
        return `<p>${renderInline(value)}</p>`;
      })
      .filter(Boolean)
      .join("");
  }
  return markdownToHtml(trimmed);
};

export interface IPrepareArticleHtmlOptions {
  stripFaq?: boolean;
}

export const prepareArticleHtml = (
  content: string,
  videoUrls: string[],
  options: IPrepareArticleHtmlOptions = {},
): string => {
  const { stripFaq = false } = options;
  const collapsed = collapseCmsContent(content, stripFaq);
  const stripped = videoUrls.length > 0 ? dropBareYoutubeLines(collapsed) : collapsed;
  if (!stripped.trim()) return "";
  return lazyImages(convertSegment(stripped));
};

const youtubeId = (url: string): string | null => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/i);
  return match?.[1] ?? null;
};

export const videosFrom = (urls: string[]): IArticleVideo[] =>
  urls
    .filter((url) => url.startsWith("http"))
    .map((url) => {
      const id = youtubeId(url);
      if (id) return { kind: "youtube", id } satisfies IYoutubeVideo;
      return { kind: "link", href: url } satisfies IExternalVideo;
    });

export const faqsFrom = (value: unknown): ICmsFaq[] => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!isRecord(item) || typeof item.question !== "string" || typeof item.answer !== "string") return [];
    const question = item.question.trim();
    const answer = item.answer.trim();
    if (!question || !answer) return [];
    return [{ question, answer }];
  });
};

const schemaTypes = (value: unknown): string[] => {
  if (!isRecord(value)) return [];
  const raw = value["@type"];
  const own = typeof raw === "string" ? [raw] : Array.isArray(raw) ? raw.filter((item): item is string => typeof item === "string") : [];
  const graph = Array.isArray(value["@graph"]) ? value["@graph"].flatMap(schemaTypes) : [];
  return [...own, ...graph];
};

export const schemaHasFaq = (schema: unknown) => schemaTypes(schema).includes("FAQPage");

const keywordLine = (keywords: string[] | string | undefined): string => {
  if (Array.isArray(keywords)) return keywords.filter((item) => item.trim()).join(", ");
  if (typeof keywords === "string") return keywords.trim();
  return "";
};

export const coverFrom = (article: ICmsArticle): string | undefined => {
  const image = article.imageUrls?.find((url) => url.startsWith("http"));
  if (image) return image;
  return article.markdownImages?.find((url) => url.startsWith("http"));
};

export const jsonLdFor = (article: ICmsArticle, canonical: string): unknown[] => {
  const faq = faqsFrom(article.faq);
  const scripts: unknown[] = [];
  const schema = isRecord(article.schemaMarkup) ? article.schemaMarkup : null;

  if (schema) scripts.push(schema);
  else {
    scripts.push({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: article.title,
      description: article.seo?.meta_description || article.summary || article.description || "",
      inLanguage: "pt-BR",
      datePublished: article.createdAt,
      dateModified: article.updatedAt || article.createdAt,
      author: (article.authorNames ?? []).map((name) => ({ "@type": "Person", name })),
      image: coverFrom(article) || `${site.url}/brand/fallback.png`,
      mainEntityOfPage: canonical,
      publisher: {
        "@type": "NewsMediaOrganization",
        name: site.name,
        url: site.url,
        logo: { "@type": "ImageObject", url: `${site.url}/logo.png` },
      },
    });
  }

  if (faq.length > 0 && !schemaHasFaq(schema)) {
    scripts.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  return scripts;
};

export const metaTitleOf = (article: ICmsArticle) => article.seo?.meta_title?.trim() || article.title || "";

export const metaDescriptionOf = (article: ICmsArticle) => {
  const seo = article.seo?.meta_description?.trim();
  if (seo) return seo;
  const summary = article.summary?.trim() || article.description?.trim();
  if (summary) return summary;
  const plain = (article.content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain.slice(0, 180);
};

export const keywordsOf = (article: ICmsArticle) => keywordLine(article.seo?.keywords);

export const readCmsArticle = (value: unknown): ICmsArticle | null => {
  if (!isRecord(value)) return null;
  if (typeof value.title !== "string" && typeof value.slug !== "string") return null;
  return value as ICmsArticle;
};

export const readCmsList = (body: unknown): { rows: ICmsArticle[]; totalPages: number } => {
  if (Array.isArray(body)) return { rows: body.map(readCmsArticle).filter((row): row is ICmsArticle => row !== null), totalPages: 1 };
  if (!isRecord(body)) return { rows: [], totalPages: 1 };
  const rows = Array.isArray(body.data) ? body.data.map(readCmsArticle).filter((row): row is ICmsArticle => row !== null) : [];
  const meta = isRecord(body.meta) ? body.meta : {};
  const totalPages = typeof meta.totalPages === "number" && meta.totalPages > 0 ? meta.totalPages : 1;
  return { rows, totalPages };
};
