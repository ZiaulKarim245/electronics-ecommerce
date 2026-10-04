import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@/components/storefront/Breadcrumbs";
import ProductCard from "@/components/storefront/ProductCard";
import OfferBannerPoster from "@/components/storefront/OfferBannerPoster";
import { getOfferBySlug, getOfferProducts, campaignOffers } from "@/lib/data/offers";

export async function generateStaticParams() {
  return campaignOffers.map((offer) => ({
    slug: offer.slug,
  }));
}

export default async function OfferDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offer = getOfferBySlug(slug);

  if (!offer) {
    notFound();
  }

  const products = getOfferProducts(offer);

  return (
    <>
      {/* Reusable Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Offers", href: "/offers" },
          { label: offer.title },
        ]}
      />

      <main className="mx-auto max-w-[1440px] px-4 pb-12 pt-4 sm:px-6 lg:px-10">
        {/* Back Link */}
        <div className="mb-4">
          <Link
            href="/offers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted transition hover:text-primary"
          >
            <span>←</span> Back to All Offers
          </Link>
        </div>

        {/* 1. Large Hero Campaign Banner */}
        <section className="overflow-hidden rounded-2xl shadow-md">
          <OfferBannerPoster offer={offer} size="hero" />
        </section>

        {/* 2. Campaign Quick Info Strip */}
        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-card-border bg-card p-4 shadow-xs">
            <p className="text-[11px] font-bold text-muted">Offer Period</p>
            <p className="mt-1 text-xs font-black text-foreground sm:text-sm">
              {offer.startDate} – {offer.endDate}
            </p>
          </div>
          <div className="rounded-2xl border border-card-border bg-card p-4 shadow-xs">
            <p className="text-[11px] font-bold text-muted">Time Remaining</p>
            <p className="mt-1 text-xs font-black text-amber-600 sm:text-sm">
              ⏱️ {offer.countdown}
            </p>
          </div>
          <div className="rounded-2xl border border-card-border bg-card p-4 shadow-xs">
            <p className="text-[11px] font-bold text-muted">Availability</p>
            <p className="mt-1 text-xs font-black text-foreground sm:text-sm">
              🏬 {offer.location}
            </p>
          </div>
          <div className="rounded-2xl border border-card-border bg-card p-4 shadow-xs">
            <p className="text-[11px] font-bold text-muted">Status</p>
            <div className="mt-1 inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-black text-emerald-600 sm:text-sm">
                Active Promotion
              </p>
            </div>
          </div>
        </section>

        {/* 3. Campaign Description & Terms and Conditions (Star Tech / Techland Style) */}
        <section className="mt-8 rounded-2xl border border-card-border bg-card p-6 shadow-xs sm:p-8">
          <div className="border-b border-card-border pb-4">
            <span className="rounded-md bg-secondary/10 px-2.5 py-1 text-xs font-black text-secondary">
              CAMPAIGN DETAILS & GUIDELINES
            </span>
            <h2 className="mt-2 text-lg font-black text-foreground sm:text-xl">
              {offer.title}
            </h2>
            {offer.bengaliHeadline && (
              <p className="mt-1 text-sm font-semibold text-primary">
                {offer.bengaliHeadline}
              </p>
            )}
          </div>

          <div className="mt-4 text-xs leading-relaxed text-muted sm:text-sm">
            <p>{offer.description}</p>
          </div>

          <div className="mt-6 border-t border-card-border pt-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-foreground sm:text-sm">
              Terms & Conditions:
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-muted sm:text-sm">
              {offer.terms.map((term, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-black text-primary">
                    ✓
                  </span>
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. Eligible Products Grid (Star Tech / Techland Style) */}
        <section className="mt-12">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                CAMPAIGN PRODUCTS
              </span>
              <h2 className="text-xl font-black text-foreground sm:text-2xl">
                Eligible Products on Offer
              </h2>
            </div>
            <p className="text-xs text-muted">
              Showing {products.length} qualifying item{products.length === 1 ? "" : "s"} for this deal
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} variant="listing" />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-card-border bg-card p-12 text-center shadow-xs">
              <p className="text-sm font-bold text-foreground">
                All promotional items for this offer are currently being updated.
              </p>
              <p className="mt-1 text-xs text-muted">
                Please visit any of our physical outlets or check back shortly.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
