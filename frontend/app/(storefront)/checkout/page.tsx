"use client";

import { useEffect } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/storefront/Breadcrumbs";
import { useCheckoutLogic } from "@/components/checkout/useCheckoutLogic";

// Import Production-Named Templates
import SinglePageTemplateOne from "@/components/checkout/templates/SinglePageTemplateOne";
import SinglePageTemplateTwo from "@/components/checkout/templates/SinglePageTemplateTwo";
import SinglePageTemplateThree from "@/components/checkout/templates/SinglePageTemplateThree";

import { useStoreConfig } from "@/context/StoreConfigContext";

export default function CheckoutPage() {
  const logic = useCheckoutLogic();
  const { cartItems } = logic;
  const { checkoutTemplate } = useStoreConfig();

  useEffect(() => {
    document.title = "Checkout | TechHub Bangladesh";
  }, []);

  // Safe fallback to prevent runtime issues
  const activeTemplate = checkoutTemplate || "lucrative";

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shopping Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <main className="mx-auto max-w-[1440px] px-4 pb-8 pt-4 sm:px-6 lg:px-10">
        {/* Empty Cart State — Aligned with Star Tech production software */}
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          {/* Muted shopping bag icon matching the header Cart icon */}
          <div className="text-slate-300">
            <svg
              className="size-16 sm:size-20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
            </svg>
          </div>

          <h2 className="mt-5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Your cart is empty
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Add some products to get started.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm sm:max-w-none mx-auto">
            <Link
              href="/"
              className="inline-flex h-11 w-full sm:w-auto sm:min-w-[180px] items-center justify-center rounded-xl border border-secondary bg-secondary px-8 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-hover active:scale-[0.98]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        /* Render Active Template chosen by business owner */
        <div className="mt-5">
          {activeTemplate === "modern" && <SinglePageTemplateOne logic={logic} />}
          {activeTemplate === "precise" && <SinglePageTemplateTwo logic={logic} />}
          {activeTemplate === "lucrative" && <SinglePageTemplateThree logic={logic} />}
        </div>
      )}
    </main>
    </>
  );
}
