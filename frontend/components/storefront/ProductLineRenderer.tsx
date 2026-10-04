"use client";

import { useState } from "react";
import Link from "next/link";
import ProductVisual from "@/components/storefront/ProductVisual";
import { type Product } from "@/components/storefront/ProductCard";
import { type ProductLineTemplate } from "@/lib/storeConfig";
import { useCart } from "@/context/CartContext";
import { useCompare } from "@/context/CompareContext";
import { useActionNotification } from "@/context/ActionNotificationContext";

interface ProductLineRendererProps {
  products: Product[];
  template: ProductLineTemplate;
}

export default function ProductLineRenderer({ products, template }: ProductLineRendererProps) {
  const { addToCart } = useCart();
  const { addToCompare, isInCompare } = useCompare();
  const { showNotification } = useActionNotification();
  const [addedIds, setAddedIds] = useState<Record<number, boolean>>({});

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: product.title,
      price: product.discountedPrice,
      regularPrice: product.regularPrice,
      warranty: `${product.warrantyDuration} ${product.warrantyType}`,
      slug: product.slug,
      visualType: product.visualType,
    });
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1600);

    showNotification({
      id: product.id,
      type: "cart",
      status: "success",
      title: "Success",
      message: "Product successfully added to your cart.",
    });
  };

  /* =========================================================================
     TEMPLATE 1: MODERN GRID (Sleek, Minimalist, Rounded, Focus on Visual)
     ========================================================================= */
  if (template === "modern") {
    return (
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in duration-300">
        {products.map((product) => {
          const saveAmount = product.regularPrice - product.discountedPrice;
          const availability = product.availability ?? (product.inStock ? "In Stock" : "Pre Order");
          const isAdded = addedIds[product.id];

          return (
            <div
              key={product.id}
              className="group ecommerce-card-hover relative flex flex-col justify-between rounded-3xl border border-card-border/80 bg-card p-4 sm:p-5 shadow-xs"
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-1 text-[11px] font-bold">
                  {saveAmount > 0 ? (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black tracking-wide text-emerald-700 ring-1 ring-emerald-200">
                      Save: ৳{saveAmount.toLocaleString()}
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-500">
                      Official
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-[10px] font-bold text-foreground border border-card-border">
                    <span className={`size-1.5 rounded-full ${product.inStock ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                    {availability}
                  </span>
                </div>

                {/* Product Artwork Container */}
                <Link
                  href={`/products/${product.slug}`}
                  className="mt-3.5 flex h-40 items-center justify-center rounded-2xl bg-surface/70 p-4 border border-card-border/60 transition duration-300 group-hover:bg-surface"
                >
                  <ProductVisual
                    type={product.visualType}
                    className="size-32 transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>

                {/* Title */}
                <Link href={`/products/${product.slug}`}>
                  <h3 className="mt-4 line-clamp-2 text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition leading-snug">
                    {product.title}
                  </h3>
                </Link>

                {/* Clean Specs Pills */}
                {product.specs && product.specs.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {product.specs.slice(0, 2).map((s, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-surface px-2 py-0.5 text-[10px] font-medium text-muted border border-card-border/60 truncate max-w-[200px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Pricing & Footer Actions */}
              <div className="mt-4 pt-3 border-t border-card-border/60">
                <div className="flex items-baseline justify-between gap-1">
                  <div>
                    <span className="text-base sm:text-lg font-black text-primary tracking-tight block">
                      ৳{product.discountedPrice.toLocaleString()}
                    </span>
                    {product.regularPrice > product.discountedPrice && (
                      <span className="text-xs text-muted line-through">
                        ৳{product.regularPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-muted">
                    {product.warrantyDuration}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleAdd(e, product)}
                    className={`flex min-h-[38px] items-center justify-center gap-1 rounded-xl py-1.5 px-3 text-xs font-bold transition active:scale-95 ${isAdded
                      ? "bg-emerald-600 text-white shadow-emerald-600/30"
                      : "bg-secondary hover:bg-secondary-hover text-white shadow-xs"
                      }`}
                  >
                    <span>Add to Cart</span>
                  </button>

                  <Link
                    href={`/products/${product.slug}`}
                    className="flex min-h-[38px] items-center justify-center rounded-xl border border-card-border bg-surface py-1.5 px-3 text-xs font-bold text-foreground hover:border-primary hover:text-primary transition"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /* =========================================================================
     TEMPLATE 2: PRECISE TECHNICAL LIST (StarTech/Techland Spec-Dense View)
     ========================================================================= */
  if (template === "precise") {
    return (
      <div className="space-y-3.5 animate-in fade-in duration-300">
        {products.map((product) => {
          const saveAmount = product.regularPrice - product.discountedPrice;
          const availability = product.availability ?? (product.inStock ? "In Stock" : "Pre Order");
          const isAdded = addedIds[product.id];

          return (
            <div
              key={product.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 rounded-2xl border border-card-border bg-card p-4 sm:p-5 shadow-2xs hover:border-slate-400 transition-all duration-200 group"
            >
              {/* Left Column: Visual Artwork & Stock Pill */}
              <div className="flex items-center gap-4 shrink-0">
                <Link
                  href={`/products/${product.slug}`}
                  className="flex size-24 sm:size-28 items-center justify-center rounded-xl bg-surface p-2 border border-card-border group-hover:border-primary transition"
                >
                  <ProductVisual type={product.visualType} className="size-20 sm:size-24 object-contain" />
                </Link>
              </div>

              {/* Middle Column: Detailed Hardware Spec Matrix */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${product.inStock ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                      }`}
                  >
                    <span className={`size-1.5 rounded-full ${product.inStock ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                    {availability}
                  </span>
                  <span className="rounded-full bg-surface px-2.5 py-0.5 text-[10px] font-bold text-muted border border-card-border">
                    Warranty: {product.warrantyDuration} {product.warrantyType}
                  </span>
                  {saveAmount > 0 && (
                    <span className="rounded-md bg-emerald-700 px-2 py-0.5 text-[10px] font-bold text-white">
                      Save: ৳{saveAmount.toLocaleString()}
                    </span>
                  )}
                </div>

                <Link href={`/products/${product.slug}`}>
                  <h3 className="mt-1.5 text-sm sm:text-base font-black text-foreground hover:text-primary transition">
                    {product.title}
                  </h3>
                </Link>

                {/* StarTech-style Bulleted Specification Table */}
                <div className="mt-2.5 space-y-1 text-xs text-muted">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex items-start gap-1.5 line-clamp-1">
                      <span className="text-primary font-bold shrink-0">▸</span>
                      <span className="truncate">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Pricing & Precision Action Controls */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto shrink-0 border-t md:border-t-0 border-card-border pt-3 md:pt-0 gap-3">
                <div className="text-left md:text-right">
                  <span className="text-lg sm:text-xl font-black text-primary block tracking-tight">
                    ৳{product.discountedPrice.toLocaleString()}
                  </span>
                  {product.regularPrice > product.discountedPrice && (
                    <span className="text-xs text-muted line-through">
                      Regular: ৳{product.regularPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleAdd(e, product)}
                    className={`flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl py-2 px-4 text-xs font-bold transition active:scale-95 ${isAdded
                      ? "bg-emerald-600 text-white shadow-emerald-600/30"
                      : "bg-secondary hover:bg-secondary-hover text-white shadow-xs"
                      }`}
                  >
                    <span>Add to Cart</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (isInCompare && isInCompare(product.id)) {
                        showNotification({
                          id: product.id,
                          type: "compare",
                          status: "error",
                          title: "Error",
                          message: "This product is already in your compare list.",
                        });
                      } else {
                        addToCompare(product);
                        showNotification({
                          id: product.id,
                          type: "compare",
                          status: "success",
                          title: "Success",
                          message: "Product added to your compare list.",
                        });
                      }
                    }}
                    className="flex min-h-[40px] items-center justify-center gap-1 rounded-xl border border-card-border bg-surface px-3 text-xs font-bold text-foreground hover:border-primary hover:text-primary transition active:scale-95"
                    title="Compare"
                  >
                    <span>⇄</span>
                    <span className="hidden sm:inline">Compare</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /* =========================================================================
     TEMPLATE 3: LUCRATIVE SHOWCASE (High-Converting Deal Cards with EMI)
     ========================================================================= */
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in duration-300">
      {products.map((product) => {
        const saveAmount = product.regularPrice - product.discountedPrice;
        const emiPerMonth = Math.round(product.discountedPrice / 12);
        const isAdded = addedIds[product.id];
        const rating = (4.7 + (product.id % 4) * 0.1).toFixed(1);
        const reviewCount = 18 + (product.id * 7) % 65;

        return (
          <div
            key={product.id}
            className="group ecommerce-card-hover relative flex flex-col justify-between rounded-3xl border-2 border-emerald-500/20 bg-gradient-to-b from-card via-card to-emerald-50/20 p-5 shadow-sm"
          >
            <div>
              {/* Header Badges: Large Save Badge & Star Ratings */}
              <div className="flex items-center justify-between gap-1">
                {saveAmount > 0 ? (
                  <span className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-3 py-1 text-xs font-black text-white shadow-xs">
                    SAVE ৳{saveAmount.toLocaleString()}
                  </span>
                ) : (
                  <span className="rounded-xl bg-primary px-3 py-1 text-xs font-black text-white shadow-xs">
                    HOT DEAL
                  </span>
                )}

                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <span>★</span>
                  <span className="text-foreground">{rating}</span>
                  <span className="text-muted text-[10px]">({reviewCount})</span>
                </div>
              </div>

              {/* Product Artwork with subtle radial glow */}
              <Link
                href={`/products/${product.slug}`}
                className="mt-4 flex h-44 items-center justify-center rounded-2xl bg-surface p-4 border border-card-border/50 relative overflow-hidden group-hover:border-emerald-500/40 transition"
              >
                <div className="absolute inset-0 bg-radial from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                <ProductVisual
                  type={product.visualType}
                  className="size-36 transition-transform duration-300 group-hover:scale-110"
                />
              </Link>

              {/* Title */}
              <Link href={`/products/${product.slug}`}>
                <h3 className="mt-4 line-clamp-2 text-sm font-black text-foreground group-hover:text-emerald-700 transition leading-snug">
                  {product.title}
                </h3>
              </Link>

              {/* Lucrative Key Spec Highlights */}
              {product.specs && (
                <div className="mt-2.5 space-y-1 text-xs text-muted">
                  {product.specs.slice(0, 2).map((s, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 truncate">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span className="truncate">{s}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing, EMI & Radiant Action */}
            <div className="mt-5 pt-3.5 border-t border-card-border/60">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
                    ৳{product.discountedPrice.toLocaleString()}
                  </span>
                  {product.regularPrice > product.discountedPrice && (
                    <span className="block text-xs text-muted line-through">
                      ৳{product.regularPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* 0% EMI Installment Badge */}
                <div className="text-right">
                  <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800 block">
                    EMI ৳{emiPerMonth.toLocaleString()}/mo
                  </span>
                  <span className="text-[9px] text-muted block mt-0.5">0% Interest · 12 Mo</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-[1.3fr_1fr] gap-2">
                <button
                  type="button"
                  onClick={(e) => handleAdd(e, product)}
                  className={`flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-black text-white shadow-md transition transform active:scale-95 ${isAdded
                    ? "bg-slate-900 shadow-slate-900/30"
                    : "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-emerald-600/30"
                    }`}
                >
                  <span>{isAdded ? "Added" : "Add to Cart"}</span>
                </button>

                <Link
                  href={`/products/${product.slug}`}
                  className="flex min-h-[42px] items-center justify-center rounded-xl border border-card-border bg-surface py-2 px-2 text-xs font-bold text-foreground hover:border-emerald-500 hover:text-emerald-700 transition"
                >
                  Specs
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
