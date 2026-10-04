"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { type ProductVisualType } from "@/components/storefront/ProductVisual";

export interface WishlistItem {
  id: number;
  title: string;
  price: number;
  regularPrice?: number;
  inStock?: boolean;
  warranty?: string;
  slug: string;
  visualType: ProductVisualType;
  category?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (idOrSlug: number | string) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (idOrSlug: number | string) => boolean;
  clearWishlist: () => void;
  totalWishlistCount: number;
  isLoaded: boolean;
}

const defaultDemoWishlist: WishlistItem[] = [
  {
    id: 101,
    title: "NVIDIA GeForce RTX 4070 SUPER 12GB GDDR6X",
    price: 79500,
    regularPrice: 84000,
    inStock: true,
    warranty: "3 Years Official",
    slug: "geforce-rtx-4070-super-12gb",
    visualType: "gpu",
    category: "Components",
  },
];

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(defaultDemoWishlist);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate from localStorage once on client mount to prevent SSR mismatch
  useEffect(() => {
    try {
      const saved = localStorage.getItem("techhub_wishlist");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Storage unavailable or disabled
    }
    setIsLoaded(true);
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("techhub_wishlist", JSON.stringify(items));
      } catch {
        // Storage unavailable
      }
    }
  }, [items, isLoaded]);

  const addToWishlist = (item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id || (item.slug && i.slug === item.slug))) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (idOrSlug: number | string) => {
    setItems((prev) => prev.filter((i) => i.id !== idOrSlug && i.slug !== String(idOrSlug)));
  };

  const toggleWishlist = (item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id || (item.slug && i.slug === item.slug))) {
        return prev.filter((i) => i.id !== item.id && i.slug !== item.slug);
      }
      return [...prev, item];
    });
  };

  const isInWishlist = (idOrSlug: number | string) => {
    return items.some((i) => i.id === idOrSlug || i.slug === String(idOrSlug) || (typeof idOrSlug === "number" && i.id === idOrSlug));
  };

  const clearWishlist = () => {
    setItems([]);
  };

  const totalWishlistCount = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        totalWishlistCount,
        isLoaded,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
