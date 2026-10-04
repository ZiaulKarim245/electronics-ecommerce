"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { campaignOffers, type CampaignOffer } from "@/lib/data/offers";

interface HeroSliderProps {
  initialOffers?: CampaignOffer[];
}

// Helper to filter valid, non-expired offers
function filterValidOffers(offersList: CampaignOffer[]): CampaignOffer[] {
  const now = new Date();
  return offersList.filter((offer) => {
    if (!offer.endDate) return true;
    const end = new Date(offer.endDate);
    return isNaN(end.getTime()) || end >= now;
  });
}

export default function HeroSlider({ initialOffers }: HeroSliderProps) {
  const [offers, setOffers] = useState<CampaignOffer[]>(() => {
    const list = initialOffers && initialOffers.length > 0 ? initialOffers : campaignOffers;
    const valid = filterValidOffers(list);
    return valid.length > 0 ? valid : list;
  });
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Optional: check backend offers if available, preserving fallback
  useEffect(() => {
    if (initialOffers && initialOffers.length > 0) return;
    fetch("/api/storefront/offers")
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
          const valid = filterValidOffers(data.data);
          if (valid.length > 0) {
            setOffers(valid);
            setCurrent(0);
          }
        }
      })
      .catch(() => {
        // Fallback to local campaignOffers silently
      });
  }, [initialOffers]);

  // Auto-rotation after hydration
  useEffect(() => {
    setMounted(true);
    if (offers.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [offers.length]);

  if (!offers.length) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-card-border bg-header shadow-2xl">
      {/* Slides Container */}
      <div className="relative min-h-[300px] sm:min-h-[380px] lg:min-h-[440px]">
        {offers.map((offer, index) => {
          const isActive = index === current;
          return (
            <div
              key={offer.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              } ${offer.bgGradient} overflow-hidden`}
              aria-hidden={!isActive}
            >
              {/* Dynamic Glows */}
              <div
                className="absolute -right-16 -bottom-16 size-80 sm:size-96 rounded-full blur-3xl opacity-40 pointer-events-none"
                style={{ backgroundColor: offer.accentColor || "#ef4a23" }}
              />
              <div
                className="absolute -left-12 -top-12 size-60 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ backgroundColor: offer.accentColor || "#3749bb" }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

              {/* Content Text Overlay */}
              <div className="relative z-10 flex h-full max-w-2xl flex-col justify-center p-6 sm:p-10 lg:p-14 text-white">
                {/* Badges Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white/90 backdrop-blur-md border border-white/10">
                    {offer.campaignTag}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border shadow-xs ${offer.badgeColor}`}
                  >
                    {offer.badge}
                  </span>
                </div>

                {/* Offer Title */}
                <h2 className="mt-3 text-2xl font-black leading-tight tracking-tight text-white drop-shadow-lg sm:mt-4 sm:text-4xl lg:text-5xl lg:leading-[1.1]">
                  {offer.title}
                </h2>

                {/* Bengali / Punchline Subtitle */}
                {offer.bengaliHeadline ? (
                  <p className="mt-2 text-sm font-semibold text-amber-200/95 drop-shadow sm:text-base lg:text-lg">
                    {offer.bengaliHeadline}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-slate-200 drop-shadow sm:text-base lg:text-lg">
                    {offer.subtitle}
                  </p>
                )}

                {/* Highlight Pill */}
                {offer.mainHighlight && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-xs border border-amber-400/30">
                      <span>★</span>
                      <span>{offer.mainHighlight}</span>
                    </span>
                    <span className="text-[11px] text-slate-300/80 font-medium">
                      {offer.startDate} – {offer.endDate}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Indicators (Dots at bottom) */}
      {offers.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                mounted && index === current
                  ? "w-8 bg-primary shadow-md shadow-primary/50"
                  : "w-2.5 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === current ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

