"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/storefront/Breadcrumbs";
import { type PaymentMethod } from "@/components/checkout/useCheckoutLogic";

type CompletedOrder = {
  invoiceNo: string;
  name: string;
  phone: string;
  address: string;
  total: number;
  dueOnDelivery?: number;
  paymentOption: PaymentMethod;
};

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<CompletedOrder | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      try {
        const savedOrder = localStorage.getItem("techhub_last_order");
        if (savedOrder) setOrder(JSON.parse(savedOrder) as CompletedOrder);
      } catch {
        // Show the safe fallback when browser storage is unavailable.
      } finally {
        setIsLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shopping Cart", href: "/cart" },
          { label: "Checkout", href: "/checkout" },
          { label: "Order Confirmation" },
        ]}
      />

      <main className="mx-auto max-w-[1440px] px-4 pb-12 pt-4 sm:px-6 lg:px-10">
        {!isLoaded ? (
          <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-card-border bg-card p-10 text-center shadow-xs" role="status">
            <span className="mx-auto block size-7 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
            <p className="mt-3 text-sm font-medium text-muted">Loading order confirmation…</p>
          </div>
        ) : order ? (
          <div className="mx-auto mt-6 max-w-xl text-center">
            {/* Success Icon */}
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-xs">
              <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Title & Subtitle */}
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Order Successfully Placed!
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              Thank you for your purchase. We are preparing your order for dispatch.
            </p>

            {/* Invoice Reference Badge */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-card-border bg-surface px-4 py-1 text-xs font-medium text-slate-600 shadow-2xs">
              <span>Invoice Reference:</span>
              <span className="font-mono font-bold text-secondary">{order.invoiceNo}</span>
            </div>

            {/* Production Receipt Card */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-card-border bg-card shadow-xs text-left">
              <div className="border-b border-card-border bg-surface/80 px-5 py-3 sm:px-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
                  Order &amp; Delivery Details
                </h2>
              </div>

              <div className="divide-y divide-card-border/70 px-5 sm:px-6">
                <DetailRow label="Recipient Name" value={order.name} />
                <DetailRow label="Delivery Address" value={order.address} />
                <DetailRow label="SMS Tracking Mobile" value={order.phone} mono />
                <DetailRow
                  label="Payment Method"
                  value={order.paymentOption === "COD" ? "Cash on Delivery" : "Online Payment"}
                  badge={order.paymentOption === "COD" ? "COD" : "Prepaid"}
                />
              </div>

              {/* Amount Due / Total Highlight Box */}
              <div className="flex items-center justify-between gap-4 border-t border-card-border bg-surface/40 px-5 py-4 sm:px-6">
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {order.paymentOption === "COD" ? "Amount Due on Delivery" : "Total Amount Paid"}
                  </p>
                  <p className="text-xs text-muted">
                    {order.paymentOption === "COD" ? "Pay upon courier arrival" : "Paid securely online"}
                  </p>
                </div>
                <span className="text-xl sm:text-2xl font-black text-secondary">
                  ৳{(order.dueOnDelivery ?? order.total).toLocaleString()}
                </span>
              </div>
            </div>

            {/* SMS Notification Assurance Banner */}
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-3.5 text-left text-xs leading-relaxed text-emerald-900 shadow-2xs">
              <svg className="size-5 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-emerald-800">
                SMS verification and courier tracking updates have been sent to <span className="font-mono font-bold text-emerald-950">{order.phone}</span>.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm sm:max-w-none mx-auto">
              <Link
                href={`/account/orders?invoice=${encodeURIComponent(order.invoiceNo)}`}
                className="inline-flex h-11 w-full sm:w-auto sm:min-w-[180px] items-center justify-center rounded-xl border border-secondary bg-secondary px-6 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-hover active:scale-[0.98]"
              >
                Track Your Order
              </Link>
              <Link
                href="/"
                className="inline-flex h-11 w-full sm:w-auto sm:min-w-[180px] items-center justify-center rounded-xl border border-card-border bg-white px-6 text-sm font-bold text-foreground shadow-2xs transition hover:border-secondary hover:bg-slate-50 hover:text-secondary active:scale-[0.98]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-card-border bg-card p-8 text-center shadow-xs">
            <h1 className="text-xl font-bold text-foreground">No recent order found</h1>
            <p className="mt-2 text-sm text-muted">This confirmation link is available after successfully placing an order.</p>
            <Link
              href="/"
              className="mt-6 inline-flex h-11 w-full sm:w-auto sm:min-w-[180px] items-center justify-center rounded-xl border border-secondary bg-secondary px-8 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-hover active:scale-[0.98]"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </main>
    </>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
  badge,
}: {
  label: string;
  value: string;
  mono?: boolean;
  badge?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 text-sm">
      <span className="font-medium text-muted">{label}</span>
      <div className="flex items-center gap-2 text-right">
        {badge && (
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
            {badge}
          </span>
        )}
        <span className={`font-semibold text-foreground ${mono ? "font-mono text-secondary" : ""}`}>
          {value}
        </span>
      </div>
    </div>
  );
}
