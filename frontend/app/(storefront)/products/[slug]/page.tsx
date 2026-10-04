"use client";

import { useState, useEffect } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import Link from "next/link";

import ProductVisual from "@/components/storefront/ProductVisual";
import Breadcrumbs from "@/components/storefront/Breadcrumbs";
import { getProductBySlug, mockCatalog } from "@/lib/data/catalog";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useActionNotification } from "@/context/ActionNotificationContext";

export default function ProductDetailPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { showNotification } = useActionNotification();

  const [quantity, setQuantity] = useState<number>(1);
  const [paymentOption, setPaymentOption] = useState<"cash" | "emi">("cash");
  const [activeTab, setActiveTab] = useState<"specs" | "description" | "questions" | "reviews">("specs");
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questionSubmitted, setQuestionSubmitted] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const params = useParams();
  const slug = params?.slug as string;

  const product = getProductBySlug(slug);

  useEffect(() => {
    if (product?.title) {
      document.title = `${product.title} | TechHub Bangladesh`;
    }
  }, [product?.title]);

  if (!product) {
    return notFound();
  }

  const inWishlist = isInWishlist(product.id) || isInWishlist(product.slug);
  const inCompare = isInCompare ? (isInCompare(product.id) || isInCompare(product.slug)) : false;

  const price = product.officialWarranty.price;
  const regularPrice = product.officialWarranty.regularPrice;
  const warrantyDuration = product.officialWarranty.duration;
  const saveAmount = regularPrice > price ? regularPrice - price : 0;
  const monthlyEmi = Math.round(regularPrice / 12);
  const productCode = product.model || `TH-${product.id + 52800}`;

  // Sourced similar products from the same category or brand, with catalog fallback to ensure items are always displayed
  const matchingProducts = mockCatalog.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand)
  );
  const fallbackProducts = mockCatalog.filter(
    (p) => p.id !== product.id && !matchingProducts.some((m) => m.id === p.id)
  );
  const similarProducts = [...matchingProducts, ...fallbackProducts].slice(0, 5);

  const handleAddToCart = (redirect = false) => {
    addToCart(
      {
        id: product.id,
        title: product.title,
        price: price,
        regularPrice: regularPrice,
        warranty: warrantyDuration,
        slug: product.slug,
        visualType: product.visualType,
      },
      quantity
    );

    if (redirect) {
      router.push("/cart");
    } else {
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2000);
      showNotification({
        id: product.id,
        type: "cart",
        status: "success",
        title: "Success",
        message: "Product successfully added to your cart.",
      });
    }
  };

  const scrollToSpecification = () => {
    setActiveTab("specs");
    const specElem = document.getElementById("tabbed-details");
    if (specElem) {
      specElem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleAskQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setQuestionSubmitted(true);
    setTimeout(() => {
      setQuestionModalOpen(false);
      setQuestionText("");
      setQuestionSubmitted(false);
      showNotification({
        title: "Question Submitted",
        message: "Your question has been received. Our technical team will respond shortly.",
        status: "success",
      });
    }, 800);
  };

  return (
    <>
      {/* Reusable SEO-Structured Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: product.category, href: `/products?category=${encodeURIComponent(product.category)}` },
          { label: product.title },
        ]}
      />

      <main className="mx-auto max-w-[1440px] px-3.5 sm:px-6 lg:px-10 pb-16 pt-3 sm:pt-4">
        {/* Top Product Summary Section - Combined Single Grid Card */}
        <div className="rounded-2xl sm:rounded-3xl border border-card-border bg-card p-4 sm:p-6 shadow-xs grid gap-5 md:gap-6 lg:grid-cols-[1fr_1.2fr] items-start">
          {/* Left Column: Product Artwork Showcase */}
          <div className="flex flex-col gap-3">
            <div className="relative flex aspect-square w-full items-center justify-center p-4 sm:p-6">
              <ProductVisual
                type={product.visualType}
                className="size-52 xs:size-60 sm:size-72 md:size-64 lg:size-72 max-w-full max-h-full transition-transform duration-300 hover:scale-105"
              />

              {saveAmount > 0 && (
                <span className="absolute top-4 right-4 sm:top-6 sm:right-6 rounded-md bg-[#027048] px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                  Save ৳{saveAmount.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Title, Meta Table, Key Features, Payment Options & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Product Title */}
              <h1 className="text-xl sm:text-2xl lg:text-[25px] font-semibold text-foreground leading-snug break-words">
                {product.title}
              </h1>

              {/* Production Meta Pill Badges (StarTech & Ryans Production Format) */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
                {/* Price Pill */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-surface border border-card-border/80 px-3.5 py-1.5 shadow-2xs">
                  <span className="font-semibold text-slate-700">Price:</span>
                  <span className="font-bold text-foreground">৳{price.toLocaleString()}</span>
                  {regularPrice > price && (
                    <span className="text-[11px] text-muted line-through">
                      ৳{regularPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Regular Price Pill */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-surface border border-card-border/80 px-3.5 py-1.5 shadow-2xs">
                  <span className="font-semibold text-slate-700">Regular Price:</span>
                  <span className="font-bold text-foreground">৳{regularPrice.toLocaleString()}</span>
                </div>

                {/* Status Pill */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-surface border border-card-border/80 px-3.5 py-1.5 shadow-2xs">
                  <span className="font-semibold text-slate-700">Status:</span>
                  <span className={`font-bold ${product.stockStatus === "In Stock" ? "text-emerald-700" : "text-amber-700"}`}>
                    {product.stockStatus}
                  </span>
                </div>

                {/* Product Code Pill */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-surface border border-card-border/80 px-3.5 py-1.5 shadow-2xs">
                  <span className="font-semibold text-slate-700">Product Code:</span>
                  <span className="font-bold text-foreground">{productCode}</span>
                </div>

                {/* Brand Pill */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-surface border border-card-border/80 px-3.5 py-1.5 shadow-2xs">
                  <span className="font-semibold text-slate-700">Brand:</span>
                  <Link
                    href={`/products?brand=${encodeURIComponent(product.brand)}`}
                    className="font-bold text-foreground hover:text-primary hover:underline transition"
                  >
                    {product.brand}
                  </Link>
                </div>

                {/* Warranty Pill */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-surface border border-card-border/80 px-3.5 py-1.5 shadow-2xs">
                  <span className="font-semibold text-slate-700">Warranty:</span>
                  <span className="font-bold text-foreground">{warrantyDuration}</span>
                </div>
              </div>

              {/* Key Features Section (Directly ABOVE Payment Options) */}
              <div className="mt-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Key Features</h2>
                <ul className="mt-2.5 space-y-1.5 text-xs text-foreground">
                  {product.keyFeatures.map((kf, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />
                      <span className="leading-relaxed">{kf}</span>
                    </li>
                  ))}
                  <li className="pt-1">
                    <button
                      type="button"
                      onClick={scrollToSpecification}
                      className="text-xs font-bold text-secondary hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>View More Info</span>
                      <span>↓</span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Payment Options (Cash Discount vs EMI) */}
              <div className="mt-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-2.5">
                  Payment Options
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Cash Discount Price */}
                  <label
                    onClick={() => setPaymentOption("cash")}
                    className={`relative flex flex-col justify-between rounded-xl border p-3.5 cursor-pointer transition ${paymentOption === "cash"
                      ? "border-secondary bg-secondary/5 ring-1 ring-secondary/30"
                      : "border-card-border bg-surface hover:border-muted"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base sm:text-lg font-black text-foreground">
                          ৳{(price * quantity).toLocaleString()}
                        </span>
                        {saveAmount > 0 && (
                          <span className="text-xs text-muted line-through">
                            ৳{(regularPrice * quantity).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <input
                        type="radio"
                        name="payment_option"
                        checked={paymentOption === "cash"}
                        onChange={() => setPaymentOption("cash")}
                        className="accent-secondary size-4"
                      />
                    </div>
                    <div className="mt-2 text-[11px] font-bold text-foreground">
                      Cash Discount Price
                    </div>
                    <div className="text-[10px] text-muted">Online / Cash on Delivery</div>
                  </label>

                  {/* Option 2: 0% EMI Price */}
                  <label
                    onClick={() => setPaymentOption("emi")}
                    className={`relative flex flex-col justify-between rounded-xl border p-3.5 cursor-pointer transition ${paymentOption === "emi"
                      ? "border-secondary bg-secondary/5 ring-1 ring-secondary/30"
                      : "border-card-border bg-surface hover:border-muted"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base sm:text-lg font-black text-foreground">
                        ৳{monthlyEmi.toLocaleString()}
                        <span className="text-xs font-normal text-muted">/mo</span>
                      </span>
                      <input
                        type="radio"
                        name="payment_option"
                        checked={paymentOption === "emi"}
                        onChange={() => setPaymentOption("emi")}
                        className="accent-secondary size-4"
                      />
                    </div>
                    <div className="mt-2 text-[11px] font-bold text-foreground">
                      Regular Price: ৳{(regularPrice * quantity).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-muted">0% EMI for up to 12 Months***</div>
                  </label>
                </div>
              </div>
            </div>

            {/* Quantity and Actions: Single row with responsive icon-only buttons */}
            <div className="mt-6 sm:mt-8 border-t border-card-border pt-5 sm:pt-6">
              <div className="flex items-center gap-2 sm:gap-2.5 xl:gap-3.5">
                {/* Segmented Quantity Stepper */}
                <div className="inline-flex h-11 sm:h-12 shrink-0 items-stretch divide-x divide-slate-300 rounded-lg border border-slate-300 bg-white shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className={`flex w-7 sm:w-9 xl:w-11 items-center justify-center transition active:bg-slate-100 ${quantity <= 1
                      ? "cursor-not-allowed text-slate-300"
                      : "text-slate-700 hover:bg-slate-50 hover:text-foreground"
                      }`}
                  >
                    <svg
                      className="size-3.5 stroke-[2.8]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" d="M5 12h14" />
                    </svg>
                  </button>
                  <div className="flex w-7 sm:w-9 xl:w-12 items-center justify-center text-xs sm:text-sm font-semibold text-foreground select-none">
                    {quantity}
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    className="flex w-7 sm:w-9 xl:w-11 items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-foreground active:bg-slate-100 transition"
                  >
                    <svg
                      className="size-3.5 stroke-[2.8]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" d="M12 5v14m-7-7h14" />
                    </svg>
                  </button>
                </div>

                {/* Single Primary Add to Cart CTA */}
                <button
                  type="button"
                  onClick={() => handleAddToCart(false)}
                  className={`flex min-h-[44px] sm:min-h-[48px] flex-1 items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-2.5 sm:px-4 xl:px-6 py-2.5 sm:py-3 font-bold transition active:scale-95 shadow-sm text-xs sm:text-sm cursor-pointer ${addedToast
                    ? "bg-emerald-600 text-white"
                    : "bg-secondary hover:bg-secondary-hover text-white shadow-secondary/20"
                    }`}
                >
                  <svg
                    className="size-4 sm:size-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="truncate">{addedToast ? "Add to Cart!" : "Add to Cart"}</span>
                </button>

                {/* Compare Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (!product) return;
                    const alreadyInCompare =
                      inCompare ||
                      (isInCompare && (isInCompare(product.id) || isInCompare(product.slug)));

                    if (alreadyInCompare) {
                      showNotification({
                        id: product.id,
                        type: "compare",
                        status: "error",
                        title: "Error",
                        message: "This product is already in your compare list.",
                      });
                    } else {
                      addToCompare(product);
                      showNotification({
                        id: product.id,
                        type: "compare",
                        status: "success",
                        title: "Success",
                        message: "Product added to your compare list.",
                      });
                    }
                  }}
                  className="btn-compare flex min-h-[44px] sm:min-h-[48px] items-center justify-center gap-2 rounded-lg px-3 xl:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition shrink-0 active:scale-95 cursor-pointer"
                  title="Compare"
                  aria-label="Compare"
                >
                  <svg
                    className="size-4 shrink-0 text-[#1c3554]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="6" cy="18" r="1.5" fill="currentColor" stroke="none" />
                    <path d="M6 16.5V10a4 4 0 0 1 4-4h7" />
                    <polyline points="14 3 17 6 14 9" />
                    <circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" />
                    <path d="M18 7.5V14a4 4 0 0 1-4 4H7" />
                    <polyline points="10 15 7 18 10 21" />
                  </svg>
                  <span className="hidden xl:inline">Compare</span>
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (!product) return;
                    const alreadyInWishlist =
                      inWishlist ||
                      (isInWishlist && (isInWishlist(product.id) || isInWishlist(product.slug)));

                    if (alreadyInWishlist) {
                      showNotification({
                        id: product.id,
                        type: "wishlist",
                        status: "error",
                        title: "Error",
                        message: "This product is already in your wishlist.",
                      });
                    } else {
                      addToWishlist({
                        id: product.id,
                        title: product.title,
                        price: price,
                        regularPrice: regularPrice,
                        inStock: product.stockStatus === "In Stock",
                        warranty: warrantyDuration,
                        slug: product.slug,
                        visualType: product.visualType,
                        category: product.category,
                      });
                      showNotification({
                        id: product.id,
                        type: "wishlist",
                        status: "success",
                        title: "Success",
                        message: "Product successfully added to wishlist.",
                      });
                    }
                  }}
                  className="btn-compare flex min-h-[44px] sm:min-h-[48px] items-center justify-center gap-2 rounded-lg px-3 xl:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition shrink-0 active:scale-95 cursor-pointer"
                  title="Wishlist"
                  aria-label="Wishlist"
                >
                  <svg
                    className="size-4 sm:size-4.5 shrink-0 text-[#1c3554]"
                    viewBox="0 0 24 24"
                    fill={inWishlist ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth={inWishlist ? 1 : 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <span className="hidden xl:inline">Wishlist</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Main Content + Similar Products Sidebar Layout */}
        <div id="tabbed-details" className="mt-4 sm:mt-5 grid gap-4 sm:gap-5 lg:grid-cols-[1fr_310px] items-start scroll-mt-[75px] xl:scroll-mt-[130px]">
          {/* Main Content Area */}
          <div className="space-y-4 sm:space-y-5">
            {/* Tab Navigation */}
            <div className="rounded-2xl border border-card-border bg-card shadow-xs">
              <div className="sticky top-[65px] sm:top-[73px] lg:top-[77px] xl:top-[118px] z-30 flex border-b border-card-border overflow-x-auto no-scrollbar bg-surface/95 backdrop-blur-md px-2 sm:px-4 rounded-t-2xl shadow-2xs transition-all">
                {[
                  { key: "specs" as const, label: "Specification" },
                  { key: "description" as const, label: "Description" },
                  { key: "questions" as const, label: "Questions (0)" },
                  { key: "reviews" as const, label: `Reviews (${product.reviewsCount})` },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`whitespace-nowrap px-4 sm:px-6 py-3.5 text-xs sm:text-sm font-bold transition border-b-2 shrink-0 cursor-pointer ${activeTab === tab.key
                      ? "border-primary text-primary bg-card"
                      : "border-transparent text-muted hover:text-foreground"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-4 sm:p-6">
                {/* Tab 1: Technical Specification */}
                {activeTab === "specs" && (
                  <div id="specification" className="space-y-6">
                    <div className="border-b border-card-border pb-2.5">
                      <h2 className="text-base sm:text-lg font-bold text-foreground">
                        Specification
                      </h2>
                    </div>

                    <div className="space-y-6">
                      {Array.from(new Set(product.specifications.map((s) => s.group))).map((group) => (
                        <div key={group} className="rounded-xl border border-card-border overflow-hidden">
                          <div className="bg-surface px-4 py-2.5 border-b border-card-border">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                              {group}
                            </h3>
                          </div>
                          <table className="w-full text-xs divide-y divide-card-border">
                            <tbody className="divide-y divide-card-border">
                              {product.specifications
                                .filter((s) => s.group === group)
                                .map((spec, i) => (
                                  <tr key={i} className="hover:bg-surface/50 transition">
                                    <td className="w-[140px] sm:w-[220px] p-3 text-muted font-semibold bg-surface/30 align-top">
                                      {spec.key}
                                    </td>
                                    <td className="p-3 text-foreground break-words leading-relaxed">
                                      {spec.value}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 2: Description */}
                {activeTab === "description" && (
                  <div className="space-y-4">
                    <div className="border-b border-card-border pb-2.5">
                      <h2 className="text-base sm:text-lg font-bold text-foreground">
                        Description
                      </h2>
                    </div>

                    <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed space-y-3">
                      <h3 className="text-sm sm:text-base font-bold text-foreground">
                        {product.title}
                      </h3>
                      <p>
                        The <strong>{product.title}</strong> is a high-performance, official warranty solution designed to deliver exceptional reliability and speed. Powered by industry-leading {product.brand} technology, this product is meticulously crafted to satisfy demanding computing, entertainment, and professional workloads.
                      </p>
                      <p>
                        Featuring top-tier specifications including {product.keyFeatures.slice(0, 3).join(", ")}, it guarantees rock-solid thermal efficiency and consistent longevity. TechHub guarantees 100% genuine official stock with full manufacturer authenticity and valid serial/IMEI validation.
                      </p>
                    </div>

                    {product.videoUrl && (
                      <div className="pt-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                          Video Unboxing &amp; Overview
                        </h3>
                        <div className="w-full max-w-2xl aspect-video rounded-xl overflow-hidden border border-card-border bg-header">
                          <iframe
                            src={product.videoUrl}
                            title="Product Video Unboxing"
                            className="w-full h-full"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 3: Questions */}
                {activeTab === "questions" && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-card-border pb-4">
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-foreground">Questions (0)</h2>
                        <p className="text-xs text-muted mt-0.5">
                          Have questions about this product? Get specific details from our technical specialists.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setQuestionModalOpen(true)}
                        className="rounded-lg border border-primary bg-primary/10 px-4 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white transition cursor-pointer"
                      >
                        Ask Question
                      </button>
                    </div>

                    <div className="flex flex-col items-center justify-center p-8 text-center text-muted bg-surface/50 rounded-xl border border-dashed border-card-border">
                      <span className="text-3xl mb-2">💬</span>
                      <p className="text-xs font-medium">There are no questions asked yet.</p>
                      <p className="text-[11px] mt-0.5">Be the first one to ask a question about this product.</p>
                    </div>
                  </div>
                )}

                {/* Tab 4: Reviews */}
                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-card-border pb-4">
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-foreground">
                          Customer Reviews ({product.reviewsCount})
                        </h2>
                        <p className="text-xs text-muted mt-0.5">
                          Verified feedback and ratings from authentic TechHub customers.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          showNotification({
                            title: "Review System",
                            message: "Review submission form will open for verified buyers.",
                            status: "info",
                          });
                        }}
                        className="rounded-lg border border-primary bg-primary/10 px-4 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white transition cursor-pointer"
                      >
                        Write a Review
                      </button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-[200px_1fr]">
                      <div className="rounded-xl bg-surface p-5 text-center border border-card-border self-start">
                        <span className="text-5xl font-black text-primary">{product.rating}</span>
                        <p className="mt-1 text-xs text-amber-500">★★★★★</p>
                        <p className="mt-1 text-[11px] text-muted">
                          Based on {product.reviewsCount} customer reviews
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="rounded-xl border border-card-border bg-surface p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-foreground">Rahim Ahmed (Verified Buyer)</span>
                            <span className="text-[10px] text-muted">2 days ago</span>
                          </div>
                          <p className="mt-1 text-xs text-amber-500">★★★★★</p>
                          <p className="mt-2 text-xs text-muted leading-relaxed">
                            Received genuine official warranty unit with valid serial code. Performance in benchmark tests is exceptional!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SEO FAQ Box: "What is the price in Bangladesh?" */}
            <div className="rounded-2xl border border-card-border bg-card p-4 sm:p-5 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                What is the price of {product.title} in Bangladesh?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                The latest price of <strong>{product.title}</strong> in Bangladesh is <strong>৳{price.toLocaleString()}</strong>. You can buy the {product.title} at the best price from our website with official distributor warranty, or visit any of our experience centers across Dhaka and nationwide.
              </p>
            </div>
          </div>

          {/* Right Column: "Similar Products" Sidebar */}
          <aside className="rounded-2xl border border-card-border bg-card p-4 sm:p-5 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-card-border pb-3">
              Similar Products
            </h3>

            <div className="mt-4 divide-y divide-card-border/80">
              {similarProducts.map((simProd) => {
                const simPrice = simProd.officialWarranty.price;
                const simRegular = simProd.officialWarranty.regularPrice;
                const simSaveAmount = simRegular > simPrice ? simRegular - simPrice : 0;

                return (
                  <div key={simProd.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3">
                    {/* Thumbnail */}
                    <Link
                      href={`/products/${simProd.slug}`}
                      className="size-16 sm:size-18 shrink-0 rounded-lg border border-card-border bg-surface flex items-center justify-center p-1.5 transition hover:opacity-90"
                    >
                      <ProductVisual type={simProd.visualType} className="size-12" />
                    </Link>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-foreground hover:text-primary transition line-clamp-2 leading-snug">
                        <Link href={`/products/${simProd.slug}`}>{simProd.title}</Link>
                      </h4>

                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-xs font-extrabold text-primary">
                          ৳{simPrice.toLocaleString()}
                        </span>
                        {simRegular > simPrice && (
                          <span className="text-[10px] text-muted line-through">
                            ৳{simRegular.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Save amount in green text */}
                      {simSaveAmount > 0 && (
                        <p className="mt-1 text-[11px] font-bold text-emerald-600">
                          Save ৳{simSaveAmount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>

        {/* Ask Question Modal */}
        {questionModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-2xl border border-card-border bg-card p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-card-border pb-3">
                <h3 className="text-sm font-bold text-foreground">Ask Question About This Product</h3>
                <button
                  type="button"
                  onClick={() => setQuestionModalOpen(false)}
                  className="text-muted hover:text-foreground p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAskQuestionSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Your Question
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Ask about warranty, compatibility, stock, or technical specifications..."
                    className="w-full rounded-lg border border-card-border bg-surface p-3 text-xs text-foreground placeholder:text-muted focus:border-secondary focus:ring-1 focus:ring-secondary outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setQuestionModalOpen(false)}
                    className="rounded-lg border border-card-border px-4 py-2 text-xs font-semibold text-muted hover:text-foreground cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={questionSubmitted}
                    className="rounded-lg bg-secondary px-5 py-2 text-xs font-bold text-white hover:bg-secondary-hover transition cursor-pointer"
                  >
                    {questionSubmitted ? "Submitting..." : "Submit Question"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
