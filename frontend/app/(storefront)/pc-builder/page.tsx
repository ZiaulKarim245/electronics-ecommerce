"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductVisual from "@/components/storefront/ProductVisual";
import Breadcrumbs from "@/components/storefront/Breadcrumbs";
import { pcBuilderSlots, pcComponentsCatalog } from "@/lib/data/pcBuilder";
import type { PCComponent } from "@/types/pc-builder";

export default function PCBuilderPage() {
  const [selectedParts, setSelectedParts] = useState<{ [category: string]: PCComponent | undefined }>({});

  const [activeModalCategory, setActiveModalCategory] = useState<string | null>(null);
  const [hideUnconfigured, setHideUnconfigured] = useState(false);

  useEffect(() => {
    document.title = "PC Builder - Build Your Custom PC | TechHub Bangladesh";
  }, []);

  // Calculations
  const cpu = selectedParts["Processor"];
  const mobo = selectedParts["Motherboard"];
  const ram = selectedParts["RAM"];
  const psu = selectedParts["Power Supply"];

  const isSocketCompatible = !cpu || !mobo || cpu.socket === mobo.socket;
  const isRamCompatible = !mobo || !ram || mobo.ramType === ram.ramType;
  const estimatedWattage = Object.values(selectedParts).reduce((acc, part) => acc + (part?.wattage || 0), 0);
  const psuCapacity = psu?.psuCapacity || 0;
  const recommendedWattage = Math.ceil(estimatedWattage * 1.2);
  const isPsuSufficient = !psu || psuCapacity >= recommendedWattage;
  const totalPrice = Object.values(selectedParts).reduce((acc, part) => acc + (part?.price || 0), 0);
  const selectedCount = Object.values(selectedParts).filter(Boolean).length;

  const selectPart = (part: PCComponent) => {
    setSelectedParts((prev) => ({ ...prev, [part.category]: part }));
    setActiveModalCategory(null);
  };

  const removePart = (category: string) => {
    setSelectedParts((prev) => ({ ...prev, [category]: undefined }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleScreenshot = () => {
    window.print();
  };

  const handleSavePC = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("PC Build URL copied to clipboard!");
  };

  // Group slots into Core Components vs Peripherals/Others
  const coreCategories = ["Processor", "CPU Cooler", "Motherboard", "RAM", "Storage", "Graphics Card", "Power Supply", "Casing"];
  const coreSlots = pcBuilderSlots.filter((s) => coreCategories.includes(s.category));
  const otherSlots = pcBuilderSlots.filter((s) => !coreCategories.includes(s.category));

  const renderSlotRow = (slot: (typeof pcBuilderSlots)[number]) => {
    const part = selectedParts[slot.category];
    if (hideUnconfigured && !part) return null;

    return (
      <div
        key={slot.category}
        className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 hover:bg-surface/60 transition-colors"
      >
        {/* Left: Icon & Label & Name/Specs */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Outlined Icon Box using project's surface & card border */}
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-card-border bg-surface p-1">
            <ProductVisual type={slot.visualType} className="size-7" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-foreground">
                {slot.label}
              </span>
              {slot.required && (
                <span className="rounded-md bg-secondary/15 px-1.5 py-0.5 text-[10px] font-bold text-secondary tracking-wide">
                  Required
                </span>
              )}
            </div>

            {part ? (
              <div className="mt-1">
                <p className="text-xs sm:text-sm font-bold text-primary line-clamp-1">{part.name}</p>
                <p className="text-[11px] text-muted line-clamp-1">{part.specs.join(" • ")}</p>
              </div>
            ) : (
              <div className="mt-2 h-2 w-full max-w-[280px] sm:max-w-md rounded-full bg-surface border border-card-border/50" />
            )}
          </div>
        </div>

        {/* Right: Price / Placeholder bar & Button */}
        <div className="flex items-center gap-4 sm:gap-8 shrink-0">
          {!part && (
            <div className="hidden sm:block h-2 w-16 rounded-full bg-surface border border-card-border/50" />
          )}
          {part && (
            <span className="text-xs sm:text-sm font-black text-foreground">
              ৳{part.price.toLocaleString()}
            </span>
          )}

          {part ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveModalCategory(slot.category)}
                className="rounded-xl border border-secondary text-secondary hover:bg-secondary hover:text-white px-3 py-1.5 text-xs font-bold transition shadow-xs"
              >
                Change
              </button>
              <button
                type="button"
                onClick={() => removePart(slot.category)}
                className="flex size-8 items-center justify-center rounded-xl border border-card-border bg-surface text-xs text-muted hover:border-rose-400 hover:bg-rose-50 hover:text-rose-600 transition"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setActiveModalCategory(slot.category)}
              className="rounded-xl border-2 border-secondary bg-transparent hover:bg-secondary px-4 py-1.5 text-xs font-bold text-secondary hover:text-white shadow-xs transition active:scale-95"
            >
              Choose
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "PC Builder" },
        ]}
        className="print:hidden"
      />

      <main className="mx-auto max-w-[1100px] px-3 pb-16 pt-2 sm:px-6">
        {/* Main Card Container aligned with project's design system */}
        <div className="rounded-2xl border border-card-border bg-card p-4 sm:p-7 shadow-xs">

          {/* Top Row: TechHub Brand Header & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-card-border pb-5 print:hidden">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Configurator Tool</span>
              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                TechHub PC Studio
              </h2>
            </div>

            {/* Top Right 4 Action Items */}
            <div className="flex items-center gap-4 sm:gap-6 text-xs text-muted">
              <Link
                href="/cart"
                className="flex flex-col items-center gap-1 group hover:text-primary transition"
              >
                <div className="flex size-7 items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-foreground">Add to Cart</span>
              </Link>

              <button
                type="button"
                onClick={handleSavePC}
                className="flex flex-col items-center gap-1 group hover:text-primary transition"
              >
                <div className="flex size-7 items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-foreground">Save PC</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex flex-col items-center gap-1 group hover:text-primary transition"
              >
                <div className="flex size-7 items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-foreground">Print</span>
              </button>

              <button
                type="button"
                onClick={handleScreenshot}
                className="flex flex-col items-center gap-1 group hover:text-primary transition"
              >
                <div className="flex size-7 items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-foreground">Screenshot</span>
              </button>
            </div>
          </div>

          {/* Subheader: Page Title & Checkbox (Left) | Metrics Boxes (Right) */}
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <div>
              <h1 className="text-base sm:text-lg font-bold text-foreground">
                PC Builder - Build Your Own Computer
              </h1>
              <label className="mt-1.5 flex items-center gap-2 text-xs text-muted cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hideUnconfigured}
                  onChange={(e) => setHideUnconfigured(e.target.checked)}
                  className="size-3.5 rounded border-card-border text-primary focus:ring-primary"
                />
                <span>Hide Unconfigured Components</span>
              </label>
            </div>

            {/* Metrics: Wattage Box + Total/Items Button */}
            <div className="flex items-center gap-3">
              {/* Estimated Wattage Box */}
              <div className="relative rounded-xl border border-dashed border-amber-500/80 bg-surface px-5 py-2 text-center min-w-[130px]">
                <span className="absolute -top-2 right-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-1.5 text-[8px] font-bold text-amber-600 uppercase">
                  BETA
                </span>
                <p className="text-sm font-black text-foreground leading-tight">
                  ⚡ {estimatedWattage}W
                </p>
                <p className="text-[10px] text-muted font-medium">
                  Estimated Wattage
                </p>
              </div>

              {/* Price & Items Pill */}
              <div className="flex flex-col items-center justify-center rounded-xl bg-primary hover:bg-primary-dark px-6 py-2 text-white shadow-xs min-w-[130px] transition">
                <p className="text-sm font-black leading-tight">
                  {totalPrice > 0 ? `৳${totalPrice.toLocaleString()}` : "0৳"}
                </p>
                <p className="text-[10px] font-medium opacity-90">
                  {selectedCount} Items
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Core Components Header */}
          <div className="mt-6 overflow-hidden rounded-xl border border-card-border bg-card">
            <div className="bg-surface border-b border-card-border px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted">
              Core Components
            </div>
            <div className="divide-y divide-card-border">
              {coreSlots.map((slot) => renderSlotRow(slot))}
            </div>
          </div>

          {/* Section 2: Peripherals & Others Header */}
          {otherSlots.length > 0 && (
            <div className="mt-6 overflow-hidden rounded-xl border border-card-border bg-card">
              <div className="bg-surface border-b border-card-border px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted">
                Peripherals &amp; Others
              </div>
              <div className="divide-y divide-card-border">
                {otherSlots.map((slot) => renderSlotRow(slot))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Component Selector Modal */}
      {activeModalCategory !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs">
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl border border-card-border bg-card shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-card-border p-4">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Select Component</span>
                <h3 className="text-base font-bold text-foreground">Choose {activeModalCategory}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalCategory(null)}
                className="flex size-7 items-center justify-center rounded border border-card-border text-muted hover:text-foreground text-xs"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2">
              {pcComponentsCatalog
                .filter((c) => c.category === activeModalCategory)
                .map((comp) => {
                  let warning = "";
                  if (activeModalCategory === "Processor" && mobo && comp.socket !== mobo.socket) {
                    warning = `Socket Mismatch (${comp.socket} vs Mobo ${mobo.socket})`;
                  } else if (activeModalCategory === "Motherboard" && cpu && comp.socket !== cpu.socket) {
                    warning = `Socket Mismatch (${comp.socket} vs CPU ${cpu.socket})`;
                  } else if (activeModalCategory === "RAM" && mobo && comp.ramType !== mobo.ramType) {
                    warning = `RAM Mismatch (${comp.ramType} vs Mobo ${mobo.ramType})`;
                  }

                  return (
                    <div
                      key={comp.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-card-border bg-surface/50 p-3 hover:border-primary/50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-card border border-card-border p-1">
                          <ProductVisual type={comp.visualType} className="size-7" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-foreground">{comp.name}</h4>
                            {warning && (
                              <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold text-rose-600 border border-rose-200">
                                {warning}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[11px] text-muted">
                            {comp.specs.join(" • ")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <span className="text-sm font-black text-primary">
                          ৳{comp.price.toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => selectPart(comp)}
                          className="rounded border border-blue-600 bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 text-xs font-bold text-white transition active:scale-95"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
