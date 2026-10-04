import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function BusinessPortalHome() {
  const session = (await cookies()).get("business_portal_session");
  redirect(session ? "/business-portal/dashboard" : "/business-portal/login");
}