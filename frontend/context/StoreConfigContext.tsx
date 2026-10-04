"use client";

import React, { createContext, useContext, useEffect, useState, useTransition, useCallback } from "react";
import {
  type CheckoutTemplate,
  type ProductLineTemplate,
  type StoreConfig,
  DEFAULT_STORE_CONFIG,
  STORE_CONFIG_KEY,
  STORE_CONFIG_CHANGE_EVENT,
  getStoredConfig,
  saveStoredConfig,
} from "@/lib/storeConfig";

interface StoreConfigContextType {
  config: StoreConfig;
  checkoutTemplate: CheckoutTemplate;
  productLineTemplate: ProductLineTemplate;
  setCheckoutTemplate: (template: CheckoutTemplate) => void;
  setProductLineTemplate: (template: ProductLineTemplate) => void;
  updateConfig: (patch: Partial<StoreConfig>) => void;
  isHydrated: boolean;
}

const StoreConfigContext = createContext<StoreConfigContextType>({
  config: DEFAULT_STORE_CONFIG,
  checkoutTemplate: DEFAULT_STORE_CONFIG.checkoutTemplate,
  productLineTemplate: DEFAULT_STORE_CONFIG.productLineTemplate,
  setCheckoutTemplate: () => {},
  setProductLineTemplate: () => {},
  updateConfig: () => {},
  isHydrated: false,
});

export function StoreConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<StoreConfig>(DEFAULT_STORE_CONFIG);
  const [isHydrated, setIsHydrated] = useState(false);
  const [, startTransition] = useTransition();

  // Helper to fetch server config across origins/ports
  const fetchServerConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/store-config", {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        const serverData = (await res.json()) as StoreConfig;
        if (serverData && serverData.checkoutTemplate) {
          setConfig((prev) => {
            if (
              prev.checkoutTemplate !== serverData.checkoutTemplate ||
              prev.productLineTemplate !== serverData.productLineTemplate ||
              prev.updatedAt !== serverData.updatedAt
            ) {
              // Sync to local storage on this port/origin as well
              saveStoredConfig(serverData);
              return serverData;
            }
            return prev;
          });
        }
      }
    } catch {
      // Offline / network fallback
    }
  }, []);

  // 1. Initial hydration from localStorage, URL query, and Server API
  useEffect(() => {
    const initial = getStoredConfig();

    // Check URL parameters for explicit overrides (convenient for reviewers/demos)
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlCheckout = urlParams.get("checkout") || urlParams.get("checkoutTemplate") || urlParams.get("t");
      const urlProductLine = urlParams.get("product_line") || urlParams.get("layout") || urlParams.get("productTemplate");

      if (urlCheckout && ["modern", "precise", "lucrative"].includes(urlCheckout)) {
        initial.checkoutTemplate = urlCheckout as CheckoutTemplate;
      }
      if (urlProductLine && ["modern", "precise", "lucrative"].includes(urlProductLine)) {
        initial.productLineTemplate = urlProductLine as ProductLineTemplate;
      }
    }

    startTransition(() => {
      setConfig(initial);
      setIsHydrated(true);
    });

    // Fetch authoritative server state immediately on mount
    fetchServerConfig();

    // 2. Synchronize across tabs on same port
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORE_CONFIG_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setConfig((prev) => ({ ...prev, ...parsed }));
        } catch {
          // Ignore
        }
      }
    };

    // 3. Synchronize within same window/tab
    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<StoreConfig>;
      if (customEvent.detail) {
        setConfig(customEvent.detail);
      }
    };

    // 4. Cross-Origin / Cross-Port Synchronization (e.g. port 3001 -> port 3000)
    // Whenever the user switches back to this tab or window gains focus:
    const handleFocus = () => {
      fetchServerConfig();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchServerConfig();
      }
    };

    // Fast polling interval (1000ms) to ensure live real-time sync across side-by-side browser windows
    const pollInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchServerConfig();
      }
    }, 1200);

    window.addEventListener("storage", handleStorage);
    window.addEventListener(STORE_CONFIG_CHANGE_EVENT, handleCustomChange);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(STORE_CONFIG_CHANGE_EVENT, handleCustomChange);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchServerConfig]);

  // Update config both locally and across the server API
  const updateConfig = async (patch: Partial<StoreConfig>) => {
    const updated = saveStoredConfig(patch);
    setConfig(updated);

    // Persist to server API so both port 3000 and port 3001 share the exact same state
    try {
      await fetch("/api/store-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });

      // If we are on port 3001, also ping port 3000 directly
      if (typeof window !== "undefined" && window.location.port === "3001") {
        fetch("http://localhost:3000/api/store-config", {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        }).catch(() => {});
      }
    } catch {
      // Ignore network errors
    }
  };

  const setCheckoutTemplate = (template: CheckoutTemplate) => {
    updateConfig({ checkoutTemplate: template });
  };

  const setProductLineTemplate = (template: ProductLineTemplate) => {
    updateConfig({ productLineTemplate: template });
  };

  return (
    <StoreConfigContext.Provider
      value={{
        config,
        checkoutTemplate: config.checkoutTemplate,
        productLineTemplate: config.productLineTemplate,
        setCheckoutTemplate,
        setProductLineTemplate,
        updateConfig,
        isHydrated,
      }}
    >
      {children}
    </StoreConfigContext.Provider>
  );
}

export function useStoreConfig() {
  const context = useContext(StoreConfigContext);
  if (!context) {
    throw new Error("useStoreConfig must be used within a StoreConfigProvider");
  }
  return context;
}
