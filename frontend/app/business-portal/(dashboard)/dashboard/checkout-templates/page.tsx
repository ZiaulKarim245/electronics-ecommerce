"use client";

import { useState } from "react";
import Link from "next/link";
import { CHECKOUT_TEMPLATES_META, type CheckoutTemplate } from "@/lib/storeConfig";
import { useStoreConfig } from "@/context/StoreConfigContext";

/* -------------------------------------------------------------------------- */
/* Visual Layout Wireframe Mockups for each Template (Clean Light Theme)      */
/* -------------------------------------------------------------------------- */

function ModernSplitWireframe({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`relative w-full aspect-[16/10] rounded-xl border p-2.5 flex flex-col justify-between overflow-hidden select-none transition-colors ${
        isActive
          ? "border-cyan-300 bg-cyan-50/40"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      {/* Mini top bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-rose-400" />
          <span className="size-1.5 rounded-full bg-amber-400" />
          <span className="size-1.5 rounded-full bg-emerald-400" />
        </div>
        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Two-Column Split</span>
      </div>

      {/* Grid Wireframe */}
      <div className="grid grid-cols-12 gap-2 flex-1 pt-2">
        {/* Left Column: Multi-card forms */}
        <div className="col-span-7 flex flex-col gap-1.5">
          <div className="rounded-md border border-slate-200 bg-white p-1.5 flex flex-col gap-1 shadow-xs">
            <div className="h-1.5 w-1/3 rounded bg-cyan-600" />
            <div className="h-1 w-full rounded bg-slate-200" />
            <div className="h-1 w-2/3 rounded bg-slate-200" />
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-1.5 flex flex-col gap-1 shadow-xs">
            <div className="h-1.5 w-2/5 rounded bg-cyan-600" />
            <div className="grid grid-cols-2 gap-1">
              <div className="h-1 rounded bg-slate-200" />
              <div className="h-1 rounded bg-slate-200" />
            </div>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-1.5 flex items-center justify-between shadow-xs">
            <div className="h-1.5 w-1/4 rounded bg-cyan-600" />
            <div className="h-1.5 w-6 rounded bg-emerald-500" />
          </div>
        </div>

        {/* Right Column: Sticky Summary */}
        <div className="col-span-5 flex flex-col justify-between rounded-md border border-cyan-200 bg-cyan-100/50 p-1.5">
          <div className="flex flex-col gap-1">
            <div className="h-1.5 w-1/2 rounded bg-cyan-800" />
            <div className="flex items-center gap-1 mt-0.5">
              <div className="size-3 rounded bg-white shrink-0 border border-cyan-200" />
              <div className="h-1 w-full rounded bg-cyan-200" />
            </div>
            <div className="flex items-center gap-1">
              <div className="size-3 rounded bg-white shrink-0 border border-cyan-200" />
              <div className="h-1 w-3/4 rounded bg-cyan-200" />
            </div>
          </div>
          <div className="pt-1.5 border-t border-cyan-200 flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <div className="h-1 w-8 rounded bg-cyan-300" />
              <div className="h-1 w-6 rounded bg-cyan-700" />
            </div>
            <div className="h-2.5 w-full rounded bg-cyan-600 shadow-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressiveAccordionWireframe({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`relative w-full aspect-[16/10] rounded-xl border p-2.5 flex flex-col justify-between overflow-hidden select-none transition-colors ${
        isActive
          ? "border-amber-300 bg-amber-50/40"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      {/* Mini top bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          <div className="h-0.5 w-3 bg-amber-500" />
          <span className="size-1.5 rounded-full bg-amber-500" />
          <div className="h-0.5 w-3 bg-slate-300" />
          <span className="size-1.5 rounded-full bg-slate-400" />
        </div>
        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Step-By-Step</span>
      </div>

      {/* Accordion Stack */}
      <div className="flex flex-col gap-1.5 flex-1 pt-2">
        {/* Step 1: Collapsed / Completed */}
        <div className="rounded-md border border-emerald-200 bg-emerald-50/80 p-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-600 flex items-center justify-center text-[7px] text-white font-bold">✓</span>
            <div className="h-1.5 w-16 rounded bg-emerald-700/70" />
          </div>
          <span className="text-[8px] text-emerald-700 font-bold">Done</span>
        </div>

        {/* Step 2: Expanded / In-Progress */}
        <div className="rounded-md border border-amber-300 bg-white p-2 flex flex-col gap-1.5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-500 flex items-center justify-center text-[7px] text-white font-bold">2</span>
              <div className="h-1.5 w-20 rounded bg-amber-700" />
            </div>
            <div className="h-1.5 w-10 rounded bg-amber-200" />
          </div>
          <div className="grid grid-cols-2 gap-1 pt-0.5">
            <div className="h-1.5 rounded bg-slate-100 border border-slate-200" />
            <div className="h-1.5 rounded bg-slate-100 border border-slate-200" />
          </div>
          <div className="h-2 w-14 rounded bg-amber-500 self-end mt-0.5" />
        </div>

        {/* Step 3: Locked / Upcoming */}
        <div className="rounded-md border border-slate-200 bg-slate-100 p-1.5 flex items-center justify-between opacity-70">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-slate-300" />
            <div className="h-1.5 w-14 rounded bg-slate-400" />
          </div>
          <div className="size-2 rounded bg-slate-300" />
        </div>
      </div>
    </div>
  );
}

function CenteredMinimalistWireframe({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`relative w-full aspect-[16/10] rounded-xl border p-2.5 flex flex-col justify-between overflow-hidden select-none transition-colors ${
        isActive
          ? "border-emerald-300 bg-emerald-50/40"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      {/* Mini top bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-rose-400" />
          <span className="size-1.5 rounded-full bg-amber-400" />
          <span className="size-1.5 rounded-full bg-emerald-400" />
        </div>
        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Centered Minimal</span>
      </div>

      {/* Centered Column Wireframe */}
      <div className="flex flex-col items-center flex-1 pt-2">
        <div className="w-4/5 flex flex-col gap-1.5">
          {/* Drawer Banner */}
          <div className="rounded-md border border-emerald-200 bg-emerald-50/90 p-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="size-2 rounded bg-emerald-600" />
              <div className="h-1.5 w-14 rounded bg-emerald-800" />
            </div>
            <div className="h-1.5 w-8 rounded bg-emerald-600" />
          </div>

          {/* Form Fields Stack */}
          <div className="rounded-md border border-slate-200 bg-white p-2 flex flex-col gap-1.5 shadow-xs">
            <div className="h-1.5 w-1/3 rounded bg-slate-400" />
            <div className="h-1.5 w-full rounded bg-slate-100 border border-slate-200" />
            <div className="h-1.5 w-full rounded bg-slate-100 border border-slate-200" />
            <div className="flex items-center justify-between pt-1">
              <div className="h-1 w-10 rounded bg-slate-300" />
              <div className="h-2 w-16 rounded bg-emerald-600 shadow-xs" />
            </div>
          </div>

          {/* Trust badges footer */}
          <div className="flex justify-center items-center gap-2 pt-0.5">
            <div className="h-1 w-6 rounded bg-slate-300" />
            <div className="h-1 w-6 rounded bg-slate-300" />
            <div className="h-1 w-6 rounded bg-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateWireframe({ id, isActive }: { id: CheckoutTemplate; isActive: boolean }) {
  if (id === "modern") return <ModernSplitWireframe isActive={isActive} />;
  if (id === "precise") return <ProgressiveAccordionWireframe isActive={isActive} />;
  return <CenteredMinimalistWireframe isActive={isActive} />;
}

/* -------------------------------------------------------------------------- */
/* Main Page Component (White / Light Theme)                                  */
/* -------------------------------------------------------------------------- */

export default function CheckoutTemplatesDashboardPage() {
  const { checkoutTemplate, setCheckoutTemplate } = useStoreConfig();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState<CheckoutTemplate | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleActivate = (id: CheckoutTemplate) => {
    setCheckoutTemplate(id);
    const meta = CHECKOUT_TEMPLATES_META[id];
    showToast(`✓ "${meta.operationalTitle}" is now live on the storefront checkout.`);
  };

  const templates: CheckoutTemplate[] = ["modern", "precise", "lucrative"];

  return (
    <main className="p-4 sm:p-6 lg:p-8 xl:p-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex max-w-md items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-md px-5 py-4 text-white shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <span className="size-2.5 shrink-0 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span className="text-xs font-semibold sm:text-sm text-slate-100">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-auto rounded-lg px-2 py-1 text-xs font-bold text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link href="/business-portal/dashboard" className="hover:text-cyan-700 transition">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Checkout templates</span>
          </div>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Checkout templates
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Configure the storefront checkout architecture. Switch between multi-card split-screen, progressive accordion, and centered minimalist layouts in real time.
          </p>
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {templates.map((id) => {
          const meta = CHECKOUT_TEMPLATES_META[id];
          const isActive = checkoutTemplate === id;

          return (
            <div
              key={id}
              className={`rounded-2xl border-2 transition-all duration-200 bg-white flex flex-col justify-between p-6 relative overflow-hidden group shadow-sm hover:shadow-md ${
                isActive
                  ? "border-cyan-500 ring-4 ring-cyan-500/10"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* Active Badge Bar */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800">
                  {meta.templateNumber}
                </span>

                {isActive ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    Currently active
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-400">Available</span>
                )}
              </div>

              {/* Wireframe Mockup */}
              <div className="mb-4">
                <TemplateWireframe id={id} isActive={isActive} />
              </div>

              {/* Title & Tagline */}
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {meta.operationalTitle}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">
                  {meta.tagline}
                </p>
              </div>

              {/* Action Buttons: Preview & Activate */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setPreviewModal(id)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition flex items-center justify-center gap-1.5"
                >
                  <svg className="size-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleActivate(id)}
                  disabled={isActive}
                  className={`flex-1 rounded-xl py-2.5 px-3 text-xs font-black uppercase tracking-wider transition ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                      : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                  }`}
                >
                  {isActive ? "Active" : "Activate"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Production-Grade Preview Modal (Clean Light Theme) */}
      {previewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-3xl rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-cyan-700">
                    {CHECKOUT_TEMPLATES_META[previewModal].templateNumber}
                  </span>
                  {checkoutTemplate === previewModal && (
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      Currently active
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  {CHECKOUT_TEMPLATES_META[previewModal].operationalTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {CHECKOUT_TEMPLATES_META[previewModal].tagline}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewModal(null)}
                aria-label="Close preview modal"
                className="size-9 rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-6 space-y-6">
              {/* Layout Wireframe Anatomy */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Layout Architecture & Anatomy
                </h4>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <TemplateWireframe id={previewModal} isActive={true} />
                </div>
              </div>

              {/* Description */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Overview & Philosophy
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {CHECKOUT_TEMPLATES_META[previewModal].description}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Key Engineered Features
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {CHECKOUT_TEMPLATES_META[previewModal].features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold shrink-0">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Target Persona */}
              <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4">
                <p className="text-xs font-bold text-cyan-900 uppercase tracking-wider">
                  Optimal Storefront Use Case
                </p>
                <p className="text-xs text-cyan-800 mt-1">
                  {CHECKOUT_TEMPLATES_META[previewModal].bestFor}
                </p>
              </div>
            </div>

            {/* Modal Footer CTAs */}
            <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
              <a
                href={`/checkout?template=${previewModal}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
              >
                <span>Open in storefront sandbox</span>
                <svg className="size-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              <div className="w-full sm:w-auto flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewModal(null)}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleActivate(previewModal);
                    setPreviewModal(null);
                  }}
                  disabled={checkoutTemplate === previewModal}
                  className={`rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-wider transition ${
                    checkoutTemplate === previewModal
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                      : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                  }`}
                >
                  {checkoutTemplate === previewModal ? "Already active" : "Activate this template"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
