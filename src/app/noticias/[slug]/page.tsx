import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadArticleDocument, loadDeskArticles } from "@/lib/deskArticles";
import { ArticleCard } from "@/components/ArticleCard";
import { ArticleCardImage } from "@/components/ArticleCardImage";
import { formatPublished } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { FaqAccordion } from "@/components/FaqAccordion";
import { VideoBlock } from "@/components/VideoBlock";
import { Container, Crumb } from "@/components/ui";
import type { ISlugPageProps } from "@/types";

export const revalidate = 120;

const jsonScript = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

export const generateStaticParams = async () => {
  const stories = await loadDeskArticles();
  return stories.map((article) => ({ slug: article.slug }));
};

export const generateMetadata = async (props: ISlugPageProps): Promise<Metadata> => {
  const { params } = props;
  const { slug } = await params;
  const doc = await loadArticleDocument(slug);
  if (doc === "missing") return {};
  if (doc !== "down") {
    return pageMetadata({
      title: doc.metaTitle,
      description: doc.metaDescription,
      path: `/noticias/${doc.slug}`,
      type: "article",
      publishedTime: doc.publishedAt,
      exactTitle: true,
      keywords: doc.keywords,
      image: doc.cover,
    });
  }
  return {};
};

const ArticlePage = async (props: ISlugPageProps) => {
  const { params } = props;
  const { slug } = await params;
  const doc = await loadArticleDocument(slug);
  if (doc === "missing") notFound();

  if (doc === "down") notFound();

  const stories = await loadDeskArticles();
  const others = stories.filter((item) => item.slug !== doc.slug);
  const sameSection = others.filter((item) => item.sectionLabel && item.sectionLabel === doc.sectionLabel);
  const more = (sameSection.length > 0 ? sameSection : others).slice(0, 3);

  return (
    <Container className="py-10">
      {doc.jsonLd.map((schema, index) => (
        <script key={`ld-${index}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonScript(schema) }} />
      ))}
      <Crumb
        items={[
          { href: "/", label: "Início" },
          { href: "/noticias", label: "Notícias" },
          { label: doc.title },
        ]}
      />
      <article className="mx-auto mt-6 min-w-0 max-w-3xl">
        {doc.sectionLabel ? (
          <p className="utility-label-soft text-[11px] font-semibold text-accent">
            {doc.sectionLabel} · {formatPublished(doc.publishedAt)}
          </p>
        ) : null}
        <h1 className="mt-2 font-display text-4xl leading-[1.05] font-semibold sm:text-5xl">{doc.title}</h1>
        {doc.summary ? <p className="mt-4 text-lg text-muted">{doc.summary}</p> : null}
        {doc.authors.length > 0 ? <p className="mt-3 text-sm">Por {doc.authors.join(", ")}</p> : null}
        <div className="mt-8 overflow-hidden border border-line">
          <ArticleCardImage src={doc.cover} alt={doc.title} sizes="(max-width: 768px) 100vw, 768px" />
        </div>
        <div className="cms-body mt-8 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: doc.html }} />
        <VideoBlock videos={doc.videos} />
        <FaqAccordion items={doc.faq} />
      </article>
      {more.length > 0 ? (
        <aside className="mx-auto mt-12 max-w-3xl border-t border-line pt-6">
          <h2 className="font-sans text-2xl font-semibold text-ink">Segue na mesa</h2>
          <ul className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {more.map((item) => (
              <li key={item.slug} className="h-full border border-line bg-panel">
                <ArticleCard article={item} variant="related" />
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </Container>
  );
};

export default ArticlePage;
