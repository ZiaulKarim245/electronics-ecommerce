import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/storefront/Breadcrumbs";

export const metadata: Metadata = {
  title: "EMI Information & Terms | TechHub Bangladesh",
  description: "Learn about 0% interest EMI options up to 36 months on credit cards from 24+ leading banks in Bangladesh at TechHub.",
};

const bankPartners = [
  "BRAC Bank",
  "City Bank (Amex)",
  "Eastern Bank PLC (EBL)",
  "Standard Chartered Bank",
  "Dutch-Bangla Bank (DBBL)",
  "Dhaka Bank",
  "Mutual Trust Bank (MTB)",
  "Prime Bank",
  "UCB Bank",
  "Bank Asia",
  "Southeast Bank",
  "Premier Bank",
];

const emiTenures = [
  { tenure: "3 Months", interest: "0% Interest", processingFee: "0%" },
  { tenure: "6 Months", interest: "0% Interest", processingFee: "0%" },
  { tenure: "9 Months", interest: "0% Interest", processingFee: "Low convenience charge" },
  { tenure: "12 Months", interest: "0% Interest", processingFee: "Available on selected cards" },
  { tenure: "18 to 36 Months", interest: "Bank Standard Rate", processingFee: "As per bank policy" },
];

export default function EmiPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "EMI Terms & Information" }]} />

      <main className="mx-auto max-w-[1440px] px-4 pb-8 pt-4 sm:px-6 lg:px-10">
        <div className="rounded-3xl border border-card-border bg-card p-6 sm:p-10 shadow-xs">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Flexible Installments</span>
          <h1 className="mt-2 text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            EMI Facility at TechHub Bangladesh
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Upgrade your gaming rig, laptop, or smartphone without paying the entire price upfront. We offer seamless <strong>Equated Monthly Installment (EMI)</strong> options on credit cards from 24+ major commercial banks in Bangladesh.
          </p>
        </div>

        {/* EMI Key Eligibility Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-card-border bg-surface p-5">
            <span className="text-2xl">💳</span>
            <h2 className="mt-3 text-sm font-bold text-foreground">Minimum Cart Total</h2>
            <p className="mt-1 text-xs text-slate-600">
              Eligible on any order of <strong>৳10,000 or above</strong> purchased online or at our physical retail outlets.
            </p>
          </div>

          <div className="rounded-2xl border border-card-border bg-surface p-5">
            <span className="text-2xl">⚡</span>
            <h2 className="mt-3 text-sm font-bold text-foreground">0% Interest Schemes</h2>
            <p className="mt-1 text-xs text-slate-600">
              Enjoy zero-interest EMI tenures for 3 to 12 months on selected laptops, monitors, graphics cards, and flagship phones.
            </p>
          </div>

          <div className="rounded-2xl border border-card-border bg-surface p-5">
            <span className="text-2xl">🏦</span>
            <h2 className="mt-3 text-sm font-bold text-foreground">24+ Partner Banks</h2>
            <p className="mt-1 text-xs text-slate-600">
              Supported by leading credit card issuers including City Bank Amex, EBL, BRAC Bank, and Standard Chartered.
            </p>
          </div>
        </div>

        {/* Tenure Table */}
        <div className="mt-10">
          <h2 className="text-base sm:text-lg font-bold text-foreground">Available EMI Tenures &amp; Schemes</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-card-border bg-surface text-muted">
                  <th className="py-3 px-4 font-bold">EMI Tenure</th>
                  <th className="py-3 px-4 font-bold">Interest Rate</th>
                  <th className="py-3 px-4 font-bold">Convenience / Processing Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {emiTenures.map((row) => (
                  <tr key={row.tenure} className="hover:bg-surface/50 transition">
                    <td className="py-3 px-4 font-bold text-foreground">{row.tenure}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-600">{row.interest}</td>
                    <td className="py-3 px-4 text-slate-600">{row.processingFee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Partner Banks Grid */}
        <div className="mt-10 border-t border-card-border pt-8">
          <h2 className="text-base sm:text-lg font-bold text-foreground">Our Partner Bank Network</h2>
          <p className="mt-1 text-xs text-muted">Credit cards from the following banks qualify for POS and online EMI processing:</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {bankPartners.map((bank) => (
              <span
                key={bank}
                className="rounded-xl border border-card-border bg-surface px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs"
              >
                🏦 {bank}
              </span>
            ))}
          </div>
        </div>

        {/* Action Prompt */}
        <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-foreground">Have questions about calculating your monthly installment?</h2>
            <p className="mt-1 text-xs text-slate-600">Our customer team can assist you with card verification and monthly payment breakdowns.</p>
          </div>
          <Link
            href="/contact"
            className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white transition hover:brightness-90 shrink-0"
          >
            Contact Helpdesk
          </Link>
        </div>
      </div>
    </main>
    </>
  );
}
