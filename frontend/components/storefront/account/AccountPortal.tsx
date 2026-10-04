"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/storefront/Breadcrumbs";
import {
  requestOtp,
  verifyOtpCode,
  resendOtpCode,
  getCustomerOrder,
  submitRmaClaim,
  isValidLoginIdentifier,
  normalizeLoginIdentifier,
  type CustomerOrder,
  type RmaClaimResponse,
} from "@/lib/api/account";

export type AccountSection = "orders" | "rma";

interface AccountPortalProps {
  initialSection?: AccountSection;
  initiallyAuthenticated?: boolean;
}

type AuthStep = "identifier" | "verify";

interface ImageAttachment {
  name: string;
  url: string;
  size: string;
}

export default function AccountPortal({
  initialSection = "orders",
  initiallyAuthenticated = false,
}: AccountPortalProps) {
  const router = useRouter();

  // Authentication UI state
  const [isLoggedIn, setIsLoggedIn] = useState(initiallyAuthenticated);
  const [authStep, setAuthStep] = useState<AuthStep>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otpDestination, setOtpDestination] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [authError, setAuthError] = useState("");
  const [otpNotice, setOtpNotice] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(60);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const verificationInFlightRef = useRef(false);

  // RMA Form state
  const [rmaSerial, setRmaSerial] = useState("");
  const [rmaProblem, setRmaProblem] = useState("");
  const [rmaAttachments, setRmaAttachments] = useState<ImageAttachment[]>([]);
  const [rmaError, setRmaError] = useState("");
  const [isSubmittingRma, setIsSubmittingRma] = useState(false);
  const [rmaTicket, setRmaTicket] = useState<RmaClaimResponse | null>(null);

  // Customer & Order Data
  const [currentOrder, setCurrentOrder] = useState<CustomerOrder | null>(null);
  const [customerInfo, setCustomerInfo] = useState({ name: "Ziaul Karim", phone: "+880 1712-345678" });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load order data via service layer
    getCustomerOrder().then((order) => {
      setCurrentOrder(order);
    });

    // Check query params for deep-linking
    const params = new URLSearchParams(window.location.search);
    const legacyTab = params.get("tab");
    const track = params.get("track") || params.get("invoice");

    if (window.location.pathname === "/account" && (legacyTab === "orders" || legacyTab === "rma" || track)) {
      const destination = legacyTab === "rma" ? "/account/rma" : "/account/orders";
      const query = track ? `?invoice=${encodeURIComponent(track)}` : "";
      router.replace(`${destination}${query}`);
      return;
    }

    if (track) {
      setIsLoggedIn(true);
    }
  }, [router]);

  useEffect(() => {
    if (authStep !== "verify" || isResendingOtp) return;

    otpInputRef.current?.focus();
    const timer = window.setInterval(() => {
      setResendSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [authStep, isResendingOtp]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSendingOtp) return;

    const trimmed = identifier.trim();
    if (!isValidLoginIdentifier(trimmed)) {
      setAuthError("Enter a valid Bangladeshi mobile number (e.g. 017XXXXXXXX) or email address.");
      return;
    }

    setAuthError("");
    setOtpNotice("");
    setIsSendingOtp(true);

    try {
      const res = await requestOtp(trimmed);
      setOtpDestination(res.destination);
      setResendSeconds(res.resendCooldownSec);
      setAuthStep("verify");
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : "Failed to send verification code.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async (code: string) => {
    if (verificationInFlightRef.current) return;
    if (!/^\d{6}$/.test(code)) {
      setAuthError("Enter the complete 6-digit verification code.");
      return;
    }

    verificationInFlightRef.current = true;
    setAuthError("");
    setIsVerifyingOtp(true);

    try {
      const res = await verifyOtpCode(identifier, code);
      if (res.customer) {
        setCustomerInfo({
          name: res.customer.name,
          phone: res.customer.phone,
        });
      }
      setIsLoggedIn(true);
      router.push("/account/orders");
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : "Invalid code. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
      verificationInFlightRef.current = false;
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    void verifyOtp(otpCode);
  };

  const handleChangeIdentifier = () => {
    setAuthStep("identifier");
    setOtpCode("");
    setAuthError("");
    setOtpNotice("");
  };

  const handleResendOtp = async () => {
    if (resendSeconds > 0 || isResendingOtp) return;

    setIsResendingOtp(true);
    setOtpCode("");
    setAuthError("");
    setOtpNotice("");

    try {
      const res = await resendOtpCode(identifier);
      setResendSeconds(res.resendCooldownSec);
      setOtpNotice(res.message);
      otpInputRef.current?.focus();
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : "Failed to resend code.");
    } finally {
      setIsResendingOtp(false);
    }
  };

  // Attachment upload handler
  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: ImageAttachment[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        setRmaError("Only image files (JPG, PNG, WebP) are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setRmaError(`File ${file.name} exceeds 5MB size limit.`);
        return;
      }

      newAttachments.push({
        name: file.name,
        url: URL.createObjectURL(file),
        size: `${(file.size / 1024).toFixed(0)} KB`,
      });
    }

    setRmaAttachments((prev) => [...prev, ...newAttachments].slice(0, 4));
    setRmaError("");
    e.target.value = "";
  };

  const handleRemoveAttachment = (index: number) => {
    setRmaAttachments((prev) => {
      const target = prev[index];
      if (target?.url.startsWith("blob:")) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleRmaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRma) return;

    const trimmedSerial = rmaSerial.trim();
    const trimmedProblem = rmaProblem.trim();

    if (!trimmedSerial) {
      setRmaError("Please provide the product Serial Number or IMEI.");
      return;
    }

    if (trimmedProblem.length < 10) {
      setRmaError("Please describe the issue in more detail (at least 10 characters).");
      return;
    }

    setRmaError("");
    setIsSubmittingRma(true);

    try {
      const res = await submitRmaClaim({
        serialNumber: trimmedSerial,
        problemDescription: trimmedProblem,
        attachments: rmaAttachments.map((a) => a.url),
      });
      setRmaTicket(res);
    } catch (err: unknown) {
      setRmaError(err instanceof Error ? err.message : "Failed to submit RMA ticket.");
    } finally {
      setIsSubmittingRma(false);
    }
  };

  return (
    <>
      {/* Reusable Breadcrumbs - Hidden on Print */}
      <Breadcrumbs
        className="print:hidden"
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: isLoggedIn ? "/account/orders" : "/account/login" },
          ...(isLoggedIn
            ? [{ label: initialSection === "orders" ? "Orders & Tracking" : "RMA & Warranty Claims" }]
            : [{ label: authStep === "identifier" ? "Login" : "OTP Verification" }]),
        ]}
      />

      {/* Printable Invoice Header (Visible only when printed) */}
      <div className="hidden print:block mb-6 border-b border-black pb-4 text-black">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black tracking-tight">TECHHUB BANGLADESH</h1>
            <p className="text-xs">Multi-Brand Premium Computer & Electronics Retailer</p>
            <p className="text-xs">Support: +880 9612-345678 | support@techhub.com.bd</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold uppercase">Official Retail Invoice</span>
            <p className="text-lg font-mono font-black">{currentOrder?.invoiceNo || "TH-2026-89412"}</p>
            <p className="text-xs">Date: {currentOrder?.date || "Aug 29, 2026"}</p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1440px] px-4 pb-4 pt-4 sm:px-6 lg:px-10 min-h-[calc(100vh-320px)] sm:min-h-[calc(100vh-280px)] flex flex-col justify-center print:min-h-0 print:p-0">
        {!isLoggedIn ? (
          /* ========================================================================= */
          /* AUTHENTICATION & LOGIN FORM                                            */
          /* ========================================================================= */
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-xs sm:p-8">
              <div className="border-b border-card-border pb-5">
                <h1 className="mt-2 text-xl font-black text-foreground sm:text-2xl">
                  {authStep === "identifier" ? "Sign in or create an account" : "Verify your identity"}
                </h1>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {authStep === "identifier"
                    ? "Enter your mobile number or email."
                    : `We sent a 6-digit verification code to ${otpDestination}.`}
                </p>
              </div>

              {authStep === "identifier" ? (
                <form onSubmit={handleSendOtp} className="mt-6 space-y-4" noValidate aria-busy={isSendingOtp}>
                  <div>
                    <label htmlFor="account-identifier" className="text-xs font-bold uppercase tracking-wider text-muted">
                      Mobile number or email <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="account-identifier"
                      type="text"
                      required
                      disabled={isSendingOtp}
                      autoComplete="username"
                      aria-describedby={authError ? "account-auth-error" : undefined}
                      aria-invalid={authError ? true : undefined}
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (authError) setAuthError("");
                      }}
                      placeholder="e.g. 01712345678 or user@domain.com"
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-card-border bg-surface px-4 py-2.5 text-base text-foreground outline-none transition placeholder:text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  {authError && (
                    <p id="account-auth-error" role="alert" className="rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
                      {authError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-sm shadow-secondary/20 transition hover:bg-secondary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-secondary disabled:active:scale-100"
                  >
                    {isSendingOtp ? (
                      <>
                        <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        <span>Sending code…</span>
                      </>
                    ) : (
                      "Send verification code"
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4" noValidate>
                  <div className="flex items-center justify-between gap-4 rounded-xl border border-card-border bg-surface px-4 py-3">
                    <span className="min-w-0 truncate text-sm font-semibold text-foreground">{otpDestination}</span>
                    <button
                      type="button"
                      onClick={handleChangeIdentifier}
                      className="shrink-0 text-xs font-bold text-secondary transition hover:text-secondary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label htmlFor="account-otp" className="text-xs font-bold uppercase tracking-wider text-muted">
                      6-digit verification code <span aria-hidden="true">*</span>
                    </label>
                    <input
                      ref={otpInputRef}
                      id="account-otp"
                      type="text"
                      required
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      aria-describedby={authError ? "account-auth-error" : undefined}
                      aria-invalid={authError ? true : undefined}
                      disabled={isVerifyingOtp}
                      value={otpCode}
                      onChange={(e) => {
                        const nextCode = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setOtpCode(nextCode);
                        if (authError) setAuthError("");
                        if (nextCode.length === 6) void verifyOtp(nextCode);
                      }}
                      placeholder="000000"
                      className="mt-1.5 min-h-[52px] w-full rounded-xl border border-card-border bg-surface px-4 py-3 text-center font-mono text-xl font-bold tracking-[0.4em] text-foreground outline-none transition placeholder:text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/20 disabled:cursor-wait disabled:opacity-70"
                    />
                  </div>

                  {authError && (
                    <p id="account-auth-error" role="alert" className="rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
                      {authError}
                    </p>
                  )}
                  {otpNotice && (
                    <p role="status" className="rounded-lg bg-secondary/10 px-3 py-2 text-xs font-semibold text-secondary">
                      {otpNotice}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isVerifyingOtp}
                    className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-sm shadow-secondary/20 transition hover:bg-secondary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 disabled:hover:bg-secondary disabled:active:scale-100"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        <span>Verifying…</span>
                      </>
                    ) : (
                      "Verify & continue"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendSeconds > 0 || isResendingOtp || isVerifyingOtp}
                    className="mx-auto flex min-h-[44px] items-center justify-center gap-2 px-4 text-xs font-bold text-secondary transition hover:text-secondary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary disabled:cursor-not-allowed disabled:text-muted disabled:no-underline"
                  >
                    {isResendingOtp ? (
                      <>
                        <span aria-hidden="true" className="size-3.5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                        <span>Resending…</span>
                      </>
                    ) : resendSeconds > 0 ? (
                      `Resend available in 00:${String(resendSeconds).padStart(2, "0")}`
                    ) : (
                      "Resend verification code"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* CUSTOMER DASHBOARD & LIVE TRACKING                                     */
          /* ========================================================================= */
          <div className="grid gap-8 lg:grid-cols-[280px_1fr] print:block">
            {/* Left Navigation Card - Hidden when printing */}
            <aside className="rounded-3xl border border-card-border bg-card p-6 shadow-xs h-fit print:hidden">
              <div className="flex items-center gap-3 border-b border-card-border pb-5">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-white font-black text-lg">
                  {customerInfo.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "ZK"}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{customerInfo.name}</h3>
                  <p className="text-xs text-muted font-mono">{customerInfo.phone}</p>
                </div>
              </div>

              <nav className="mt-4 space-y-1 text-xs font-semibold">
                <Link
                  href="/account/orders"
                  aria-current={initialSection === "orders" ? "page" : undefined}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-left transition ${
                    initialSection === "orders"
                      ? "bg-primary/10 text-primary border border-primary/20 font-bold"
                      : "text-foreground hover:bg-surface"
                  }`}
                >
                  <span>📦</span>
                  <span>My Orders &amp; Live Tracking</span>
                </Link>

                <Link
                  href="/account/rma"
                  aria-current={initialSection === "rma" ? "page" : undefined}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-left transition ${
                    initialSection === "rma"
                      ? "bg-primary/10 text-primary border border-primary/20 font-bold"
                      : "text-foreground hover:bg-surface"
                  }`}
                >
                  <span>🛡️</span>
                  <span>RMA &amp; Warranty Claims</span>
                </Link>

                <Link
                  href="/warranty"
                  className="flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-left text-foreground hover:bg-surface transition"
                >
                  <span>🔍</span>
                  <span>Serial / IMEI Verification</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsLoggedIn(false);
                    router.push("/account/login");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-left text-rose-600 hover:bg-rose-50 transition mt-4 border-t border-card-border pt-4"
                >
                  <span>🚪</span>
                  <span>Sign Out</span>
                </button>
              </nav>
            </aside>

            {/* Right Content Area */}
            <section className="space-y-6">
              {/* Tab 1: Orders & Timeline */}
              {initialSection === "orders" && currentOrder && (
                <div className="rounded-3xl border border-card-border bg-card p-6 sm:p-8 shadow-xs print-invoice-card">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-card-border pb-5">
                    <div>
                      <span className="text-xs font-bold text-primary uppercase print:text-black">Recent Order</span>
                      <h2 className="text-lg font-bold text-foreground print:text-black">Invoice: {currentOrder.invoiceNo}</h2>
                      <p className="text-xs text-muted print:text-gray-700">Placed on {currentOrder.date}</p>
                    </div>
                    <div className="flex items-center gap-2 print:hidden">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="rounded-xl border border-card-border bg-surface px-4 py-2 text-xs font-bold text-foreground hover:bg-card transition flex items-center gap-1.5"
                      >
                        <span>📄</span>
                        <span>Download Invoice (PDF)</span>
                      </button>
                    </div>
                  </div>

                  {/* Items & Serial Numbers (SRS 3.1 Anti-Fraud) */}
                  <div className="mt-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted print:text-black">
                      Ordered Units with Bound Serial Codes
                    </h4>
                    <div className="mt-3 divide-y divide-card-border rounded-2xl border border-card-border bg-surface p-4 print:border-black print:bg-white">
                      {currentOrder.items.map((item, i) => (
                        <div key={i} className="flex flex-wrap items-center justify-between py-2.5 text-xs">
                          <div>
                            <p className="font-bold text-foreground print:text-black">{item.name}</p>
                            <p className="text-[11px] text-primary font-mono mt-0.5 print:text-black">
                              Unit Serial / IMEI: {item.serial}
                            </p>
                          </div>
                          <span className="font-black text-foreground print:text-black">৳{item.price.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="pt-3 flex justify-between items-center text-sm font-black">
                        <span>Total Paid</span>
                        <span className="text-primary print:text-black">৳{currentOrder.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Timeline Tracking (SRS 3.1) - Hidden during print */}
                  <div className="mt-8 print:hidden">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
                      Live Dispatch &amp; Delivery Timeline ({currentOrder.courierName})
                    </h4>
                    <p className="text-xs text-muted mt-1">
                      Tracking Number: <span className="font-mono text-primary font-bold">{currentOrder.trackingCode}</span>
                    </p>

                    <div className="mt-6 space-y-6 border-l-2 border-primary/30 pl-6 ml-2">
                      {currentOrder.timeline.map((step, i) => (
                        <div key={i} className="relative">
                          <div
                            className={`absolute -left-[31px] top-0 flex size-4 items-center justify-center rounded-full ${
                              step.completed
                                ? "bg-primary ring-4 ring-primary/20"
                                : "bg-surface border border-card-border"
                            }`}
                          />
                          <p className={`text-xs font-bold ${step.completed ? "text-foreground" : "text-muted"}`}>
                            {step.title}
                          </p>
                          <p className="text-[11px] text-muted">{step.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: RMA Claim Submission (SRS 3.1) */}
              {initialSection === "rma" && (
                <div className="rounded-3xl border border-card-border bg-card p-6 sm:p-8 shadow-xs">
                  <div className="border-b border-card-border pb-5">
                    <h2 className="text-xl font-bold text-foreground">Submit Return / Warranty (RMA) Ticket</h2>
                    <p className="text-xs text-muted mt-1">
                      Enter the Serial / IMEI code printed on your product box or invoice to initiate official service inspection.
                    </p>
                  </div>

                  {rmaTicket ? (
                    <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                      <span className="text-4xl" aria-hidden="true">✅</span>
                      <h3 className="mt-3 text-base font-bold text-emerald-900">RMA Claim Ticket Submitted!</h3>
                      <p className="mt-1 text-xs text-emerald-800">
                        Ticket Reference: <strong className="font-mono text-primary font-bold">{rmaTicket.ticketReference}</strong>
                      </p>
                      <p className="mt-1 text-xs text-emerald-700">
                        Estimated Response: <strong>{rmaTicket.estimatedResolution}</strong>
                      </p>
                      <p className="mt-2 text-xs text-muted">
                        Our Technical Service Officer will contact you within 24 hours to schedule drop-off or courier pickup.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setRmaTicket(null);
                          setRmaSerial("");
                          setRmaProblem("");
                          setRmaAttachments([]);
                        }}
                        className="mt-4 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary/90 transition shadow-sm"
                      >
                        Submit Another Ticket
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRmaSubmit} className="mt-6 space-y-5" noValidate>
                      {/* Serial Number & Fast Select */}
                      <div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="rma-serial-input" className="text-xs font-bold uppercase tracking-wider text-muted">
                            Product Serial Number / IMEI <span aria-hidden="true">*</span>
                          </label>
                          {currentOrder?.items && currentOrder.items.length > 0 && (
                            <span className="text-[11px] text-muted">
                              Quick select from recent purchase below
                            </span>
                          )}
                        </div>

                        {/* Recent order quick-fill chips */}
                        {currentOrder?.items && currentOrder.items.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {currentOrder.items.map((item, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setRmaSerial(item.serial);
                                  if (rmaError) setRmaError("");
                                }}
                                className={`rounded-lg border px-2.5 py-1 text-[11px] font-mono transition ${
                                  rmaSerial === item.serial
                                    ? "border-primary bg-primary/10 text-primary font-bold"
                                    : "border-card-border bg-surface text-muted hover:border-muted hover:text-foreground"
                                }`}
                              >
                                {item.serial}
                              </button>
                            ))}
                          </div>
                        )}

                        <input
                          id="rma-serial-input"
                          type="text"
                          required
                          value={rmaSerial}
                          onChange={(e) => {
                            setRmaSerial(e.target.value);
                            if (rmaError) setRmaError("");
                          }}
                          placeholder="e.g. SN-RTX4070-882194"
                          className="mt-1.5 w-full rounded-xl border border-card-border bg-surface px-4 py-2.5 text-xs text-foreground placeholder:text-muted focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition font-mono"
                        />
                      </div>

                      {/* Problem Description */}
                      <div>
                        <label htmlFor="rma-problem-input" className="text-xs font-bold uppercase tracking-wider text-muted">
                          Problem Description <span aria-hidden="true">*</span>
                        </label>
                        <textarea
                          id="rma-problem-input"
                          required
                          rows={3}
                          value={rmaProblem}
                          onChange={(e) => {
                            setRmaProblem(e.target.value);
                            if (rmaError) setRmaError("");
                          }}
                          placeholder="Describe the hardware defect or symptom (e.g. Artifacts on display, no display output, device fails to power on)..."
                          className="mt-1.5 w-full rounded-xl border border-card-border bg-surface px-4 py-2.5 text-xs text-foreground placeholder:text-muted focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition"
                        />
                      </div>

                      {/* Photo / Proof Upload Attachments */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted">
                          Attach Defect Photo or Invoice Proof <span className="text-[11px] font-normal lowercase">(optional, max 4 images)</span>
                        </label>
                        
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          {rmaAttachments.map((att, idx) => (
                            <div key={idx} className="relative size-20 rounded-xl border border-card-border overflow-hidden bg-surface group">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={att.url} alt={att.name} className="size-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveAttachment(idx)}
                                title="Remove image"
                                className="absolute inset-0 bg-black/60 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                              >
                                ✕ Remove
                              </button>
                            </div>
                          ))}

                          {rmaAttachments.length < 4 && (
                            <label className="flex size-20 flex-col items-center justify-center rounded-xl border-2 border-dashed border-card-border bg-surface text-muted hover:border-secondary hover:text-secondary cursor-pointer transition">
                              <span className="text-lg">📷</span>
                              <span className="text-[10px] font-bold mt-1">Upload</span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                onChange={handleAttachmentUpload}
                                className="sr-only"
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      {rmaError && (
                        <p role="alert" className="rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
                          {rmaError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmittingRma}
                        className="rounded-xl bg-secondary px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-secondary-hover transition shadow-sm shadow-secondary/20 disabled:opacity-70 disabled:cursor-wait flex items-center gap-2"
                      >
                        {isSubmittingRma ? (
                          <>
                            <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            <span>Submitting Claim…</span>
                          </>
                        ) : (
                          <span>Submit Warranty Claim Ticket →</span>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </>
  );
}
