import type { Metadata } from "next";
import { getBusinessDemoCredentials, isBusinessDemoEnabled } from "@/lib/businessPortal/demo";
import { PORTAL_ROLES, ROLE_META } from "@/lib/businessPortal/roles";
import TechHubLogo from "@/components/storefront/TechHubLogo";

export const metadata: Metadata = { title: "Business Portal Sign In", description: "Authorized staff access for TechHub business operations." };

export default async function BusinessPortalLoginPage({ searchParams }: { searchParams: Promise<{ error?: string; from?: string }> }) {
  const demoEnabled = isBusinessDemoEnabled();
  const credentials = demoEnabled ? getBusinessDemoCredentials() : null;
  const params = await searchParams;
  const invalidCredentials = params.error === "invalid";
  const accessDenied = params.error === "access_denied";

  return <main className="business-portal-shell grid min-h-screen bg-slate-950 text-slate-900 lg:grid-cols-[minmax(0,1fr)_minmax(28rem,0.8fr)]">
    <section className="relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.13),transparent_35%)]" />
      <div className="relative">
        <TechHubLogo className="h-11 w-auto" variant="light" accessibleLabel="TechHub" />
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Business operations</p>
      </div>
      <div className="relative max-w-xl"><p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">One workspace</p><h1 className="mt-4 text-5xl font-black leading-tight tracking-tight">Run commerce, inventory, retail, and service with clarity.</h1><p className="mt-5 max-w-lg text-base leading-7 text-slate-400">Designed for serialized electronics stock, high-value orders, point-of-sale workflows, warranty service, and role-based teams.</p></div>
      <p className="relative text-xs text-slate-500">Authorized staff access only</p>
    </section>
    <section className="flex min-h-screen items-center justify-center bg-slate-100 px-5 py-10 sm:px-10">
      <div className="w-full max-w-md">
        <div className="mb-8 lg:hidden">
          <TechHubLogo className="h-9 w-auto" variant="dark" accessibleLabel="TechHub" />
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Business operations</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/30 sm:p-8">
          <div className="flex items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Secure staff access</p>{demoEnabled && <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-violet-700 ring-1 ring-violet-200">Demo mode</span>}</div>
          <h2 className="mt-3 text-3xl font-black tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Sign in with an account assigned by your administrator.</p>
          <form action="/api/business-demo/login" method="post" className="mt-8 space-y-5">
            <div><label className="block text-sm font-bold" htmlFor="email">Work email</label><input id="email" type="email" name="email" autoComplete="username" required disabled={!demoEnabled} defaultValue={credentials?.email} className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed" placeholder="name@company.com" /></div>
            <div><label className="block text-sm font-bold" htmlFor="password">Password</label><input id="password" type="password" name="password" autoComplete="current-password" required disabled={!demoEnabled} defaultValue={credentials?.password} className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed" placeholder="Enter your password" /></div>

            {/* Role selector — demo only, simulates different RBAC accounts */}
            {demoEnabled && (
              <div>
                <label className="block text-sm font-bold" htmlFor="role">Sign in as role</label>
                <select id="role" name="role" defaultValue="admin" className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100">
                  {PORTAL_ROLES.map((r) => (
                    <option key={r} value={r}>{ROLE_META[r].label}</option>
                  ))}
                </select>
                <p className="mt-1.5 text-[11px] text-slate-400">Different roles see different modules. Admin sees all.</p>
              </div>
            )}

            {invalidCredentials && demoEnabled && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">The demo email or password is incorrect.</p>}
            {accessDenied && <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-700">You do not have permission to access that section. Please sign in with a different role.</p>}
            <button type="submit" disabled={!demoEnabled} className="w-full rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-65">{demoEnabled ? "Enter demo portal" : "Authentication API not connected"}</button>
          </form>
          {demoEnabled ? <div className="mt-6 rounded-xl border border-violet-200 bg-violet-50 p-3 text-xs leading-5 text-violet-800"><strong>Local demo:</strong> The fields are prefilled for testing. Data and access are temporary and cannot run in production.</div> : <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800"><strong>Setup status:</strong> Enable local demo mode or connect Laravel Sanctum authentication and the frontend session contract.</div>}
        </div>
        <p className="mt-5 text-center text-xs text-slate-500">Contact your administrator if you need portal access.</p>
      </div>
    </section>
  </main>;
}
