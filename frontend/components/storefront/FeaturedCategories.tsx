import Link from "next/link";
import React from "react";

import type { BackendCategory } from "@/types/api";

export interface FeaturedCategoriesProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllText?: string;
  className?: string;
  /** Live categories from the backend. Falls back to static list when empty. */
  categories?: BackendCategory[];
}

interface CategoryItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const featuredCategories: CategoryItem[] = [
  {
    name: "Smartphone",
    href: "/phone",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-[43px] sm:size-[47px]">
        <rect x="6" y="2" width="12" height="20" rx="3" />
        <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
        <line x1="10" y1="5" x2="14" y2="5" />
      </svg>
    ),
  },
  {
    name: "Laptop",
    href: "/laptop",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-[43px] sm:size-[47px]">
        <rect x="3" y="4" width="18" height="12" rx="1.5" />
        <path d="M2 19h20" />
        <path d="M9 16h6" />
        <line x1="2" y1="16" x2="22" y2="16" />
      </svg>
    ),
  },
  {
    name: "Air Conditioner",
    href: "/inverter-ac",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-[43px] sm:size-[47px]">
        <rect x="2" y="5" width="20" height="9" rx="2" />
        <line x1="5" y1="11" x2="19" y2="11" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
        <circle cx="18" cy="8" r="0.75" fill="currentColor" />
        <path d="M6 18c1-1.5 2-2 3-2s2 .5 3 2" />
        <path d="M12 18c1-1.5 2-2 3-2s2 .5 3 2" />
      </svg>
    ),
  },
  {
    name: "Desktop",
    href: "/desktops",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-[43px] sm:size-[47px]">
        <rect x="2" y="3" width="13" height="11" rx="1.5" />
        <line x1="5.5" y1="17" x2="11.5" y2="17" />
        <line x1="8.5" y1="14" x2="8.5" y2="17" />
        <rect x="17" y="3" width="5" height="15" rx="1" />
        <circle cx="19.5" cy="6" r="0.75" fill="currentColor" />
        <line x1="18.5" y1="9" x2="20.5" y2="9" />
      </svg>
    ),
  },
  {
    name: "AI Laptop",
    href: "/ai-pc",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-[43px] sm:size-[47px]">
        <rect x="3" y="4" width="18" height="12" rx="1.5" />
        <path d="M2 19h20" />
        <line x1="2" y1="16" x2="22" y2="16" />
        <rect x="8.5" y="7" width="7" height="6" rx="1" />
        <circle cx="12" cy="10" r="1.5" />
        <line x1="12" y1="5.5" x2="12" y2="7" />
        <line x1="12" y1="13" x2="12" y2="14.5" />
        <line x1="7" y1="10" x2="8.5" y2="10" />
        <line x1="15.5" y1="10" x2="17" y2="10" />
      </svg>
    ),
  },
  {
    name: "Processor",
    href: "/processor",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-[43px] sm:size-[47px]">
        <rect x="5" y="5" width="14" height="14" rx="2" />
        <rect x="8.5" y="8.5" width="7" height="7" rx="1" />
        <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
      </svg>
    ),
  },
  {
    name: "Motherboard",
    href: "/motherboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-[43px] sm:size-[47px]">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <rect x="6" y="6" width="6" height="6" rx="1" />
        <line x1="15" y1="6" x2="15" y2="12" strokeWidth="1.8" />
        <line x1="17.5" y1="6" x2="17.5" y2="12" strokeWidth="1.8" />
        <rect x="6" y="15" width="12" height="3" rx="0.5" />
      </svg>
    ),
  },
  {
    name: "SSD",
    href: "/storage",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-[43px] sm:size-[47px]">
        <rect x="2" y="7" width="20" height="10" rx="1.5" />
        <circle cx="18" cy="12" r="1" fill="currentColor" />
        <rect x="5" y="9.5" width="4" height="5" rx="0.5" />
        <rect x="11" y="9.5" width="4" height="5" rx="0.5" />
        <line x1="2" y1="10" x2="2" y2="14" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    name: "Graphics Card",
    href: "/gpu",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-[43px] sm:size-[47px]">
        <rect x="2" y="5" width="20" height="12" rx="2" />
        <circle cx="8" cy="11" r="3.5" />
        <circle cx="16" cy="11" r="3.5" />
        <line x1="8" y1="11" x2="8" y2="11.01" strokeWidth="2.5" />
        <line x1="16" y1="11" x2="16" y2="11.01" strokeWidth="2.5" />
        <path d="M5 17v2M19 17v2" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: "RAM",
    href: "/ram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-[43px] sm:size-[47px]">
        <rect x="2" y="8" width="20" height="8" rx="1.5" />
        <line x1="5" y1="8" x2="5" y2="11" />
        <line x1="8" y1="8" x2="8" y2="11" />
        <line x1="11" y1="8" x2="11" y2="11" />
        <line x1="14" y1="8" x2="14" y2="11" />
        <line x1="17" y1="8" x2="17" y2="11" />
        <line x1="5" y1="16" x2="19" y2="16" strokeDasharray="2 1.5" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: "Television",
    href: "/tv",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-[43px] sm:size-[47px]">
        <rect x="2" y="5" width="20" height="13" rx="2" />
        <path d="M7 21l2-3h6l2 3" />
        <path d="M8 2l4 3 4-3" />
      </svg>
    ),
  },
  {
    name: "Router",
    href: "/router",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-[43px] sm:size-[47px]">
        <rect x="2" y="14" width="20" height="7" rx="2" />
        <line x1="6" y1="5" x2="6" y2="14" />
        <line x1="12" y1="3" x2="12" y2="14" />
        <line x1="18" y1="5" x2="18" y2="14" />
        <circle cx="6" cy="17.5" r="0.75" fill="currentColor" />
        <circle cx="9" cy="17.5" r="0.75" fill="currentColor" />
        <circle cx="12" cy="17.5" r="0.75" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Monitor",
    href: "/monitor",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-[43px] sm:size-[47px]">
        <rect x="2" y="3" width="20" height="13" rx="2" />
        <line x1="12" y1="16" x2="12" y2="20" />
        <line x1="7" y1="20" x2="17" y2="20" />
      </svg>
    ),
  },
  {
    name: "Printer",
    href: "/printer",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-[43px] sm:size-[47px]">
        <path d="M6 9V3h12v6" />
        <rect x="3" y="9" width="18" height="9" rx="2" />
        <path d="M6 15h12v6H6z" />
        <circle cx="17.5" cy="12.5" r="0.75" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "WiFi Camera",
    href: "/ip-camera",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-[43px] sm:size-[47px]">
        <circle cx="12" cy="9" r="6" />
        <circle cx="12" cy="9" r="2.5" />
        <path d="M8 19h8" />
        <path d="M12 15v4" />
        <path d="M5 21h14" />
      </svg>
    ),
  },
  {
    name: "Smart Watch",
    href: "/smart-watch",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-[43px] sm:size-[47px]">
        <rect x="6" y="6" width="12" height="12" rx="4" />
        <path d="M9 6V2h6v4M9 18v4h6v-4" />
        <circle cx="12" cy="12" r="2.5" />
        <line x1="18" y1="10" x2="19.5" y2="10" strokeWidth="2" />
      </svg>
    ),
  },
];

