import type { Metadata } from "next";
import Link from "next/link";
import { MatchRow } from "@/components/football/FootballBoard";
import { SectionNotes } from "@/components/SectionNotes";
import { loadArticlesForPath } from "@/lib/deskArticles";
import { getCrossLeagueFixtures } from "@/lib/football";
import { pageMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/ui";

export const revalidate = 120;

export const metadata: Metadata = pageMetadata({
  title: "Resultados",
  description: "Placares recentes de Brasileirão, Série B, Copa do Brasil, Libertadores e Seleção.",
  path: "/resultados",
});

const ResultsPage = async () => {
  const [{ completed }, notes] = await Promise.all([
    getCrossLeagueFixtures(),
    loadArticlesForPath("/resultados", 20),
  ]);

  return (
    <Container className="py-10">
      <PageHeader
        kicker="Placar ao vivo da API"
        title="Resultados"
        lede="Últimos jogos encerrados nas competições da mesa. Cada placar abre a súmula com lances quando a API envia eventos."
      />
      {completed.length > 0 ? (
        <div className="mt-6">
          {completed.map((match) => (
            <MatchRow key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <p className="mt-6 max-w-2xl text-muted">Nenhum resultado recente nas competições cobertas por enquanto.</p>
      )}
      <p className="mt-6">
        <Link href="/futebol" className="utility-label text-xs font-semibold text-accent">
          Ver classificação e artilharia
        </Link>
      </p>
      <SectionNotes title="Notas de partidas" notes={notes} empty="Ainda não há notas dos feeds Brasileirão, Série B ou Copa do Brasil." />
    </Container>
  );
};

export default ResultsPage;
