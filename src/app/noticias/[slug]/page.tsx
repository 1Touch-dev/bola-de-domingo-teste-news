import AffiliateBanner from "@/components/affiliate/AffiliateBanner";
import { ArticleAffiliateLayout } from "@/components/affiliate/ArticleAffiliateLayout";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle } from "@/data";
import { loadArticleDocument, loadDeskArticles } from "@/lib/deskArticles";
import { formatPublished } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PartnerStrip } from "@/components/PartnerStrip";
import { ReaderReaction } from "@/components/ReaderReaction";
import { VideoBlock } from "@/components/VideoBlock";
import { Container, Crumb } from "@/components/ui";
import { loadPartnerBanners } from "@/lib/banners";
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
  const seed = getArticle(slug);
  if (!seed) return {};
  return pageMetadata({
    title: seed.title,
    description: seed.excerpt,
    path: `/noticias/${seed.slug}`,
    type: "article",
    publishedTime: seed.publishedAt,
    exactTitle: true,
  });
};

const ArticlePage = async (props: ISlugPageProps) => {
  const { params } = props;
  const { slug } = await params;
  const doc = await loadArticleDocument(slug);
  if (doc === "missing") notFound();

  if (doc === "down") {
    const article = getArticle(slug);
    if (!article) notFound();
    return (
      <Container className="py-10">
        <ArticleAffiliateLayout>
        <article className="mx-auto min-w-0 max-w-3xl">
        <h1 className="font-display text-4xl font-semibold">{article.title}</h1>
        <div className="mt-8 space-y-4 text-lg leading-relaxed">
          {article.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        </article>
        </ArticleAffiliateLayout>
        <AffiliateBanner preset="strip" className="mt-8" />
      </Container>
    );
  }

  const stories = await loadDeskArticles();
  const partners = await loadPartnerBanners("content");
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
      <ArticleAffiliateLayout>
      <article className="mx-auto min-w-0 max-w-3xl">
        {doc.sectionLabel ? (
          <p className="text-[11px] font-semibold tracking-[0.14em] text-accent uppercase">
            {doc.sectionLabel} · {formatPublished(doc.publishedAt)}
          </p>
        ) : null}
        <h1 className="mt-2 font-display text-4xl leading-[1.05] font-semibold sm:text-5xl">{doc.title}</h1>
        {doc.summary ? <p className="mt-4 text-lg text-muted">{doc.summary}</p> : null}
        {doc.authors.length > 0 ? <p className="mt-3 text-sm">Por {doc.authors.join(", ")}</p> : null}
        {doc.cover ? (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden border border-line">
            <Image src={doc.cover} alt="" fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
          </div>
        ) : null}
        <div className="cms-body mt-8 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: doc.html }} />
        <VideoBlock videos={doc.videos} />
        <FaqAccordion items={doc.faq} />
        <ReaderReaction slug={doc.slug} articleId={doc.id} />
        <div className="mt-8">
          <PartnerStrip banners={partners} variant="content" />
        </div>
      </article>
      </ArticleAffiliateLayout>
      {partners.length === 0 ? <AffiliateBanner preset="strip" className="mt-8" /> : null}
      {more.length > 0 ? (
        <aside className="mx-auto mt-12 max-w-3xl border-t border-line pt-6">
          <h2 className="font-display text-2xl font-semibold">Segue na mesa</h2>
          <ul className="mt-3 space-y-2">
            {more.map((item) => (
              <li key={item.slug}>
                <Link href={`/noticias/${item.slug}`} className="hover:text-accent">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </Container>
  );
};

export default ArticlePage;
