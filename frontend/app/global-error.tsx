"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root application error captured by global-error boundary:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900 font-sans antialiased">
        <div className="max-w-md w-full rounded-3xl bg-white border border-slate-200 p-8 shadow-xl text-center">
          <div className="size-14 mx-auto rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center text-2xl font-black">
            !
          </div>

          <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900">
            System Unavailable
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
            A critical framework exception occurred. Please reload the application or try again in a moment.
          </p>

          {error.digest && (
            <div className="mt-3 rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-400 font-mono">
              Digest: {error.digest}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-slate-800 transition"
            >
              Reload application
            </button>
            <button
              type="button"
              onClick={() => window.location.assign("/")}
              className="w-full rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Go to homepage
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
