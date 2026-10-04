import Link from "next/link";
import PortalIcon, { type PortalIconName } from "@/components/business-portal/PortalIcon";
import { demoRecords, isBusinessDemoEnabled } from "@/lib/businessPortal/demo";

const stats: { label: string; value: string; helper: string; icon: PortalIconName }[] = [
  { label: "Orders today", value: "—", helper: "Awaiting order API", icon: "orders" },
  { label: "Revenue today", value: "৳ —", helper: "Awaiting sales API", icon: "reports" },
  { label: "Low-stock variants", value: "—", helper: "Awaiting inventory API", icon: "inventory" },
  { label: "Open RMA claims", value: "—", helper: "Awaiting service API", icon: "rma" },
];

const actions: { title: string; detail: string; href: string; icon: PortalIconName }[] = [
  { title: "Receive inventory", detail: "Record variants and serial or IMEI numbers", href: "/business-portal/dashboard/inventory", icon: "inventory" },
  { title: "Process orders", detail: "Review risk, payment and fulfilment state", href: "/business-portal/dashboard/orders", icon: "orders" },
  { title: "Open POS", detail: "Counter sale, receipt and quotation tools", href: "/business-portal/dashboard/pos", icon: "pos" },
  { title: "Manage RMA", detail: "Track repair, replacement and distributor claims", href: "/business-portal/dashboard/rma", icon: "rma" },
];

export default function BusinessPortalDashboardPage() {
  const demoMode = isBusinessDemoEnabled();
  const summary = demoMode ? [
    { label: "Orders today", value: "24", helper: "5 require review", icon: "orders" as const },
    { label: "Revenue today", value: "৳ 486K", helper: "Online and POS", icon: "reports" as const },
    { label: "Low-stock variants", value: "8", helper: "3 below reorder level", icon: "inventory" as const },
    { label: "Open RMA claims", value: "12", helper: "2 awaiting distributor", icon: "rma" as const },
  ] : stats;
  return <main className="p-4 sm:p-6 lg:p-8 xl:p-10">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Overview</p><h1 className="mt-2 text-3xl font-black tracking-tight">Operations dashboard</h1><p className="mt-2 text-sm text-slate-500">A focused view of commerce, stock, service, and store activity.</p></div><Link href="/business-portal/dashboard/catalog" className="w-fit rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800">Manage catalog</Link></div>
    <section aria-label="Business summary" className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{summary.map((stat) => <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><p className="text-sm font-semibold text-slate-500">{stat.label}</p><span className="rounded-xl bg-cyan-50 p-2 text-cyan-700"><PortalIcon name={stat.icon} className="size-5" /></span></div><p className="mt-4 text-3xl font-black">{stat.value}</p><p className={`mt-2 text-xs font-medium ${demoMode ? "text-violet-700" : "text-amber-700"}`}>{stat.helper}</p></article>)}</section>
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,1fr)]">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-200 p-5"><div><h2 className="text-lg font-black">Priority queue</h2><p className="mt-1 text-xs text-slate-500">Orders requiring review appear here.</p></div>{demoMode && <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700 ring-1 ring-violet-200">Demo data</span>}</div>{demoMode ? <ul className="divide-y divide-slate-200">{demoRecords.orders.map((order) => <li key={order.reference} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><p className="text-xs font-bold text-slate-400">{order.reference}</p><p className="mt-1 font-bold">{order.title}</p><p className="mt-1 text-xs text-slate-500">{order.detail}</p></div><span className="w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">{order.status}</span></li>)}</ul> : <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center"><span className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500"><PortalIcon name="orders" className="size-6" /></span><p className="mt-4 font-bold">No API data connected</p><p className="mt-1 max-w-md text-sm leading-6 text-slate-500">Risk flags, advance-payment checks, stock exceptions, and overdue fulfilment tasks will populate this queue.</p></div>}</section>
      <section className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm"><p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-400">Quick actions</p><div className="mt-4 space-y-2">{actions.map((action) => <Link key={action.href} href={action.href} className="group flex items-center gap-3 rounded-xl border border-white/10 p-3 transition hover:border-cyan-400/40 hover:bg-white/5"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-cyan-300"><PortalIcon name={action.icon} className="size-5" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{action.title}</span><span className="mt-0.5 block text-xs leading-5 text-slate-400">{action.detail}</span></span><PortalIcon name="arrow" className="size-4 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-cyan-300" /></Link>)}</div></section>
    </div>
  </main>;
}
