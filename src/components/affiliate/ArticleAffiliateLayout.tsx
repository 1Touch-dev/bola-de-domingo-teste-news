"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import AffiliateBanner from "./AffiliateBanner";

interface IArticleAffiliateLayoutProps {
  children: ReactNode;
}

export const ArticleAffiliateLayout = (props: IArticleAffiliateLayoutProps) => {
  const { children } = props;
  const content = useRef<HTMLDivElement>(null);
  const [hasRoom, setHasRoom] = useState(false);

  useEffect(() => {
    const element = content.current;
    if (!element) return;
    // Measure at the narrower article width as well: a short article should not
    // grow solely to accommodate the vertical creative.
    const measure = () => setHasRoom(element.getBoundingClientRect().height >= 520);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mt-6 grid min-w-0 items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_250px]">
      <div ref={content} className={hasRoom ? "min-w-0" : "col-span-full min-w-0"}>{children}</div>
      {hasRoom ? (
        <div className="hidden min-w-0 lg:block">
          <div className="sticky top-6"><AffiliateBanner preset="vertical" /></div>
        </div>
      ) : null}
    </div>
  );
};
