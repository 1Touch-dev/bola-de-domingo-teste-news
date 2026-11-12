import Link from "next/link";
import type { IArticle } from "@/types";

interface ISectionNotesProps {
  title?: string;
  notes: IArticle[];
  empty?: string;
}

export const SectionNotes = (props: ISectionNotesProps) => {
  const { title = "Notas", notes, empty = "Ainda não há notas publicadas nesta seção." } = props;

  return (
    <section className="mt-8">
      <h2 className="font-sans text-2xl font-semibold text-ink">{title}</h2>
      {notes.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {notes.map((article) => (
            <li key={article.slug}>
              <Link href={`/noticias/${article.slug}`} className="hover:text-accent">
                {article.title}
              </Link>
              {article.sectionLabel ? <span className="ml-2 text-xs text-muted">{article.sectionLabel}</span> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 max-w-2xl text-muted">{empty}</p>
      )}
    </section>
  );
};
