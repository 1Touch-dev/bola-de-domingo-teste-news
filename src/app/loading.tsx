import { CardSkeleton } from "@/components/CardSkeleton";

const HomeLoading = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <div className="space-y-10">
        <div className="h-12 w-2/3 animate-pulse bg-line" />
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <CardSkeleton />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <CardSkeleton key={index} image={false} compact />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLoading;