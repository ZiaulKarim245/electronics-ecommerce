"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard, { type Product } from "@/components/storefront/ProductCard";
import Breadcrumbs from "@/components/storefront/Breadcrumbs";
import type { DetailedProduct } from "@/types/catalog";
import type { StorefrontCatalogResponse } from "@/types/api";

const categoryFromParam = (category: string) => {
  const categoryMap: Record<string, string> = {
    processor: "Processor",
    gpu: "Graphics Card",
    laptop: "Laptop",
    laptops: "Laptop",
    monitor: "Monitor",
    smartphone: "Smartphone",
  };
  return categoryMap[category.toLowerCase()] ?? "All";
};

// Client-side in-memory cache for catalog data to eliminate redundant network calls
let cachedCatalog: DetailedProduct[] | null = null;
let catalogFetchPromise: Promise<DetailedProduct[]> | null = null;

async function getCachedCatalog(): Promise<DetailedProduct[]> {
  if (cachedCatalog) return cachedCatalog;
  if (!catalogFetchPromise) {
    catalogFetchPromise = fetch("/api/storefront/products")
      .then((res) => {
        if (!res.ok) throw new Error("Catalog request failed");
        return res.json() as Promise<StorefrontCatalogResponse>;
      })
      .then((payload) => {
        cachedCatalog = payload.data.products;
        catalogFetchPromise = null;
        return cachedCatalog;
      })
      .catch((err) => {
        catalogFetchPromise = null;
        throw err;
      });
  }
  return catalogFetchPromise;
}

