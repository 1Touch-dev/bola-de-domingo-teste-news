"use client";

import { useState } from "react";
import { site } from "@/config/site";

export const ContactForm = () => {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="mt-8 grid max-w-xl gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = String(data.get("name") ?? "");
        const from = String(data.get("from") ?? "");
        const message = String(data.get("message") ?? "");
        const body = `Nome: ${name}\nPraça ou tarde: ${from}\n\n${message}`;
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Mesa ${site.folder}`)}&body=${encodeURIComponent(body)}`;
        setSent(true);
      }}
    >
      <label className="grid gap-1 text-sm">
        Nome
        <input name="name" required autoComplete="name" className="border border-line bg-panel px-3 py-2 text-base text-ink" />
      </label>
      <label className="grid gap-1 text-sm">
        Praça ou tarde
        <input name="from" required className="border border-line bg-panel px-3 py-2 text-base text-ink" />
      </label>
      <label className="grid gap-1 text-sm">
        Mensagem
        <textarea name="message" required rows={5} className="border border-line bg-panel px-3 py-2 text-base text-ink" />
      </label>
      <button type="submit" className="utility-label-soft w-fit bg-accent px-5 py-2 text-xs font-semibold text-panel hover:bg-asphalt">
        Abrir e-mail
      </button>
      {sent ? (
        <p className="text-sm text-muted">
          O e-mail para {site.email} foi aberto. Se não sair, copie a mensagem e envie à mão. A súmula assinada manda sobre o grupo.
        </p>
      ) : null}
    </form>
  );
};
