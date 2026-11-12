import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { nav, site } from "@/config/site";
import { pracas, tardes } from "@/data";
import { HOME_ARTICLE_ENDPOINT } from "@/lib/cmsEndpoints";
import { loadArticlesByEndpoint } from "@/lib/deskArticles";
import { DeskDate } from "@/components/DeskDate";
import { FooterNewsletter } from "@/components/FooterNewsletter";
import { SiteNav } from "@/components/SiteNav";
import { SiteSearch } from "@/components/SiteSearch";
import { Container } from "@/components/ui";
import { SearchKindEnum } from "@/types";
import type { ISearchItem } from "@/types";

interface ISiteShellProps {
  children: React.ReactNode;
}

const searchItems = async (): Promise<ISearchItem[]> => {
  // Keep the shell on one feed so every static page does not fan out the full desk during SSG.
  const notes = await loadArticlesByEndpoint(HOME_ARTICLE_ENDPOINT, 40);
  return [
    ...pracas.map((item) => ({
      type: SearchKindEnum.PRACA,
      title: item.name,
      subtitle: `${item.kind} · ${item.city}`,
      href: `/pracas/${item.slug}`,
      slug: item.slug,
    })),
    ...tardes.map((item) => ({
      type: SearchKindEnum.TARDE,
      title: item.name,
      subtitle: item.note,
      href: `/tardes#${item.slug}`,
      slug: item.slug,
    })),
    ...notes.map((item) => ({
      type: SearchKindEnum.NOTA,
      title: item.title,
      subtitle: item.excerpt,
      href: `/noticias/${item.slug}`,
      image: item.coverImage,
    })),
  ];
};

export const SiteShell = async (props: ISiteShellProps) => {
  const { children } = props;
  const items = await searchItems();

  return (
    <div className="flex min-h-full flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-panel focus:px-3 focus:py-2"
      >
        Ir para o conteúdo
      </a>
      <header>
        <div className="bg-ink text-[11px] text-panel/70">
          <Container className="flex items-center justify-between gap-4 py-2">
            <DeskDate className="capitalize" />
            <p className="hidden min-w-0 truncate sm:block">{site.tagline}</p>
            <p className="shrink-0 font-semibold text-panel">pt-BR</p>
          </Container>
        </div>
        <div className="border-b border-line bg-panel">
          <Container className="flex items-center justify-between gap-6 py-5">
            <Link href="/" className="flex min-w-0 items-center gap-3" aria-label={site.name}>
              <BrandMark className="size-12 sm:size-16" />
              <span className="min-w-0 leading-none">
                <span className="utility-label block text-[11px] font-semibold text-highlight">Domingo</span>
                <span className="mt-1.5 block font-display text-2xl leading-none font-semibold text-ink sm:text-[2rem]">{site.name}</span>
              </span>
            </Link>
            <div className="flex shrink-0 items-center gap-3">
              <SiteSearch items={items} />
              <Link
                href="/contato"
                className="utility-label hidden bg-asphalt px-3 py-2 text-xs font-semibold text-panel sm:inline"
              >
                Contato
              </Link>
            </div>
          </Container>
        </div>
        <SiteNav />
      </header>
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <section className="mt-16 border-t-4 border-accent bg-asphalt text-panel">
        <Container className="grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="utility-label text-[11px] font-semibold text-accent">Newsletter</p>
            <h2 className="mt-3 font-display text-4xl leading-tight font-semibold">O boletim de domingo</h2>
            <p className="mt-4 max-w-md text-[0.97rem] leading-7 text-panel/75">
              Três notas e a semana da taça. Sem tabela da CBF.
            </p>
          </div>
          <div className="bg-panel p-6 text-ink">
            <FooterNewsletter id="briefing-newsletter-email" layout="stack" tone="paper" />
            <p className="mt-2 text-xs text-muted">Sem spam. A assinatura sai quando você pedir.</p>
          </div>
        </Container>
      </section>
      <footer className="bg-ink text-panel">
        <Container className="grid gap-8 py-12 sm:grid-cols-3">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label={site.name}>
              <BrandMark className="size-12 rounded-full bg-page" />
              <span className="font-display text-2xl leading-none font-semibold">{site.name}</span>
            </Link>
            <p className="mt-4 text-[0.95rem] leading-7 text-panel/60">
              Mesa independente em São Paulo. Placares que a praça assina, não o boletim da federação.
            </p>
          </div>
          <div>
            <p className="utility-label text-[11px] font-semibold text-panel/50">Seções</p>
            <ul className="mt-3 grid gap-2 text-sm text-panel/80">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="utility-label text-[11px] font-semibold text-panel/50">Mesa</p>
            <ul className="mt-3 grid gap-2 text-sm text-panel/80">
              <li>
                <Link href="/sobre" className="hover:text-accent">
                  Quem somos
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-accent">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos" className="hover:text-accent">
                  Termos
                </Link>
              </li>
            </ul>
          </div>
        </Container>
        <Container className="border-t border-white/10 py-4 text-xs text-panel/40">
          © {new Date().getFullYear()} {site.name}. {site.city}, {site.country}. Horário de Brasília (GMT-3).
        </Container>
      </footer>
    </div>
  );
};
