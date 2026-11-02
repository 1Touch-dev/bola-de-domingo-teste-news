import AffiliateBanner from "@/components/affiliate/AffiliateBanner";
import { AffiliateFeed } from "@/components/affiliate/AffiliateFeed";
import type { Metadata } from "next";
import Link from "next/link";
import { pracas, pracaTable } from "@/data";
import { pageMetadata } from "@/lib/seo";
import { Container, PageHeader, Stripe } from "@/components/ui";
import { StandingsTable } from "@/components/StandingsTable";

export const metadata: Metadata = pageMetadata({
  title: "Praças do domingo",
  description:
    "Taça de Domingo: praças que disputam o calendário de Bola de Domingo. Sem elenco e sem tabela da CBF.",
  path: "/pracas",
});

const PracasPage = () => (
  <Container className="py-10">
    <PageHeader
      kicker="Taça de Domingo"
      title="Praças"
      lede="Seis praças movem o domingo no país. A tarde define a tabela da taça. A copa da manhã vive no calendário, quando a mesa assina, e não numa lista de nomes."
    />
    <div className="mt-8">
      <StandingsTable
        title="Taça de Domingo"
        rows={pracaTable}
        href="/calendario"
        sideLabel="Praça"
        note="Vitória vale três pontos. Empate vale um. GP soma os gols da súmula. A Rodada da Copa não entra nesta soma. Não é tabela da CBF, do Brasileirão nem de clube."
      />
    </div>
    <AffiliateBanner preset="landscape" className="mt-8" />
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
      <AffiliateFeed cards list>{pracas.map((praca) => (
        <li key={praca.slug} className="border border-line bg-panel p-4">
          <div className="flex items-start gap-3">
            <Stripe colors={praca.colors} />
            <div>
              <p className="text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">
                {praca.kind} · {praca.city}
              </p>
              <h2 className="font-display text-2xl leading-tight">
                <Link href={`/pracas/${praca.slug}`} className="hover:text-accent">
                  {praca.name}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{praca.blurb}</p>
            </div>
          </div>
        </li>
      ))}</AffiliateFeed>
    </ul>
  </Container>
);

export default PracasPage;
