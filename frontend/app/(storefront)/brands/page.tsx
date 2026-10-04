import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/storefront/Breadcrumbs";

export const metadata: Metadata = {
  title: "Official Brands | TechHub Bangladesh",
  description: "Explore top technology & electronics brands available at TechHub Bangladesh with 100% genuine brand warranty.",
};

const topBrands = [
  { name: "Apple", category: "Laptops, Tablets & Smartphones", logo: "🍎", count: "12+ Items" },
  { name: "Intel", category: "Core Processors & ARC Graphics", logo: "🔷", count: "24+ Items" },
  { name: "AMD", category: "Ryzen CPUs & Radeon Graphics", logo: "🔴", count: "18+ Items" },
  { name: "Asus", category: "ROG / TUF Laptops, Mobo & GPU", logo: "⚡", count: "35+ Items" },
  { name: "Samsung", category: "Monitors, SSDs & Smartphones", logo: "📱", count: "28+ Items" },
  { name: "MSI", category: "Gaming Laptops & Motherboards", logo: "🐉", count: "22+ Items" },
  { name: "Gigabyte", category: "AORUS Graphics & Motherboards", logo: "🦅", count: "26+ Items" },
  { name: "Corsair", category: "RAM, Power Supplies & Coolers", logo: "⛵", count: "30+ Items" },
  { name: "Razer", category: "Gaming Mice, Keyboards & Audio", logo: "🐍", count: "16+ Items" },
  { name: "Logitech", category: "Office & Gaming Peripherals", logo: "🖱️", count: "32+ Items" },
  { name: "TP-Link", category: "Routers, Mesh Wi-Fi & Switches", logo: "📶", count: "20+ Items" },
  { name: "Walton", category: "Budget Tablets & Desktops", logo: "🇧🇩", count: "14+ Items" },
];

export default function BrandsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Brands" }]} />

      <main className="mx-auto max-w-[1440px] px-4 pb-8 pt-4 sm:px-6 lg:px-10">
        <div className="rounded-3xl border border-card-border bg-card p-6 sm:p-10 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Authorized Distributors</span>
          <h1 className="mt-2 text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            All Featured Brands
          </h1>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-600 leading-relaxed">
            Shop with absolute confidence. All hardware products from our partnered global brands come with verifiable serial numbers, official distributor stickers, and authentic brand warranty.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {topBrands.map((brand) => (
              <Link
                key={brand.name}
                href={`/products?q=${encodeURIComponent(brand.name)}`}
                className="group ecommerce-card-hover flex flex-col items-center justify-center rounded-2xl border border-card-border bg-surface p-5 text-center shadow-xs"
              >
                <div className="flex size-14 items-center justify-center rounded-2xl bg-card border border-card-border text-2xl shadow-xs group-hover:scale-110 transition-transform">
                  {brand.logo}
                </div>
                <h2 className="mt-3 text-sm font-bold text-foreground group-hover:text-primary transition">
                  {brand.name}
                </h2>
                <p className="mt-1 text-[11px] text-muted line-clamp-1">{brand.category}</p>
                <span className="mt-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {brand.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
