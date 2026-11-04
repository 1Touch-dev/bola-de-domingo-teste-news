import { AffiliateFeed } from "@/components/affiliate/AffiliateFeed";
import type { Metadata } from "next";
import Link from "next/link";
import { categorias } from "@/data";
import { pageMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = pageMetadata({
  title: "Categorias",
  description: "Domingo, copa, tarde, seleção, mercado e bastidores na cobertura de Bola de Domingo.",
  path: "/categorias",
});

const CategoriasPage = () => (
  <Container className="py-10">
    <PageHeader
      kicker="Praça e tarde"
      title="Categorias"
      lede="A taça enche a tarde. A copa se joga de manhã. O circuito fecha às 17:30. Seleção, mercado e bastidores ficam na nota, sem placar oficial."
    />
    <ul className="mt-8 grid gap-4 sm:grid-cols-2">
      <AffiliateFeed cards list>{categorias.map((item) => (
        <li key={item.slug} className="border border-line bg-panel p-5">
          <h2 className="font-sans text-2xl font-semibold text-ink">
            <Link href={`/categorias/${item.slug}`} className="hover:text-accent">
              {item.name}
            </Link>
          </h2>
          <p className="mt-2 text-muted">{item.pitch}</p>
          <p className="mt-3 text-sm text-ink">{item.where}</p>
        </li>
      ))}</AffiliateFeed>
    </ul>
  </Container>
);

export default CategoriasPage;
