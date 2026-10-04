"use client";

import { useState, useEffect, useMemo, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductVisual from "@/components/storefront/ProductVisual";
import Breadcrumbs from "@/components/storefront/Breadcrumbs";
import type { DetailedProduct } from "@/types/catalog";
import { mockCatalog } from "@/lib/data/catalog";
import { useCompare } from "@/context/CompareContext";
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

function CompareContent() {
  const searchParams = useSearchParams();
  const addId = searchParams.get("add");
  const { items, addToCompare, removeFromCompare, clearCompare, isLoaded } = useCompare();
  const { addToCart } = useCart();
  const { showNotification } = useActionNotification();

  const [activeSlotModal, setActiveSlotModal] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [addedToasts, setAddedToasts] = useState<{ [productId: number]: boolean }>({});
  const [confirmClear, setConfirmClear] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const tableTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Compare Products | TechHub Bangladesh";
  }, []);

  const toggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  // If page was reached via ?add=xxx, automatically ensure it is added to comparison
  useEffect(() => {
    if (!addId || !isLoaded) return;
    const idNum = parseInt(addId, 10);
    if (!isNaN(idNum)) {
      addToCompare(idNum);
    } else {
      addToCompare(addId);
    }
  }, [addId, isLoaded, addToCompare]);

  // Track scroll for sticky product name bar & horizontal scroll sync
  const headerCardRef = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const stickyScrollRef = useRef<HTMLDivElement>(null);
  const isSyncingScroll = useRef(false);
  const [leftColWidth, setLeftColWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!headerCardRef.current || !tableTopRef.current) return;
      const headerRect = headerCardRef.current.getBoundingClientRect();
      const tableRect = tableTopRef.current.getBoundingClientRect();
      const navbarHeight = window.innerWidth >= 1280 ? 115 : 65;
      // Show sticky row when the main product cards scroll above navbar, and hide when table leaves viewport
      const scrolledPastCards = headerRect.bottom <= navbarHeight + 40;
      const notPastTableBottom = tableRect.bottom >= navbarHeight + 80;
      setIsSticky(scrolledPastCards && notPastTableBottom);

      // Measure exact rendered width of the actual first column
      const firstCol = headerCardRef.current.firstElementChild as HTMLElement | null;
      if (firstCol) {
        setLeftColWidth(firstCol.getBoundingClientRect().width);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Synchronize horizontal scroll between main table and sticky product bar
  useEffect(() => {
    if (isSticky && tableScrollRef.current && stickyScrollRef.current) {
      stickyScrollRef.current.scrollLeft = tableScrollRef.current.scrollLeft;
    }
  }, [isSticky]);

  const handleTableHorizontalScroll = () => {
    if (!tableScrollRef.current || !stickyScrollRef.current || isSyncingScroll.current) return;
    isSyncingScroll.current = true;
    stickyScrollRef.current.scrollLeft = tableScrollRef.current.scrollLeft;
    isSyncingScroll.current = false;
  };

  const handleStickyHorizontalScroll = () => {
    if (!tableScrollRef.current || !stickyScrollRef.current || isSyncingScroll.current) return;
    isSyncingScroll.current = true;
    tableScrollRef.current.scrollLeft = stickyScrollRef.current.scrollLeft;
    isSyncingScroll.current = false;
  };

  const selectedProducts: (DetailedProduct | undefined)[] = [0, 1, 2, 3].map(
    (index) => items[index]
  );

  const activeProducts = selectedProducts.filter((p): p is DetailedProduct => Boolean(p));
  const selectedIds = items.map((p) => p.id);

  const removeProduct = (id: number) => {
    removeFromCompare(id);
  };

  const handleAddToCart = (product: DetailedProduct) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.officialWarranty.price,
      regularPrice: product.officialWarranty.regularPrice,
      warranty: product.officialWarranty.duration,
      slug: product.slug,
      visualType: product.visualType,
    });

    setAddedToasts((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedToasts((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);

    showNotification({
      id: product.id,
      type: "cart",
      status: "success",
      title: "Success",
      message: "Product successfully added to your cart.",
    });
  };

  const addProductToSlot = (productId: number) => {
    addToCompare(productId);
    setActiveSlotModal(null);
    setSearchQuery("");
    const prod = mockCatalog.find((p) => p.id === productId);
    if (prod) {
      showNotification({
        id: prod.id,
        type: "compare",
        status: "success",
        title: "Success",
        message: "Product added to your compare list.",
      });
    }
  };

  // Filter products for the modal search
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return mockCatalog;
    const q = searchQuery.toLowerCase();
    return mockCatalog.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Collect all unique specification groups & keys across selected items
  const allSpecGroups = useMemo(() => {
    return Array.from(
      new Set(
        activeProducts.flatMap((p) => p.specifications.map((s) => s.group))
      )
    );
  }, [activeProducts]);

  // Check if all active products have different values for a given spec key
  const hasDifference = (group: string, specKey: string) => {
    if (activeProducts.length < 2) return false;
    const values = activeProducts.map(
      (p) => p.specifications.find((s) => s.group === group && s.key === specKey)?.value || "—"
    );
    return new Set(values).size > 1;
  };

  const hasOverviewDifference = (getter: (p: DetailedProduct) => string | number) => {
    if (activeProducts.length < 2) return false;
    const values = activeProducts.map(getter);
    return new Set(values).size > 1;
  };

  // Responsive column template: all columns (including left column) adjust identically across screens
  const colTemplate = `repeat(${1 + activeProducts.length + (activeProducts.length < 4 ? 1 : 0)}, minmax(140px, 1fr))`;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Product Comparison" },
        ]}
      />

      <main className="mx-auto max-w-[1440px] px-4 pb-4 pt-4 sm:px-6 lg:px-10 min-h-[calc(100vh-320px)] sm:min-h-[calc(100vh-280px)] flex flex-col">
        {activeProducts.length === 0 ? (
          <div className="flex min-h-[380px] sm:min-h-[440px] flex-col items-center justify-center rounded-2xl border border-dashed border-card-border bg-card px-4 py-12 text-center shadow-xs sm:py-16 w-full">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-surface-border bg-surface text-slate-400" aria-hidden="true">
              <svg
                className="size-8 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                <path d="M7 21h10" />
                <path d="M12 3v18" />
                <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
              </svg>
            </div>
            <h2 className="mt-4 text-base font-bold text-foreground sm:text-lg">
              Nothing to compare yet
            </h2>
            <p className="mt-2 text-xs text-muted sm:text-sm">
              Add products from catalog pages to compare specs side by side.
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
        ) : (
          <div className="space-y-4">
            {/* Top Header & Actions — aligned with Wishlist & Cart page design */}
            <div className="mb-6 flex flex-row items-center justify-between gap-3 border-b border-card-border pb-3">
              <h1 className="text-lg sm:text-2xl font-bold text-foreground">
                Compare Products ({activeProducts.length} of 4)
              </h1>

              <div className="flex flex-wrap items-center gap-2.5">

                {/* Clear All */}
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 transition active:scale-95 cursor-pointer"
                  title="Clear all products"
                >
                  <TrashIcon className="size-4 text-red-600" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            {/* Comparison Matrix (Desktop & Tablet & Horizontal Mobile Scroll) */}
            <div
              ref={tableTopRef}
              className="w-full rounded-2xl border border-card-border bg-card shadow-xs"
            >
              <div
                ref={tableScrollRef}
                onScroll={handleTableHorizontalScroll}
                className="overflow-x-auto [-webkit-overflow-scrolling:touch]"
              >
                <div className="w-fit min-w-[660px] lg:min-w-full border-r border-card-border">
                  {/* Sticky Product Names Bar (Appears fixed under navbar when scrolled down - syncs horizontally) */}
                  {isSticky && (
                    <div
                      className="fixed top-[65px] xl:top-[115px] z-40 mx-auto max-w-[1440px] border border-card-border bg-card/95 shadow-md backdrop-blur-md transition-all duration-150 overflow-hidden"
                      style={{
                        left: tableScrollRef.current ? `${tableScrollRef.current.getBoundingClientRect().left}px` : (tableTopRef.current ? `${tableTopRef.current.getBoundingClientRect().left}px` : "auto"),
                        width: tableScrollRef.current ? `${tableScrollRef.current.clientWidth}px` : (tableTopRef.current ? `${tableTopRef.current.offsetWidth}px` : "100%"),
                      }}
                    >
                      <div
                        ref={stickyScrollRef}
                        onScroll={handleStickyHorizontalScroll}
                        className="overflow-x-auto [-webkit-overflow-scrolling:touch]"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                        <div
                          className="grid divide-x divide-card-border w-fit min-w-[660px] lg:min-w-full"
                          style={{
                            gridTemplateColumns: leftColWidth
                              ? `${leftColWidth}px repeat(${activeProducts.length + (activeProducts.length < 4 ? 1 : 0)}, minmax(140px, 1fr))`
                              : colTemplate,
                          }}
                        >
                          <div className="flex items-center px-3 py-3 bg-surface/80 font-bold text-xs text-muted uppercase">
                            Products
                          </div>
                          {activeProducts.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center justify-center p-3 text-center"
                            >
                              <Link
                                href={`/products/${product.slug}`}
                                className="text-xs sm:text-sm font-bold text-foreground hover:text-primary transition line-clamp-1"
                                title={product.title}
                              >
                                {product.title}
                              </Link>
                            </div>
                          ))}
                          {activeProducts.length < 4 && (
                            <div className="flex items-center justify-center p-3 text-center text-xs text-muted">
                              <button
                                type="button"
                                onClick={() => setActiveSlotModal(activeProducts.length)}
                                className="text-xs font-semibold text-secondary hover:text-primary transition"
                              >
                                + Add Product
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Normal Product Cards Row */}
                  <div
                    ref={headerCardRef}
                    className="grid border-b border-card-border bg-card"
                    style={{
                      gridTemplateColumns: colTemplate,
                    }}
                  >
                    {/* Left corner label */}
                    <div className="flex items-center justify-center border-r border-card-border bg-surface/40 p-4 text-center">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                        Products
                      </span>
                    </div>

                    {/* Active Product Cards */}
                    {activeProducts.map((product) => (
                      <div
                        key={product.id}
                        className="relative flex flex-col justify-start px-3.5 pt-3.5 pb-2.5 border-r border-card-border last:border-r-0"
                      >
                        {/* Remove X Button */}
                        <button
                          type="button"
                          onClick={() => removeProduct(product.id)}
                          className="absolute top-2.5 right-2.5 flex size-6 items-center justify-center rounded-full border border-card-border bg-surface text-xs text-muted hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition shadow-xs z-10"
                          title="Remove product"
                          aria-label={`Remove ${product.title}`}
                        >
                          ✕
                        </button>

                        {/* Visual & Identity */}
                        <div className="flex flex-col items-center text-center pt-1">
                          <Link
                            href={`/products/${product.slug}`}
                            className="group flex size-24 items-center justify-center rounded-xl bg-surface border border-surface-border p-2 transition hover:scale-105"
                          >
                            <ProductVisual type={product.visualType} className="size-20" />
                          </Link>

                          <Link
                            href={`/products/${product.slug}`}
                            className="mt-3 line-clamp-2 text-xs sm:text-[13px] font-bold text-foreground hover:text-primary transition leading-snug"
                            title={product.title}
                          >
                            {product.title}
                          </Link>

                          {/* Price block */}
                          <div className="mt-2 flex items-baseline gap-1.5">
                            <span className="text-sm lg:text-base font-black text-primary">
                              {product.officialWarranty.price.toLocaleString()}৳
                            </span>
                            {product.officialWarranty.regularPrice > product.officialWarranty.price && (
                              <span className="text-[10px] text-muted line-through">
                                {product.officialWarranty.regularPrice.toLocaleString()}৳
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Single Add Next Product Slot (if fewer than 4 products) */}
                    {activeProducts.length < 4 && (
                      <div className="relative flex flex-col justify-center items-center px-4 py-6 border-r border-card-border last:border-r-0 text-center">
                        <button
                          type="button"
                          onClick={() => setActiveSlotModal(activeProducts.length)}
                          className="flex size-12 items-center justify-center rounded-2xl border-2 border-dashed border-card-border bg-surface text-muted text-xl font-bold transition hover:border-primary hover:text-primary"
                        >
                          +
                        </button>
                        <span className="mt-2 text-xs font-bold text-foreground">
                          Add Another Product
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ======================================================== */}
                  {/* SPECIFICATION ROWS                                        */}
                  {/* ======================================================== */}
                  <div className="text-xs">
                    {/* SECTION: GENERAL / OVERVIEW */}
                    <button
                      type="button"
                      onClick={() => toggleGroupCollapse("general")}
                      className="flex w-full items-center justify-between bg-[#f2f4f8] dark:bg-surface/80 px-4 py-3 font-bold text-secondary hover:bg-[#e9ecf2] dark:hover:bg-surface transition cursor-pointer border-y border-card-border text-[13px] sm:text-sm text-left select-none"
                    >
                      <span className="tracking-wide">General Information</span>
                      <svg
                        className={`size-4 text-secondary transition-transform duration-200 ${collapsedGroups["general"] ? "-rotate-90" : "rotate-0"
                          }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {!collapsedGroups["general"] && (
                      <>
                        {/* Brand */}
                        <div
                          className={`grid border-b border-card-border/60 hover:bg-surface/40 transition ${highlightDifferences && hasOverviewDifference((p) => p.brand) ? "bg-amber-500/5 font-semibold" : ""
                            }`}
                          style={{
                            gridTemplateColumns: colTemplate,
                          }}
                        >
                          <span className="p-3 font-semibold text-muted border-r border-card-border">Brand</span>
                          {activeProducts.map((p) => (
                            <span key={p.id} className="p-3 text-foreground font-medium border-r border-card-border last:border-r-0">
                              {p.brand}
                            </span>
                          ))}
                          {activeProducts.length < 4 && <span className="p-3 text-muted border-r border-card-border last:border-r-0 text-center"></span>}
                        </div>

                        {/* Model */}
                        <div
                          className={`grid border-b border-card-border/60 hover:bg-surface/40 transition ${highlightDifferences && hasOverviewDifference((p) => p.model) ? "bg-amber-500/5 font-semibold" : ""
                            }`}
                          style={{
                            gridTemplateColumns: colTemplate,
                          }}
                        >
                          <span className="p-3 font-semibold text-muted border-r border-card-border">Model</span>
                          {activeProducts.map((p) => (
                            <span key={p.id} className="p-3 text-foreground font-medium border-r border-card-border last:border-r-0">
                              {p.model}
                            </span>
                          ))}
                          {activeProducts.length < 4 && <span className="p-3 text-muted border-r border-card-border last:border-r-0 text-center"></span>}
                        </div>

                        {/* Category */}
                        <div
                          className="grid border-b border-card-border/60 hover:bg-surface/40 transition"
                          style={{
                            gridTemplateColumns: colTemplate,
                          }}
                        >
                          <span className="p-3 font-semibold text-muted border-r border-card-border">Category</span>
                          {activeProducts.map((p) => (
                            <span key={p.id} className="p-3 text-foreground font-medium border-r border-card-border last:border-r-0">
                              {p.category}
                            </span>
                          ))}
                          {activeProducts.length < 4 && <span className="p-3 text-muted border-r border-card-border last:border-r-0 text-center"></span>}
                        </div>

                        {/* Stock Status */}
                        <div
                          className={`grid border-b border-card-border/60 hover:bg-surface/40 transition ${highlightDifferences && hasOverviewDifference((p) => p.stockStatus) ? "bg-amber-500/5 font-semibold" : ""
                            }`}
                          style={{
                            gridTemplateColumns: colTemplate,
                          }}
                        >
                          <span className="p-3 font-semibold text-muted border-r border-card-border">Availability</span>
                          {activeProducts.map((p) => (
                            <span key={p.id} className="p-3 border-r border-card-border last:border-r-0">
                              <span
                                className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${p.stockStatus === "In Stock"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                                  }`}
                              >
                                {p.stockStatus}
                              </span>
                            </span>
                          ))}
                          {activeProducts.length < 4 && <span className="p-3 text-muted border-r border-card-border last:border-r-0 text-center"></span>}
                        </div>

                        {/* Official Warranty */}
                        <div
                          className={`grid border-b border-card-border/60 hover:bg-surface/40 transition ${highlightDifferences && hasOverviewDifference((p) => p.officialWarranty.duration) ? "bg-amber-500/5 font-semibold" : ""
                            }`}
                          style={{
                            gridTemplateColumns: colTemplate,
                          }}
                        >
                          <span className="p-3 font-semibold text-muted border-r border-card-border">Official Warranty</span>
                          {activeProducts.map((p) => (
                            <span key={p.id} className="p-3 text-foreground font-medium border-r border-card-border last:border-r-0">
                              {p.officialWarranty.duration}
                            </span>
                          ))}
                          {activeProducts.length < 4 && <span className="p-3 text-muted border-r border-card-border last:border-r-0 text-center"></span>}
                        </div>

                        {/* Rating & Reviews */}
                        <div
                          className="grid border-b border-card-border/60 hover:bg-surface/40 transition"
                          style={{
                            gridTemplateColumns: colTemplate,
                          }}
                        >
                          <span className="p-3 font-semibold text-muted border-r border-card-border">Customer Rating</span>
                          {activeProducts.map((p) => (
                            <div key={p.id} className="p-3 border-r border-card-border last:border-r-0 flex items-center gap-1.5">
                              <span className="text-amber-500 font-bold">★ {p.rating}</span>
                              <span className="text-muted text-[10px]">({p.reviewsCount} reviews)</span>
                            </div>
                          ))}
                          {activeProducts.length < 4 && <span className="p-3 text-muted border-r border-card-border last:border-r-0 text-center"></span>}
                        </div>
                      </>
                    )}

                    {/* SECTION: DYNAMIC SPECIFICATION GROUPS */}
                    {allSpecGroups.map((group) => {
                      const keysInGroup = Array.from(
                        new Set(
                          activeProducts.flatMap((p) =>
                            p.specifications.filter((s) => s.group === group).map((s) => s.key)
                          )
                        )
                      );
                      const isCollapsed = Boolean(collapsedGroups[group]);

                      return (
                        <div key={group}>
                          {/* Group Header Collapsible Button */}
                          <button
                            type="button"
                            onClick={() => toggleGroupCollapse(group)}
                            className="flex w-full items-center justify-between bg-[#f2f4f8] dark:bg-surface/80 px-4 py-3 font-bold text-secondary hover:bg-[#e9ecf2] dark:hover:bg-surface transition cursor-pointer border-y border-card-border text-[13px] sm:text-sm text-left select-none"
                          >
                            <span className="tracking-wide">{group}</span>
                            <svg
                              className={`size-4 text-secondary transition-transform duration-200 ${isCollapsed ? "-rotate-90" : "rotate-0"
                                }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {/* Group Spec Keys */}
                          {!isCollapsed &&
                            keysInGroup.map((specKey) => {
                              const isDiff = highlightDifferences && hasDifference(group, specKey);

                              return (
                                <div
                                  key={specKey}
                                  className={`grid border-b border-card-border/60 hover:bg-surface/40 transition ${isDiff ? "bg-amber-500/5 font-semibold" : ""
                                    }`}
                                  style={{
                                    gridTemplateColumns: colTemplate,
                                  }}
                                >
                                  <span className="p-3 font-semibold text-muted border-r border-card-border flex items-center justify-between">
                                    <span>{specKey}</span>
                                    {isDiff && (
                                      <span className="size-1.5 rounded-full bg-amber-500 mr-1" title="Values differ" />
                                    )}
                                  </span>
                                  {activeProducts.map((p) => {
                                    const val = p.specifications.find(
                                      (s) => s.group === group && s.key === specKey
                                    )?.value;
                                    return (
                                      <span
                                        key={p.id}
                                        className="p-3 text-foreground font-medium border-r border-card-border last:border-r-0 break-words leading-relaxed"
                                      >
                                        {val || "—"}
                                      </span>
                                    );
                                  })}
                                  {activeProducts.length < 4 && <span className="p-3 text-muted border-r border-card-border last:border-r-0 text-center"></span>}
                                </div>
                              );
                            })}
                        </div>
                      );
                    })}

                    {/* BOTTOM ACTION ROW */}
                    <div
                      className="grid bg-surface/50 p-4 border-t border-card-border"
                      style={{
                        gridTemplateColumns: colTemplate,
                      }}
                    >
                      <div></div>
                      {activeProducts.map((product) => {
                        const isAdded = Boolean(addedToasts[product.id]);
                        return (
                          <div key={product.id} className="px-2">
                            <button
                              type="button"
                              onClick={() => handleAddToCart(product)}
                              className={`flex min-h-[42px] w-full items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-2 sm:px-4 py-2 sm:py-2.5 font-bold transition active:scale-95 shadow-sm text-xs sm:text-sm cursor-pointer ${isAdded
                                ? "bg-emerald-600 text-white"
                                : "bg-secondary hover:bg-secondary-hover text-white shadow-secondary/20"
                                }`}
                            >
                              <svg
                                className="size-4 sm:size-5 shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              <span className="truncate">{isAdded ? "Add to Cart!" : "Add to Cart"}</span>
                            </button>
                          </div>
                        );
                      })}
                      {activeProducts.length < 4 && <div className="px-2" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Production Product Picker Dialog (Startech & Techland style with search bar) */}
        {activeSlotModal !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-header/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-xl rounded-2xl border border-card-border bg-card p-5 shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-card-border pb-3">
                <div>
                  <h3 className="text-base font-bold text-foreground">Select Product to Compare</h3>
                  <p className="text-xs text-muted">Assigning to Slot {activeSlotModal + 1}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSlotModal(null);
                    setSearchQuery("");
                  }}
                  className="flex size-8 items-center justify-center rounded-full bg-surface text-muted hover:text-foreground transition"
                  aria-label="Close dialog"
                >
                  ✕
                </button>
              </div>

              {/* Search Bar inside Modal */}
              <div className="mt-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search product by title, model, or brand..."
                    className="w-full rounded-xl border border-card-border bg-surface px-4 py-2.5 text-xs text-foreground placeholder:text-muted focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-2.5 text-xs text-muted hover:text-foreground"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Product Selection List */}
              <div className="mt-3 flex-1 overflow-y-auto space-y-2 pr-1">
                {filteredProducts.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted">
                    No products found matching &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  filteredProducts.map((prod) => {
                    const isAlreadySelected = selectedIds.includes(prod.id);

                    return (
                      <button
                        type="button"
                        key={prod.id}
                        disabled={isAlreadySelected}
                        onClick={() => addProductToSlot(prod.id)}
                        className={`flex w-full items-center justify-between rounded-xl border p-2.5 text-left transition ${isAlreadySelected
                          ? "border-card-border bg-surface opacity-40 cursor-not-allowed"
                          : "border-card-border bg-surface hover:border-slate-300 hover:bg-card active:scale-[0.99]"
                          }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-card border border-card-border p-1">
                            <ProductVisual type={prod.visualType} className="size-8" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-foreground truncate">{prod.title}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                                {prod.brand}
                              </span>
                              <span className="text-[10px] text-muted">• {prod.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0 ml-3">
                          <span className="text-xs font-black text-primary block">
                            ৳{prod.officialWarranty.price.toLocaleString()}
                          </span>
                          {isAlreadySelected ? (
                            <span className="text-[9px] font-bold text-muted">Added</span>
                          ) : (
                            <span className="text-[10px] font-bold text-secondary"></span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation dialog for Clear All — matched with Cart modal */}
      {confirmClear && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-compare-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 id="clear-compare-title" className="text-xl font-bold text-foreground">
              Clear your compare list?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              This removes every item from your comparison list. This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="min-h-11 rounded-xl border border-card-border px-4 text-sm font-semibold text-foreground hover:bg-slate-50 transition cursor-pointer"
              >
                Keep items
              </button>
              <button
                type="button"
                onClick={() => {
                  clearCompare();
                  setConfirmClear(false);
                }}
                className="min-h-11 rounded-xl bg-red-600 px-4 text-sm font-bold text-white hover:bg-red-700 transition cursor-pointer"
              >
                Clear list
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-primary text-sm font-semibold">Loading comparison tool...</div>}>
      <CompareContent />
    </Suspense>
  );
}
