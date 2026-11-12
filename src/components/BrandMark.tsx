import Image from "next/image";

interface IBrandMarkProps {
  className?: string;
}

export const BrandMark = (props: IBrandMarkProps) => {
  const { className = "size-14" } = props;
  return <Image src="/brand/logo.png" alt="" width={512} height={512} className={`shrink-0 object-contain ${className}`} />;
};
