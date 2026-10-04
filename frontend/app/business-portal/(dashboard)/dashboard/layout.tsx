import type { Metadata } from "next";
import PortalShell from "@/components/business-portal/PortalShell";
import { isBusinessDemoEnabled } from "@/lib/businessPortal/demo";
import { requireServerSession } from "@/lib/businessPortal/auth";

export const metadata: Metadata = { 
  title: { default: "Business Portal | TechHub Bangladesh", template: "%s | TechHub Bangladesh" } 
};

export default async function BusinessPortalDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireServerSession();
  return (
    <PortalShell demoMode={isBusinessDemoEnabled()} session={session}>
      {children}
    </PortalShell>
  );
}

