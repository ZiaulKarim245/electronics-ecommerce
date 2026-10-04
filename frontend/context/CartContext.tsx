"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { type ProductVisualType } from "@/components/storefront/ProductVisual";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  regularPrice?: number;
  quantity: number;
  warranty: string;
  slug: string;
  visualType: ProductVisualType;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  clearCart: () => void;
  restoreDemoCart: () => void;
  totalCount: number;
  subtotal: number;
  isLoaded: boolean;
}

const defaultDemoItems: CartItem[] = [
  {
    id: 100,
    title: "Apple MacBook Pro 14 M3 Pro (18GB, 512GB SSD) Space Black",
    price: 237000,
    regularPrice: 245000,
    quantity: 1,
    warranty: "1 Year Official Apple Warranty",
    slug: "apple-macbook-pro-14-m3-pro",
    visualType: "laptop",
  },
];

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(defaultDemoItems);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage only on client mount to prevent SSR hydration mismatch
  useEffect(() => {
    try {
      const saved = localStorage.getItem("techhub_cart");
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(JSON.parse(saved));
      }
    } catch {
      // localStorage disabled or unavailable
    }
    setIsLoaded(true);
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("techhub_cart", JSON.stringify(items));
      } catch {
        // storage disabled
      }
    }
  }, [items, isLoaded]);

  const addToCart = (newItem: Omit<CartItem, "quantity">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...newItem, quantity: qty }];
    });
  };

  const removeFromCart = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => Boolean(item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const restoreDemoCart = () => {
    setItems(defaultDemoItems);
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        restoreDemoCart,
        totalCount,
        subtotal,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
