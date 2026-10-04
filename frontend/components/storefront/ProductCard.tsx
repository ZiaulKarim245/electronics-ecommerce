"use client";

import Link from "next/link";
import ProductVisual, { type ProductVisualType } from "@/components/storefront/ProductVisual";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useActionNotification } from "@/context/ActionNotificationContext";
import { useState } from "react";

export interface Product {
  id: number;
  title: string;
  category: string;
  specs: string[];
  regularPrice: number;
  discountedPrice: number;
  badge?: string;
  inStock: boolean;
  availability?: "In Stock" | "Out of Stock" | "Pre Order" | "Up Coming";
  warrantyType: "Official" | "Shop";
  warrantyDuration: string;
  slug: string;
  visualType: ProductVisualType;
}

export default function ProductCard({
  product,
  variant = "showcase",
  layout = "grid",
}: {
  product: Product;
  variant?: "showcase" | "listing";
  layout?: "grid" | "list";
}) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, toggleCompare, isInCompare } = useCompare();
  const { showNotification } = useActionNotification();
  const [added, setAdded] = useState(false);
  const inWishlist = isInWishlist(product.id);
  const inCompare =
    (isInCompare ? isInCompare(product.id) : false) ||
    (product.slug && isInCompare ? isInCompare(product.slug) : false);
  const saveAmount = product.regularPrice - product.discountedPrice;
  const availability = product.availability ?? (product.inStock ? "In Stock" : "Pre Order");
  const availabilityTone = availability === "In Stock" ? "emerald" : availability === "Up Coming" ? "sky" : "amber";

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const willAdd = !inWishlist;
    toggleWishlist({
      id: product.id,
      title: product.title,
      price: product.discountedPrice,
      regularPrice: product.regularPrice,
      inStock: product.inStock,
      warranty: `${product.warrantyDuration} ${product.warrantyType}`,
      slug: product.slug,
      visualType: product.visualType,
      category: product.category,
    });

    if (willAdd) {
      showNotification({
        id: product.id,
        type: "wishlist",
        status: "success",
        title: "Success",
        message: "Product successfully added to wishlist.",
      });
    } else {
      showNotification({
        id: product.id,
        type: "wishlist",
        status: "info",
        title: "Removed",
        message: "Product removed from your wishlist.",
      });
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const alreadyInCompare =
      inCompare ||
      (isInCompare && (isInCompare(product.id) || (product.slug ? isInCompare(product.slug) : false)));

    if (alreadyInCompare) {
      showNotification({
        id: product.id,
        type: "compare",
        status: "error",
        title: "Error",
        message: "This product is already in your compare list.",
      });
      return;
    }

    addToCompare(product);
    showNotification({
      id: product.id,
      type: "compare",
      status: "success",
      title: "Success",
      message: "Product added to your compare list.",
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
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
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);

    showNotification({
      id: product.id,
      type: "cart",
      status: "success",
      title: "Success",
      message: "Product successfully added to your cart.",
    });
  };

  // Variant 1: "showcase" (Homepage image 1) -> Clean card with full-width dark "View Details" button
  if (variant === "showcase") {
    return (
      <div className="group ecommerce-card-hover relative flex flex-col justify-between rounded-2xl border border-card-border bg-card p-4 sm:p-5 shadow-xs">
        <div>
          {/* Top Badges (Save Badge on left, Stock Badge on right) */}
          <div className="flex items-center justify-between gap-1 text-[11px] font-bold">
            {saveAmount > 0 ? (
              <span className="rounded-md bg-[#027048] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                Save: ৳{saveAmount.toLocaleString()}
              </span>
            ) : (
              <span />
            )}

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${availabilityTone === "emerald" ? "text-emerald-700" : availabilityTone === "sky" ? "text-sky-700" : "text-amber-700"}`}
            >
              <span className={`size-1.5 rounded-full ${availabilityTone === "emerald" ? "bg-emerald-500 animate-pulse" : availabilityTone === "sky" ? "bg-sky-500" : "bg-amber-500"}`} />
              {availability}
            </span>
          </div>

          {/* High-Resolution Vector Visual Artwork with Hover Actions */}
          <div className="relative mt-3.5">
            <Link
              href={`/products/${product.slug}`}
              className="flex h-40 items-center justify-center rounded-xl bg-surface p-3 border border-surface-border transition duration-300"
            >
              <ProductVisual type={product.visualType} className="size-32 group-hover:scale-105 transition-transform duration-200" />
            </Link>

            {/* Floating Action Button: Wishlist (Love) - Visible on hover */}
            <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={handleWishlistToggle}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                className={`flex size-8 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-xs transition-all duration-200 hover:scale-110 active:scale-95 border ${inWishlist
                  ? "opacity-100 border-red-200 text-primary shadow-red-100"
                  : "opacity-0 group-hover:opacity-100 border-slate-200 text-slate-400 hover:text-primary hover:border-primary/40"
                  }`}
              >
                <svg
                  className="size-4.5 transition-transform"
                  viewBox="0 0 24 24"
                  fill={inWishlist ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-3.5 line-clamp-2 text-xs sm:text-sm font-bold text-black hover:text-primary transition leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Spec Bullet List */}
          <ul className="mt-3 space-y-1 text-xs text-muted border-t border-card-border pt-3">
            {product.specs.map((spec, i) => (
              <li key={i} className="flex items-start gap-1.5 line-clamp-1">
                <span className="text-muted/70 text-xs shrink-0">•</span>
                <span className="truncate">{spec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing Block */}
        <div className="mt-4 flex items-center justify-center gap-2 border-t border-card-border pt-3">
          <span className="text-base sm:text-lg font-black text-primary tracking-tight">
            ৳{product.discountedPrice.toLocaleString()}
          </span>
          {product.regularPrice > product.discountedPrice && (
            <span className="text-xs text-muted line-through">
              ৳{product.regularPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* View Details Button */}
        <div className="mt-3.5">
          <Link
            href={`/products/${product.slug}`}
            className="flex w-full items-center justify-center rounded-xl bg-header py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-primary"
          >
            View Details
          </Link>
        </div>
      </div>
    );
  }

  // Horizontal List Layout (When View: List is active)
  if (layout === "list") {
    return (
      <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl border border-card-border bg-card p-4 sm:p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300 group">
        {/* Left: Product Visual Artwork + Hover Action Triggers */}
        <div className="relative shrink-0 flex items-center justify-center">
          <Link
            href={`/products/${product.slug}`}
            className="flex size-28 sm:size-32 items-center justify-center rounded-xl bg-surface p-2 border border-surface-border transition group-hover:border-primary/40"
          >
            <ProductVisual type={product.visualType} className="size-24 sm:size-28 object-contain transition-transform duration-200 group-hover:scale-105" />
          </Link>

          {/* Floating Action Button: Wishlist (Love) - Visible on hover */}
          <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
            <button
              type="button"
              onClick={handleWishlistToggle}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              className={`flex size-7 items-center justify-center rounded-full bg-white/95 shadow-xs backdrop-blur-xs transition-all duration-200 hover:scale-110 active:scale-95 border ${inWishlist
                ? "opacity-100 border-red-200 text-primary shadow-red-100"
                : "opacity-0 group-hover:opacity-100 border-slate-200 text-slate-400 hover:text-primary hover:border-primary/40"
                }`}
            >
              <svg
                className="size-4 transition-transform"
                viewBox="0 0 24 24"
                fill={inWishlist ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Middle: Details & Hardware Specs */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
            {saveAmount > 0 && (
              <span className="rounded-md bg-[#027048] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                Save: ৳{saveAmount.toLocaleString()}
              </span>
            )}

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${availabilityTone === "emerald" ? "text-emerald-700" : availabilityTone === "sky" ? "text-sky-700" : "text-amber-700"}`}
            >
              <span className={`size-1.5 rounded-full ${availabilityTone === "emerald" ? "bg-emerald-500 animate-pulse" : availabilityTone === "sky" ? "bg-sky-500" : "bg-amber-500"}`} />
              {availability}
            </span>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-2 line-clamp-2 text-sm sm:text-base font-bold text-black hover:text-primary transition leading-snug">
              {product.title}
            </h3>
          </Link>

          <ul className="mt-2.5 space-y-1 text-xs text-muted">
            {product.specs.map((spec, i) => (
              <li key={i} className="flex items-start gap-1.5 line-clamp-1">
                <span className="text-primary font-bold shrink-0">▸</span>
                <span className="truncate">{spec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Pricing & Actions */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-card-border pt-3 sm:pt-0 gap-3">
          <div className="text-left sm:text-right">
            <span className="text-base sm:text-xl font-black text-primary block tracking-tight">
              ৳{product.discountedPrice.toLocaleString()}
            </span>
            {product.regularPrice > product.discountedPrice && (
              <span className="text-xs text-muted line-through">
                ৳{product.regularPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex flex-1 sm:flex-initial min-h-[38px] items-center justify-center gap-1.5 rounded-xl py-2 px-3 sm:px-4 text-xs font-bold transition active:scale-95 shadow-xs focus:outline-none ${added
                ? "bg-emerald-600 text-white shadow-emerald-600/30"
                : "bg-secondary hover:bg-secondary-hover text-white shadow-secondary/20 focus-visible:ring-2 focus-visible:ring-secondary"
                }`}
            >
              <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              onClick={handleCompareClick}
              className="btn-compare flex min-h-[38px] items-center justify-center gap-1.5 rounded-lg py-2 px-2.5 sm:px-3 text-xs font-semibold transition active:scale-95"
              title="Compare"
            >
              <svg className="size-4 shrink-0 text-[#1c3554]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="18" r="1.5" fill="currentColor" stroke="none" />
                <path d="M6 16.5V10a4 4 0 0 1 4-4h7" />
                <polyline points="14 3 17 6 14 9" />
                <circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" />
                <path d="M18 7.5V14a4 4 0 0 1-4 4H7" />
                <polyline points="10 15 7 18 10 21" />
              </svg>
              <span>Compare</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Variant 2: "listing" (Standard Grid Mode) -> Cards with [ 🛒 Add to Cart ] and [ ⇄ Compare ]
  return (
    <div className="group ecommerce-card-hover relative flex flex-col justify-between rounded-2xl border border-card-border bg-card p-4 sm:p-5 shadow-xs">
      <div>
        {/* Top Badges (Save Badge on left, Stock Badge on right) */}
        <div className="flex items-center justify-between gap-1 text-[11px] font-bold">
          {saveAmount > 0 ? (
            <span className="rounded-md bg-[#027048] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
              Save: ৳{saveAmount.toLocaleString()}
            </span>
          ) : (
            <span />
          )}

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${availabilityTone === "emerald" ? "text-emerald-700" : availabilityTone === "sky" ? "text-sky-700" : "text-amber-700"}`}
          >
            <span className={`size-1.5 rounded-full ${availabilityTone === "emerald" ? "bg-emerald-500 animate-pulse" : availabilityTone === "sky" ? "bg-sky-500" : "bg-amber-500"}`} />
            {availability}
          </span>
        </div>

        {/* High-Resolution Vector Visual Artwork with Hover Actions */}
        <div className="relative mt-3.5">
          <Link
            href={`/products/${product.slug}`}
            className="flex h-36 items-center justify-center rounded-xl bg-surface p-3 border border-surface-border transition duration-300"
          >
            <ProductVisual type={product.visualType} className="size-28 group-hover:scale-105 transition-transform duration-200" />
          </Link>

          {/* Floating Action Buttons: Wishlist (Love) & Compare - Visible on hover */}
          <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={handleWishlistToggle}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              className={`flex size-8 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-xs transition-all duration-200 hover:scale-110 active:scale-95 border ${inWishlist
                ? "opacity-100 border-red-200 text-primary shadow-red-100"
                : "opacity-0 group-hover:opacity-100 border-slate-200 text-slate-400 hover:text-primary hover:border-primary/40"
                }`}
            >
              <svg
                className="size-4.5 transition-transform"
                viewBox="0 0 24 24"
                fill={inWishlist ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product Title - Only changes color when hovering title itself */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-3.5 line-clamp-2 text-xs sm:text-sm font-bold text-black hover:text-primary transition leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Spec Bullet List */}
        <ul className="mt-3 space-y-1 text-xs text-muted border-t border-card-border pt-3">
          {product.specs.map((spec, i) => (
            <li key={i} className="flex items-start gap-1.5 line-clamp-1">
              <span className="text-muted/70 text-xs shrink-0">•</span>
              <span className="truncate">{spec}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        {/* Pricing Block (Centered, red discount price + strikethrough regular price) */}
        <div className="flex items-center justify-center gap-2 border-t border-card-border pt-3">
          <span className="text-base sm:text-lg font-black text-primary tracking-tight">
            ৳{product.discountedPrice.toLocaleString()}
          </span>
          {product.regularPrice > product.discountedPrice && (
            <span className="text-xs text-muted line-through">
              ৳{product.regularPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Action Buttons: [ 🛒 Add to Cart ] and [ ⇄ Compare ] matching Image 3 */}
        <div className="mt-3.5 grid grid-cols-[1.2fr_1fr] gap-2 items-center">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl py-2 px-2 sm:px-3 text-xs font-bold transition active:scale-95 shadow-xs focus:outline-none ${added
              ? "bg-emerald-600 text-white shadow-emerald-600/30"
              : "bg-secondary hover:bg-secondary-hover text-white shadow-secondary/20 focus-visible:ring-2 focus-visible:ring-secondary"
              }`}
          >
            <svg
              className="size-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>Add to Cart</span>
          </button>

          <button
            type="button"
            onClick={handleCompareClick}
            className="btn-compare flex min-h-[42px] items-center justify-center gap-1.5 rounded-lg py-2 px-2.5 sm:px-3 text-xs font-semibold transition active:scale-95"
            title="Compare"
          >
            <svg
              className="size-4 shrink-0 text-[#1c3554]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="6" cy="18" r="1.5" fill="currentColor" stroke="none" />
              <path d="M6 16.5V10a4 4 0 0 1 4-4h7" />
              <polyline points="14 3 17 6 14 9" />
              <circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" />
              <path d="M18 7.5V14a4 4 0 0 1-4 4H7" />
              <polyline points="10 15 7 18 10 21" />
            </svg>
            <span>Compare</span>
          </button>
        </div>
      </div>
    </div>
  );
}
