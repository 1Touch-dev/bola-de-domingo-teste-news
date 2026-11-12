import Link from "next/link";
import { ArticleCardImage } from "@/components/ArticleCardImage";
import { categoriaName } from "@/data";
import { formatPublished, readingMinutes } from "@/lib/format";
import type { IArticle } from "@/types";

interface IArticleCardProps {
  article: IArticle;
  variant: "rail" | "latest" | "list" | "related";
}

export const ArticleCard = (props: IArticleCardProps) => {
  const { article, variant } = props;
  const metaLabel = article.sectionLabel || categoriaName(article.categoria);
  const minutes = readingMinutes(`${article.excerpt} ${article.paragraphs.join(" ")}`);

  if (variant === "rail") {
    return (
      <Link href={`/noticias/${article.slug}`} className="group block overflow-hidden py-4 hover:bg-page lg:px-6">
        <ArticleCardImage src={article.coverImage} alt={article.title} sizes="(max-width: 1024px) 100vw, 30vw" compact label={metaLabel} />
        <div className="pt-4">
          <p className="utility-label text-[11px] font-semibold text-highlight">{metaLabel}</p>
          <h2 className="mt-1 line-clamp-3 font-sans text-lg leading-snug font-semibold text-ink group-hover:text-accent">
            {article.title}
          </h2>
          <p className="mt-1 text-xs text-muted">
            {formatPublished(article.publishedAt)} · {minutes} min
          </p>
        </div>
      </Link>
    );
  }

  if (variant === "latest") {
    return (
      <Link
        href={`/noticias/${article.slug}`}
        className="group flex h-full flex-col overflow-hidden border border-line bg-panel hover:border-accent hover:bg-page"
      >
        <ArticleCardImage src={article.coverImage} alt={article.title} sizes="(max-width: 768px) 100vw, 50vw" compact label={metaLabel} />
        <div className="flex flex-1 flex-col p-6">
          <p className="utility-label text-[11px] font-semibold text-accent">{metaLabel}</p>
          <h3 className="mt-2 line-clamp-3 font-sans text-[1.35rem] leading-8 font-semibold text-ink group-hover:text-accent">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-4 flex-1 min-h-[7rem] text-[0.95rem] leading-7 text-muted">{article.excerpt}</p>
          <p className="mt-4 text-xs text-muted">
            {formatPublished(article.publishedAt)} · {minutes} min
          </p>
        </div>
      </Link>
    );
  }

  if (variant === "list") {
    return (
      <Link href={`/noticias/${article.slug}`} className="group grid items-center gap-4 py-5 hover:bg-panel sm:grid-cols-[13rem_1fr]">
        <div className="self-center overflow-hidden border border-line bg-panel">
          <ArticleCardImage src={article.coverImage} alt={article.title} sizes="(max-width: 768px) 100vw, 13rem" compact label={metaLabel} />
        </div>
        <span>
          <p className="text-sm text-muted">{formatPublished(article.publishedAt)}</p>
          <span className="utility-label-soft block text-[11px] font-semibold text-accent">
            {categoriaName(article.categoria)} · {article.author}
          </span>
          <h2 className="mt-1 line-clamp-3 font-sans text-2xl leading-snug font-semibold text-ink group-hover:text-accent">
            {article.title}
          </h2>
          <p className="mt-2 line-clamp-4 max-w-2xl text-muted">{article.excerpt}</p>
        </span>
      </Link>
    );
  }

  return (
    <Link href={`/noticias/${article.slug}`} className="group flex h-full flex-col overflow-hidden hover:bg-page">
      <ArticleCardImage src={article.coverImage} alt={article.title} sizes="(max-width: 768px) 100vw, 768px" compact label={metaLabel} />
      <div className="flex flex-1 flex-col p-4">
        <p className="utility-label-soft text-[11px] font-semibold text-accent">
          {article.sectionLabel || formatPublished(article.publishedAt)}
        </p>
        <p className="mt-2 line-clamp-3 flex-1 min-h-[5rem] font-sans text-lg font-semibold text-ink group-hover:text-accent">{article.title}</p>
      </div>
    </Link>
  );
};