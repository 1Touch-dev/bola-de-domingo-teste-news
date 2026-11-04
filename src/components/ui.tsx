import Link from "next/link";
import { site } from "@/config/site";
import type { ICrumbItem, IFixture } from "@/types";
import { FixtureStatusEnum } from "@/types";
import { categoriaName, sideColors, sideHref, sideName, sideShort } from "@/data";
import { formatKickoff } from "@/lib/format";
import type { IContextMatch } from "@/lib/contextFixtures";
import { TeamLogo } from "@/components/TeamLogo";

interface IContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = (props: IContainerProps) => {
  const { children, className = "" } = props;
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
};

interface IPageHeaderProps {
  kicker: string;
  title: string;
  lede: string;
}

export const PageHeader = (props: IPageHeaderProps) => {
  const { kicker, title, lede } = props;

  return (
    <header className="border-b border-line pb-10">
      <p className="utility-label text-[11px] font-semibold text-accent">{kicker}</p>
      <h1 className="mt-3 max-w-4xl font-display text-4xl leading-[1.02] font-semibold text-ink sm:text-5xl">{title}</h1>
      <p className="mt-5 max-w-2xl text-[1.05rem] leading-8 text-muted">{lede}</p>
    </header>
  );
};

interface ISectionHeadingProps {
  eyebrow?: string;
  title: string;
  href?: string;
  actionLabel?: string;
}

export const SectionHeading = (props: ISectionHeadingProps) => {
  const { eyebrow, title, href, actionLabel = "Ver todas" } = props;

  return (
    <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-asphalt pb-3">
      <div>
        {eyebrow ? <p className="utility-label text-[11px] font-semibold text-highlight">{eyebrow}</p> : null}
        <h2 className="font-display text-2xl leading-tight font-semibold text-ink sm:text-[2rem]">{title}</h2>
      </div>
      {href ? (
        <Link href={href} className="utility-label-soft text-xs font-semibold text-accent hover:text-asphalt">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
};

interface ICrestProps {
  slug: string;
  size?: "xs" | "sm";
}

export const Crest = (props: ICrestProps) => {
  const { slug, size = "sm" } = props;
  const [ground, ink] = sideColors(slug);
  const dim = size === "xs" ? "size-7 text-[8px]" : "size-9 text-[10px]";

  return (
    <span
      aria-hidden="true"
      title={sideName(slug)}
      className={`inline-grid shrink-0 place-items-center border border-ink/15 font-semibold tracking-wide ${dim}`}
      style={{ background: ground, color: ink }}
    >
      {sideShort(slug)}
    </span>
  );
};

interface IContextRowProps {
  match: IContextMatch;
}

export const ContextRow = (props: IContextRowProps) => {
  const { match } = props;

  return (
    <article className="grid min-w-0 items-center gap-3 border-b border-line py-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
      <p className="min-w-0 text-xs capitalize text-muted">{match.startsAt ? formatKickoff(match.startsAt) : match.competition}</p>
      <div className="min-w-0">
        <p className="utility-label text-[11px] font-semibold text-muted">{match.competition}</p>
        <div className="mt-1 grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          <p className="flex min-w-0 items-center justify-end gap-2 text-right text-sm font-medium">
            <span className="truncate">{match.homeName}</span>
            <TeamLogo src={match.homeLogo} label={match.homeName} size="xs" />
          </p>
          <p className="score-text shrink-0 bg-asphalt px-2 py-1 text-center text-lg text-panel">{match.score ?? "A disputar"}</p>
          <p className="flex min-w-0 items-center gap-2 text-sm font-medium">
            <TeamLogo src={match.awayLogo} label={match.awayName} size="xs" />
            <span className="min-w-0 truncate">{match.awayName}</span>
          </p>
        </div>
      </div>
    </article>
  );
};

interface ICrumbProps {
  items: ICrumbItem[];
}

export const Crumb = (props: ICrumbProps) => {
  const { items } = props;
  const trail = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${site.url}${item.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Trilha" className="text-sm text-muted">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(trail).replace(/</g, "\\u003c") }} />
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="hover:text-accent">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

interface IStripeProps {
  colors: [string, string];
}

export const Stripe = (props: IStripeProps) => {
  const { colors } = props;

  return (
    <span
      aria-hidden="true"
      className="inline-block h-10 w-3 shrink-0"
      style={{ background: `linear-gradient(${colors[0]}, ${colors[1]})` }}
    />
  );
};

interface IFixtureRowProps {
  fixture: IFixture;
}

export const FixtureRow = (props: IFixtureRowProps) => {
  const { fixture } = props;

  return (
    <article className="grid min-w-0 items-center gap-3 border-b border-line py-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
      <p className="min-w-0 text-xs text-muted">
        <span className="utility-label-soft block font-semibold text-highlight">{categoriaName(fixture.categoria)}</span>
        <span className="mt-1 block capitalize">{formatKickoff(fixture.startsAt)}</span>
      </p>
      <div className="min-w-0">
        <p className="utility-label text-[11px] font-semibold text-muted">{fixture.competition}</p>
        <div className="mt-1 grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          <Link href={sideHref(fixture.homeSlug)} className="flex min-w-0 items-center justify-end gap-2 text-right text-sm font-medium hover:text-accent">
            <span className="truncate">{sideName(fixture.homeSlug)}</span>
            <Crest slug={fixture.homeSlug} size="xs" />
          </Link>
          <Link
            href={`/resultados/${fixture.id}`}
            className="score-text shrink-0 bg-asphalt px-2 py-1 text-center text-lg text-panel hover:bg-accent"
          >
            {fixture.score ?? (fixture.status === FixtureStatusEnum.PROGRAMADO ? "vs" : "—")}
          </Link>
          <Link href={sideHref(fixture.awaySlug)} className="flex min-w-0 items-center gap-2 text-sm font-medium hover:text-accent">
            <Crest slug={fixture.awaySlug} size="xs" />
            <span className="min-w-0 truncate">{sideName(fixture.awaySlug)}</span>
          </Link>
        </div>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-muted">
          <span>{fixture.venue}</span>
          <Link href={`/resultados/${fixture.id}`} className="utility-label font-semibold text-accent">
            {fixture.status === FixtureStatusEnum.FINAL ? "Súmula" : "Ficha"}
          </Link>
        </p>
      </div>
    </article>
  );
};
