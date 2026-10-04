"use client";

import ProductCard, { Product } from "@/components/storefront/ProductCard";

export interface ProductShelfProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  products: Product[];
  className?: string;
  columns?: 3 | 4;
}

export default function ProductShelf({
  eyebrow,
  title = "Featured Products",
  subtitle = "Discover our handpicked selection of premium tech products",
  products,
  className = "",
  columns = 4,
}: ProductShelfProps) {
  const gridColsClass =
    columns === 3
      ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <section className={`mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 ${className}`}>
      {/* Modern Section Header (Aligned with Reference Design) */}
      <div className="mb-6 flex flex-col items-start">
        {eyebrow && (
          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
            {eyebrow}
          </span>
        )}
        <h2 className="text-[23px] sm:text-[27px] font-semibold text-foreground tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-[13.5px] sm:text-[15.5px] font-normal text-slate-600 dark:text-slate-300 leading-relaxed tracking-normal">
            {subtitle}
          </p>
        )}
      </div>

      {/* Product Grid or Fallback */}
      {products.length > 0 ? (
        <div className={gridColsClass}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-card-border bg-card p-12 text-center text-muted text-sm">
          No products currently available in this collection.
        </div>
      )}
    </section>
  );
}
