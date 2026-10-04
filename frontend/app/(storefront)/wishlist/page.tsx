"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/storefront/Breadcrumbs";
import ProductVisual from "@/components/storefront/ProductVisual";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useActionNotification } from "@/context/ActionNotificationContext";

function TrashIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <line x1="9.5" y1="11" x2="9.5" y2="17" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <line x1="14.5" y1="11" x2="14.5" y2="17" />
    </svg>
  );
}

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist, isLoaded } = useWishlist();
  const { addToCart } = useCart();
  const { showNotification } = useActionNotification();
  const [addedIds, setAddedIds] = useState<Record<number, boolean>>({});
  const [bulkAdded, setBulkAdded] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    document.title = "My Wishlist | TechHub Bangladesh";
  }, []);

  const handleAddToCart = (item: (typeof items)[0]) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      regularPrice: item.regularPrice,
      warranty: item.warranty ?? "Official Warranty",
      slug: item.slug,
      visualType: item.visualType,
    });
    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);

    showNotification({
      id: item.id,
      type: "cart",
      status: "success",
      title: "Success",
      message: "Product successfully added to your cart.",
    });
  };

  const handleAddAllToCart = () => {
    const inStockItems = items.filter((item) => item.inStock !== false);
    if (inStockItems.length === 0) return;

    inStockItems.forEach((item) => {
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        regularPrice: item.regularPrice,
        warranty: item.warranty ?? "Official Warranty",
        slug: item.slug,
        visualType: item.visualType,
      });
    });
    setBulkAdded(true);
    setTimeout(() => setBulkAdded(false), 2000);
  };

  return (
    <>
      {/* Standardized Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "My Wishlist" },
        ]}
      />

      <main className="mx-auto max-w-[1440px] px-4 pb-4 pt-4 sm:px-6 lg:px-10 min-h-[calc(100vh-320px)] sm:min-h-[calc(100vh-280px)] flex flex-col">
        {/* Top Header & Actions — aligned with Cart page design */}
        {items.length > 0 && (
          <div className="mb-6 flex flex-col justify-between gap-3 border-b border-card-border pb-3 sm:flex-row sm:items-center">
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">
              Wishlist ({items.length} {items.length === 1 ? "item" : "items"})
            </h1>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* View Mode Toggle: Grid & List */}
              <div className="flex items-center gap-1.5 border-r border-card-border pr-2.5 text-xs text-muted">
                <span className="font-semibold text-foreground">View:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                    title="Grid view"
                    className={`p-1 rounded-sm transition cursor-pointer ${viewMode === "grid" ? "text-foreground" : "text-slate-400 hover:text-foreground"}`}
                  >
                    <svg className="size-4" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="1" y="1" width="6" height="6" rx="0.5" />
                      <rect x="9" y="1" width="6" height="6" rx="0.5" />
                      <rect x="1" y="9" width="6" height="6" rx="0.5" />
                      <rect x="9" y="9" width="6" height="6" rx="0.5" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                    title="List view"
                    className={`p-1 rounded-sm transition cursor-pointer ${viewMode === "list" ? "text-foreground" : "text-slate-400 hover:text-foreground"}`}
                  >
                    <svg className="size-4" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="1" y="2" width="3" height="3" rx="0.5" />
                      <rect x="6" y="2" width="9" height="3" rx="0.5" />
                      <rect x="1" y="6.5" width="3" height="3" rx="0.5" />
                      <rect x="6" y="6.5" width="9" height="3" rx="0.5" />
                      <rect x="1" y="11" width="3" height="3" rx="0.5" />
                      <rect x="6" y="11" width="9" height="3" rx="0.5" />
                    </svg>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 transition active:scale-95 cursor-pointer"
                title="Clear all items in wishlist"
              >
                <TrashIcon className="size-4 text-red-600" />
                <span>Clear All</span>
              </button>
            </div>
          </div>
        )}

        {/* Wishlist Content */}
        {!isLoaded ? (
          /* Loading skeleton */
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl border border-card-border bg-card p-4" />
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Empty State — aligned with Cart & Checkout */
          <div className="flex min-h-[380px] sm:min-h-[440px] flex-col items-center justify-center rounded-2xl border border-dashed border-card-border bg-card px-4 py-12 text-center shadow-xs sm:py-16 w-full">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-surface-border bg-surface text-slate-400" aria-hidden="true">
              <svg className="size-8 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <h2 className="mt-4 text-base font-bold text-foreground sm:text-lg">Your wishlist is empty</h2>
            <p className="mt-2 text-xs text-muted sm:text-sm">
              Explore our tech catalog and click the heart icon on any product to save it here for later.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-secondary px-8 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-hover active:scale-[0.98]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          /* Wishlist Items Grid */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => {
              const saveAmount =
                item.regularPrice && item.regularPrice > item.price
                  ? item.regularPrice - item.price
                  : 0;
              const isAdded = addedIds[item.id];
              const inStock = item.inStock !== false;

              return (
                <div
                  key={item.id}
                  className="ecommerce-card-hover relative flex flex-col justify-between rounded-2xl border border-card-border bg-card p-4 shadow-xs sm:p-5"
                >
                  <div>
                    {/* Top Badges (Save Badge on left, Stock Badge on right) — aligned with ProductCard */}
                    <div className="flex items-center justify-between gap-1 text-[11px] font-bold">
                      {saveAmount > 0 ? (
                        <span className="rounded-md bg-[#027048] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                          Save: ৳{saveAmount.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                          {item.category ?? "Hardware"}
                        </span>
                      )}

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${inStock ? "text-emerald-700" : "text-amber-700"
                          }`}
                      >
                        <span className={`size-1.5 rounded-full ${inStock ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                        {inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>

                    {/* Artwork with Wishlist Heart Trigger — aligned with ProductCard */}
                    <div className="relative mt-3.5">
                      <Link
                        href={`/products/${item.slug}`}
                        className="group flex h-36 items-center justify-center rounded-xl bg-surface p-3 border border-surface-border transition duration-300"
                      >
                        <ProductVisual type={item.visualType} className="size-28 group-hover:scale-105 transition-transform duration-200" />
                      </Link>

                      {/* Active Heart (Wishlist Item is already saved, clicking removes it) */}
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(item.id)}
                        aria-label="Remove from wishlist"
                        title="Remove from wishlist"
                        className="absolute top-2.5 right-2.5 z-10 flex size-8 items-center justify-center rounded-full border border-red-200 bg-white/90 text-primary shadow-sm backdrop-blur-xs transition hover:scale-110 active:scale-95"
                      >
                        <svg
                          className="size-4.5 transition-transform"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                      </button>
                    </div>

                    {/* Title */}
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="mt-3.5 line-clamp-2 text-xs font-bold leading-snug text-foreground transition hover:text-primary sm:text-sm">
                        {item.title}
                      </h3>
                    </Link>

                    {/* Warranty tag */}
                    {item.warranty && (
                      <p className="mt-1.5 text-[11px] text-muted">
                        🛡️ {item.warranty}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 border-t border-card-border pt-3.5">
                    {/* Price Block */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-black tracking-tight text-primary sm:text-lg">
                        ৳{item.price.toLocaleString()}
                      </span>
                      {saveAmount > 0 && item.regularPrice && (
                        <span className="text-xs text-muted line-through">
                          ৳{item.regularPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Actions: [ Add to Cart ] and [ Remove ] */}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => inStock && handleAddToCart(item)}
                        disabled={!inStock}
                        className={`flex flex-1 min-h-[40px] items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold shadow-xs transition active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 ${isAdded
                          ? "bg-emerald-600 text-white shadow-emerald-600/30"
                          : inStock
                            ? "bg-secondary text-white shadow-secondary/20 hover:bg-secondary-hover"
                            : "bg-slate-200 text-slate-400"
                          }`}
                      >
                        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{inStock ? "Add to Cart" : "Out of Stock"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromWishlist(item.id)}
                        className="flex size-10 shrink-0 items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition active:scale-95 cursor-pointer"
                        title="Remove from wishlist"
                        aria-label={`Remove ${item.title} from wishlist`}
                      >
                        <TrashIcon className="size-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Wishlist Items List */
          <div className="flex flex-col gap-3.5">
            {items.map((item) => {
              const saveAmount =
                item.regularPrice && item.regularPrice > item.price
                  ? item.regularPrice - item.price
                  : 0;
              const isAdded = addedIds[item.id];
              const inStock = item.inStock !== false;

              return (
                <div
                  key={item.id}
                  className="relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl border border-card-border bg-card p-4 sm:p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300 group"
                >
                  {/* Left: Artwork + Active Heart */}
                  <div className="relative shrink-0 flex items-center justify-center">
                    <Link
                      href={`/products/${item.slug}`}
                      className="flex size-24 sm:size-28 items-center justify-center rounded-xl bg-surface p-2 border border-surface-border transition group-hover:border-primary/40"
                    >
                      <ProductVisual type={item.visualType} className="size-20 sm:size-24 object-contain transition-transform duration-200 group-hover:scale-105" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(item.id)}
                      aria-label="Remove from wishlist"
                      title="Remove from wishlist"
                      className="absolute top-1.5 right-1.5 z-10 flex size-6 items-center justify-center rounded-full bg-white/90 shadow-xs border border-red-200 text-primary transition hover:scale-110 active:scale-95"
                    >
                      <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={2}>
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    </button>
                  </div>

                  {/* Middle: Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                      {saveAmount > 0 && (
                        <span className="rounded-md bg-[#027048] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                          Save: ৳{saveAmount.toLocaleString()}
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${inStock ? "text-emerald-700" : "text-amber-700"
                          }`}
                      >
                        <span className={`size-1.5 rounded-full ${inStock ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                        {inStock ? "In Stock" : "Out of Stock"}
                      </span>
                      {item.category && (
                        <span className="rounded-full bg-surface px-2.5 py-0.5 text-[10px] font-bold text-muted border border-card-border uppercase">
                          {item.category}
                        </span>
                      )}
                    </div>

                    <Link href={`/products/${item.slug}`}>
                      <h3 className="mt-2 text-sm sm:text-base font-bold text-foreground hover:text-primary transition leading-snug">
                        {item.title}
                      </h3>
                    </Link>

                    {item.warranty && (
                      <p className="mt-1 text-xs text-muted">
                        🛡️ {item.warranty}
                      </p>
                    )}
                  </div>

                  {/* Right: Pricing & Actions */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 border-t sm:border-t-0 sm:border-l border-card-border pt-3 sm:pt-0 sm:pl-5 min-w-[190px]">
                    <div className="text-left sm:text-right">
                      <span className="text-base sm:text-lg font-black text-primary tracking-tight block">
                        ৳{item.price.toLocaleString()}
                      </span>
                      {saveAmount > 0 && item.regularPrice && (
                        <span className="text-xs text-muted line-through block">
                          ৳{item.regularPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => inStock && handleAddToCart(item)}
                        disabled={!inStock}
                        className={`flex flex-1 sm:flex-initial min-h-[38px] items-center justify-center gap-1.5 rounded-xl py-2 px-3 sm:px-4 text-xs font-bold transition active:scale-95 shadow-xs disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 ${isAdded
                          ? "bg-emerald-600 text-white shadow-emerald-600/30"
                          : inStock
                            ? "bg-secondary hover:bg-secondary-hover text-white shadow-secondary/20 focus-visible:ring-2 focus-visible:ring-secondary"
                            : "bg-slate-200 text-slate-400"
                          }`}
                      >
                        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{inStock ? "Add to Cart" : "Out of Stock"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromWishlist(item.id)}
                        className="flex size-[38px] shrink-0 items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition active:scale-95 cursor-pointer"
                        title="Remove from wishlist"
                        aria-label={`Remove ${item.title} from wishlist`}
                      >
                        <TrashIcon className="size-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Left Navigation */}
        {items.length > 0 && (
          <div className="mt-8 flex items-center justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline hover:underline-offset-4 hover:text-secondary-hover"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </main>

      {/* Confirmation Modal for Clear All — exact match with Cart page */}
      {confirmClear && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/55 p-4" role="dialog" aria-modal="true" aria-labelledby="clear-wishlist-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 id="clear-wishlist-title" className="text-xl font-bold text-foreground">Clear your wishlist?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">This removes every item from your wishlist. This action cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="min-h-11 rounded-xl border border-card-border px-4 text-sm font-semibold text-foreground transition hover:bg-slate-50"
              >
                Keep items
              </button>
              <button
                type="button"
                onClick={() => {
                  clearWishlist();
                  setConfirmClear(false);
                }}
                className="min-h-11 rounded-xl bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Clear wishlist
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
