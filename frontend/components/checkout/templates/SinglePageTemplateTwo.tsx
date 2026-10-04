"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ProductVisual from "@/components/storefront/ProductVisual";
import { CheckoutLoadingSpinner, CheckoutPolicyConsent, CheckoutSubmitError } from "../CheckoutSubmissionControls";
import { type CheckoutLogic } from "../useCheckoutLogic";

type SectionKey = "contact" | "shipping" | "payment" | "review";
const sectionOrder: SectionKey[] = ["contact", "shipping", "payment", "review"];

export default function SinglePageTemplateTwo({ logic }: { logic: CheckoutLogic }) {
  const {
    fullName, setFullName, phone, phoneError, handlePhoneChange, email, setEmail,
    district, handleDistrictChange, availableDistricts, area, setArea, availableAreas, address, setAddress,
    sameBillingAddress, setSameBillingAddress, billingAddress, setBillingAddress,
    courierTier, setCourierTier, orderNote, setOrderNote, paymentOption, setPaymentOption,
    deliveryCharge, isAdvanceRequired, advanceToPay,
    dueOnDelivery, totalAmount, termsAccepted, setTermsAccepted, isSubmitting,
    submitError, handleOrderSubmit, availableCourierOptions,
    isPhoneValid, isEmailValid, isContactValid, isShippingValid,
  } = logic;

  const addressParts = [address.trim(), area.trim(), district.trim()].filter(Boolean);
  const fullAddressPreview = addressParts.length > 0 ? `${addressParts.join(", ")}.` : "";

  const [activeSection, setActiveSection] = useState<SectionKey>("contact");
  const [completedSections, setCompletedSections] = useState<SectionKey[]>([]);
  const [attemptedSection, setAttemptedSection] = useState<SectionKey | null>(null);
  const focusTargets = useRef<Partial<Record<SectionKey, HTMLElement | null>>>({});

  const paymentValid = paymentOption === "COD";
  const selectedCourierLabel = availableCourierOptions.find((option) => option.value === courierTier)?.label
    ?? availableCourierOptions[0].label;

  useEffect(() => {
    const target = focusTargets.current[activeSection];
    if (!target) return;
    const frame = requestAnimationFrame(() => target.focus());
    return () => cancelAnimationFrame(frame);
  }, [activeSection]);

  const completed = (section: SectionKey) => completedSections.includes(section);

  const openSection = (section: SectionKey) => {
    const targetIndex = sectionOrder.indexOf(section);
    const firstIncompleteIndex = sectionOrder.findIndex((item) => item !== "review" && !completedSections.includes(item));
    if (firstIncompleteIndex !== -1 && targetIndex > firstIncompleteIndex) return;
    setActiveSection(section);
  };

  const completeSection = (section: SectionKey, next: SectionKey, isValid: boolean) => {
    setAttemptedSection(section);
    if (!isValid) return;
    setCompletedSections((current) => current.includes(section) ? current : [...current, section]);
    setAttemptedSection(null);
    setActiveSection(next);
  };

  const submitCheckout = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isContactValid) { setAttemptedSection("contact"); setActiveSection("contact"); return; }
    if (!isShippingValid) { setAttemptedSection("shipping"); setActiveSection("shipping"); return; }
    if (!paymentValid) { setAttemptedSection("payment"); setActiveSection("payment"); return; }
    handleOrderSubmit(event);
  };

  return (
    <form onSubmit={submitCheckout} aria-busy={isSubmitting} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_425px]">
      <fieldset disabled={isSubmitting} className="contents">
        <div className="space-y-3">
          <div className="mb-4 lg:hidden"><MobileOrderSummary logic={logic} /></div>
          <AccordionSection section="contact" title="Contact details" summary={completed("contact") ? `${fullName} · ${phone}` : ""} activeSection={activeSection} isCompleted={completed("contact")} onOpen={openSection}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required error={attemptedSection === "contact" && fullName.trim().length < 2 ? "Enter at least 2 characters." : undefined}>
                <input ref={(node) => { focusTargets.current.contact = node; }} type="text" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Enter your full name" className={inputClass} />
              </Field>
              <Field label="Mobile number" required error={phoneError || (attemptedSection === "contact" && !isPhoneValid ? "Enter a valid Bangladeshi mobile number." : undefined)}>
                <input type="tel" inputMode="numeric" autoComplete="tel" value={phone} onChange={(event) => handlePhoneChange(event.target.value)} placeholder="01XXXXXXXXX" className={`${inputClass} ${phoneError ? "border-red-400 focus:border-red-500 focus:ring-red-100" : ""}`} />
              </Field>
              <Field label="Email address" optional className="sm:col-span-2" error={attemptedSection === "contact" && !isEmailValid ? "Enter a valid email address." : undefined}>
                <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" className={inputClass} />
              </Field>
            </div>
            <SectionAction label="Continue to shipping" onClick={() => completeSection("contact", "shipping", isContactValid)} />
          </AccordionSection>

          <AccordionSection section="shipping" title="Shipping details" summary={completed("shipping") ? `${[area, district].filter(Boolean).join(", ")} · ${selectedCourierLabel}` : ""} activeSection={activeSection} isCompleted={completed("shipping")} onOpen={openSection}>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* District Dropdown */}
              <div>
                <label htmlFor="checkout-district-two" className="text-sm font-semibold text-foreground">
                  District <span className="text-primary">*</span>
                </label>
                <div className="relative mt-1.5">
                  <select
                    id="checkout-district-two"
                    ref={(node) => { focusTargets.current.shipping = node; }}
                    required
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className={`h-11 w-full appearance-none rounded-xl border px-3.5 pr-10 text-sm font-normal outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/10 cursor-pointer ${attemptedSection === "shipping" && !district
                      ? "border-red-400 focus:border-red-500"
                      : "border-card-border bg-white text-foreground"
                      }`}
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
                {attemptedSection === "shipping" && !district && (
                  <p className="mt-1 text-xs font-semibold text-red-600">Select a district.</p>
                )}
              </div>

              {/* Area Dropdown */}
              <div>
                <label htmlFor="checkout-area-two" className="text-sm font-semibold text-foreground">
                  Area <span className="text-primary">*</span>
                </label>
                <div className="relative mt-1.5">
                  <select
                    id="checkout-area-two"
                    required
                    disabled={!district}
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className={`h-11 w-full appearance-none rounded-xl border px-3.5 pr-10 text-sm font-normal outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/10 ${!district
                      ? "cursor-not-allowed bg-slate-50 text-slate-400 border-card-border"
                      : attemptedSection === "shipping" && !area
                        ? "border-red-400 focus:border-red-500 bg-white text-foreground cursor-pointer"
                        : "border-card-border bg-white text-foreground cursor-pointer"
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
                {attemptedSection === "shipping" && !area && (
                  <p className="mt-1 text-xs font-semibold text-red-600">Select an area or thana.</p>
                )}
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <div className="flex flex-wrap items-baseline gap-1.5">
                  <label htmlFor="checkout-address-two" className="text-sm font-semibold text-foreground">
                    Address <span className="text-primary">*</span>
                  </label>
                </div>
                <input
                  id="checkout-address-two"
                  type="text"
                  autoComplete="street-address"
                  required
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="House, road and area details"
                  className={`mt-1.5 h-11 w-full rounded-xl border bg-white px-3.5 text-sm font-normal text-foreground outline-none transition placeholder:text-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/10 ${attemptedSection === "shipping" && address.trim().length < 2
                    ? "border-red-400 focus:border-red-500"
                    : "border-card-border"
                    }`}
                />
                {attemptedSection === "shipping" && address.trim().length < 2 && (
                  <p className="mt-1 text-xs font-semibold text-red-600">Enter a delivery address.</p>
                )}
              </div>

              {/* Live Address Preview */}
              {fullAddressPreview && (
                <div className="sm:col-span-2 flex items-center gap-2 rounded-xl bg-slate-100/90 px-3.5 py-2.5 text-xs font-semibold text-foreground">
                  <MapPinIcon className="size-4 shrink-0 text-foreground" />
                  <span className="truncate">{fullAddressPreview}</span>
                </div>
              )}
              <fieldset className="sm:col-span-2">
                <legend className="text-sm font-semibold text-foreground">Delivery method</legend>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {availableCourierOptions.map((option) => <label key={option.value} className={`cursor-pointer rounded-xl border-2 p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-secondary/30 ${courierTier === option.value ? "border-secondary bg-secondary/5" : "border-card-border bg-white hover:border-slate-300"}`}><input type="radio" name="accordion-courier" checked={courierTier === option.value} onChange={() => setCourierTier(option.value)} className="sr-only" /><span className="flex justify-between gap-3 text-sm font-bold text-foreground"><span>{option.label}</span><span className="text-secondary">৳{option.price}</span></span><span className="mt-1 block text-xs leading-relaxed text-muted">Availability and timing are confirmed after order review.</span></label>)}
                </div>
              </fieldset>
              <div className="sm:col-span-2">
                <Field label="Order notes" optional>
                  <textarea rows={2} value={orderNote} onChange={(event) => setOrderNote(event.target.value)} placeholder="Add delivery instructions or another helpful note" className={textareaClass} />
                </Field>
              </div>
            </div>
            {isAdvanceRequired && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-relaxed text-red-800"><strong className="font-bold text-red-900">Advance delivery charge required:</strong> An advance courier charge of ৳{advanceToPay.toLocaleString()} is required before dispatch. The remaining ৳{dueOnDelivery.toLocaleString()} is payable on delivery.</div>}
            <SectionAction label="Continue to payment" onClick={() => completeSection("shipping", "payment", isShippingValid)} />
          </AccordionSection>

          <AccordionSection section="payment" title="Payment method" summary={completed("payment") ? "Cash on delivery" : ""} activeSection={activeSection} isCompleted={completed("payment")} onOpen={openSection}>
            <fieldset>
              <legend ref={(node) => { focusTargets.current.payment = node; }} tabIndex={-1} className="text-sm font-semibold text-foreground outline-none">Payment method</legend>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <label className={`cursor-pointer rounded-xl border-2 p-4 transition ${paymentOption === "COD" ? "border-secondary bg-secondary/5" : "border-card-border"}`}><input type="radio" name="accordion-payment" checked={paymentOption === "COD"} onChange={() => setPaymentOption("COD")} className="mr-3 size-4 accent-secondary" /><span className="text-sm font-bold text-foreground">Cash on delivery</span></label>
                <div className="rounded-xl border-2 border-card-border bg-slate-50 p-4 opacity-70" aria-disabled="true"><div className="flex items-center gap-3"><input type="radio" disabled className="size-4" /><span className="text-sm font-bold text-foreground">Online payment</span></div><p className="mt-1 pl-7 text-xs text-muted">Available after a secure gateway is connected.</p></div>
              </div>
            </fieldset>
            {attemptedSection === "payment" && paymentOption !== "COD" && <p role="alert" className="text-xs font-semibold text-red-600">Select an available payment method.</p>}
            <SectionAction label="Review order" onClick={() => completeSection("payment", "review", paymentValid)} />
          </AccordionSection>

          <AccordionSection section="review" title="Review and confirm" summary="" activeSection={activeSection} isCompleted={false} onOpen={openSection}>
            <div ref={(node) => { focusTargets.current.review = node; }} tabIndex={-1} className="space-y-4 outline-none">
              <CheckoutPolicyConsent checked={termsAccepted} onChange={setTermsAccepted} />
              <CheckoutSubmitError message={submitError} />
              <button type="submit" disabled={!termsAccepted || isSubmitting} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary px-5 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-hover disabled:cursor-not-allowed disabled:bg-slate-300">{isSubmitting && <CheckoutLoadingSpinner />}{isSubmitting ? "Processing order…" : `Confirm Order`}</button>
              <Link href="/cart" className="flex min-h-11 items-center justify-center text-sm font-semibold text-secondary hover:underline">Back to cart</Link>
            </div>
          </AccordionSection>
        </div>

        <aside className="hidden lg:sticky lg:top-24 lg:block" aria-label="Order summary"><OrderSummary logic={logic} /></aside>
      </fieldset>
    </form>
  );
}

function AccordionSection({ section, title, summary, activeSection, isCompleted, onOpen, children }: { section: SectionKey; title: string; summary: string; activeSection: SectionKey; isCompleted: boolean; onOpen: (section: SectionKey) => void; children: React.ReactNode }) {
  const isOpen = activeSection === section;
  const panelId = `checkout-${section}-panel`;
  const headingId = `checkout-${section}-heading`;
  return (
    <section className={`overflow-hidden rounded-2xl border bg-card shadow-xs transition ${isOpen ? "border-secondary/40" : "border-card-border"}`}>
      <h2 id={headingId}>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => onOpen(section)}
          className="flex min-h-16 w-full items-center justify-between gap-3 px-4 text-left transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary/40 sm:px-5"
        >
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2 text-sm font-bold text-foreground">
              {title}
              {isCompleted && (
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-black text-emerald-700" aria-label="Completed">
                  ✓
                </span>
              )}
            </span>
            <span className="mt-0.5 block truncate text-xs text-muted">{summary}</span>
          </span>
          {!isOpen && isCompleted && <span className="shrink-0 text-xs font-bold text-secondary">Edit</span>}
        </button>
      </h2>
      {isOpen && <div id={panelId} role="region" aria-labelledby={headingId} className="space-y-5 border-t border-card-border p-4 sm:p-5">{children}</div>}
    </section>
  );
}

function SectionAction({ label, onClick }: { label: string; onClick: () => void }) {
  return <div className="flex justify-end border-t border-card-border pt-4"><button type="button" onClick={onClick} className="min-h-11 rounded-xl bg-secondary px-5 text-sm font-bold text-white transition hover:bg-secondary-hover">{label}</button></div>;
}

function MobileOrderSummary({ logic }: { logic: CheckoutLogic }) {
  const lineCount = logic.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  return <details className="group rounded-2xl border border-card-border bg-card shadow-xs"><summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary/40"><span className="text-sm font-bold text-foreground">Order summary <span className="font-normal text-muted">({lineCount})</span></span><span className="flex items-center gap-2 text-sm font-black text-secondary">৳{logic.totalAmount.toLocaleString()} <span className="transition group-open:rotate-180">⌄</span></span></summary><div className="border-t border-card-border"><OrderSummary logic={logic} embedded /></div></details>;
}

function OrderSummary({ logic, embedded = false }: { logic: CheckoutLogic; embedded?: boolean }) {
  const { cartItems, subtotal, couponDiscount, deliveryCharge, totalAmount, isAdvanceRequired, dueOnDelivery } = logic;
  const lineCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const regularSubtotal = cartItems.reduce((sum, item) => sum + (item.regularPrice && item.regularPrice > item.price ? item.regularPrice : item.price) * item.quantity, 0);
  const catalogDiscount = Math.max(0, regularSubtotal - subtotal);
  const totalDiscount = catalogDiscount + couponDiscount;
  return <div className={embedded ? "bg-card" : "overflow-hidden rounded-2xl border border-card-border bg-card shadow-xs"}>{!embedded && <div className="border-b border-card-border px-5 py-4"><h2 className="text-lg font-bold text-foreground">Order summary</h2><p className="mt-1 text-xs text-muted">{lineCount} {lineCount === 1 ? "item" : "items"}</p></div>}<div className="max-h-80 divide-y divide-card-border overflow-y-auto overscroll-contain px-4">{cartItems.map((item) => <div key={item.id} className="flex gap-3 py-4"><div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-surface-border bg-surface p-1.5"><ProductVisual type={item.visualType} className="size-full" /></div><div className="min-w-0 flex-1"><p className="line-clamp-2 text-xs font-semibold leading-snug text-foreground">{item.title}</p><p className="mt-1 text-xs text-muted">৳{item.price.toLocaleString()} × {item.quantity}</p></div><p className="shrink-0 text-sm font-semibold text-foreground">৳{(item.price * item.quantity).toLocaleString()}</p></div>)}</div><dl className="space-y-3 border-t border-card-border p-4 text-sm"><div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="font-bold text-foreground">৳{regularSubtotal.toLocaleString()}</dd></div>{totalDiscount > 0 && <div className="flex justify-between"><dt className="text-muted">Discount</dt><dd className="font-bold text-emerald-700">− ৳{totalDiscount.toLocaleString()}</dd></div>}<div className="flex justify-between"><dt className="text-muted">Delivery charge</dt><dd className="font-bold text-foreground">৳{deliveryCharge.toLocaleString()}</dd></div><div className="flex items-baseline justify-between border-t border-card-border pt-3"><dt className="font-bold text-foreground">Total payable</dt><dd className="text-xl font-black text-secondary">৳{totalAmount.toLocaleString()}</dd></div>{isAdvanceRequired && <div className="flex justify-between border-t border-card-border pt-3 text-xs"><dt className="text-muted">Due on delivery</dt><dd className="font-bold text-foreground">৳{dueOnDelivery.toLocaleString()}</dd></div>}</dl></div>;
}

function Field({ label, required, optional, error, className = "", children }: { label: string; required?: boolean; optional?: boolean; error?: string; className?: string; children: React.ReactNode }) {
  return <label className={`text-sm font-semibold text-foreground ${className}`}>{label} {required && <span className="text-primary">*</span>}{optional && <span className="font-normal text-muted">(optional)</span>}{children}{error && <span role="alert" className="mt-1.5 block text-xs font-medium text-red-600">{error}</span>}</label>;
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
