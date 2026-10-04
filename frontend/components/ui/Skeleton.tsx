import type { HTMLAttributes } from "react";

export function Skeleton({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/80 ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
      <div>
        {/* Visual placeholder */}
        <div className="relative aspect-square w-full rounded-xl bg-slate-100 overflow-hidden">
          <Skeleton className="size-full rounded-xl" />
        </div>

        {/* Brand / Model pill */}
        <div className="mt-3 flex items-center justify-between">
          <Skeleton className="h-3.5 w-16 rounded-full" />
          <Skeleton className="h-3.5 w-12 rounded-full" />
        </div>

        {/* Title lines */}
        <div className="mt-2.5 space-y-1.5">
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-3/5 rounded" />
        </div>

        {/* Spec bullet items */}
        <div className="mt-3 space-y-1">
          <Skeleton className="h-3 w-4/5 rounded" />
          <Skeleton className="h-3 w-2/3 rounded" />
        </div>
      </div>

      {/* Pricing & CTA Button */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-5 w-20 rounded" />
          <Skeleton className="h-3 w-14 rounded" />
        </div>
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}

export function CategoryPageSkeleton() {
  return (
    <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-3.5 w-14 rounded" />
        <span className="text-slate-300">/</span>
        <Skeleton className="h-3.5 w-20 rounded" />
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 shrink-0 rounded-full" />
        ))}
      </div>

      {/* Main Grid: Sidebar Filters + Products Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-8">
        {/* Left Filter Sidebar Skeleton */}
        <aside className="hidden lg:block space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
            <Skeleton className="h-5 w-24 rounded" />
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-4/5 rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <Skeleton className="h-4 w-28 rounded" />
              <div className="flex gap-2">
                <Skeleton className="h-8 flex-1 rounded-lg" />
                <Skeleton className="h-8 flex-1 rounded-lg" />
              </div>
            </div>
          </div>
        </aside>

        {/* Right Products Grid Skeleton */}
        <div>
          {/* Top Sort & Count Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-9 w-36 rounded-xl" />
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export function ProductDetailSkeleton() {
  return (
    <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-3.5 w-14 rounded" />
        <span className="text-slate-300">/</span>
        <Skeleton className="h-3.5 w-24 rounded" />
        <span className="text-slate-300">/</span>
        <Skeleton className="h-3.5 w-36 rounded" />
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full rounded-3xl border border-slate-200 bg-white p-6 overflow-hidden">
            <Skeleton className="size-full rounded-2xl" />
          </div>
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="size-20 rounded-2xl border border-slate-200" />
            ))}
          </div>
        </div>

        {/* Right Column: Info, Pricing, and CTAs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-28 rounded-full" />
            <Skeleton className="h-8 w-4/5 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="flex items-baseline gap-3">
              <Skeleton className="h-8 w-32 rounded" />
              <Skeleton className="h-5 w-20 rounded" />
            </div>
            <Skeleton className="h-4 w-3/4 rounded" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-12 flex-1 rounded-xl" />
              <Skeleton className="h-12 flex-1 rounded-xl" />
            </div>
          </div>

          {/* Highlights & specs list */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3.5 w-5/6 rounded" />
            <Skeleton className="h-3.5 w-2/3 rounded" />
          </div>
        </div>
      </div>
    </main>
  );
}
