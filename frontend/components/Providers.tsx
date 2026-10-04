"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CartProvider } from "@/context/CartContext";
import { StoreConfigProvider } from "@/context/StoreConfigContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CompareProvider } from "@/context/CompareContext";
import { ActionNotificationProvider } from "@/context/ActionNotificationContext";

const SPINNER_FAVICON_URI =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><g><animateTransform attributeName='transform' type='rotate' from='0 16 16' to='360 16 16' dur='0.75s' repeatCount='indefinite'/><circle cx='16' cy='16' r='12' fill='none' stroke='%23dbeafe' stroke-width='3.5'/><path d='M16 4 A12 12 0 0 1 28 16' fill='none' stroke='%231b4382' stroke-width='3.5' stroke-linecap='round'/></g></svg>";

function setTabFavicon(href: string, type: string) {
  if (typeof document === "undefined") return;
  const existingLink = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
  if (existingLink) {
    existingLink.type = type;
    existingLink.href = href;
  } else {
    const newLink = document.createElement("link");
    newLink.rel = "icon";
    newLink.type = type;
    newLink.href = href;
    document.head.appendChild(newLink);
  }
}

function NavigationManager() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Reset tab favicon to standard icon when navigation completes
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      setTabFavicon("/favicon.ico", "image/x-icon");
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;

        const normalize = (p: string) => p.replace(/\/+$/, "") || "/";
        const isSamePath = normalize(url.pathname) === normalize(pathname);
        const isSameSearch = url.search === window.location.search;

        if (isSamePath && isSameSearch) {
          if (window.scrollY > 0) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            router.refresh();
          } else {
            router.refresh();
          }
          setTimeout(() => {
            anchor.blur();
          }, 150);
        } else {
          // Set Browser Tab Title to Loading... & show animated spinning loader favicon
          document.title = "Loading...";
          setTabFavicon(SPINNER_FAVICON_URI, "image/svg+xml");
        }
      } catch {
        // Ignore invalid URL parsing
      }
    };

    window.addEventListener("click", handleClick, true);
    return () => window.removeEventListener("click", handleClick, true);
  }, [pathname, router]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreConfigProvider>
      <CartProvider>
        <WishlistProvider>
          <CompareProvider>
            <ActionNotificationProvider>
              <Suspense fallback={null}>
                <NavigationManager />
              </Suspense>
              {children}
            </ActionNotificationProvider>
          </CompareProvider>
        </WishlistProvider>
      </CartProvider>
    </StoreConfigProvider>
  );
}


