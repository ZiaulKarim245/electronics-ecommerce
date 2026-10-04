/**
 * lib/businessPortal/auth.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * SINGLE SOURCE OF TRUTH for Business Portal authentication & session.
 *
 * CURRENT MODE:  reads from a signed session cookie set by the mock login API.
 * FUTURE MODE:   swap getServerSession() to call Laravel /api/user with a
 *                Sanctum Bearer token — everything else stays unchanged.
 *
 * HOW TO SWAP FOR LARAVEL:
 *   1. Replace MOCK_USERS lookup with:
 *        const res = await fetch(`${LARAVEL_URL}/api/user`, {
 *          headers: { Authorization: `Bearer ${token}` },
 *          cache: "no-store",
 *        });
 *        const data = await res.json();
 *        return { id: data.id, name: data.name, email: data.email, role: data.role };
 *   2. Change the cookie name to your Sanctum token cookie.
 *   3. Delete MOCK_USERS below.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_SESSION_COOKIE, getBusinessDemoSessionToken, getBusinessDemoCredentials } from "./demo";
import { type PortalRole, ROLE_META } from "./roles";

// ─── Cookie names ────────────────────────────────────────────────────────────
/** Role stored separately so middleware can read it without a DB call */
export const PORTAL_ROLE_COOKIE = "business_portal_role";

// ─── Session shape ───────────────────────────────────────────────────────────
export interface PortalSession {
  id: string;
  name: string;
  email: string;
  role: PortalRole;
  /** true while using the local mock; false when connected to real backend */
  isMock: boolean;
}

// ─── Mock user store (replaced by Laravel API later) ─────────────────────────
const MOCK_USERS: PortalSession[] = [
  { id: "USR-001", name: "Demo Administrator", email: getBusinessDemoCredentials().email, role: "admin", isMock: true },
];

// ─── Server-side session reader (Server Components & Route Handlers) ──────────

/**
 * Returns the current session or null if the visitor is unauthenticated.
 * Safe to call from Server Components, layouts, and API route handlers.
 *
 * SWAP POINT: replace the mock lookup below with a real API call.
 */
export async function getServerSession(): Promise<PortalSession | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(DEMO_SESSION_COOKIE)?.value;

  if (!sessionToken) return null;

  // ── MOCK: validate against hardcoded session token ────────────────────────
  const expectedToken = getBusinessDemoSessionToken();
  if (sessionToken !== expectedToken) return null;

  // Read role from cookie (set during login to avoid repeated user lookups)
  const roleCookie = cookieStore.get(PORTAL_ROLE_COOKIE)?.value as PortalRole | undefined;
  const role: PortalRole = roleCookie && ROLE_META[roleCookie] ? roleCookie : "admin";

  const user = MOCK_USERS.find((u) => u.role === role) ?? MOCK_USERS[0];
  return { ...user, role };
}

/**
 * Like getServerSession() but throws a redirect instead of returning null.
 * Use in layouts/pages that require authentication.
 */
export async function requireServerSession(): Promise<PortalSession> {
  const session = await getServerSession();
  if (!session) redirect("/business-portal/login");
  return session;
}

// ─── Cookie helper called from login API route ────────────────────────────────
/**
 * Returns the Set-Cookie options for the role cookie.
 * Called by the login API route after authenticating the user.
 */
export function buildRoleCookieOptions(role: PortalRole) {
  return {
    name: PORTAL_ROLE_COOKIE,
    value: role,
    options: {
      httpOnly: true,
      sameSite: "strict" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    },
  };
}

/**
 * Returns cookie clear options for logout.
 */
export function buildRoleCookieClear() {
  return {
    name: PORTAL_ROLE_COOKIE,
    options: {
      httpOnly: true,
      sameSite: "strict" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    },
  };
}
