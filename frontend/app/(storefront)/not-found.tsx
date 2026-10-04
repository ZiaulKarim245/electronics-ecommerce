"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/storefront/Breadcrumbs";

export default function StorefrontNotFound() {
  const router = useRouter();

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "The page you requested cannot be found!" },
        ]}
      />

      <main className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
        {/* Big 404 Number */}
        <h1 className="text-7xl sm:text-8xl font-black tracking-tight text-slate-800 dark:text-slate-100">
          404
        </h1>

        {/* Page Not Found Title */}
        <h2 className="mt-3 text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">
          Page Not Found
        </h2>

        {/* Description text */}
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
          We can&apos;t seem to find the page you&apos;re looking for. It might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition active:scale-95"
          >
            Go to Homepage
          </Link>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg bg-slate-700 hover:bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition active:scale-95"
          >
            Go Back
          </button>
        </div>

        {/* "What happened?" explanation box */}
        <div className="mt-8 w-full max-w-md rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-5 text-center shadow-2xs">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">
            What happened?
          </h3>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            The page you requested could not be found. This might be due to a typo in the URL, the page being moved, or the page no longer existing.
          </p>
        </div>
      </main>
    </>
  );
}
