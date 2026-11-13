"use client";

import Image from "next/image";
import { useState } from "react";

export interface ITeamLogoProps {
  src?: string;
  label: string;
  size?: "xs" | "sm" | "md" | "lg";
}

const SIZE = {
  xs: { dim: 28, box: "size-7 text-[8px]" },
  sm: { dim: 36, box: "size-9 text-[10px]" },
  md: { dim: 56, box: "size-14 text-xs" },
  lg: { dim: 88, box: "size-[5.5rem] text-sm" },
} as const;

export const TeamLogo = (props: ITeamLogoProps) => {
  const { src, label, size = "sm" } = props;
  const [failed, setFailed] = useState(false);
  const { dim, box } = SIZE[size];
  const mark = label.slice(0, 3).toUpperCase();

  if (!src || failed) {
    return (
      <span aria-hidden="true" className={`inline-grid shrink-0 place-items-center bg-asphalt font-semibold tracking-wide text-panel ${box}`}>
        {mark}
      </span>
    );
  }

  return (
    <Image src={src} alt="" width={dim} height={dim} className={`shrink-0 object-contain ${box}`} onError={() => setFailed(true)} />
  );
};
