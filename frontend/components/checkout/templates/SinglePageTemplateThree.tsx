"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import ProductVisual from "@/components/storefront/ProductVisual";
import { CheckoutLoadingSpinner, CheckoutPolicyConsent, CheckoutSubmitError } from "../CheckoutSubmissionControls";
import { type CheckoutLogic } from "../useCheckoutLogic";

export default function SinglePageTemplateThree({ logic }: { logic: CheckoutLogic }) {
  const {
    cartItems, subtotal,
    fullName, setFullName, phone, phoneError, handlePhoneChange, email, setEmail,
    district, handleDistrictChange, availableDistricts, area, setArea, availableAreas,
    address, setAddress,
    sameBillingAddress, setSameBillingAddress, billingAddress, setBillingAddress,
    courierTier, setCourierTier, availableCourierOptions,
    orderNote, setOrderNote, paymentOption, setPaymentOption,
    deliveryCharge, isAdvanceRequired, advanceToPay,
    dueOnDelivery, couponDiscount, totalAmount, termsAccepted, setTermsAccepted,
    isSubmitting, submitError, handleOrderSubmit, isPhoneValid, isEmailValid,
    isContactValid, isShippingValid,
  } = logic;
  const [showErrors, setShowErrors] = useState(false);

  const addressParts = [address.trim(), area.trim(), district.trim()].filter(Boolean);
  const fullAddressPreview = addressParts.length > 0 ? `${addressParts.join(", ")}.` : "";

  const inputRefs = useRef<{
    fullName: HTMLInputElement | null;
    phone: HTMLInputElement | null;
    email: HTMLInputElement | null;
    district: HTMLSelectElement | null;
    area: HTMLSelectElement | null;
    address: HTMLInputElement | null;
  }>({
    fullName: null,
    phone: null,
    email: null,
    district: null,
    area: null,
    address: null,
  });

  const checkoutValid = isContactValid && isShippingValid && paymentOption === "COD";
  const selectedCourierLabel = availableCourierOptions.find((option) => option.value === courierTier)?.label
    ?? availableCourierOptions[0].label;
  const lineCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const regularSubtotal = cartItems.reduce(
    (sum, item) => sum + (item.regularPrice && item.regularPrice > item.price ? item.regularPrice : item.price) * item.quantity,
    0,
  );
  const totalDiscount = Math.max(0, regularSubtotal - subtotal) + couponDiscount;

  const submitCheckout = (event: React.FormEvent<HTMLFormElement>) => {
    if (!checkoutValid) {
      event.preventDefault();
      setShowErrors(true);

      // Focus and smoothly scroll to the first invalid field
      let target: HTMLElement | null = null;
      if (fullName.trim().length < 2) {
        target = inputRefs.current.fullName;
      } else if (!isPhoneValid || Boolean(phoneError)) {
        target = inputRefs.current.phone;
      } else if (!isEmailValid) {
        target = inputRefs.current.email;
      } else if (!district) {
        target = inputRefs.current.district;
      } else if (!area) {
        target = inputRefs.current.area;
      } else if (address.trim().length < 5) {
        target = inputRefs.current.address;
      }

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.focus({ preventScroll: true });
      }
      return;
    }
    handleOrderSubmit(event);
  };

  return (
    <form onSubmit={submitCheckout} aria-busy={isSubmitting} className="mx-auto max-w-2xl space-y-6 pb-12">
      <fieldset disabled={isSubmitting} className="contents">
        {/* Order Summary Dropdown */}
        <details className="group rounded-2xl border border-card-border bg-card shadow-xs">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary/40">
            <span className="text-sm font-bold text-foreground">
              Order summary <span className="font-normal text-muted">({lineCount} {lineCount === 1 ? "item" : "items"})</span>
            </span>
            <span className="flex items-center gap-2 text-sm font-black text-secondary">
              ৳{totalAmount.toLocaleString()} <span className="transition group-open:rotate-180">⌄</span>
            </span>
          </summary>
          <div className="border-t border-card-border">
            <div className="max-h-72 divide-y divide-card-border overflow-y-auto overscroll-contain px-5">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 py-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-surface-border bg-surface p-1.5">
                    <ProductVisual type={item.visualType} className="size-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-xs font-semibold leading-snug text-foreground">{item.title}</p>
                    <p className="mt-1 text-xs text-muted">৳{item.price.toLocaleString()} × {item.quantity}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-foreground">৳{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <dl className="space-y-3 border-t border-card-border bg-surface/50 p-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-bold text-foreground">৳{regularSubtotal.toLocaleString()}</dd>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Discount</dt>
                  <dd className="font-bold text-emerald-700">− ৳{totalDiscount.toLocaleString()}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Delivery charge</dt>
                <dd className="font-bold text-foreground">৳{deliveryCharge.toLocaleString()}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-card-border pt-3">
                <dt className="font-bold text-foreground">Total payable</dt>
                <dd className="text-xl font-black text-secondary">৳{totalAmount.toLocaleString()}</dd>
              </div>
              {isAdvanceRequired && (
                <div className="flex justify-between gap-4 border-t border-card-border pt-3 text-xs">
                  <dt className="text-muted">Due on delivery</dt>
                  <dd className="font-bold text-foreground">৳{dueOnDelivery.toLocaleString()}</dd>
                </div>
              )}
            </dl>
          </div>
        </details>

        {/* Section 1: Contact Details */}
        <section className="rounded-2xl border border-card-border bg-card p-5 shadow-xs sm:p-6" aria-labelledby="contact-heading">
          <SectionHeading id="contact-heading" title="Contact details" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" required error={showErrors && fullName.trim().length < 2 ? "Enter at least 2 characters." : undefined}>
              <input
                ref={(node) => { inputRefs.current.fullName = node; }}
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Enter your full name"
                className={inputClass}
              />
            </Field>
            <Field label="Mobile number" required error={showErrors && (!isPhoneValid || phoneError) ? (phoneError || "Enter a valid Bangladeshi mobile number.") : undefined}>
              <input
                ref={(node) => { inputRefs.current.phone = node; }}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={phone}
                onChange={(event) => handlePhoneChange(event.target.value)}
                placeholder="01XXXXXXXXX"
                className={`${inputClass} ${(showErrors && !isPhoneValid) || phoneError ? "border-red-400 focus:border-red-500 focus:ring-red-100" : ""}`}
              />
            </Field>
            <Field label="Email address" optional className="sm:col-span-2" error={showErrors && !isEmailValid ? "Enter a valid email address." : undefined}>
              <input
                ref={(node) => { inputRefs.current.email = node; }}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        {/* Section 2: Shipping Details */}
        <section className="rounded-2xl border border-card-border bg-card p-5 shadow-xs sm:p-6" aria-labelledby="shipping-heading">
          <SectionHeading id="shipping-heading" title="Shipping details"  />
          <div className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* District Dropdown */}
              <div>
                <label htmlFor="checkout-district-three" className="text-sm font-semibold text-foreground">
                  District <span className="text-primary">*</span>
                </label>
                <div className="relative mt-1.5">
                  <select
                    id="checkout-district-three"
                    ref={(node) => { inputRefs.current.district = node; }}
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
                {showErrors && !district && (
                  <span role="alert" className="mt-1.5 block text-xs font-medium text-red-600">Select your district.</span>
                )}
              </div>

              {/* Area Dropdown */}
              <div>
                <label htmlFor="checkout-area-three" className="text-sm font-semibold text-foreground">
                  Area <span className="text-primary">*</span>
                </label>
                <div className="relative mt-1.5">
                  <select
                    id="checkout-area-three"
                    ref={(node) => { inputRefs.current.area = node; }}
                    required
                    disabled={!district}
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className={`h-11 w-full appearance-none rounded-xl border border-card-border px-3.5 pr-10 text-sm font-normal outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/10 ${
                      !district
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
                {showErrors && district && !area && (
                  <span role="alert" className="mt-1.5 block text-xs font-medium text-red-600">Select your area.</span>
                )}
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <div className="flex flex-wrap items-baseline gap-1.5">
                  <label htmlFor="checkout-address-three" className="text-sm font-semibold text-foreground">
                    Address <span className="text-primary">*</span>
                  </label>
                </div>
                <input
                  ref={(node) => { inputRefs.current.address = node; }}
                  id="checkout-address-three"
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
            </div>

            <fieldset>
              <legend className="text-sm font-semibold text-foreground">Delivery method</legend>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {availableCourierOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-xl border-2 p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-secondary/30 ${
                      courierTier === option.value
                        ? "border-secondary bg-secondary/5"
                        : "border-card-border bg-white hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="minimal-courier"
                      checked={courierTier === option.value}
                      onChange={() => setCourierTier(option.value)}
                      className="sr-only"
                    />
                    <span className="flex justify-between gap-3 text-sm font-bold text-foreground">
                      <span>{option.label}</span>
                      <span className="text-secondary">৳{option.price}</span>
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted">
                      Availability and timing are confirmed after order review.
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>



            <Field label="Order notes" optional>
              <textarea
                rows={2}
                value={orderNote}
                onChange={(event) => setOrderNote(event.target.value)}
                placeholder="Add delivery instructions or another helpful note"
                className={textareaClass}
              />
            </Field>

            {isAdvanceRequired && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs leading-relaxed text-red-800">
                <strong className="font-bold text-red-900">Advance delivery charge required:</strong> An advance courier charge of ৳{advanceToPay.toLocaleString()} is required before dispatch. The remaining ৳{dueOnDelivery.toLocaleString()} is payable on delivery.
              </div>
            )}
          </div>
        </section>

        {/* Section 3: Payment Method */}
        <section className="rounded-2xl border border-card-border bg-card p-5 shadow-xs sm:p-6" aria-labelledby="payment-heading">
          <SectionHeading id="payment-heading" title="Payment method"  />
          <fieldset className="mt-5">
            <legend className="sr-only">Payment method</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={`block cursor-pointer rounded-xl border-2 p-4 transition ${
                  paymentOption === "COD"
                    ? "border-secondary bg-secondary/5"
                    : "border-card-border bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="minimal-payment"
                    checked={paymentOption === "COD"}
                    onChange={() => setPaymentOption("COD")}
                    className="mt-0.5 size-4 accent-secondary"
                  />
                  <div>
                    <p className="text-sm font-bold text-foreground">Cash on delivery</p>
                    <p className="mt-1 text-xs text-muted">Pay in cash when your shipment arrives.</p>
                  </div>
                </div>
              </label>

              <label
                htmlFor="minimal-payment-online"
                className="block cursor-not-allowed rounded-xl border-2 border-card-border bg-slate-50 p-4 opacity-70"
                aria-disabled="true"
              >
                <div className="flex items-start gap-3">
                  <input
                    id="minimal-payment-online"
                    type="radio"
                    name="minimal-payment"
                    disabled
                    aria-describedby="online-payment-help"
                    className="mt-0.5 size-4"
                  />
                  <div>
                    <p className="text-sm font-bold text-foreground">Online payment</p>
                    <p id="online-payment-help" className="mt-1 text-xs text-muted">Available after a secure gateway is connected.</p>
                  </div>
                </div>
              </label>
            </div>
          </fieldset>
          {showErrors && paymentOption !== "COD" && (
            <p role="alert" className="mt-3 text-xs font-semibold text-red-600">Select an available payment method.</p>
          )}
        </section>

        {/* Section 4: Review and Confirm */}
        <section className="rounded-2xl border border-card-border bg-card p-5 shadow-xs sm:p-6" aria-labelledby="review-heading">
          <SectionHeading id="review-heading" title="Review and confirm"  />
          <div className="mt-5 space-y-4">

            <CheckoutPolicyConsent checked={termsAccepted} onChange={setTermsAccepted} />
            <CheckoutSubmitError message={submitError} />
            {showErrors && !checkoutValid && (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                Please fill in all required fields marked above before confirming your order.
              </p>
            )}
            <button
              type="submit"
              disabled={!termsAccepted || isSubmitting}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary px-5 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-hover disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting && <CheckoutLoadingSpinner />}
              {isSubmitting ? "Processing order…" : "Confirm Order"}
            </button>
            <Link href="/cart" className="flex min-h-11 items-center justify-center text-sm font-semibold text-secondary hover:underline">
              Back to cart
            </Link>
          </div>
        </section>
      </fieldset>
    </form>
  );
}

function SectionHeading({ id, title, description }: { id: string; title: string; description?: string }) {
  return (
    <div className="border-b border-card-border pb-3">
      <h2 id={id} className="text-base font-bold text-foreground sm:text-lg">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
    </div>
  );
}

function Field({ label, required, optional, error, className = "", children }: { label: string; required?: boolean; optional?: boolean; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`text-sm font-semibold text-foreground ${className}`}>
      {label} {required && <span className="text-primary">*</span>}{optional && <span className="font-normal text-muted">(optional)</span>}
      {children}
      {error && <span role="alert" className="mt-1.5 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

const inputClass = "mt-1.5 min-h-11 w-full rounded-xl border border-card-border bg-white px-3.5 text-sm font-normal outline-none transition placeholder:text-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/10";
const textareaClass = "mt-1.5 w-full resize-none rounded-xl border border-card-border bg-white px-3.5 py-3 text-sm font-normal outline-none transition placeholder:text-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/10";

function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
