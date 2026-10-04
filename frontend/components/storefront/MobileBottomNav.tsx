"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompare } from "@/context/CompareContext";

interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const bottomNavItems: BottomNavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: (
      <svg className="size-5 sm:size-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3.2 2.75 11v9.25a.75.75 0 0 0 .75.75h5.25v-6h6.5v6h5.25a.75.75 0 0 0 .75-.75V11L12 3.2Z" />
      </svg>
    ),
  },
  {
    label: "Offers",
    href: "/offers",
    icon: (
      <svg className="size-5 sm:size-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v-1.5A2.25 2.25 0 0 0 9.375 3Zm3.375 3.75h1.875a1.875 1.875 0 1 0 0-3.75 2.25 2.25 0 0 0-1.875 2.25v1.5ZM4.5 8.25A1.5 1.5 0 0 1 6 6.75h12a1.5 1.5 0 0 1 1.5 1.5v1.5a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V8.25ZM5.25 12h5.625v8.25H6A1.5 1.5 0 0 1 4.5 18.75V12h.75Zm7.125 8.25V12h6.375v6.75a1.5 1.5 0 0 1-1.5 1.5h-4.875Z" />
      </svg>
    ),
  },
  {
    label: "PC Builder",
    href: "/pc-builder",
    icon: (
      <svg className="size-5 sm:size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Compare",
    href: "/compare",
    icon: (
      <svg className="size-5 sm:size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="18" r="1.5" fill="currentColor" stroke="none" />
        <path d="M6 16.5V10a4 4 0 0 1 4-4h7" />
        <polyline points="14 3 17 6 14 9" />
        <circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" />
        <path d="M18 7.5V14a4 4 0 0 1-4 4H7" />
        <polyline points="10 15 7 18 10 21" />
      </svg>
    ),
  },
  {
    label: "Account",
    href: "/account/login",
    icon: (
      <svg className="size-5 sm:size-6" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalCompareCount, isLoaded: isCompareLoaded } = useCompare();

  return (
    <nav aria-label="Mobile quick navigation" className="fixed bottom-0 left-0 right-0 z-[70] border-t border-white/10 bg-header/95 backdrop-blur-lg xl:hidden">
      <div className="grid w-full grid-cols-5 items-stretch px-1 sm:px-3">
        {bottomNavItems.map((item) => {
          const isActive = item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-[58px] w-full min-w-0 flex-col items-center justify-center px-1 py-1.5 transition-colors hover:text-primary active:scale-95 ${
                isActive ? "text-primary" : "text-white"
              }`}
            >
              <span className="relative mb-0.5 flex size-5 sm:size-6 shrink-0 items-center justify-center text-current">
                {item.icon}
                {item.href === "/compare" && isCompareLoaded && totalCompareCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white shadow-md">
                    {totalCompareCount}
                  </span>
                )}
              </span>
              <span className="w-full truncate text-center text-[10px] font-bold leading-tight tracking-tight min-[360px]:text-[11px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area inset for phones with home indicators */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
