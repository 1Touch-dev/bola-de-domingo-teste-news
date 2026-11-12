import type { Metadata } from "next";
import Link from "next/link";
import { SectionNotes } from "@/components/SectionNotes";
import { pracas } from "@/data";
import { loadArticlesForPath } from "@/lib/deskArticles";
import { loadDeskFixtures, pracaDeskTable } from "@/lib/deskFixtures";
import { pageMetadata } from "@/lib/seo";
import { Container, PageHeader, Stripe } from "@/components/ui";
import { StandingsTable } from "@/components/StandingsTable";

export const metadata: Metadata = pageMetadata({
  title: "Praças do domingo",
  description:
    "Taça de Domingo: praças que disputam o calendário de Bola de Domingo. Sem elenco e sem tabela da CBF.",
  path: "/pracas",
});

const PracasPage = async () => {
  const [fixtures, notes] = await Promise.all([loadDeskFixtures(), loadArticlesForPath("/pracas", 20)]);
  const rows = pracaDeskTable(fixtures);

  return (
    <Container className="py-10">
      <PageHeader
        kicker="Taça de Domingo"
        title="Praças"
        lede="Seis praças movem o domingo no país. A tarde define a tabela da taça. A copa da manhã vive no calendário, quando a mesa assina, e não numa lista de nomes."
      />
      {rows.some((row) => row.played > 0) ? (
        <div className="mt-8">
          <StandingsTable
            title="Taça de Domingo"
            rows={rows}
            href="/calendario"
            sideLabel="Praça"
            note="Vitória vale três pontos. Empate vale um. GP soma os gols da súmula. A Rodada da Copa não entra nesta soma. Não é tabela da CBF, do Brasileirão nem de clube."
          />
        </div>
      ) : (
        <p className="mt-8 max-w-2xl text-muted">A tabela da taça aparece quando a mesa assinar os primeiros placares.</p>
      )}
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {pracas.map((praca) => (
          <li key={praca.slug} className="border border-line bg-panel p-4">
            <div className="flex items-start gap-3">
              <Stripe colors={praca.colors} />
              <div>
                <p className="utility-label-soft text-[11px] font-semibold text-muted">
                  {praca.kind} · {praca.city}
                </p>
                <h2 className="font-sans text-xl leading-snug font-semibold text-ink">
                  <Link href={`/pracas/${praca.slug}`} className="hover:text-accent">
                    {praca.name}
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{praca.blurb}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <SectionNotes
        title="Notas de equipes e tabela"
        notes={notes}
        empty="Ainda não há notas dos endpoints Equipes ou Tabela de classificação."
      />
    </Container>
  );
};

export default PracasPage;
