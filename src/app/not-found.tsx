import Link from "next/link";
import { Container } from "@/components/ui";

const NotFound = () => (
  <Container className="py-20">
    <p className="utility-label text-[11px] font-semibold text-accent">404</p>
    <h1 className="mt-2 font-display text-4xl font-semibold">Esse domingo não está no mapa</h1>
    <p className="mt-3 max-w-xl text-muted">A página que você procura não está na mesa. Volte para a rodada ou para as notas.</p>
    <div className="mt-6 flex gap-4 text-sm">
      <Link href="/" className="utility-label-soft bg-accent px-4 py-2 text-xs font-semibold text-panel">
        Início
      </Link>
      <Link href="/calendario" className="border border-line bg-panel px-4 py-2">
        Calendário
      </Link>
    </div>
  </Container>
);

export default NotFound;
