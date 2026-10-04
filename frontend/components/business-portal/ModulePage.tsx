import Link from "next/link";
import PortalIcon, { type PortalIconName } from "./PortalIcon";
import { getBusinessDemoRecords, isBusinessDemoEnabled } from "@/lib/businessPortal/demo";

interface ModulePageProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: PortalIconName;
  primaryAction: string;
  capabilities: string[];
}

export default function ModulePage({ eyebrow, title, description, icon, primaryAction, capabilities }: ModulePageProps) {
  const demoMode = isBusinessDemoEnabled();
  const records = getBusinessDemoRecords(icon);
  const toneStyles = { cyan: "bg-cyan-50 text-cyan-700 ring-cyan-200", amber: "bg-amber-50 text-amber-700 ring-amber-200", emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200", rose: "bg-rose-50 text-rose-700 ring-rose-200", slate: "bg-slate-100 text-slate-600 ring-slate-200" };
  return <main className="p-4 sm:p-6 lg:p-8 xl:p-10">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl"><p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">{eyebrow}</p><h1 className="mt-2 text-3xl font-black tracking-tight">{title}</h1><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p></div>
      <button type="button" disabled title={demoMode ? "Actions are disabled in the read-only demo" : "Available after the backend API is connected"} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-55">{primaryAction}</button>
    </div>
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold">Workspace</h2><p className="mt-1 text-xs text-slate-500">{demoMode ? "Illustrative local records for interface testing." : "Operational records will load from the Laravel API."}</p></div><span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ring-1 ${demoMode ? "bg-violet-50 text-violet-700 ring-violet-200" : "bg-amber-50 text-amber-700 ring-amber-200"}`}>{demoMode ? "Demo data" : "API pending"}</span></div>
      {capabilities && capabilities.length > 0 && (
        <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-3 lg:px-7">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Core Capabilities</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {capabilities.map((cap) => (
              <span key={cap} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-xs">
                {cap}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="p-5 lg:p-7">
        {records.length > 0 ? <div className="overflow-hidden rounded-2xl border border-slate-200"><ul className="divide-y divide-slate-200">{records.map((record) => <li key={record.reference} className="flex flex-col gap-3 bg-white p-4 transition hover:bg-slate-50 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><p className="text-xs font-bold text-slate-400">{record.reference}</p><p className="mt-1 font-bold text-slate-900">{record.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{record.detail}</p></div><span className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-bold ring-1 ${toneStyles[record.tone]}`}>{record.status}</span></li>)}</ul><p className="border-t border-slate-200 bg-violet-50 px-4 py-3 text-xs font-medium text-violet-700">Read-only demonstration records — no changes are saved.</p></div> : <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center"><span className="flex size-14 items-center justify-center rounded-2xl bg-white text-cyan-700 shadow-sm ring-1 ring-slate-200"><PortalIcon name={icon} className="size-7" /></span><h3 className="mt-5 text-lg font-black">No records available yet</h3><p className="mt-2 max-w-md text-sm leading-6 text-slate-500">Connect the authenticated API endpoint to load real records.</p></div>}
      </div>
    </section>
    <p className="mt-5 text-xs text-slate-500">Return to <Link href="/business-portal/dashboard" className="font-bold text-cyan-700 hover:underline">dashboard overview</Link>.</p>
  </main>;
}
