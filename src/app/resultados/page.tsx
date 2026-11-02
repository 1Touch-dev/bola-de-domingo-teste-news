import AffiliateBanner from "@/components/affiliate/AffiliateBanner";
import { AffiliateFeed } from "@/components/affiliate/AffiliateFeed";
import type { Metadata } from "next";
import { finishedDeskFixtures, loadDeskFixtures } from "@/lib/deskFixtures";
import { pageMetadata } from "@/lib/seo";
import { Container, FixtureRow, PageHeader } from "@/components/ui";

export const revalidate = 120;

export const metadata: Metadata = pageMetadata({
  title: "Resultados",
  description: "Placares assinados das praças, da rodada da copa e das tardes do circuito. Cada súmula abre o detalhe.",
  path: "/resultados",
});

const ResultsPage = async () => {
  const rows = finishedDeskFixtures(await loadDeskFixtures());

  return (
    <Container className="py-10">
      <PageHeader
        kicker="Súmula assinada"
        title="Resultados"
        lede="Entra o placar que a mesa fechou. O placar abre a súmula: praça, tarde e gols. O grupo não mexe no número, e a federação não empresta a tabela."
      />
      <div className="mt-6">
        <AffiliateFeed>{rows.map((fixture) => (
          <FixtureRow key={fixture.id} fixture={fixture} />
        ))}</AffiliateFeed>
      </div>
      {rows.length < 6 && rows.length > 0 ? <AffiliateBanner preset="strip" className="mt-8" /> : null}
    </Container>
  );
};

export default ResultsPage;
