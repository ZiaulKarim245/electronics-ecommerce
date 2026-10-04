import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { canAccess } from "./lib/businessPortal/roles";

const isBusinessSurface = process.env.APP_SURFACE === "business";
const isBusinessDemo = process.env.NODE_ENV !== "production"
  && isBusinessSurface
  && process.env.BUSINESS_DEMO_MODE === "true";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDemoApiRequest = pathname.startsWith("/api/business-demo/");
  const demoCookie = request.cookies.get("business_portal_demo_session")?.value;
  const demoToken = process.env.BUSINESS_DEMO_SESSION_TOKEN ?? "techhub-local-demo-session";
  const hasBusinessSession = isBusinessDemo && demoCookie === demoToken;

  if (isDemoApiRequest) {
    return isBusinessDemo ? NextResponse.next() : new NextResponse("Not Found", { status: 404 });
  }
  if (isBusinessSurface && pathname === "/") {
    const destination = hasBusinessSession
      ? "/business-portal/dashboard"
      : "/business-portal/login";
    return NextResponse.redirect(new URL(destination, request.url));
  }
  if (!isBusinessSurface && pathname.startsWith("/business-portal")) return new NextResponse("Not Found", { status: 404 });
  if (isBusinessSurface && !pathname.startsWith("/business-portal")) return new NextResponse("Not Found", { status: 404 });
  if (isBusinessSurface && pathname.startsWith("/business-portal/dashboard") && !hasBusinessSession) {
    return NextResponse.redirect(new URL("/business-portal/login", request.url));
  }
  if (isBusinessSurface && pathname === "/business-portal/login" && hasBusinessSession) {
    return NextResponse.redirect(new URL("/business-portal/dashboard", request.url));
  }

  // ── RBAC: single source of truth via roles.ts ─────────────────────────────
  if (isBusinessSurface && hasBusinessSession && pathname.startsWith("/business-portal/dashboard")) {
    const roleCookie = request.cookies.get("business_portal_role")?.value ?? "admin";
    if (!canAccess(roleCookie as Parameters<typeof canAccess>[0], pathname)) {
      const dest = new URL("/business-portal/dashboard", request.url);
      dest.searchParams.set("error", "access_denied");
      return NextResponse.redirect(dest);
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"] };
