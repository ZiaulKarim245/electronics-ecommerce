"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { navCategories } from "@/components/storefront/CategoryNav";
import TechHubLogo from "@/components/storefront/TechHubLogo";
import ProductVisual, { type ProductVisualType } from "@/components/storefront/ProductVisual";

export interface SearchSuggestionItem {
  id: number;
  slug: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  regularPrice: number;
  stockStatus: string;
  visualType: ProductVisualType;
}

// In-memory client-side cache for search suggestions to eliminate duplicate network calls
const searchSuggestionsCache = new Map<string, { items: SearchSuggestionItem[]; total: number }>();

export default function Header() {
  const { totalCount, isLoaded } = useCart();
  const { totalWishlistCount, isLoaded: isWishlistLoaded } = useWishlist();
  const { totalCompareCount, isLoaded: isCompareLoaded } = useCompare();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SearchSuggestionItem[]>([]);
  const [totalSuggestionsCount, setTotalSuggestionsCount] = useState<number>(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchFormRef = useRef<HTMLFormElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(65);
  const router = useRouter();
  const pathname = usePathname();

  // Auto clear search input when navigating to other routes/buttons
  useEffect(() => {
    setSearchQuery("");
    setShowSuggestions(false);
    setSuggestions([]);
  }, [pathname]);

  // Keep header height updated for flush mobile drawer positioning
  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [mobileSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    setSuggestions([]);
    const query = searchQuery.trim();
    setSearchQuery("");
    if (query) {
      router.push(`/products?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/products");
    }
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setMobileSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounced & memoized suggestions fetch
  useEffect(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();
    if (cleanQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Immediate cache hit: zero network request & zero delay
    if (searchSuggestionsCache.has(cleanQuery)) {
      const cached = searchSuggestionsCache.get(cleanQuery);
      setSuggestions(cached?.items || []);
      setTotalSuggestionsCount(cached?.total || 0);
      setShowSuggestions(true);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search-suggest?q=${encodeURIComponent(cleanQuery)}`);
        const data = await res.json();
        const results = data.suggestions ?? [];
        const total = data.totalCount ?? results.length;
        searchSuggestionsCache.set(cleanQuery, { items: results, total });
        setSuggestions(results);
        setTotalSuggestionsCount(total);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
        setTotalSuggestionsCount(0);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchFormRef.current && !searchFormRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCategory = useCallback((name: string) => {
    setExpandedCategory((prev) => (prev === name ? null : name));
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="relative z-50 border-b border-white/10 bg-header/95 text-white backdrop-blur-md"
      >
        {/* ═══════ Top Header Row ═══════ */}
        <div className="relative mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 md:gap-4 lg:gap-5 lg:px-10 lg:py-[18px]">

          {/* ── Left: Hamburger (mobile) + Logo ── */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            {/* Hamburger / Close toggle — mobile/tablet only */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen((prev) => !prev);
                setMobileSearchOpen(false);
              }}
              className="flex size-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10 hover:text-primary active:scale-95 xl:hidden"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="storefront-mobile-menu"
            >
              {mobileMenuOpen ? (
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="group absolute left-1/2 flex min-h-11 -translate-x-1/2 shrink-0 items-center justify-center rounded-lg px-1 hover:opacity-90 transition-opacity xl:static xl:translate-x-0"
              aria-label="TechHub Home"
            >
              <TechHubLogo compact className="size-8 min-[360px]:hidden" />
              <TechHubLogo className="hidden h-7 w-auto min-[360px]:block sm:h-10 xl:h-11" />
            </Link>
          </div>

          {/* ── Center: Desktop Search Bar (md+) — Long & Wide ── */}
          <form
            ref={searchFormRef}
            onSubmit={handleSearchSubmit}
            className="relative z-[60] mx-3 hidden min-w-[200px] max-w-[608px] flex-1 items-center lg:mx-5 xl:flex"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type Your Desire Product...."
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className="search-input h-[42px] w-full rounded-md border border-slate-200 bg-white px-4 pr-20 text-[14px] text-slate-900 placeholder-slate-400 shadow-xs transition focus:outline-none sm:px-4 sm:pr-20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(""); setSuggestions([]); setShowSuggestions(false); }}
                aria-label="Clear search"
                className="absolute inset-y-0 right-9 sm:right-10 my-auto flex size-6 sm:size-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <svg className="size-3.5 sm:size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              aria-label="Search"
              className="absolute inset-y-0 right-1.5 my-auto flex size-7 sm:size-7.5 items-center justify-center rounded-md text-slate-500 hover:text-primary transition"
            >
              <svg className="size-4 sm:size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* ── Suggestions Dropdown ── */}
            {showSuggestions && searchQuery.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-[46px] z-[100] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
                {suggestions.length === 0 ? (
                  /* No results state */
                  <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
                    <svg className="size-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-[13px] font-medium text-slate-500">
                      No results for <span className="font-semibold text-slate-800">&ldquo;{searchQuery}&rdquo;</span>
                    </p>
                    <p className="text-[12px] text-slate-400">Try a different keyword or browse our categories</p>
                  </div>
                ) : (
                  <>
                    {/* Header: Showing X out of Y products + View All */}
                    <div className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-2.5">
                      <span className="text-[13px] font-semibold text-secondary">
                        Showing {suggestions.length} out of {totalSuggestionsCount} products
                      </span>
                      <button
                        type="submit"
                        className="text-[13px] font-semibold text-secondary hover:underline cursor-pointer"
                      >
                        View All
                      </button>
                    </div>

                    {/* Scrollable Products List */}
                    <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
                      {suggestions.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/products/${s.slug}`}
                          onClick={() => { setShowSuggestions(false); setSuggestions([]); setSearchQuery(""); }}
                          className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-slate-50/80"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Product Thumbnail */}
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white p-1">
                              <ProductVisual type={s.visualType} className="size-8" />
                            </div>

                            {/* Title & Price */}
                            <div className="min-w-0 flex-1">
                              <h4 className="text-[13px] font-medium text-slate-900 truncate leading-snug">
                                {s.title}
                              </h4>
                              <div className="mt-0.5 flex items-baseline gap-1.5 text-xs">
                                <span className="font-bold text-slate-900">
                                  ৳{s.price.toLocaleString()}
                                </span>
                                {s.regularPrice > s.price && (
                                  <span className="text-[11px] text-slate-400 line-through">
                                    ৳{s.regularPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* In Stock Badge */}
                          <div className="shrink-0 pl-2">
                            <span className={`inline-block rounded px-2.5 py-1 text-xs font-semibold ${s.stockStatus === "In Stock"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                              }`}>
                              {s.stockStatus}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </form>

          {/* ── Right: Action Items ── */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-5">

            {/* Mobile Search Toggle — visible below xl */}
            <button
              type="button"
              onClick={() => {
                setMobileSearchOpen((v) => {
                  const next = !v;
                  if (next) setMobileMenuOpen(false);
                  return next;
                });
              }}
              className="flex size-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10 hover:text-primary active:scale-95 xl:hidden"
              aria-label="Toggle search"
            >
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Offers Link (Desktop xl+ only) */}
            <Link
              href="/offers"
              className="group hidden items-center gap-2.5 rounded-lg text-slate-300 transition hover:text-white xl:flex"
            >
              {/* StarTech Gift Box SVG */}
              <svg className="size-6 text-white group-hover:text-primary transition-colors shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v-1.5A2.25 2.25 0 0 0 9.375 3Zm3.375 3.75h1.875a1.875 1.875 0 1 0 0-3.75 2.25 2.25 0 0 0-1.875 2.25v1.5ZM4.5 8.25A1.5 1.5 0 0 1 6 6.75h12a1.5 1.5 0 0 1 1.5 1.5v1.5a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V8.25ZM5.25 12h5.625v8.25H6A1.5 1.5 0 0 1 4.5 18.75V12h.75Zm7.125 8.25V12h6.375v6.75a1.5 1.5 0 0 1-1.5 1.5h-4.875Z" />
              </svg>
              <div>
                <p className="hover-gradient-text-light text-[16px] font-bold leading-tight">Offers</p>
              </div>
            </Link>

            {/* Account Link (Tablet & Desktop md+) */}
            <Link
              href="/account/login"
              className="group hidden items-center gap-1.5 rounded-lg text-slate-300 transition hover:text-white sm:gap-2 xl:flex"
              title="Account"
            >
              {/* Profile avatar ring icon */}
              <svg className="size-5 sm:size-6 text-white group-hover:text-primary transition-colors shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" clipRule="evenodd" />
              </svg>
              <div className="hidden xl:block">
                <p className="hover-gradient-text-light text-[16px] font-bold leading-tight">Account</p>
              </div>
            </Link>

            {/* Wishlist Link with Live Count Badge (Tablet & Desktop md+) */}
            <Link
              href="/wishlist"
              className="group relative hidden items-center gap-1.5 rounded-lg text-slate-300 transition hover:text-white sm:gap-2 xl:flex"
              title="Wishlist"
            >
              <div className="relative shrink-0">
                <svg
                  className="size-5 sm:size-6 text-white group-hover:text-primary transition-colors shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                {isWishlistLoaded && totalWishlistCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white shadow-md">
                    {totalWishlistCount}
                  </span>
                )}
              </div>
              <div className="hidden xl:block">
                <p className="hover-gradient-text-light text-[16px] font-bold leading-tight">Wishlist</p>
              </div>
            </Link>

            {/* Compare Link (Tablet & Desktop md+) */}
            <Link
              href="/compare"
              className="group hidden items-center gap-1.5 rounded-lg text-slate-300 transition hover:text-white sm:gap-2 xl:flex"
              title="Compare"
            >
              {/* Dual opposing curved arrows with dots */}
              <div className="relative shrink-0">
                <svg className="size-5 sm:size-6 text-white group-hover:text-primary transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="6" cy="18" r="1.5" fill="currentColor" stroke="none" />
                  <path d="M6 16.5V10a4 4 0 0 1 4-4h7" />
                  <polyline points="14 3 17 6 14 9" />
                  <circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" />
                  <path d="M18 7.5V14a4 4 0 0 1-4 4H7" />
                  <polyline points="10 15 7 18 10 21" />
                </svg>
                {isCompareLoaded && totalCompareCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white shadow-md">
                    {totalCompareCount}
                  </span>
                )}
              </div>
              <div className="hidden xl:block">
                <p className="hover-gradient-text-light text-[16px] font-bold leading-tight">Compare</p>
              </div>
            </Link>

            {/* Cart with Live Count Badge — always visible */}
            <Link
              href="/cart"
              className="group relative flex items-center gap-1.5 sm:gap-2 rounded-lg text-slate-300 transition hover:text-white"
              title="Cart"
            >
              <div className="relative shrink-0">
                <svg
                  className="size-5 sm:size-6 text-white group-hover:text-primary transition-colors"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.6"
                >
                  <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
                </svg>
                {isLoaded && totalCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white shadow-md">
                    {totalCount}
                  </span>
                )}
              </div>
              <div className="hidden xl:block">
                <p className="hover-gradient-text-light text-[16px] font-bold leading-tight">Cart</p>
              </div>
            </Link>

            {/* PC Builder CTA Button — desktop & tablet sm+ */}
            <Link
              href="/pc-builder"
              className="pc-builder-animate hidden items-center gap-1.5 rounded-xl px-4 py-2.5 text-[14px] font-bold uppercase tracking-wider text-white transition-all duration-200 ease-in-out hover:opacity-95 active:scale-95 xl:flex"
            >
              <span>PC Builder</span>
            </Link>
          </div>
        </div>

        {/* ═══════ Mobile Search Slide-Down ═══════ */}
        {mobileSearchOpen && (
          <div className="border-t border-white/10 bg-header px-4 pb-3 pt-2 xl:hidden">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type Your Desire Product...."
                autoFocus
                className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-20 text-[17px] text-slate-900 placeholder-slate-400 shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-11 flex size-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                aria-label="Search mobile"
                className="absolute right-1.5 flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-primary hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile category drawer — sits flush below persistent header */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 flex xl:hidden"
          style={{ top: `${headerHeight}px` }}
        >
          {/* Backdrop overlay covering the screen below the header */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu backdrop"
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            style={{ top: `${headerHeight}px` }}
          />

          {/* Drawer panel */}
          <aside
            id="storefront-mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Store categories"
            className="relative z-10 flex h-full w-[min(88vw,20rem)] flex-col border-r border-slate-200 bg-white text-slate-900 shadow-2xl animate-in slide-in-from-left duration-200"
          >
            {/* Scrollable category navigation */}
            <nav aria-label="Product categories" className="flex-1 overflow-y-auto overscroll-contain pb-[calc(4rem+env(safe-area-inset-bottom))]">
              <ul className="divide-y divide-slate-100">
                {navCategories.map((cat) => {
                  const hasChildren = Boolean(cat.subcategories && cat.subcategories.length > 0);
                  const isExpanded = expandedCategory === cat.name;

                  return (
                    <li key={cat.name}>
                      <div className="flex items-stretch">
                        {/* Category link */}
                        <Link
                          href={cat.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex min-h-[50px] flex-1 items-center px-5 text-[15px] font-semibold text-slate-800 transition hover:text-primary active:bg-slate-50"
                        >
                          {cat.name}
                        </Link>

                        {/* Expand/collapse button */}
                        {hasChildren && (
                          <button
                            type="button"
                            onClick={() => toggleCategory(cat.name)}
                            className="flex w-14 items-center justify-center border-l border-slate-100 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
                            aria-label={isExpanded ? `Collapse ${cat.name}` : `Expand ${cat.name}`}
                            aria-expanded={isExpanded}
                          >
                            <svg
                              className={`size-5 transition-transform duration-200 ${isExpanded ? "rotate-45 text-primary" : ""}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Subcategories accordion panel */}
                      {hasChildren && isExpanded && (
                        <ul className="border-t border-slate-100 bg-slate-50/80 py-1">
                          {cat.subcategories!.map((sub) => (
                            <li key={sub.name}>
                              <Link
                                href={sub.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex min-h-[44px] items-center px-8 text-sm text-slate-600 transition hover:text-primary active:bg-slate-100"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* Mobile Drawer Quick Links */}
              <div className="border-t border-slate-200 bg-slate-50 p-4 space-y-1">
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100 hover:text-primary transition"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="size-4.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    <span>My Wishlist</span>
                  </div>
                  {isWishlistLoaded && totalWishlistCount > 0 && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary border border-primary/20">
                      {totalWishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/compare"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100 hover:text-primary transition"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="size-4.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="6" cy="18" r="1.5" fill="currentColor" stroke="none" />
                      <path d="M6 16.5V10a4 4 0 0 1 4-4h7" />
                      <polyline points="14 3 17 6 14 9" />
                      <circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" />
                      <path d="M18 7.5V14a4 4 0 0 1-4 4H7" />
                      <polyline points="10 15 7 18 10 21" />
                    </svg>
                    <span>Compare Products</span>
                  </div>
                  {isCompareLoaded && totalCompareCount > 0 && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary border border-primary/20">
                      {totalCompareCount}
                    </span>
                  )}
                </Link>
              </div>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
