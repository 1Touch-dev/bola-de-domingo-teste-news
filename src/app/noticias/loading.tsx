import { Container, PageHeader } from "@/components/ui";
import { CardSkeleton } from "@/components/CardSkeleton";

const NewsLoading = () => {
  return (
    <Container className="py-10">
      <PageHeader
        kicker="Mesa de redação"
        title="Notícias"
        lede="O que a súmula confirma: praças, tardes e a semana de seleção que a mesa não transforma em tabela oficial."
      />
      <div className="mt-8 divide-y divide-line border-y border-line">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="grid gap-4 py-5 sm:grid-cols-[13rem_1fr]">
            <CardSkeleton compact />
            <CardSkeleton image={false} compact />
          </div>
        ))}
      </div>
    </Container>
  );
};

export default NewsLoading;