/**
 * lib/api/catalog.ts — Server-only catalog data fetchers.
 *
 * Caching strategy (senior-approved):
 *  - React.cache()   → per-request memoization. If two Server Components in the
 *                      same render tree call the same function, the HTTP request
 *                      fires ONCE, not twice.
 *  - next.revalidate → Next.js ISR: the response is cached in the Next.js data
 *                      cache for N seconds, then silently revalidated in the
 *                      background — visitors never wait for the refetch.
 *  - try/catch       → if the backend is unreachable we return mock data so
 *                      the storefront never shows a blank page.
 */
import "server-only"
import { cache } from "react";

import { backendRequest } from "./client";
import type { BackendProduct, BackendCategory } from "@/types/api";
import type { DetailedProduct } from "@/types/catalog";
import type { Product } from "@/components/storefront/ProductCard";

// ─────────────────────────────────────────────────────────────
// Normalisation helpers
// ─────────────────────────────────────────────────────────────

function normalizeDetailedProduct(product: BackendProduct): DetailedProduct {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    model: product.model,
    brand: product.brand,
    category: product.category,
    stockStatus: product.stock_status,
    officialWarranty: product.official_warranty
      ? {
          price: product.official_warranty.price,
          regularPrice: product.official_warranty.regular_price,
          duration: product.official_warranty.duration,
        }
      : { price: 0, regularPrice: 0, duration: "" },
    shopWarranty: product.shop_warranty
      ? {
          price: product.shop_warranty.price,
          regularPrice: product.shop_warranty.regular_price,
          duration: product.shop_warranty.duration,
        }
      : { price: 0, regularPrice: 0, duration: "" },
    keyFeatures: product.key_features,
    specifications: product.specifications,
    videoUrl: product.video_url ?? undefined,
    driverDownloadUrl: product.driver_download_url ?? undefined,
    rating: 0,
    reviewsCount: 0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    visualType: product.visual_type,
  };
}

function normalizeCardProduct(product: BackendProduct): Product {
  const officialWarranty = product.official_warranty ?? product.shop_warranty;
  const price = officialWarranty?.price ?? 0;
  const regularPrice = officialWarranty?.regular_price ?? price;

  return {
    id: product.id,
    title: product.title,
    category: product.category,
    specs: product.key_features.slice(0, 4),
    regularPrice,
    discountedPrice: price,
    inStock: product.stock_status === "In Stock",
    warrantyType: "Official",
    warrantyDuration: product.official_warranty?.duration ?? "Warranty included",
    slug: product.slug,
    visualType: product.visual_type,
  };
}

// ─────────────────────────────────────────────────────────────
// Runtime validators
// ─────────────────────────────────────────────────────────────

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function isString(v: unknown): v is string { return typeof v === "string"; }
function isFinite_(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }

function isBackendProduct(v: unknown): v is BackendProduct {
  if (!isRecord(v)) return false;
  return isFinite_(v.id) && isString(v.slug) && isString(v.title);
}

function isBackendCategory(v: unknown): v is BackendCategory {
  if (!isRecord(v)) return false;
  return isFinite_(v.id) && isString(v.slug) && isString(v.name);
}

// ─────────────────────────────────────────────────────────────
// Exported fetchers — each wrapped with React.cache()
// ─────────────────────────────────────────────────────────────

/**
 * Fetches the top 8 newest products for the homepage shelf.
 * ISR 5 min + per-request memoization.
 * Falls back to mock data if the backend is unreachable.
 */
export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
  try {
    const response = await backendRequest("products/featured", {
      next: { revalidate: 300 },
    });
    if (!response.ok) throw new Error(`Backend responded ${response.status}`);
    const raw: unknown = await response.json();
    if (!isRecord(raw) || raw.status !== "success" || !Array.isArray(raw.data)) {
      throw new Error("Featured API: invalid envelope");
    }
    const products = (raw.data as unknown[]).filter(isBackendProduct);
    return products.map(normalizeCardProduct);
  } catch (error) {
    console.warn("[catalog] getFeaturedProducts fallback:", (error as Error).message);
    const { featuredProducts } = await import("@/lib/data/products");
    return featuredProducts;
  }
});

/**
 * Fetches all active top-level categories with their children.
 * ISR 10 min + per-request memoization.
 * Falls back to empty array if the backend is unreachable.
 */
export const getCategories = cache(async (): Promise<BackendCategory[]> => {
  try {
    const response = await backendRequest("categories", {
      next: { revalidate: 600 },
    });
    if (!response.ok) throw new Error(`Backend responded ${response.status}`);
    const raw: unknown = await response.json();
    if (!isRecord(raw) || raw.status !== "success" || !Array.isArray(raw.data)) {
      throw new Error("Categories API: invalid envelope");
    }
    return (raw.data as unknown[]).filter(isBackendCategory);
  } catch (error) {
    console.warn("[catalog] getCategories fallback:", (error as Error).message);
    return [];
  }
});

/**
 * Fetches the paginated product list — used on /products catalog page.
 * No ISR (data changes frequently with filters); per-request memoization only.
 */
export const getCatalogProducts = cache(async (params?: {
  category?: string;
  q?: string;
  page?: number;
}): Promise<DetailedProduct[]> => {
  try {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.q) query.set("q", params.q);
    if (params?.page) query.set("page", String(params.page));

    const path = query.toString() ? `products?${query}` : "products";
    const response = await backendRequest(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`Backend responded ${response.status}`);
    const raw: unknown = await response.json();
    if (!isRecord(raw) || raw.status !== "success" || !isRecord(raw.data)) {
      throw new Error("Catalog API: invalid envelope");
    }
    const items = Array.isArray((raw.data as Record<string, unknown>).data)
      ? ((raw.data as Record<string, unknown>).data as unknown[]).filter(isBackendProduct)
      : [];
    return items.map(normalizeDetailedProduct);
  } catch (error) {
    console.warn("[catalog] getCatalogProducts fallback:", (error as Error).message);
    const { mockCatalog } = await import("@/lib/data/catalog");
    return mockCatalog;
  }
});

/**
 * Fetches a single product by slug.
 * ISR 5 min + per-request memoization.
 * Falls back to mock lookup if the backend is unreachable.
 */
export const getProductBySlug = cache(async (slug: string): Promise<DetailedProduct | null> => {
  try {
    const response = await backendRequest(`products/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Backend responded ${response.status}`);
    const raw: unknown = await response.json();
    if (!isRecord(raw) || raw.status !== "success" || !isBackendProduct(raw.data)) {
      throw new Error("Product API: invalid shape");
    }
    return normalizeDetailedProduct(raw.data as BackendProduct);
  } catch (error) {
    console.warn("[catalog] getProductBySlug fallback:", (error as Error).message);
    const { getProductBySlug: mockGet } = await import("@/lib/data/catalog");
    return mockGet(slug) ?? null;
  }
});


