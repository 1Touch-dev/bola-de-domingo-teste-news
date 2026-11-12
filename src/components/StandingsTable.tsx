import Link from "next/link";
import { points, pointsDiff, sideHref, sideName, sortTable } from "@/data";
import type { IStandingRow } from "@/types";
import { Crest } from "@/components/ui";

interface IStandingsTableProps {
  title: string;
  rows: IStandingRow[];
  href: string;
  sideLabel?: string;
  note?: string;
}

export const StandingsTable = (props: IStandingsTableProps) => {
  const { title, rows, href, sideLabel = "Praça", note } = props;
  const table = sortTable(rows);
  const hasResults = table.some((row) => row.played > 0);
  if (!hasResults) return null;

  return (
    <section className="min-w-0">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="min-w-0 font-sans text-2xl font-semibold text-ink">{title}</h2>
        <Link href={href} className="utility-label shrink-0 text-xs font-semibold text-accent hover:text-asphalt">
          Ver todas
        </Link>
      </div>
      <div className="max-w-full overflow-x-auto border border-line bg-panel">
        <table className="w-full text-left text-[0.95rem]">
          <caption className="sr-only">{title}</caption>
          <thead className="utility-label bg-asphalt text-[11px] text-panel">
            <tr>
              <th scope="col" className="px-2 py-2 font-semibold sm:px-3">
                #
              </th>
              <th scope="col" className="px-2 py-2 font-semibold sm:px-3">
                {sideLabel}
              </th>
              <th scope="col" className="px-2 py-2 text-right font-semibold sm:px-3">
                J
              </th>
              <th scope="col" className="px-2 py-2 text-right font-semibold sm:px-3">
                GP
              </th>
              <th scope="col" className="px-2 py-2 text-right font-semibold sm:px-3">
                SG
              </th>
              <th scope="col" className="px-2 py-2 text-right font-semibold sm:px-3">
                Pts
              </th>
            </tr>
          </thead>
          <tbody>
            {table.map((row, index) => {
              const diff = pointsDiff(row);
              return (
                <tr key={row.slug} className="border-t border-line">
                  <td className="px-2 py-3 font-semibold text-highlight tabular-nums sm:px-3">{index + 1}</td>
                  <td className="px-2 py-3 sm:px-3">
                    <Link href={sideHref(row.slug)} className="flex min-w-0 items-center gap-2 font-medium hover:text-accent">
                      <Crest slug={row.slug} size="xs" />
                      <span className="truncate">{sideName(row.slug)}</span>
                    </Link>
                  </td>
                  <td className="px-2 py-3 text-right tabular-nums text-muted sm:px-3">{row.played}</td>
                  <td className="px-2 py-3 text-right tabular-nums text-muted sm:px-3">{row.pointsFor}</td>
                  <td className="px-2 py-3 text-right tabular-nums text-muted sm:px-3">{diff > 0 ? `+${diff}` : diff}</td>
                  <td className="score-text px-2 py-3 text-right text-base font-bold text-ink sm:px-3">{points(row)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {note ? <p className="mt-3 text-xs text-muted">{note}</p> : null}
    </section>
  );
};
