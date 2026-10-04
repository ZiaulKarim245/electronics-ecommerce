"use client";

import { useState } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/storefront/Breadcrumbs";

interface WarrantyRecord {
  valid: boolean;
  serial: string;
  productName: string;
  variant: string;
  purchaseDate: string;
  expiryDate: string;
  warrantyDuration: string;
  status: string;
  brandCenter: string;
}

export default function WarrantyCheckPage() {
  const [serialQuery, setSerialQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<WarrantyRecord | null>(null);

  // Mock serial database records
  const mockSerials: { [sn: string]: WarrantyRecord } = {
    "SN-RTX4070-882194": {
      valid: true,
      serial: "SN-RTX4070-882194",
      productName: "NVIDIA GeForce RTX 4070 SUPER 12GB GDDR6X",
      variant: "Official Brand Distributor",
      purchaseDate: "2026-04-12",
      expiryDate: "2029-04-12",
      warrantyDuration: "3 Years Official Warranty",
      status: "Active (Covered)",
      brandCenter: "Smart Technologies / UCC Official Service Center (Dhaka)",
    },
    "SN-R7-7800X-11203": {
      valid: true,
      serial: "SN-R7-7800X-11203",
      productName: "AMD Ryzen 7 7800X3D Gaming Processor",
      variant: "Official Brand Distributor",
      purchaseDate: "2025-11-20",
      expiryDate: "2028-11-20",
      warrantyDuration: "3 Years Official Warranty",
      status: "Active (Covered)",
      brandCenter: "Star Tech / UCC Official AMD RMA Center",
    },
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const cleaned = serialQuery.trim();
    if (mockSerials[cleaned]) {
      setResult(mockSerials[cleaned]);
    } else {
      setResult(null);
    }
  };

  return (
    <>
      {/* Reusable Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Public Serial / IMEI Warranty Verification" },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        {/* Verification Card */}
        <div className="rounded-3xl border border-card-border bg-card p-8 shadow-xs">
        <div className="text-center">
          <span className="flex size-14 mx-auto items-center justify-center rounded-2xl bg-surface text-3xl border border-card-border">
            🛡️
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-foreground">
            Official Serial / IMEI Warranty Check
          </h1>
          <p className="mt-2 text-xs text-muted max-w-md mx-auto">
            Enter your product&apos;s Serial Number (SN) or Smartphone IMEI printed on your retail box or invoice to check real-time warranty validity.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleLookup} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <input
            type="text"
            required
            value={serialQuery}
            onChange={(e) => setSerialQuery(e.target.value)}
            placeholder="e.g. SN-RTX4070-882194 or SN-R7-7800X-11203"
            className="flex-1 min-h-[48px] rounded-2xl border border-card-border bg-surface px-5 py-3 text-base sm:text-xs text-foreground placeholder-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="flex min-h-[48px] items-center justify-center rounded-2xl bg-secondary hover:bg-secondary-hover px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition shrink-0 shadow-sm shadow-secondary/20 active:scale-95"
          >
            Verify Warranty →
          </button>
        </form>

        {/* Quick test pills */}
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-muted">
          <span>Try sample codes:</span>
          <button
            type="button"
            onClick={() => setSerialQuery("SN-RTX4070-882194")}
            className="text-primary hover:underline font-mono"
          >
            SN-RTX4070-882194
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setSerialQuery("SN-R7-7800X-11203")}
            className="text-primary hover:underline font-mono"
          >
            SN-R7-7800X-11203
          </button>
        </div>

        {/* Results Block */}
        {searched && (
          <div className="mt-8 border-t border-card-border pt-6">
            {result ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-card-border pb-4">
                  <div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-300">
                      ✓ {result.status}
                    </span>
                    <h3 className="mt-2 text-base font-bold text-foreground">{result.productName}</h3>
                  </div>
                  <span className="text-xs font-mono text-primary font-bold">{result.serial}</span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div>
                    <p className="text-muted">Warranty Type:</p>
                    <p className="font-bold text-foreground mt-0.5">{result.variant}</p>
                  </div>
                  <div>
                    <p className="text-muted">Duration Coverage:</p>
                    <p className="font-bold text-foreground mt-0.5">{result.warrantyDuration}</p>
                  </div>
                  <div>
                    <p className="text-muted">Purchase Date:</p>
                    <p className="font-semibold text-foreground mt-0.5">{result.purchaseDate}</p>
                  </div>
                  <div>
                    <p className="text-muted">Warranty Expiration:</p>
                    <p className="font-bold text-emerald-700 mt-0.5">{result.expiryDate}</p>
                  </div>
                  <div className="sm:col-span-2 border-t border-card-border pt-3">
                    <p className="text-muted">Authorized RMA Service Partner:</p>
                    <p className="font-bold text-secondary mt-0.5">{result.brandCenter}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-xs">
                <span className="text-3xl">⚠️</span>
                <h3 className="mt-2 font-bold text-rose-900 text-sm">No Warranty Record Found</h3>
                <p className="mt-1 text-rose-800">
                  The Serial / IMEI <strong className="font-mono text-rose-950">{serialQuery}</strong> was not found in the official distributor database.
                </p>
                <p className="mt-2 text-muted">
                  Please check for typing errors, then <Link href="/contact" className="font-bold text-secondary hover:underline">contact support</Link> if you still need help.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
    </>
  );
}