function CatalogView({ queryParam, catParam }: { queryParam: string; catParam: string }) {
  const selectedCategory = useMemo(() => categoryFromParam(catParam), [catParam]);
  const [catalog, setCatalog] = useState<DetailedProduct[]>(() => cachedCatalog || []);
  const [catalogState, setCatalogState] = useState<"loading" | "ready" | "error">(() => (cachedCatalog ? "ready" : "loading"));
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [sortBy, setSortBy] = useState("Default");
  const [showCount, setShowCount] = useState(16);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (searchQuery) {
      document.title = `Search - ${searchQuery} | TechHub Bangladesh`;
    } else if (selectedCategory && selectedCategory !== "All") {
      document.title = `${selectedCategory} Price in Bangladesh | TechHub Bangladesh`;
    } else {
      document.title = "All Products | TechHub Bangladesh";
    }
  }, [searchQuery, selectedCategory]);

  const loadCatalog = async (showLoading = true) => {
    if (showLoading && !cachedCatalog) setCatalogState("loading");
    try {
      const data = await getCachedCatalog();
      setCatalog(data);
      setCatalogState("ready");
    } catch {
      setCatalogState("error");
    }
  };

  useEffect(() => {
    let cancelled = false;
    if (cachedCatalog) {
      setCatalog(cachedCatalog);
      setCatalogState("ready");
      return;
    }

    getCachedCatalog()
      .then((data) => {
        if (!cancelled) {
          setCatalog(data);
          setCatalogState("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setCatalogState("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const cleanSearch = searchQuery.trim().toLowerCase();
    return catalog.filter((product) => {
      const matchSearch =
        !cleanSearch ||
        product.title.toLowerCase().includes(cleanSearch) ||
        product.category.toLowerCase().includes(cleanSearch) ||
        product.brand.toLowerCase().includes(cleanSearch) ||
        product.keyFeatures.some((kf) => kf.toLowerCase().includes(cleanSearch));

      const matchCategory = selectedCategory === "All" || product.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [catalog, searchQuery, selectedCategory]);

  const sortedProducts = useMemo(() => {
    const items = [...filteredProducts];
    if (sortBy === "Low") {
      items.sort((a, b) => a.officialWarranty.price - b.officialWarranty.price);
    } else if (sortBy === "High") {
      items.sort((a, b) => b.officialWarranty.price - a.officialWarranty.price);
    } else if (sortBy === "Newest") {
      items.sort((a, b) => b.id - a.id);
    }
    return items;
  }, [filteredProducts, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / showCount);
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * showCount;
    return sortedProducts.slice(start, start + showCount);
  }, [sortedProducts, page, showCount]);

  return (
    <>
      {/* Reusable Breadcrumbs */}
      {!searchQuery && !(catalogState === "ready" && sortedProducts.length === 0) && (
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Products Catalog", href: "/products" },
          ]}
        />
      )}

      <main className="mx-auto max-w-[1440px] px-4 pb-8 pt-4 sm:px-6 lg:px-10">
        {catalogState === "ready" && sortedProducts.length === 0 ? (
          <div className="rounded-2xl border border-card-border bg-card py-20 px-6 text-center shadow-xs">
            <svg
              className="mx-auto mb-3.5 size-12 text-slate-300 dark:text-slate-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 7.5L7.5 3H11L9 7.5H3Z"
                fill="currentColor"
                opacity="0.7"
              />
              <path
                d="M21 7.5L16.5 3H13L15 7.5H21Z"
                fill="currentColor"
                opacity="0.7"
              />
              <path
                d="M4 8H20V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V8Z"
                fill="currentColor"
                opacity="0.9"
              />
              <rect x="10" y="11" width="4" height="2" rx="1" fill="white" className="dark:fill-slate-900" />
            </svg>
            <h2 className="text-xl font-bold text-foreground">No products found</h2>
            <p className="mt-2 text-xs sm:text-sm text-muted">
              We couldn&apos;t find anything matching &quot;<span className="text-foreground">{searchQuery || catParam || "your query"}</span>&quot;.
            </p>
          </div>
        ) : (
          <section>
            {/* Top Toolbar Schema */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card p-3 sm:p-4 border border-card-border shadow-xs">
              {/* Left: Title Heading (In place of search bar) */}
              <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                {searchQuery ? (
                  <>Search Results for &ldquo;{searchQuery}&rdquo;</>
                ) : selectedCategory && selectedCategory !== "All" ? (
                  selectedCategory
                ) : (
                  "All Products"
                )}
              </h1>

              {/* Right: Show Count, Sort By, View Mode */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-slate-600">Show:</span>
                  <select
                    value={showCount}
                    onChange={(e) => { setShowCount(Number(e.target.value)); setPage(1); }}
                    className="rounded-lg border border-slate-200 bg-surface px-2.5 py-1.5 font-semibold text-foreground outline-none focus:border-slate-800 cursor-pointer"
                  >
                    <option value={16}>16</option>
                    <option value={20}>20</option>
                    <option value={40}>40</option>
                    <option value={60}>60</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-slate-600">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                    className="rounded-lg border border-slate-200 bg-surface px-2.5 py-1.5 font-semibold text-foreground outline-none focus:border-slate-800 cursor-pointer"
                  >
                    <option value="Default">Default</option>
                    <option value="Low">Price (Low &gt; High)</option>
                    <option value="High">Price (High &gt; Low)</option>
                    <option value="Newest">Newest</option>
                    <option value="Popular">Most Popular</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1.5 pl-1">
                  <span className="font-medium text-slate-600">View:</span>
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
              </div>
            </div>

            {/* Product Cards Grid / List */}
            {catalogState === "loading" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Loading products">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-96 animate-pulse rounded-3xl border border-card-border bg-card p-6" />
                ))}
              </div>
            ) : catalogState === "error" ? (
              <div className="rounded-3xl border border-card-border bg-card p-12 text-center shadow-xs">
                <h3 className="text-lg font-bold text-foreground">Catalog Unavailable</h3>
                <p className="mt-2 text-xs text-muted">We could not load real-time catalog items right now.</p>
                <button
                  onClick={() => loadCatalog(true)}
                  className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark transition shadow-sm shadow-primary/20"
                >
                  Retry Request
                </button>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid gap-3.5 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "flex flex-col gap-3.5"}>
                {paginatedProducts.map((p): Product => ({
                  id: p.id,
                  title: p.title,
                  category: p.category,
                  specs: p.keyFeatures.slice(0, 3),
                  regularPrice: p.officialWarranty.regularPrice,
                  discountedPrice: p.officialWarranty.price,
                  inStock: p.stockStatus === "In Stock",
                  warrantyType: "Official",
                  warrantyDuration: p.officialWarranty.duration.split(" ")[0] + " " + p.officialWarranty.duration.split(" ")[1],
                  slug: p.slug,
                  visualType: p.visualType,
                })).map((product) => (
                  <ProductCard key={product.id} product={product} variant="listing" layout={viewMode} />
                ))}
              </div>
            )}

            {/* Bottom Pagination Schema matching category pages */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-card-border/80 pt-5">
              <span className="text-xs sm:text-sm text-slate-500 font-medium">
                Showing <strong className="text-foreground font-semibold">{paginatedProducts.length > 0 ? (page - 1) * showCount + 1 : 0} – {Math.min(page * showCount, sortedProducts.length)}</strong> of <strong className="text-foreground font-semibold">{sortedProducts.length}</strong> items
              </span>

              <nav
                className="inline-flex h-8 sm:h-[34px] items-stretch overflow-hidden rounded-lg border border-slate-300 bg-white shadow-2xs"
                aria-label="Product pagination"
              >
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  aria-label="Previous page"
                  className="flex w-8 sm:w-[34px] items-center justify-center border-r border-slate-200 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                >
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {(() => {
                  const pages: (number | string)[] = [];
                  const maxPages = Math.max(1, totalPages);
                  if (maxPages <= 7) {
                    for (let i = 1; i <= maxPages; i++) pages.push(i);
                  } else {
                    if (page <= 4) {
                      pages.push(1, 2, 3, 4, 5, "...", maxPages);
                    } else if (page >= maxPages - 3) {
                      pages.push(1, "...", maxPages - 4, maxPages - 3, maxPages - 2, maxPages - 1, maxPages);
                    } else {
                      pages.push(1, "...", page - 1, page, page + 1, "...", maxPages);
                    }
                  }
                  return pages.map((item, idx) => {
                    if (typeof item === "string") {
                      return (
                        <span
                          key={`ellipsis-${idx}`}
                          className="flex min-w-[30px] sm:min-w-[34px] items-center justify-center border-r border-slate-200 px-1.5 text-[11px] font-semibold text-slate-400 select-none bg-slate-50/40"
                        >
                          …
                        </span>
                      );
                    }
                    const isCurrent = item === page;
                    return (
                      <button
                        key={`page-${item}`}
                        type="button"
                        onClick={() => setPage(item)}
                        aria-current={isCurrent ? "page" : undefined}
                        className={`flex min-w-[32px] sm:min-w-[34px] items-center justify-center border-r border-slate-200 px-2 text-xs transition cursor-pointer ${isCurrent
                          ? "bg-[#1b4382] text-white font-bold"
                          : "text-slate-700 font-medium hover:bg-slate-50 hover:text-[#1b4382]"
                          }`}
                      >
                        {item}
                      </button>
                    );
                  });
                })()}

                <button
                  type="button"
                  disabled={page === totalPages || totalPages <= 1}
                  onClick={() => setPage(page + 1)}
                  aria-label="Next page"
                  className="flex w-8 sm:w-[34px] items-center justify-center text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                >
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") ?? "";
  const catParam = searchParams.get("cat") ?? "";

  useEffect(() => {
    if (queryParam) {
      document.title = `Search - ${queryParam} | TechHub Bangladesh`;
    } else if (catParam && catParam !== "All") {
      document.title = `${categoryFromParam(catParam)} Price in Bangladesh | TechHub Bangladesh`;
    } else {
      document.title = "All Products | TechHub Bangladesh";
    }
  }, [queryParam, catParam]);

  return <CatalogView key={`${queryParam}|${catParam}`} queryParam={queryParam} catParam={catParam} />;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-primary text-sm">Loading product catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
