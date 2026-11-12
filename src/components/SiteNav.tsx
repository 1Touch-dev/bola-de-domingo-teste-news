"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav } from "@/config/site";

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export const SiteNav = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav aria-label="Seções" className="bg-asphalt text-panel">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex justify-end lg:block">
          <button
            type="button"
            className="utility-label py-3 text-xs font-semibold text-accent lg:hidden"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Fechar" : "Seções"}
          </button>
        </div>
        <ul className={`${open ? "grid gap-1 pb-3" : "hidden"} lg:flex lg:flex-wrap lg:gap-0 lg:pb-0`}>
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`utility-label-soft block px-3 py-3 text-xs font-semibold ${
                    active ? "bg-accent text-panel" : "text-panel/80 hover:bg-white/10 hover:text-panel"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
