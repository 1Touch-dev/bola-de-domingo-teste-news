import type { Metadata } from "next";
import { FootballBoard, LeagueTabs } from "@/components/football/FootballBoard";
import { Container, PageHeader } from "@/components/ui";
import { COMPETITIONS, competitionForSlug, getLeagueBoard, SEASON } from "@/lib/football";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 120;

type PageProps = {
  searchParams: Promise<{ liga?: string }>;
};

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const params = await props.searchParams;
  const competition = competitionForSlug(params.liga ?? "") ?? COMPETITIONS[0];
  return pageMetadata({
    title: `Futebol — ${competition.name}`,
    description: `Jogos, classificação e artilharia de ${competition.name} ${SEASON} na mesa da Bola de Domingo.`,
    path: `/futebol?liga=${competition.slug}`,
  });
};

const FutebolPage = async (props: PageProps) => {
  const params = await props.searchParams;
  const competition = competitionForSlug(params.liga ?? "") ?? COMPETITIONS[0];
  const board = await getLeagueBoard(competition.slug);

  return (
    <Container className="py-10">
      <PageHeader
        kicker={`Temporada ${SEASON}`}
        title="Futebol"
        lede="Brasileirão, Série B, Copa do Brasil, Libertadores e Seleção: jogos, tabela e artilharia pelo proxy CMS da mesa."
      />
      <div className="mt-8">
        <LeagueTabs active={competition.slug} />
      </div>
      {board ? (
        <FootballBoard board={board} />
      ) : (
        <p className="mt-8 max-w-2xl text-muted">
          Os dados de {competition.name} não estão disponíveis agora. A mesa tenta de novo no próximo ciclo.
        </p>
      )}
    </Container>
  );
};

export default FutebolPage;
