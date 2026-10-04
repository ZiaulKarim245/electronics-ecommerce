"use client";

import Link from "next/link";
import ProductVisual from "@/components/storefront/ProductVisual";
import { CheckoutLoadingSpinner, CheckoutPolicyConsent, CheckoutSubmitError } from "../CheckoutSubmissionControls";
import { type CheckoutLogic } from "../useCheckoutLogic";

export default function SinglePageTemplateOne({ logic }: { logic: CheckoutLogic }) {
  const {
    cartItems, subtotal, district, handleDistrictChange, availableDistricts,
    phone, phoneError, email, setEmail, area, setArea, availableAreas,
    fullName, setFullName, address, setAddress, orderNote, setOrderNote,
    sameBillingAddress, setSameBillingAddress, billingAddress, setBillingAddress,
    deliveryCharge, isAdvanceRequired, totalAmount, dueOnDelivery,
    couponDiscount, handlePhoneChange, handleOrderSubmit,
    paymentOption, setPaymentOption, isSubmitting, submitError,
    termsAccepted, setTermsAccepted,
  } = logic;

  const addressParts = [address.trim(), area.trim(), district.trim()].filter(Boolean);
  const fullAddressPreview = addressParts.length > 0 ? `${addressParts.join(", ")}.` : "";

  const lineCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const regularSubtotal = cartItems.reduce(
    (sum, item) => sum + (item.regularPrice && item.regularPrice > item.price ? item.regularPrice : item.price) * item.quantity,
    0,
  );

  const catalogDiscount = Math.max(0, regularSubtotal - subtotal);

  const totalDiscount = catalogDiscount + couponDiscount;
  const submitLabel = paymentOption === "Online" ? "Proceed to payment" : "Confirm order";

  return (
    <form
      onSubmit={handleOrderSubmit}
      aria-busy={isSubmitting}
      className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_425px]"
    >
      <fieldset disabled={isSubmitting} className="contents">
        <div className="space-y-5">

          <section className="rounded-2xl border border-card-border bg-card p-5 shadow-xs sm:p-6" aria-labelledby="contact-details-title">
            <SectionHeading id="contact-details-title" title="Contact details" />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required>
                <input type="text" autoComplete="name" required minLength={2} value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Enter your full name" className={inputClass} />
              </Field>
              <Field label="Mobile number" required>
                <input type="tel" inputMode="numeric" autoComplete="tel" required value={phone} onChange={(event) => handlePhoneChange(event.target.value)} placeholder="01XXXXXXXXX" aria-invalid={Boolean(phoneError)} aria-describedby={phoneError ? "checkout-phone-error" : "checkout-phone-help"} className={`${inputClass} ${phoneError ? "border-red-400 focus:border-red-500 focus:ring-red-100" : ""}`} />
                {phoneError ? <span id="checkout-phone-error" className="mt-1.5 block text-xs font-medium text-red-600">{phoneError}</span> : <span></span>}
              </Field>
              <Field label="Email address" optional className="sm:col-span-2">
                <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" className={inputClass} />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-card-border bg-card p-5 shadow-xs sm:p-6" aria-labelledby="shipping-details-title">
            <SectionHeading id="shipping-details-title" title="Shipping details" />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {/* District Dropdown */}
              <div>
                <label htmlFor="checkout-district-one" className="text-sm font-semibold text-foreground">
                  District <span className="text-primary">*</span>
                </label>
                <div className="relative mt-1.5">
                  <select
                    id="checkout-district-one"
                    required
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="h-11 w-full appearance-none rounded-xl border border-card-border bg-white px-3.5 pr-10 text-sm font-normal text-foreground outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/10 cursor-pointer"
                  >
                    <option value="" disabled>Select District</option>
                    {availableDistricts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>

              {/* Area Dropdown */}
              <div>
                <label htmlFor="checkout-area-one" className="text-sm font-semibold text-foreground">
                  Area <span className="text-primary">*</span>
                </label>
                <div className="relative mt-1.5">
                  <select
                    id="checkout-area-one"
                    required
                    disabled={!district}
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className={`h-11 w-full appearance-none rounded-xl border border-card-border px-3.5 pr-10 text-sm font-normal outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/10 ${!district
                        ? "cursor-not-allowed bg-slate-50 text-slate-400"
                        : "bg-white text-foreground cursor-pointer"
                      }`}
                  >
                    <option value="" disabled>Select Area</option>
                    {availableAreas.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <div className="flex flex-wrap items-baseline gap-1.5">
                  <label htmlFor="checkout-address-one" className="text-sm font-semibold text-foreground">
                    Address <span className="text-primary">*</span>
                  </label>
                </div>
                <input
                  id="checkout-address-one"
                  type="text"
                  autoComplete="street-address"
                  required
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="House, road and area details"
                  className="mt-1.5 h-11 w-full rounded-xl border border-card-border bg-white px-3.5 text-sm font-normal text-foreground outline-none transition placeholder:text-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>

              {/* Live Address Preview */}
              {fullAddressPreview && (
                <div className="sm:col-span-2 flex items-center gap-2 rounded-xl bg-slate-100/90 px-3.5 py-2.5 text-xs font-semibold text-foreground">
                  <MapPinIcon className="size-4 shrink-0 text-foreground" />
                  <span className="truncate">{fullAddressPreview}</span>
                </div>
              )}

              <div className="rounded-xl border border-card-border bg-surface p-4 sm:col-span-2">
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-sm font-bold text-foreground">Standard courier delivery</p><p className="mt-1 text-xs leading-relaxed text-muted">Delivery timing and final availability are confirmed after order verification.</p></div>
                  <span className="shrink-0 text-sm font-black text-secondary">৳{deliveryCharge.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-card-border bg-card p-5 shadow-xs sm:p-6" aria-labelledby="payment-method-title">
            <SectionHeading id="payment-method-title" title="Payment method" />

            <div className="mt-5 space-y-3">
              {/* Cash on delivery */}
              <label
                className={`block rounded-xl border-2 p-4 cursor-pointer transition ${paymentOption === "COD"
                    ? "border-secondary bg-secondary/5"
                    : "border-card-border bg-white hover:border-slate-300"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment-method"
                    value="COD"
                    checked={paymentOption === "COD"}
                    onChange={() => setPaymentOption("COD")}
                    className="mt-0.5 size-4 accent-secondary"
                  />
                  <div>
                    <p className="text-sm font-bold text-foreground">Cash on delivery</p>
                  </div>
                </div>
              </label>

              {/* Online payment remains unavailable until a verified gateway is connected. */}
              <label
                className="block cursor-not-allowed rounded-xl border-2 border-card-border bg-slate-50 p-4 opacity-70"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment-method"
                    value="Online"
                    checked={false}
                    disabled
                    onChange={() => setPaymentOption("Online")}
                    className="mt-0.5 size-4 accent-secondary"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">Online payment</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">Available after a secure payment gateway is connected.</p>
                  </div>
                </div>
              </label>
            </div>

            {isAdvanceRequired && paymentOption === "COD" && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-xs leading-relaxed text-red-800">
                <strong className="font-bold text-red-900">Advance delivery charge required:</strong> our team will confirm the ৳{deliveryCharge.toLocaleString()} courier charge before dispatch. The remaining ৳{dueOnDelivery.toLocaleString()} is payable on delivery.
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-card-border bg-card p-5 shadow-xs sm:p-6" aria-labelledby="order-notes-title">
            <h2 id="order-notes-title" className="text-lg font-bold text-foreground">Order notes <span className="text-sm font-normal text-muted">(optional)</span></h2>
            <textarea rows={3} value={orderNote} onChange={(event) => setOrderNote(event.target.value)} placeholder="Add delivery instructions or another helpful note" className={`mt-4 ${textareaClass}`} />
          </section>
        </div>

        <aside className="rounded-2xl border border-card-border bg-card shadow-xs lg:sticky lg:top-24" aria-labelledby="checkout-summary-title">
          <div className="border-b border-card-border px-5 py-4"><h2 id="checkout-summary-title" className="text-lg font-bold text-foreground">Order summary</h2><p className="mt-1 text-xs text-muted">{lineCount} {lineCount === 1 ? "item" : "items"} in this order</p></div>
          <div className="max-h-80 divide-y divide-card-border overflow-y-auto overscroll-contain px-5 pr-1">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 py-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-surface-border bg-surface p-1.5"><ProductVisual type={item.visualType} className="size-full" /></div>
                <div className="min-w-0 flex-1"><p className="line-clamp-2 text-xs font-semibold leading-snug text-foreground">{item.title}</p><p className="mt-1 text-xs text-muted">৳{item.price.toLocaleString()} × {item.quantity}</p></div>
                <p className="shrink-0 text-sm font-semibold text-foreground">৳{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3 border-t border-card-border p-5">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-bold text-foreground">৳{regularSubtotal.toLocaleString()}</dd>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between gap-4 text-muted">
                  <dt>Discount</dt>
                  <dd className="font-bold text-emerald-700">- ৳{totalDiscount.toLocaleString()}</dd>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <dt className="text-muted">Delivery charge</dt>
                <dd className="font-semibold text-foreground">৳{deliveryCharge.toLocaleString()}</dd>
              </div>

              <div className="flex items-baseline justify-between gap-4 border-t border-card-border pt-4">
                <dt className="font-bold text-foreground">Total payable</dt>
                <dd className="text-xl font-black text-secondary">৳{totalAmount.toLocaleString()}</dd>
              </div>

              {isAdvanceRequired && paymentOption === "COD" && (
                <div className="flex justify-between gap-4 border-t border-card-border pt-3 text-xs">
                  <dt className="text-muted">Due on delivery</dt>
                  <dd className="font-bold text-foreground">৳{dueOnDelivery.toLocaleString()}</dd>
                </div>
              )}
            </dl>
            <CheckoutPolicyConsent checked={termsAccepted} onChange={setTermsAccepted} className="py-1" />
            <CheckoutSubmitError message={submitError} />
            <button type="submit" disabled={!termsAccepted || isSubmitting} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary px-5 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-hover disabled:cursor-not-allowed disabled:bg-slate-300">
              {isSubmitting && <CheckoutLoadingSpinner />}
              {isSubmitting ? "Processing order…" : submitLabel}
            </button>
            <Link href="/cart" className="flex min-h-11 items-center justify-center text-sm font-semibold text-secondary hover:underline">Back to cart</Link>
          </div>
        </aside>
      </fieldset>

    </form>
  );
}

const inputClass = "mt-1.5 min-h-11 w-full rounded-xl border border-card-border bg-white px-3.5 text-sm font-normal outline-none transition placeholder:text-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/10";
const textareaClass = "w-full resize-none rounded-xl border border-card-border bg-white px-3.5 py-3 text-sm font-normal outline-none transition placeholder:text-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/10";

function SectionHeading({ id, title, description }: { id: string; title: string; description?: string }) {
  return (
    <div className="border-b border-card-border pb-3">
      <h2 id={id} className="text-lg font-bold text-foreground">{title}</h2>
      {description && <p className="mt-1 text-xs text-muted">{description}</p>}
    </div>
  );
}

function Field({ label, required, optional, className = "", children }: { label: string; required?: boolean; optional?: boolean; className?: string; children: React.ReactNode }) {
  return <label className={`text-sm font-semibold text-foreground ${className}`}>{label} {required && <span className="text-primary">*</span>}{optional && <span className="font-normal text-muted">(optional)</span>}{children}</label>;
}

function ChevronDownIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function MapPinIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  );
}
