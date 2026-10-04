import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/storefront/Breadcrumbs";

export const metadata: Metadata = {
  title: "Official Service & RMA Centers | TechHub Bangladesh",
  description: "Find official brand warranty repair and RMA service centers for Asus, HP, Lenovo, Dell, MSI, Apple, Samsung across Dhaka, Chittagong, and Bangladesh.",
};

const serviceCenters = [
  {
    hub: "Central RMA & Repair Lab (Dhaka)",
    address: "Level-8, Multiplan Center, 54 New Elephant Road, Dhaka-1205",
    phone: "+880 9612-TECHHUB / 01734-858200",
    hours: "Saturday – Thursday: 10:00 AM – 8:00 PM (Friday Closed)",
    brandsCovered: "Intel, AMD, Asus, MSI, Gigabyte, Corsair, Razer, Sapphire",
  },
  {
    hub: "Uttara Service Branch",
    address: "House 18, Road 2, Sector 3, Uttara Commercial Area, Dhaka-1230",
    phone: "+880 1844-059123",
    hours: "Saturday – Thursday: 10:30 AM – 7:30 PM",
    brandsCovered: "Laptops, Desktops, Monitors, TP-Link, Samsung Displays",
  },
  {
    hub: "Chittagong Regional RMA Center",
    address: "Yunusco City Centre, Level-5, GEC Circle, Nasirabad, Chattogram",
    phone: "+880 1977-123456",
    hours: "Saturday – Thursday: 10:00 AM – 7:30 PM",
    brandsCovered: "All Authorized Components, Laptops, Keyboards & Networking",
  },
  {
    hub: "Rajshahi Service Point",
    address: "New Market Complex, 2nd Floor, Alokar Mor, Rajshahi-6000",
    phone: "+880 1711-987654",
    hours: "Saturday – Thursday: 10:00 AM – 7:00 PM",
    brandsCovered: "Drop-off & Diagnosis point for North Bengal customers",
  },
];

export default function ServiceCentersPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Service Centers" }]} />

      <main className="mx-auto max-w-[1440px] px-4 pb-8 pt-4 sm:px-6 lg:px-10">
        <div className="rounded-3xl border border-card-border bg-card p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-card-border pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">After-Sales Care</span>
            <h1 className="mt-2 text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              Official Service &amp; RMA Centers
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Need hardware diagnosis or official brand warranty replacement? Visit any of our certified service hubs or track claims online.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Link
              href="/warranty"
              className="inline-flex items-center gap-1.5 rounded-xl border border-card-border bg-surface px-4 py-2.5 text-xs font-bold text-foreground hover:border-primary hover:text-primary transition"
            >
              🔍 Check Serial Warranty
            </Link>
            <Link
              href="/account/rma"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white transition hover:brightness-90 shadow-sm shadow-primary/20"
            >
              🛠️ Submit RMA Ticket
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {serviceCenters.map((center) => (
            <div
              key={center.hub}
              className="flex flex-col justify-between rounded-2xl border border-card-border bg-surface p-6 shadow-xs transition hover:border-primary"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">
                    📍
                  </span>
                  <h2 className="text-base font-bold text-foreground">{center.hub}</h2>
                </div>
                <p className="mt-3 text-xs text-slate-700 leading-relaxed font-medium">
                  {center.address}
                </p>
                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <p>
                    <strong className="text-foreground">Hotline:</strong> {center.phone}
                  </p>
                  <p>
                    <strong className="text-foreground">Working Hours:</strong> {center.hours}
                  </p>
                  <p>
                    <strong className="text-foreground">Authorized Brands:</strong> {center.brandsCovered}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-card-border/60 pt-4 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" /> Certified Technicians
                </span>
                <Link href="/contact" className="font-bold text-primary hover:underline">
                  Directions &amp; Map →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
    </>
  );
}
