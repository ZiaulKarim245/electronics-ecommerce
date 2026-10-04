import type { SVGProps } from "react";

export type PortalIconName = "dashboard" | "catalog" | "inventory" | "orders" | "recovery" | "pos" | "rma" | "campaigns" | "reports" | "team" | "theme" | "menu" | "search" | "bell" | "arrow";

const paths: Record<PortalIconName, React.ReactNode> = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  catalog: <><path d="M4 5h16v14H4z" /><path d="M8 9h8M8 13h5" /></>,
  inventory: <><path d="m4 7 8-4 8 4-8 4-8-4Z" /><path d="m4 7 8 4 8-4v10l-8 4-8-4V7Z" /><path d="M12 11v10" /></>,
  orders: <><path d="M6 3h12v18H6z" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
  recovery: <><path d="M4 4v6h6" /><path d="M5.5 15a8 8 0 1 0 1-8.5L4 10" /><path d="M12 8v5l3 2" /></>,
  pos: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4M7 8h5M16 8h1M16 12h1" /></>,
  rma: <><path d="M20 7h-7V3" /><path d="M4 17h7v4" /><path d="M6.5 7a7 7 0 0 1 11.5-1l2 1M17.5 17A7 7 0 0 1 6 18l-2-1" /></>,
  campaigns: <><path d="m3 11 15-6v14L3 13v-2Z" /><path d="M7 14v6h4l1-4" /><path d="M18 9a3 3 0 0 1 0 6" /></>,
  reports: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  team: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2" /><path d="M3 20a6 6 0 0 1 12 0M15 15a5 5 0 0 1 6 5" /></>,
  theme: <><path d="M12 21a9 9 0 1 0 0-18c-4.97 0-9 3.58-9 8a5 5 0 0 0 5 5h1a1 1 0 0 1 1 1c0 1.5 1 4 2 4Z" /><circle cx="7.5" cy="10.5" r="1.5" fill="currentColor" /><circle cx="12" cy="7.5" r="1.5" fill="currentColor" /><circle cx="16.5" cy="10.5" r="1.5" fill="currentColor" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
  arrow: <path d="m9 18 6-6-6-6" />,
};

export default function PortalIcon({ name, ...props }: { name: PortalIconName } & SVGProps<SVGSVGElement>) {
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>{paths[name]}</svg>;
}
