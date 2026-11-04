"use client";

import { useEffect, useState } from "react";
import { envConfig } from "@/config/env";

interface IReaderReactionProps {
  slug: string;
  articleId: string;
}

interface ISentimentEvent {
  sourceType?: string;
  sourceId?: string;
  text?: string;
  status?: string;
  createdAt?: string;
  metadata?: { slug?: string; reaction?: string };
  analysis?: { overallLabel?: string };
}

const reactions = ["like", "love", "haha", "wow", "sad", "angry", "dislike"] as const;

const readerId = () => {
  const key = "bd-reader";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const id = window.crypto.randomUUID();
  window.localStorage.setItem(key, id);
  return id;
};

const belongs = (event: ISentimentEvent, slug: string) =>
  event.metadata?.slug === slug || (event.sourceId ?? "").startsWith(`${slug}:`);

const labelOf = (event: ISentimentEvent) => (event.analysis?.overallLabel || "").toLowerCase();

export const ReaderReaction = (props: IReaderReactionProps) => {
  const { slug, articleId } = props;
  const [events, setEvents] = useState<ISentimentEvent[]>([]);
  const [comment, setComment] = useState("");
  const [pendingComments, setPendingComments] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      const found: ISentimentEvent[] = [];
      let page = 1;
      let totalPages = 1;
      while (page <= totalPages && page <= 10) {
        const url = new URL(`${envConfig.apiBaseUrl}/sentiment/events`);
        url.searchParams.set("website", envConfig.targetWebsite);
        url.searchParams.set("status", "completed");
        url.searchParams.set("limit", "100");
        url.searchParams.set("page", String(page));
        const response = await fetch(url, { headers: { Accept: "application/json" } });
        if (!response.ok) break;
        const body: unknown = await response.json();
        if (typeof body !== "object" || body === null) break;
        const record = body as { events?: unknown; totalPages?: number };
        const rows = Array.isArray(record.events)
          ? record.events.filter((item): item is ISentimentEvent => typeof item === "object" && item !== null)
          : [];
        found.push(...rows.filter((event) => belongs(event, slug)));
        totalPages = typeof record.totalPages === "number" ? record.totalPages : page;
        page += 1;
      }
      setEvents(found);
    };
    load().catch(() => setEvents([]));
  }, [slug]);

  const completed = events.filter((event) => event.status === "completed" || !event.status);
  const count = (label: string) => completed.filter((event) => labelOf(event) === label).length;
  const likes = completed.filter((event) => event.sourceType === "like").length;
  const comments = completed
    .filter((event) => event.sourceType === "comment" && event.metadata?.slug === slug && event.text)
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  const showCounts = completed.length > 0;

  const post = async (payload: Record<string, unknown>) => {
    setBusy(true);
    setNote("");
    try {
      const response = await fetch(`${envConfig.apiBaseUrl}/sentiment/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.status === 400) {
        setNote("Não foi possível enviar.");
        return false;
      }
      if (!response.ok) {
        setNote("Não foi possível enviar. Tente de novo.");
        return false;
      }
      return true;
    } catch {
      setNote("Não foi possível enviar. Tente de novo.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const sendComment = async () => {
    const text = comment.trim();
    if (!text || busy) return;
    const id = window.crypto.randomUUID();
    const ok = await post({
      website: envConfig.targetWebsite,
      sourceType: "comment",
      sourceId: `${slug}:comment:${id}`,
      text,
      language: "pt-BR",
      metadata: { slug, path: `/noticias/${slug}`, articleId },
    });
    if (!ok) return;
    setPendingComments((rows) => [text, ...rows]);
    setComment("");
  };

  const sendLike = async () => {
    if (busy) return;
    await post({
      website: envConfig.targetWebsite,
      sourceType: "like",
      sourceId: `${slug}:like:${readerId()}`,
      language: "pt-BR",
      metadata: { slug, path: `/noticias/${slug}`, articleId, reaction: "like" },
    });
  };

  const sendReaction = async (name: string) => {
    if (busy) return;
    await post({
      website: envConfig.targetWebsite,
      sourceType: "reaction",
      sourceId: `${slug}:reaction:${name}:${readerId()}`,
      language: "pt-BR",
      metadata: { slug, path: `/noticias/${slug}`, articleId, reaction: name },
    });
  };

  const sendRating = async (rating: number) => {
    if (busy) return;
    await post({
      website: envConfig.targetWebsite,
      sourceType: "rating",
      sourceId: `${slug}:rating:${readerId()}`,
      language: "pt-BR",
      metadata: { slug, path: `/noticias/${slug}`, articleId, rating },
    });
  };

  return (
    <section className="mt-10 border-t border-line pt-6">
      <h2 className="font-display text-3xl font-semibold">Reação dos leitores</h2>
      {showCounts ? (
        <p className="mt-3 text-sm text-muted">
          Positivo {count("positive")} · Neutro {count("neutral")} · Negativo {count("negative")} · Curtidas {likes}
        </p>
      ) : null}
      <div className="mt-4 flex max-w-full flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={sendLike} className="border border-line bg-panel px-3 py-2 text-xs font-semibold tracking-wide uppercase disabled:opacity-60">
          Curtir
        </button>
        {reactions.map((name) => (
          <button key={name} type="button" disabled={busy} onClick={() => sendReaction(name)} className="border border-line px-2 py-2 text-xs uppercase disabled:opacity-60">
            {name}
          </button>
        ))}
        {[1, 2, 3, 4, 5].map((rating) => (
          <button key={rating} type="button" disabled={busy} onClick={() => sendRating(rating)} className="border border-line px-2 py-2 text-xs disabled:opacity-60">
            {rating}
          </button>
        ))}
      </div>
      <div className="mt-4 grid min-w-0 gap-2">
        <label className="text-sm" htmlFor={`comment-${slug}`}>
          Comentário
        </label>
        <textarea
          id={`comment-${slug}`}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={3}
          className="w-full max-w-full border border-line bg-panel px-3 py-2 text-sm"
        />
        <button
          type="button"
          disabled={busy || !comment.trim()}
          onClick={sendComment}
          className="w-fit bg-accent px-4 py-2 text-xs font-semibold tracking-wide text-panel uppercase disabled:opacity-60"
        >
          Enviar
        </button>
        {note ? <p className="text-xs text-accent">{note}</p> : null}
      </div>
      <ul className="mt-4 grid gap-3">
        {pendingComments.map((text, index) => (
          <li key={`${text}-${index}`} className="border border-line bg-panel p-3 text-sm break-words">
            {text}
          </li>
        ))}
        {comments.map((event) => (
          <li key={event.sourceId || event.text} className="border border-line bg-panel p-3 text-sm break-words">
            <p>{event.text}</p>
            {labelOf(event) ? <p className="mt-1 text-[11px] font-semibold tracking-wide text-highlight uppercase">{labelOf(event)}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
};
