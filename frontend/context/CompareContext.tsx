"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { DetailedProduct } from "@/types/catalog";
import { mockCatalog, getProductBySlug } from "@/lib/data/catalog";
import type { Product } from "@/components/storefront/ProductCard";

interface CompareContextType {
  items: DetailedProduct[];
  addToCompare: (productOrId: DetailedProduct | Product | number | string) => boolean;
  removeFromCompare: (idOrSlug: number | string) => void;
  toggleCompare: (productOrId: DetailedProduct | Product | number | string) => void;
  isInCompare: (idOrSlug: number | string) => boolean;
  clearCompare: () => void;
  totalCompareCount: number;
  isLoaded: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

function convertProductToDetailed(p: Product): DetailedProduct {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    model: `TH-${p.slug ? p.slug.toUpperCase().slice(0, 8) : p.id}`,
    brand: p.category || "Electronics",
    category: p.category || "Hardware",
    stockStatus: p.inStock === false ? "Pre-Order" : "In Stock",
    officialWarranty: {
      price: p.discountedPrice,
      regularPrice: p.regularPrice || p.discountedPrice,
      duration: `${p.warrantyDuration || "3 Years"} ${p.warrantyType || "Official"} Warranty`,
    },
    shopWarranty: {
      price: Math.round((p.discountedPrice || 1000) * 0.95),
      regularPrice: p.regularPrice || p.discountedPrice,
      duration: "1 Year Shop Warranty",
    },
    keyFeatures: p.specs && p.specs.length > 0 ? p.specs : ["Official Genuine Product", "Manufacturer Warranty"],
    specifications: (p.specs || []).map((spec, i) => {
      const parts = spec.split(":");
      if (parts.length > 1) {
        return {
          group: "Key Specifications",
          key: parts[0].trim(),
          value: parts.slice(1).join(":").trim(),
        };
      }
      return {
        group: "Key Specifications",
        key: `Feature ${i + 1}`,
        value: spec,
      };
    }),
    rating: 4.8,
    reviewsCount: 16,
    ratingBreakdown: { 5: 12, 4: 4 },
    visualType: p.visualType || "casing",
  };
}

function resolveToDetailedProduct(
  input: DetailedProduct | Product | number | string
): DetailedProduct | undefined {
  // 1. If it's already a DetailedProduct
  if (typeof input === "object" && input !== null && "specifications" in input && "officialWarranty" in input) {
    return input as DetailedProduct;
  }

  // 2. If it's a Product from ProductCard
  if (typeof input === "object" && input !== null && "discountedPrice" in input) {
    const product = input as Product;
    // Check if there is an exact match in mockCatalog for richer specs
    const inCatalog = mockCatalog.find((p) => p.id === product.id || p.slug === product.slug);
    if (inCatalog) return inCatalog;
    return convertProductToDetailed(product);
  }

  // 3. If it's an ID (number or numeric string)
  const numericId = typeof input === "number" ? input : parseInt(String(input), 10);
  if (!isNaN(numericId)) {
    const inCatalog = mockCatalog.find((p) => p.id === numericId);
    if (inCatalog) return inCatalog;
  }

  // 4. If it's a slug string
  if (typeof input === "string") {
    const bySlug = getProductBySlug(input);
    if (bySlug) return bySlug;
  }

  // 5. Fallback for valid numericId
  if (!isNaN(numericId)) {
    return {
      id: numericId,
      slug: `product-${numericId}`,
      title: `Product #${numericId}`,
      model: `TH-P${numericId}`,
      brand: "Verified Product",
      category: "Hardware",
      stockStatus: "In Stock",
      officialWarranty: {
        price: 35000,
        regularPrice: 38000,
        duration: "3 Years Official Warranty",
      },
      shopWarranty: {
        price: 32000,
        regularPrice: 35000,
        duration: "1 Year Shop Warranty",
      },
      keyFeatures: ["Authentic Guaranteed", "Warranty Covered"],
      specifications: [
        { group: "General", key: "Product ID", value: String(numericId) },
        { group: "General", key: "Status", value: "Verified Authentic" },
      ],
      rating: 4.8,
      reviewsCount: 10,
      ratingBreakdown: { 5: 8, 4: 2 },
      visualType: "casing",
    };
  }

  return undefined;
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<DetailedProduct[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate from localStorage once on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("techhub_compare");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Storage unavailable
    }
    setIsLoaded(true);
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("techhub_compare", JSON.stringify(items));
      } catch {
        // Storage unavailable
      }
    }
  }, [items, isLoaded]);

  const addToCompare = useCallback(
    (productOrId: DetailedProduct | Product | number | string): boolean => {
      const resolved = resolveToDetailedProduct(productOrId);
      if (!resolved) return false;

      let added = false;
      setItems((prev) => {
        if (prev.some((p) => p.id === resolved.id || (resolved.slug && p.slug === resolved.slug))) {
          added = true;
          return prev;
        }
        if (prev.length >= 4) {
          // Max 4 items allowed in comparison matrix
          return prev;
        }
        added = true;
        return [...prev, resolved];
      });

      return added;
    },
    []
  );

  const removeFromCompare = useCallback((idOrSlug: number | string) => {
    setItems((prev) => prev.filter((p) => p.id !== idOrSlug && p.slug !== String(idOrSlug)));
  }, []);

  const toggleCompare = useCallback(
    (productOrId: DetailedProduct | Product | number | string) => {
      const resolved = resolveToDetailedProduct(productOrId);
      if (!resolved) return;

      setItems((prev) => {
        if (prev.some((p) => p.id === resolved.id || (resolved.slug && p.slug === resolved.slug))) {
          return prev.filter((p) => p.id !== resolved.id && p.slug !== resolved.slug);
        }
        if (prev.length >= 4) {
          return prev;
        }
        return [...prev, resolved];
      });
    },
    []
  );

  const isInCompare = useCallback(
    (idOrSlug: number | string) => {
      return items.some((p) => p.id === idOrSlug || p.slug === String(idOrSlug) || (typeof idOrSlug === "number" && p.id === idOrSlug));
    },
    [items]
  );

  const clearCompare = useCallback(() => {
    setItems([]);
  }, []);

  const totalCompareCount = items.length;

  return (
    <CompareContext.Provider
      value={{
        items,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        isInCompare,
        clearCompare,
        totalCompareCount,
        isLoaded,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
