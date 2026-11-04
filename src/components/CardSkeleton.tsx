interface ICardSkeletonProps {
  image?: boolean;
  compact?: boolean;
}

export const CardSkeleton = (props: ICardSkeletonProps) => {
  const { image = true, compact = false } = props;

  return (
    <div className="animate-pulse border border-line bg-panel">
      {image ? <div className={`${compact ? "aspect-[16/10]" : "aspect-[16/9]"} bg-line`} /> : null}
      <div className="p-5">
        <div className="h-4 w-24 bg-line" />
        <div className="mt-3 h-8 w-5/6 bg-line" />
        <div className="mt-3 h-16 w-full bg-line" />
      </div>
    </div>
  );
};