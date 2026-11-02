import AffiliateBanner from "@/components/affiliate/AffiliateBanner";
import { AffiliateFeed } from "@/components/affiliate/AffiliateFeed";
import type { Metadata } from "next";
import { fixtures, tardeTable, tardes } from "@/data";
import { pageMetadata } from "@/lib/seo";
import { Container, FixtureRow, PageHeader } from "@/components/ui";
import { StandingsTable } from "@/components/StandingsTable";

export const metadata: Metadata = pageMetadata({
  title: "Circuito da Tarde",
  description:
    "Paradas do circuito: Relógio da Manhã, Viaduto da Tarde, Feira do Domingo, Mercado da Tarde, Estação do Apito, Orla do Domingo, Ponte da Tarde e Alto do Domingo.",
  path: "/tardes",
});

const TardesPage = () => {
  const rounds = fixtures.filter((fixture) => fixture.competition.startsWith("Circuito da Tarde"));

  return (
    <Container className="py-10">
      <PageHeader
        kicker="Domingos 17:30"
        title="Tardes"
        lede="O Circuito da Tarde se joga na parada, com ata às 15:15. A vitória vale três pontos. A tabela é da mesa, não da federação."
      />
      <div className="mt-8">
        <StandingsTable
          title="Tabela do circuito"
          rows={tardeTable}
          href="/resultados"
          sideLabel="Tarde"
          note="Soma dos placares assinados do Circuito da Tarde. Não é classificação da CBF, da Libertadores nem de clube."
        />
      </div>
      <AffiliateBanner preset="landscape" className="mt-8" />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        <AffiliateFeed cards list>{tardes.map((tarde) => (
          <li key={tarde.slug} id={tarde.slug} className="scroll-mt-28 border border-line bg-panel p-4">
            <h2 className="font-display text-2xl">{tarde.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{tarde.note}</p>
          </li>
        ))}</AffiliateFeed>
      </ul>
      <section className="mt-10">
        <h2 className="font-display text-3xl">Rodadas do circuito</h2>
        <div className="mt-2">
          {rounds.map((fixture) => (
            <FixtureRow key={fixture.id} fixture={fixture} />
          ))}
        </div>
      </section>
    </Container>
  );
};

export default TardesPage;
