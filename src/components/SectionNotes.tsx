import { ArticleCard } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/ui";
import type { IArticle } from "@/types";

interface ISectionNotesProps {
  title?: string;
  notes: IArticle[];
  empty?: string;
  href?: string;
}

export const SectionNotes = (props: ISectionNotesProps) => {
  const {
    title = "Notas",
    notes,
    empty = "Ainda não há notas publicadas nesta seção.",
    href = "/noticias",
  } = props;

  return (
    <section className="mt-12 border-t border-line pt-10">
      <SectionHeading title={title} href={href} actionLabel="Ver todas" />
      {notes.length > 0 ? (
        <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.slice(0, 6).map((article) => (
            <ArticleCard key={article.slug} article={article} variant="latest" />
          ))}
        </div>
      ) : (
        <p className="mt-4 max-w-2xl text-muted">{empty}</p>
      )}
    </section>
  );
};
