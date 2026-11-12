"use client";

import { useCallback, useState } from "react";

interface ISocialShareProps {
  url: string;
  title: string;
}

const networks = (url: string, title: string) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return [
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
    {
      id: "x",
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      id: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      id: "telegram",
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
  ] as const;
};

export const SocialShare = (props: ISocialShareProps) => {
  const { url, title } = props;
  const [copied, setCopied] = useState(false);
  const links = networks(url, title);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [url]);

  return (
    <div className="mt-6 border border-line bg-panel px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="utility-label text-[11px] font-semibold text-accent">Compartilhar</p>
        <ul className="flex flex-wrap items-center gap-2">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="utility-label-soft inline-block border border-line bg-page px-2.5 py-1.5 text-[10px] font-semibold text-ink hover:border-accent hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={handleCopy}
              className="utility-label-soft inline-block border border-line bg-page px-2.5 py-1.5 text-[10px] font-semibold text-ink hover:border-accent hover:text-accent"
            >
              {copied ? "Copiado" : "Copiar link"}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
