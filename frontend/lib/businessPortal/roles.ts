/**
 * Business Portal — Role & Permission Definitions
 *
 * This is the SINGLE SOURCE OF TRUTH for all roles and their nav/feature access.
 * When Laravel RBAC is connected, role strings returned by the API should match
 * these keys exactly (or map to them in lib/businessPortal/auth.ts).
 */

export const PORTAL_ROLES = [
  "admin",
  "inventory_manager",
  "salesman",
  "rma_officer",
  "accountant",
] as const;

export type PortalRole = (typeof PORTAL_ROLES)[number];

export interface RoleMeta {
  label: string;
  /** Sidebar nav hrefs this role can access. '*' means all. */
  allowedModules: string[] | "*";
  /** Avatar initials shown in header */
  initials: string;
  /** Badge color class pair [bg, text] */
  color: [string, string];
}

export const ROLE_META: Record<PortalRole, RoleMeta> = {
  admin: {
    label: "Administrator",
    allowedModules: "*",
    initials: "AD",
    color: ["bg-cyan-600", "text-white"],
  },
  inventory_manager: {
    label: "Inventory Manager",
    // Root overview is always accessible — don't include it here (handled in canAccess)
    allowedModules: [
      "/business-portal/dashboard/catalog",
      "/business-portal/dashboard/inventory",
    ],
    initials: "IM",
    color: ["bg-emerald-600", "text-white"],
  },
  salesman: {
    label: "Salesman",
    allowedModules: [
      "/business-portal/dashboard/pos",
      "/business-portal/dashboard/orders",
      "/business-portal/dashboard/recovery",
    ],
    initials: "SL",
    color: ["bg-violet-600", "text-white"],
  },
  rma_officer: {
    label: "RMA Officer",
    allowedModules: [
      "/business-portal/dashboard/rma",
      "/business-portal/dashboard/inventory",
    ],
    initials: "RO",
    color: ["bg-amber-600", "text-white"],
  },
  accountant: {
    label: "Accountant",
    allowedModules: [
      "/business-portal/dashboard/reports",
      "/business-portal/dashboard/orders",
    ],
    initials: "AC",
    color: ["bg-rose-600", "text-white"],
  },
};

/** Returns true if a role has access to a given module path. */
export function canAccess(role: PortalRole, modulePath: string): boolean {
  // Dashboard root (overview) is accessible to all authenticated roles
  if (modulePath === "/business-portal/dashboard") return true;

  const meta = ROLE_META[role];
  if (!meta) return false;
  if (meta.allowedModules === "*") return true;

  // Exact match OR sub-page of a specific allowed module
  return meta.allowedModules.some(
    (allowed) => modulePath === allowed || modulePath.startsWith(allowed + "/")
  );
}
