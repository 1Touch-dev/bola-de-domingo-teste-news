"use client";

import { usePathname } from "next/navigation";
import AffiliateBanner, { type AffiliateBannerPreset } from "./AffiliateBanner";

interface IAffiliatePlacementProps {
  preset?: AffiliateBannerPreset;
  className?: string;
}

export const AffiliatePlacement = (props: IAffiliatePlacementProps) => {
  const { preset = "strip", className = "" } = props;
  const pathname = usePathname();
  if (/^\/(contato|sobre|termos|privacidade)(?:\/|$)/.test(pathname)) return null;
  return <AffiliateBanner preset={preset} className={className} />;
};
