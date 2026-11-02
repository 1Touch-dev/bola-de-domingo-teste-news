import { AffiliatePlacement } from "@/components/affiliate/AffiliatePlacement";
import Image from "next/image";
import type { IPartnerBanner } from "@/lib/banners";

interface IPartnerStripProps {
  banners: IPartnerBanner[];
  variant: "header" | "footer" | "content";
}

export const PartnerStrip = (props: IPartnerStripProps) => {
  const { banners, variant } = props;
  if (banners.length === 0) return null;

  const frame =
    variant === "header"
      ? "h-16 w-auto max-w-full object-contain"
      : variant === "footer"
        ? "h-20 w-auto max-w-full object-contain"
        : "h-28 w-auto max-w-full object-contain";

  return (
    <>
    <div className={variant === "header" ? "border-b border-line bg-panel" : "bg-page"}>
      <div className={`mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-5 sm:px-8 ${variant === "header" ? "py-2" : "py-4"}`}>
        {banners.map((banner) => {
          const image = (
            <Image src={banner.imageUrl} alt={banner.partnerName} width={480} height={160} className={frame} />
          );
          return banner.linkUrl ? (
            <a key={`${banner.imageUrl}-${banner.linkUrl}`} href={banner.linkUrl} rel="sponsored noopener" target="_blank">
              {image}
            </a>
          ) : (
            <div key={banner.imageUrl}>{image}</div>
          );
        })}
      </div>
    </div>
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-8"><AffiliatePlacement /></div>
    </>
  );
};
