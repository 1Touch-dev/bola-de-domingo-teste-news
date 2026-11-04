"use client";

import { useState } from "react";
import type { ICmsFaq } from "@/lib/cmsArticle";

interface IFaqAccordionProps {
  items: ICmsFaq[];
}

export const FaqAccordion = (props: IFaqAccordionProps) => {
  const { items } = props;
  const [open, setOpen] = useState<number | null>(0);
  if (items.length === 0) return null;

  return (
    <section className="mt-10 border-t border-line pt-6">
      <h2 className="font-sans text-2xl font-semibold text-ink">Perguntas frequentes</h2>
      <div className="mt-4 divide-y divide-line border-y border-line">
        {items.map((item, index) => {
          const expanded = open === index;
          const panelId = `faq-panel-${index}`;
          return (
            <div key={item.question}>
              <h3>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-3 text-left font-semibold"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setOpen(expanded ? null : index)}
                >
                  {item.question}
                  <span aria-hidden="true">{expanded ? "–" : "+"}</span>
                </button>
              </h3>
              <div id={panelId} role="region" hidden={!expanded} className="pb-3 text-sm leading-relaxed text-muted">
                {item.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
