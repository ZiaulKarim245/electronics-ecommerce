"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/storefront/Breadcrumbs";
import ProductVisual from "@/components/storefront/ProductVisual";
import { useCart } from "@/context/CartContext";

const MAX_DEMO_QUANTITY = 5;

function TrashIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <line x1="9.5" y1="11" x2="9.5" y2="17" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <line x1="14.5" y1="11" x2="14.5" y2="17" />
    </svg>
  );
}

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, totalCount, isLoaded } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    document.title = "Shopping Cart | TechHub Bangladesh";
  }, []);

  const discount = coupon?.discount ?? 0;
  const total = Math.max(0, subtotal - discount);
  const hasStockIssue = useMemo(
    () => items.some((item) => item.quantity > MAX_DEMO_QUANTITY),
    [items]
  );

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === "TECHHUB500") {
      const applied = { code, discount: Math.min(500, subtotal) };
      setCoupon(applied);
      setCouponMessage("Coupon applied successfully.");
      sessionStorage.setItem("techhub_cart_coupon", JSON.stringify(applied));
      return;
    }
    setCoupon(null);
    setCouponMessage(code ? "This coupon is invalid or expired." : "Enter a coupon code first.");
    sessionStorage.removeItem("techhub_cart_coupon");
  };

  const proceedToCheckout = () => {
    if (!items.length || hasStockIssue) return;
    sessionStorage.setItem("techhub_cart_reviewed", "true");
    router.push("/checkout");
  };

  if (!isLoaded) {
    return (
      <main className="mx-auto max-w-[1440px] px-4 pb-12 pt-4 sm:px-6 lg:px-10" aria-busy="true">
        <div className="h-8 w-44 animate-pulse rounded-lg bg-slate-200" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="h-72 animate-pulse rounded-2xl bg-white" />
          <div className="h-80 animate-pulse rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shopping Cart" }]} />
      <main className="mx-auto max-w-[1440px] px-4 pb-4 pt-4 sm:px-6 lg:px-10 min-h-[calc(100vh-320px)] sm:min-h-[calc(100vh-280px)] flex flex-col">

        {items.length === 0 ? (
          <section className="flex min-h-[380px] sm:min-h-[440px] flex-col items-center justify-center rounded-2xl border border-dashed border-card-border bg-card px-4 py-12 text-center shadow-xs sm:py-16 w-full">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-surface-border bg-surface text-slate-400" aria-hidden="true">
              <svg
                className="size-8 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-base font-bold text-foreground sm:text-lg">Your cart is empty</h2>
            <p className="mt-2 text-xs text-muted sm:text-sm">Browse products and add the items you want to purchase.</p>
            <div className="mt-6">
              <Link href="/" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-secondary px-8 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-hover active:scale-[0.98]">
                Continue Shopping
              </Link>
            </div>
          </section>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <section className="overflow-hidden rounded-2xl border border-card-border bg-card shadow-xs" aria-labelledby="cart-products-title">
              {/* Header with "Cart (X item/items)" on left and "Clear All" with trash icon on right */}
              <div className="flex items-center justify-between border-b border-card-border px-5 py-4">
                <h2 id="cart-products-title" className="text-base sm:text-lg font-bold text-foreground">
                  Your Products ({totalCount} {totalCount === 1 ? "item" : "items"})
                </h2>
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 transition active:scale-95"
                  title="Clear all items in cart"
                >
                  <TrashIcon className="size-4 text-red-600" />
                  <span>Clear All</span>
                </button>
              </div>

              <ul className="divide-y divide-card-border">
                {items.map((item) => {
                  const atLimit = item.quantity >= MAX_DEMO_QUANTITY;
                  const regular = item.regularPrice ?? (item.price > 50000 ? item.price + 8000 : Math.round(item.price * 1.08));
                  const itemSavings = (regular - item.price) * item.quantity;

                  return (
                    <li key={item.id} className="p-4 sm:p-6">
                      <div className="grid grid-cols-[76px_minmax(0,1fr)] gap-4 sm:grid-cols-[104px_minmax(0,1fr)_auto] sm:items-center">
                        <Link href={`/products/${item.slug}`} className="flex aspect-square items-center justify-center rounded-xl border border-surface-border bg-surface p-2" aria-label={`View ${item.title}`}>
                          <ProductVisual type={item.visualType} className="size-full" />
                        </Link>

                        <div className="min-w-0">
                          <Link href={`/products/${item.slug}`} className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition hover:text-primary sm:text-base">
                            {item.title}
                          </Link>
                          <p className="mt-1 text-xs text-muted">Warranty: {item.warranty}</p>

                          {/* Price Display matching Image 1: Bold Red Price + Strikethrough + Pill "Save: ৳X" */}
                          <div className="mt-2.5 flex flex-wrap items-center gap-2 sm:gap-2.5">
                            <span className="text-base sm:text-lg font-extrabold text-red-600 tracking-tight">
                              ৳{(item.price * item.quantity).toLocaleString()}
                            </span>
                            {regular > item.price && (
                              <span className="text-xs sm:text-sm text-slate-500 line-through decoration-slate-400">
                                ৳{(regular * item.quantity).toLocaleString()}
                              </span>
                            )}
                            {itemSavings > 0 && (
                              <span className="inline-flex items-center rounded-full bg-[#e6f7ee] px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-emerald-800">
                                Save: ৳{itemSavings.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Counter & Remove matching Image 4 */}
                        <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end sm:gap-2">
                          <div className="inline-flex h-8 sm:h-8.5 items-stretch rounded-md border border-slate-300 bg-white overflow-hidden" aria-label={`Quantity for ${item.title}`}>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="flex w-8 sm:w-8.5 items-center justify-center border-r border-slate-300 text-base font-semibold text-slate-600 transition hover:bg-slate-50 active:bg-slate-100"
                              aria-label={`Decrease quantity of ${item.title}`}
                            >
                              −
                            </button>
                            <span className="flex min-w-8 sm:min-w-9 items-center justify-center border-r border-slate-300 px-2 text-center text-xs sm:text-sm font-semibold text-slate-800" aria-live="polite">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => !atLimit && updateQuantity(item.id, 1)}
                              disabled={atLimit}
                              className="flex w-8 sm:w-8.5 items-center justify-center text-base font-semibold text-slate-600 transition hover:bg-slate-50 active:bg-slate-100 disabled:text-slate-300"
                              aria-label={`Increase quantity of ${item.title}`}
                            >
                              +
                            </button>
                          </div>

                          {/* Trash Icon + Remove button (Image 4 bottom) */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="flex items-center gap-1.5 py-0.5 text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 transition active:scale-95"
                            aria-label={`Remove ${item.title} from cart`}
                          >
                            <TrashIcon className="size-3.5 sm:size-4 text-red-600" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                      {atLimit && <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">Maximum available quantity reached.</p>}
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Order Summary matching Image 2 */}
            <aside className="rounded-2xl border border-card-border bg-card shadow-xs lg:sticky lg:top-28" aria-labelledby="order-summary-title">
              <div className="border-b border-card-border px-5 py-4">
                <h2 id="order-summary-title" className="text-lg font-bold text-foreground">Order Summary</h2>
              </div>
              <div className="space-y-4 p-5">
                <dl className="space-y-3.5 text-sm">
                  {/* Subtotal formatted with (X item/items) */}
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-600">Subtotal</dt>
                    <dd className="font-bold text-slate-900">
                      ৳{items.reduce((sum, item) => {
                        const regular = item.regularPrice ?? (item.price > 50000 ? item.price + 8000 : Math.round(item.price * 1.08));
                        return sum + regular * item.quantity;
                      }, 0).toLocaleString()}.00
                    </dd>
                  </div>

                  {/* Discount line in Green: - ৳X */}
                  {(() => {
                    const catalogDiscount = items.reduce((sum, item) => {
                      const regular = item.regularPrice ?? (item.price > 50000 ? item.price + 8000 : Math.round(item.price * 1.08));
                      return sum + (regular - item.price) * item.quantity;
                    }, 0);
                    const totalSavings = catalogDiscount + discount;

                    if (totalSavings > 0) {
                      return (
                        <div className="flex justify-between gap-4">
                          <dt className="text-slate-600">Discount</dt>
                          <dd className="font-bold text-emerald-700">
                            - ৳{totalSavings.toLocaleString()}.00
                          </dd>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Shipping: Calculated later */}
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-600">Delivery charge</dt>
                    <dd className="text-slate-500">Add on checkout</dd>
                  </div>

                  {/* Estimated Total */}
                  <div className="flex justify-between gap-4 border-t border-card-border pt-4 text-base sm:text-lg">
                    <dt className="font-bold text-slate-900">Estimated Total</dt>
                    <dd className="font-black text-secondary">৳{total.toLocaleString()}.00</dd>
                  </div>
                </dl>

                <div className="border-t border-card-border pt-4">
                  <label htmlFor="cart-coupon" className="text-sm font-bold text-foreground">Promo code</label>
                  <div className="mt-2 flex gap-2">
                    <input id="cart-coupon" value={couponInput} onChange={(event) => setCouponInput(event.target.value)} placeholder="Enter code" className="min-w-0 flex-1 rounded-xl border border-card-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-secondary" />
                    <button type="button" onClick={applyCoupon} className="min-h-11 rounded-xl bg-slate-100 px-4 text-sm font-bold text-secondary transition hover:bg-slate-200">Apply</button>
                  </div>
                  {couponMessage && <p className={`mt-2 text-xs ${coupon ? "text-emerald-700" : "text-red-600"}`} role="status">{couponMessage}</p>}
                </div>

                <button type="button" onClick={proceedToCheckout} disabled={hasStockIssue} className="flex min-h-12 w-full items-center justify-center rounded-xl bg-secondary px-5 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-hover disabled:bg-slate-300">
                  Proceed to checkout
                </button>
                <Link href="/" className="flex min-h-11 items-center justify-center text-sm font-semibold text-secondary hover:underline">Continue shopping</Link>
              </div>
            </aside>
          </div>
        )}
      </main>

      {confirmClear && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/55 p-4" role="dialog" aria-modal="true" aria-labelledby="clear-cart-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 id="clear-cart-title" className="text-xl font-bold text-foreground">Clear your cart?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">This removes every item from your cart. This action cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmClear(false)} className="min-h-11 rounded-xl border border-card-border px-4 text-sm font-semibold text-foreground hover:bg-slate-50">Keep items</button>
              <button type="button" onClick={() => { clearCart(); setConfirmClear(false); }} className="min-h-11 rounded-xl bg-red-600 px-4 text-sm font-bold text-white hover:bg-red-700">Clear cart</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
