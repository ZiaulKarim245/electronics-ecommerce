"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors to telemetry or monitoring service
    console.error("Storefront runtime error captured by boundary:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[65vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <div className="size-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center text-3xl font-black shadow-xs">
        !
      </div>

      <h1 className="mt-5 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
        Something went wrong
      </h1>
      <p className="mt-2.5 text-sm text-slate-500 leading-relaxed max-w-md">
        We encountered an unexpected glitch while loading this page. Your active shopping cart, items, and session remain completely safe.
      </p>

      {error.digest && (
        <div className="mt-4 rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-500 font-mono">
          Reference Code: {error.digest}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-slate-800 transition"
        >
          Try loading again
        </button>

        <Link
          href="/"
          className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 transition"
        >
          Back to storefront
        </Link>
      </div>

      <div className="mt-12 text-xs text-slate-400">
        Need immediate assistance? Contact TechHub helpline:{" "}
        <a href="tel:09678123456" className="font-semibold text-slate-600 hover:text-cyan-700">
          09678-123456
        </a>
      </div>
    </main>
  );
}
