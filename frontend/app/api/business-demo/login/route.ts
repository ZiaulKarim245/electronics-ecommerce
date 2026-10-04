import { NextResponse } from "next/server";
import { DEMO_SESSION_COOKIE, getBusinessDemoCredentials, getBusinessDemoSessionToken, isBusinessDemoEnabled } from "@/lib/businessPortal/demo";
import { buildRoleCookieOptions } from "@/lib/businessPortal/auth";
import { type PortalRole, ROLE_META } from "@/lib/businessPortal/roles";

export async function POST(request: Request) {
  if (!isBusinessDemoEnabled()) return new NextResponse("Not Found", { status: 404 });

  const form = await request.formData();
  const expected = getBusinessDemoCredentials();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  // Allow demo users to pick a role to test different permission levels
  const roleParam = String(form.get("role") ?? "admin") as PortalRole;
  const role: PortalRole = ROLE_META[roleParam] ? roleParam : "admin";

  const loginUrl = new URL("/business-portal/login", request.url);

  if (email !== expected.email.toLowerCase() || password !== expected.password) {
    loginUrl.searchParams.set("error", "invalid");
    return NextResponse.redirect(loginUrl, 303);
  }

  const response = NextResponse.redirect(new URL("/business-portal/dashboard", request.url), 303);

  // Session cookie (proof of authentication)
  response.cookies.set(DEMO_SESSION_COOKIE, getBusinessDemoSessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  // Role cookie (used by middleware for RBAC without a DB call)
  const roleCookie = buildRoleCookieOptions(role);
  response.cookies.set(roleCookie.name, roleCookie.value, roleCookie.options);

  return response;
}
