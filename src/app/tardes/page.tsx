import AffiliateBanner from "@/components/affiliate/AffiliateBanner";
import { AffiliateFeed } from "@/components/affiliate/AffiliateFeed";
import type { Metadata } from "next";
import { SectionNotes } from "@/components/SectionNotes";
import { tardes } from "@/data";
import { loadArticlesForCategoria } from "@/lib/deskArticles";
import { loadDeskFixtures, tardeDeskTable } from "@/lib/deskFixtures";
import { pageMetadata } from "@/lib/seo";
import { CategoriaSlugEnum } from "@/types";
import { Container, FixtureRow, PageHeader } from "@/components/ui";
import { StandingsTable } from "@/components/StandingsTable";

export const metadata: Metadata = pageMetadata({
  title: "Circuito da Tarde",
  description:
    "Paradas do circuito: Relógio da Manhã, Viaduto da Tarde, Feira do Domingo, Mercado da Tarde, Estação do Apito, Orla do Domingo, Ponte da Tarde e Alto do Domingo.",
  path: "/tardes",
});

const TardesPage = async () => {
  const [fixtures, notes] = await Promise.all([
    loadDeskFixtures(),
    loadArticlesForCategoria(CategoriaSlugEnum.TARDE, 20),
  ]);
  const rounds = fixtures.filter((fixture) => fixture.competition.startsWith("Circuito da Tarde"));
  const rows = tardeDeskTable(fixtures);

  return (
    <Container className="py-10">
      <PageHeader
        kicker="Domingos 17:30"
        title="Tardes"
        lede="O Circuito da Tarde se joga na parada, com ata às 15:15. A vitória vale três pontos. A tabela é da mesa, não da federação."
      />
      {rows.some((row) => row.played > 0) ? (
        <div className="mt-8">
          <StandingsTable
            title="Tabela do circuito"
            rows={rows}
            href="/resultados"
            sideLabel="Tarde"
            note="Soma dos placares assinados do Circuito da Tarde. Não é classificação da CBF, da Libertadores nem de clube."
          />
        </div>
      ) : (
        <p className="mt-8 max-w-2xl text-muted">A tabela do circuito aparece quando a mesa assinar os primeiros placares.</p>
      )}
      <AffiliateBanner preset="landscape" className="mt-8" />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        <AffiliateFeed cards list>{tardes.map((tarde) => (
          <li key={tarde.slug} id={tarde.slug} className="scroll-mt-28 border border-line bg-panel p-4">
            <h2 className="font-sans text-xl font-semibold text-ink">{tarde.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{tarde.note}</p>
          </li>
        ))}</AffiliateFeed>
      </ul>
      {rounds.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-sans text-2xl font-semibold text-ink">Rodadas do circuito</h2>
          <div className="mt-2">
            {rounds.map((fixture) => (
              <FixtureRow key={fixture.id} fixture={fixture} />
            ))}
          </div>
        </section>
      ) : null}
      <SectionNotes title="Notas da tarde" notes={notes} empty="Ainda não há notas do endpoint Libertadores." />
    </Container>
  );
};

export default TardesPage;
