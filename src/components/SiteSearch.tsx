"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Crest } from "@/components/ui";
import type { ISearchItem } from "@/types";

interface ISiteSearchProps {
  items: ISearchItem[];
}

export const SiteSearch = (props: ISiteSearchProps) => {
  const { items } = props;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [shortcut, setShortcut] = useState("Ctrl K");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results =
    query.trim().length > 1
      ? items
          .filter((item) => {
            const q = query.toLowerCase();
            return item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q);
          })
          .slice(0, 8)
      : [];

  const handleOpen = useCallback(() => {
    setOpen(true);
    setQuery("");
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  const handleSelect = (href: string) => {
    handleClose();
    router.push(href);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        handleOpen();
      }
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleOpen, handleClose]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const apple = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
    setShortcut(apple ? "⌘K" : "Ctrl K");
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="utility-label-soft flex items-center gap-2 border border-line bg-page px-3 py-2 text-xs font-semibold text-ink hover:border-accent hover:text-accent"
        aria-label="Buscar"
        aria-keyshortcuts="Control+K Meta+K"
      >
        <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <kbd className="hidden font-mono text-[10px] not-italic sm:inline">{shortcut}</kbd>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh]" onClick={handleClose}>
          <div className="fixed inset-0 bg-asphalt/70 backdrop-blur-sm" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Buscar"
            className="relative z-10 w-full max-w-lg overflow-hidden border border-line bg-panel shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <svg className="size-4 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar praças, tardes e notas"
                className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
              />
              <button type="button" onClick={handleClose} className="utility-label-soft bg-asphalt px-2 py-0.5 text-[10px] text-panel">
                ESC
              </button>
            </div>

            {query.trim().length > 1 ? (
              <div className="max-h-[50vh] overflow-y-auto p-2">
                {results.length === 0 ? (
                  <p className="px-3 py-6 text-center text-sm text-muted">Nada com esse termo.</p>
                ) : (
                  <ul>
                    {results.map((item) => (
                      <li key={`${item.type}-${item.href}`}>
                        <button
                          type="button"
                          onClick={() => handleSelect(item.href)}
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-page"
                        >
                          {item.slug ? (
                            <Crest slug={item.slug} size="sm" />
                          ) : (
                            <span className="grid size-8 shrink-0 place-items-center bg-accent/10 text-accent">
                              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                              </svg>
                            </span>
                          )}
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-ink">{item.title}</span>
                            <span className="block truncate text-[11px] text-muted">{item.subtitle}</span>
                          </span>
                          <span className="utility-label-soft ml-auto shrink-0 bg-page px-2 py-0.5 text-[10px] text-muted">{item.type}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <p className="px-4 py-6 text-center text-sm text-muted">Digite para buscar praças, tardes e notas.</p>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};
