import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/storefront/Breadcrumbs";

export const metadata: Metadata = {
  title: "Affiliate & Partner Program | TechHub Bangladesh",
  description: "Join the TechHub Bangladesh Affiliate Program. Earn competitive commissions by sharing computer hardware, gaming gear, and tech products.",
};

export default function AffiliationPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Affiliation Program" }]} />

      <main className="mx-auto max-w-[1440px] px-4 pb-8 pt-4 sm:px-6 lg:px-10">
        <div className="rounded-3xl border border-card-border bg-card p-6 sm:p-10 shadow-xs">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Earn With TechHub</span>
          <h1 className="mt-2 text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            TechHub Affiliate &amp; Creator Program
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Are you a tech YouTuber, hardware reviewer, blog writer, or tech community leader? Partner with TechHub Bangladesh and monetize your tech recommendations with reliable weekly payouts in BDT.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-card-border bg-surface p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-black">
              1
            </div>
            <h2 className="mt-3 text-sm font-bold text-foreground">Sign Up &amp; Get Approved</h2>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Fill out a quick partner form with your social channels or website link. Verification takes under 24 hours.
            </p>
          </div>

          <div className="rounded-2xl border border-card-border bg-surface p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-black">
              2
            </div>
            <h2 className="mt-3 text-sm font-bold text-foreground">Share Custom Tracking Links</h2>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Generate unique affiliate links for laptops, PC components, peripherals, and smartphones with 30-day cookie tracking.
            </p>
          </div>

          <div className="rounded-2xl border border-card-border bg-surface p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-black">
              3
            </div>
            <h2 className="mt-3 text-sm font-bold text-foreground">Earn Up to 5% Commission</h2>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Receive direct bank transfers or bKash / Nagad payouts on every successfully delivered, non-returned customer order.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">Ready to start earning?</h2>
            <p className="mt-1 text-xs text-slate-600">
              Contact our affiliate relations desk at <strong className="text-foreground">affiliate@techhub.com.bd</strong> or submit your channel for review.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:brightness-90 shadow-sm shadow-primary/20 shrink-0"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </main>
    </>
  );
}
