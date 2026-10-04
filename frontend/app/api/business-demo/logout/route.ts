import { NextResponse } from "next/server";
import { DEMO_SESSION_COOKIE, isBusinessDemoEnabled } from "@/lib/businessPortal/demo";
import { buildRoleCookieClear } from "@/lib/businessPortal/auth";

export async function POST(request: Request) {
  if (!isBusinessDemoEnabled()) return new NextResponse("Not Found", { status: 404 });
  const response = NextResponse.redirect(new URL("/business-portal/login", request.url), 303);
  response.cookies.set(DEMO_SESSION_COOKIE, "", { httpOnly: true, sameSite: "strict", secure: false, path: "/", maxAge: 0 });
  const clear = buildRoleCookieClear();
  response.cookies.set(clear.name, "", clear.options);
  return response;
}
