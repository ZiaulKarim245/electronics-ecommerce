"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PortalIcon, { type PortalIconName } from "./PortalIcon";
import TechHubLogo from "@/components/storefront/TechHubLogo";
import type { PortalSession } from "@/lib/businessPortal/auth";
import { canAccess, ROLE_META } from "@/lib/businessPortal/roles";

const ALL_NAV: { label: string; href: string; icon: PortalIconName }[] = [
  { label: "Overview", href: "/business-portal/dashboard", icon: "dashboard" },
  { label: "Catalog", href: "/business-portal/dashboard/catalog", icon: "catalog" },
  { label: "Inventory & serials", href: "/business-portal/dashboard/inventory", icon: "inventory" },
  { label: "Orders", href: "/business-portal/dashboard/orders", icon: "orders" },
  { label: "Checkout recovery", href: "/business-portal/dashboard/recovery", icon: "recovery" },
  { label: "POS & quotations", href: "/business-portal/dashboard/pos", icon: "pos" },
  { label: "RMA & warranty", href: "/business-portal/dashboard/rma", icon: "rma" },
  { label: "Campaigns", href: "/business-portal/dashboard/campaigns", icon: "campaigns" },
  { label: "Checkout templates", href: "/business-portal/dashboard/checkout-templates", icon: "theme" },
  { label: "Reports", href: "/business-portal/dashboard/reports", icon: "reports" },
  { label: "Team & access", href: "/business-portal/dashboard/team", icon: "team" },
];

interface SidebarProps {
  demoMode: boolean;
  session: PortalSession;
  onNavigate?: () => void;
}

function Sidebar({ demoMode, session, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const roleMeta = ROLE_META[session.role];

  // Filter nav items the current role can access
  const navigation = ALL_NAV.filter((item) => canAccess(session.role, item.href));

  return (
    <div className="flex h-full flex-col bg-slate-950 text-white">
      <div className="border-b border-white/10 px-6 py-6">
        <Link href="/business-portal/dashboard" onClick={onNavigate} className="inline-flex items-center gap-2.5" aria-label="TechHub Business Portal dashboard">
          <TechHubLogo className="h-9 w-auto" variant="light" accessibleLabel="TechHub" />
          <span className="border-l border-white/20 pl-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Business</span>
        </Link>
      </div>
      <nav aria-label="Business portal navigation" className="flex-1 overflow-y-auto px-3 py-5">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const active = item.href === "/business-portal/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-950/20" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
                >
                  <PortalIcon name={item.icon} className="size-5 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-white/10 p-4 space-y-2">
        {/* User card */}
        <div className="rounded-xl bg-white/5 p-3 flex items-center gap-3">
          <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${roleMeta.color[0]} ${roleMeta.color[1]}`}>
            {roleMeta.initials}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-200 truncate">{session.name}</p>
            <p className="text-[10px] text-slate-400">{roleMeta.label}</p>
          </div>
        </div>
        {/* Data source badge */}
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-xs font-bold text-slate-200">Data source</p>
          <p className={`mt-1 flex items-center gap-2 text-[11px] ${demoMode ? "text-violet-300" : "text-amber-300"}`}>
            <span className={`size-1.5 rounded-full ${demoMode ? "bg-violet-400" : "bg-amber-400"}`} />
            {demoMode ? "Local demo data" : "Connected to backend"}
          </p>
        </div>
        {demoMode && (
          <form action="/api/business-demo/logout" method="post">
            <button type="submit" className="min-h-11 w-full rounded-xl border border-white/10 px-3 text-left text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white">
              Sign out
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function PortalShell({
  children,
  demoMode,
  session,
}: {
  children: React.ReactNode;
  demoMode: boolean;
  session: PortalSession;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const roleMeta = ROLE_META[session.role];

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <div className="business-portal-shell min-h-screen bg-slate-100 text-slate-900 lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[280px] lg:block">
        <Sidebar demoMode={demoMode} session={session} />
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close navigation" className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <aside id="business-mobile-navigation" className="relative h-full w-[min(85vw,280px)] shadow-2xl">
            <Sidebar demoMode={demoMode} session={session} onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}

      <div className="min-w-0 lg:col-start-2">
        <header className="sticky top-0 z-40 flex min-h-16 items-center gap-1.5 border-b border-slate-200 bg-white/95 px-3 py-2 backdrop-blur sm:gap-3 sm:px-6 lg:px-8">
          <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open navigation" aria-expanded={menuOpen} aria-controls="business-mobile-navigation" className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden">
            <PortalIcon name="menu" className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="hidden truncate text-sm font-bold min-[390px]:block">Operations workspace</p>
              <p className="truncate text-sm font-bold min-[390px]:hidden">Portal</p>
              {demoMode && <span className="shrink-0 rounded-full bg-violet-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-violet-700 ring-1 ring-violet-200">Demo</span>}
            </div>
            <p className="hidden text-xs text-slate-500 sm:block">Inventory, orders, service and retail control</p>
          </div>
          <button type="button" aria-label="Search portal" className="hidden size-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 sm:flex">
            <PortalIcon name="search" className="size-5" />
          </button>
          <button type="button" aria-label="Notifications" className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
            <PortalIcon name="bell" className="size-5" />
          </button>
          {demoMode && (
            <form action="/api/business-demo/logout" method="post" className="hidden sm:block">
              <button type="submit" className="min-h-10 rounded-lg px-3 text-xs font-bold text-slate-600 hover:bg-slate-100">Sign out</button>
            </form>
          )}
          {/* User avatar with role tooltip */}
          <div
            title={`${session.name} — ${roleMeta.label}`}
            className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-black ${roleMeta.color[0]} ${roleMeta.color[1]}`}
            aria-label={`Signed in as ${session.name}, ${roleMeta.label}`}
          >
            {roleMeta.initials}
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