/**
 * Maps a DB icon string (e.g. "gpu", "laptop") to the matching SVG from the
 * hardcoded list above. Falls back to a generic grid icon for unknowns.
 */
function getCategoryIcon(iconSlug: string | null, categoryName: string): React.ReactNode {
  // Try to match by icon slug first, then by name fragment
  const match = featuredCategories.find(
    (cat) =>
      cat.name.toLowerCase() === (iconSlug ?? "").toLowerCase() ||
      cat.name.toLowerCase().includes(categoryName.toLowerCase()) ||
      categoryName.toLowerCase().includes(cat.name.toLowerCase())
  );
  if (match) return match.icon;

  // Generic fallback icon (grid/product icon)
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-[43px] sm:size-[47px]">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export default function FeaturedCategories({
  eyebrow,
  title = "Featured Categories",
  subtitle = "Explore our wide range of tech products",
  className = "",
  categories: liveCategories = [],
}: FeaturedCategoriesProps = {}) {
  // Use real DB categories if we have them; otherwise fall back to hardcoded list.
  const displayCategories: CategoryItem[] =
    liveCategories.length > 0
      ? liveCategories.map((cat) => ({
          name: cat.name,
          href: `/${cat.slug}`,
          // icon is a DB string (e.g. "gpu") — map to SVG or use a generic one
          icon: getCategoryIcon(cat.icon, cat.name),
        }))
      : featuredCategories;
  return (
    <section className={`mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 ${className}`}>
      {/* Section Header */}
      <div className="mb-6 flex flex-col items-start">
        {eyebrow && (
          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
            {eyebrow}
          </span>
        )}
        <h2 className="text-[22px] sm:text-[26px] font-semibold text-foreground tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-[13px] sm:text-[14px] font-normal text-slate-500 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* 8-Column Responsive Grid matching Techland & Startech (16 items total) */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 sm:gap-3.5">
        {displayCategories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="group ecommerce-card-hover flex flex-col items-center justify-center rounded-2xl border border-card-border/80 bg-card p-3 sm:p-3.5 text-center shadow-xs min-h-[120px] sm:min-h-[132px]"
          >
            {/* Outline Line-Art Icon — Increased by 3px */}
            <div className="flex h-[47px] sm:h-[51px] w-full items-center justify-center text-slate-800 transition-all duration-200 group-hover:scale-105 group-hover:text-primary">
              {cat.icon}
            </div>

            {/* Typography — Increased by 3px: 12px->15px, sm:13px->16px */}
            <h3 className="mt-2 text-[15px] sm:text-[16px] font-medium text-slate-800 transition-colors group-hover:text-primary leading-tight line-clamp-1 w-full text-center">
              {cat.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
