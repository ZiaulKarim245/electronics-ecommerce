import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/storefront/Breadcrumbs";
import OfferBannerPoster from "@/components/storefront/OfferBannerPoster";
import { campaignOffers } from "@/lib/data/offers";

export const metadata: Metadata = {
  title: "Special Offers & Deals",
  description: "Explore the latest exclusive tech deals, seasonal discounts, and promotional campaigns at TechHub Bangladesh.",
};

export default function SpecialOffersPage() {
  return (
    <>
      {/* Reusable Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Special Offers & Campaigns" },
        ]}
      />

      <main className="mx-auto max-w-[1440px] px-4 pb-4 pt-4 sm:px-6 lg:px-10 min-h-[calc(100vh-320px)] sm:min-h-[calc(100vh-280px)] flex flex-col">

        {/* Real Production Ecommerce Offers Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaignOffers.map((offer) => (
            <div
              key={offer.id}
              className="group ecommerce-card-hover flex flex-col justify-between overflow-hidden rounded-2xl border border-card-border bg-card shadow-xs"
            >
              <div>
                {/* 1. Campaign Promotional Poster Banner */}
                <Link
                  href={`/offers/${offer.slug}`}
                  className="block overflow-hidden relative"
                  title={offer.title}
                >
                  <div className="overflow-hidden transition-transform duration-500 group-hover:scale-105">
                    {offer.image ? (
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <Image
                          src={offer.image}
                          alt={offer.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <OfferBannerPoster offer={offer} size="card" className="rounded-none rounded-t-2xl" />
                    )}
                  </div>
                </Link>

                {/* Card Footer */}
                <div className="p-5">
                  {/* Row 1: Title (left) | Location (right) */}
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/offers/${offer.slug}`} className="min-w-0">
                      <h2 className="text-base sm:text-lg font-semibold text-foreground transition-colors group-hover:text-primary leading-snug line-clamp-1">
                        {offer.title}
                      </h2>
                    </Link>
                    <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted pt-0.5">
                      <svg className="size-3.5 text-secondary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <span className="font-semibold text-foreground/85">{offer.location}</span>
                    </div>
                  </div>

                  {/* Row 2: Dates + countdown — full width, separated at bottom */}
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-card-border/80 pt-3 text-xs text-muted font-medium">
                    <div className="flex items-center gap-1.5">
                      <svg className="size-3.5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>{offer.startDate} – {offer.endDate}</span>
                    </div>
                    {offer.countdown && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-400 border border-amber-500/20 font-mono">
                        <svg className="size-3 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{offer.countdown}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
