import React from "react";
import type { CampaignOffer } from "@/lib/data/offers";

interface OfferBannerPosterProps {
  offer: CampaignOffer;
  size?: "card" | "hero";
  className?: string;
}

export default function OfferBannerPoster({
  offer,
  size = "card",
  className = "",
}: OfferBannerPosterProps) {
  const isHero = size === "hero";

  return (
    <div
      className={`relative w-full overflow-hidden ${offer.bgGradient} select-none ${
        isHero
          ? "aspect-[21/9] min-h-[220px] sm:min-h-[280px] p-6 sm:p-8 rounded-2xl"
          : "aspect-[16/9] p-4 sm:p-5"
      } flex flex-col justify-between shadow-inner ${className}`}
    >
      {/* Dynamic Background Effects: Radial Glow & Pattern */}
      <div
        className="absolute -right-10 -bottom-10 size-60 rounded-full blur-3xl opacity-45 pointer-events-none"
        style={{ backgroundColor: offer.accentColor }}
      />
      <div
        className="absolute -left-10 -top-10 size-48 rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ backgroundColor: offer.accentColor }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0c_1px,transparent_1px)] [background-size:14px_14px] opacity-40 pointer-events-none" />

      {/* Top Header Row: Badges & Live Countdown */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isHero ? (
            <>
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white/90 backdrop-blur-xs border border-white/10">
                {offer.campaignTag}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider border shadow-xs ${offer.badgeColor}`}
              >
                {offer.badge}
              </span>
            </>
          ) : (
            <span className="inline-flex items-center rounded-md bg-gradient-to-r from-primary to-orange-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
              {offer.discountBadge}
            </span>
          )}
        </div>
      </div>

      {/* Poster Center Body: Authentic Promotional Typography & Graphics */}
      <div className="relative z-10 my-auto py-1">
        <div className="flex flex-col">
          <h3
            className={`font-black uppercase tracking-tight text-white drop-shadow-md leading-tight ${
              isHero ? "text-2xl sm:text-4xl lg:text-5xl" : "text-lg sm:text-xl line-clamp-1"
            }`}
          >
            {offer.title}
          </h3>

          {/* Bengali Sub-Headline / Marketing Punchline */}
          {offer.bengaliHeadline && (
            <p
              className={`mt-1 font-medium text-slate-200/95 drop-shadow-sm leading-snug line-clamp-1 ${
                isHero ? "text-sm sm:text-lg" : "text-[11px] sm:text-xs"
              }`}
            >
              {offer.bengaliHeadline}
            </p>
          )}

          {/* Key Value Proposition / Tag */}
          <div className="mt-2 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-amber-300 backdrop-blur-xs border border-amber-400/30 drop-shadow-sm">
              <span>★</span>
              <span>{offer.mainHighlight}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Poster Bottom Bar */}
      {isHero ? (
        <div className="relative z-10 flex items-center justify-between gap-2 border-t border-white/10 pt-2.5">
          <span className="inline-flex items-center rounded-lg bg-gradient-to-r from-primary to-orange-500 px-2.5 py-1 text-[10px] sm:text-xs font-black uppercase tracking-wider text-white shadow-md">
            {offer.discountBadge}
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-300/90 tracking-wide">
            {offer.location}
          </span>
        </div>
      ) : (
        <div className="relative z-10 flex items-center justify-between gap-2 border-t border-white/10 pt-2 text-[10px]">
          <span className="font-semibold uppercase tracking-wider text-white/80">
            {offer.campaignTag}
          </span>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border ${offer.badgeColor}`}>
            {offer.badge}
          </span>
        </div>
      )}
    </div>
  );
}
