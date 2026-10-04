import { ProductCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function StorefrontLoading() {
  return (
    <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Hero Banner Skeleton */}
      <div className="w-full aspect-[21/9] min-h-[260px] sm:min-h-[380px] rounded-3xl bg-surface animate-pulse overflow-hidden border border-card-border">
        <Skeleton className="size-full" />
      </div>

      {/* Featured Categories Row Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-44 rounded-lg" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-card-border bg-card shadow-xs">
              <Skeleton className="size-14 rounded-full" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products Shelf Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-52 rounded-lg" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
