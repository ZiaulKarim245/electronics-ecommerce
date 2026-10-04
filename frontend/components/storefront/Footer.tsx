import type { ReactNode } from "react";
import Link from "next/link";
import { storefrontConfig } from "@/lib/storefrontConfig";

type IconName = "shield" | "truck" | "bolt" | "cash" | "phone" | "mail" | "pin" | "clock";

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    shield: <path d="M12 3 5 6v5c0 4.6 2.9 8.1 7 10 4.1-1.9 7-5.4 7-10V6l-7-3Zm-3 9 2 2 4-4" />,
    truck: <path d="M3 6h11v10H3V6Zm11 4h4l3 3v3h-7v-6ZM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />,
    bolt: <path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z" />,
    cash: <path d="M3 6h18v12H3V6Zm4 3a3 3 0 0 1-1 2v2a3 3 0 0 1 1 2h10a3 3 0 0 1 1-2v-2a3 3 0 0 1-1-2H7Zm5 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />,
    phone: <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-4-2-2 2c-3.7-1.6-6.4-4.3-8-8l2-2-2-4Z" />,
    mail: <path d="M3 5h18v14H3V5Zm1 2 8 6 8-6" />,
    pin: <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Zm-8 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
    clock: <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-15v5l3 2" />,
  };

  return <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className={className}>{paths[name]}</svg>;
}



const linkGroups = [
  {
    title: "Information",
    links: [
      ["About Us", "/about"],
      ["Brands", "/brands"],
      ["Blog", "/blog"],
      ["Affiliation", "/affiliation"],
      ["Service Centers", "/service-centers"],
      ["EMI Information", "/emi"],
    ]
  },
  {
    title: "Policies",
    links: [
      ["Privacy Policy", "/privacy"],
      ["Warranty Policy", "/warranty"],
      ["Payment Terms", "/payments"],
      ["Delivery Policy", "/shipping"],
      ["Terms & Conditions", "/terms"],
      ["Refund and Return Policy", "/returns"],
    ]
  },
] as const;

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#0F172A] text-slate-300 font-sans border-t-2 border-primary">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4 lg:gap-0">

          {/* Column 1: Contact Us */}
          <div className="flex flex-col gap-5 lg:col-span-2 lg:border-r lg:border-slate-700 lg:pr-10">
            <h2 className="text-xl font-bold text-white mb-2">Contact Us</h2>

            <div className="flex min-w-0 items-center gap-3 text-sm">
              <div className="flex size-7 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                <Icon name="phone" className="size-4" />
              </div>
              <div className="min-w-0 break-words">
                <span className="font-semibold text-white">Hotline:</span> {storefrontConfig.supportPhone || "(+88) 017348582.."}
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-3 text-sm">
              <div className="flex size-7 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                <Icon name="mail" className="size-4" />
              </div>
              <div className="min-w-0 break-all">
                <span className="font-semibold text-white">Email:</span> {storefrontConfig.supportEmail || "info@techhub.com.bd"}
              </div>
            </div>

            <div className="flex min-w-0 items-start gap-3 text-sm leading-relaxed">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                <Icon name="pin" className="size-4" />
              </div>
              <div className="min-w-0 break-words">
                <span className="font-semibold text-white">Head Office:</span> {storefrontConfig.address || "Level-8, ABC Plaza, 54 New Elephant Road, Dhaka-10000"}
              </div>
            </div>
          </div>

          {/* Columns 2 & 3: Information & Policies */}
          {linkGroups.map((group, idx) => (
            <div
              key={group.title}
              className={`lg:col-span-1 ${idx === 0
                ? "sm:border-r sm:border-slate-700 sm:pr-8 lg:px-10 lg:border-r lg:border-slate-700"
                : "sm:pl-8 lg:pl-10"
                }`}
            >
              <h2 className="text-xl font-bold text-white mb-6">{group.title}</h2>
              <ul className="space-y-3.5">
                {group.links.map(([label, href]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="inline-block text-sm text-slate-300 hover:text-white transition-all duration-200 hover:translate-x-1.5"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar: Copyright on Left, Compact Payment Badges on Right (Matching TechLand style) */}
      <div className="border-t border-slate-800/80 bg-[#070D18] py-4">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-4 sm:px-6 lg:px-10 md:flex-row">
          {/* Left: Copyright */}
          <p className="text-xs text-slate-400 font-normal text-center md:text-left">
            Copyright © {new Date().getFullYear()}, {storefrontConfig.legalName ?? storefrontConfig.name}. All Rights Reserved.
          </p>

          {/* Right: Sleek, compact payment card icons in a single row */}
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
            {/* VISA */}
            <div className="flex h-6 w-[26px] items-center justify-center rounded-[3px] bg-white px-0.5 shadow-xs hover:scale-105 transition-transform">
              <span className="font-black italic text-[#1A1F71] text-[8px] tracking-tight">VISA</span>
            </div>

            {/* MasterCard */}
            <div className="flex h-6 w-[26px] items-center justify-center rounded-[3px] bg-white px-0.5 shadow-xs hover:scale-105 transition-transform">
              <div className="flex items-center -space-x-1">
                <div className="size-2.5 rounded-full bg-[#EB001B]" />
                <div className="size-2.5 rounded-full bg-[#F79E1B]/90" />
              </div>
            </div>

            {/* AMEX */}
            <div className="flex h-6 w-[26px] items-center justify-center rounded-[3px] bg-[#006FCF] px-0.5 shadow-xs hover:scale-105 transition-transform">
              <span className="font-black text-white text-[6px] tracking-tighter">AMEX</span>
            </div>

            {/* UnionPay */}
            <div className="flex h-6 w-[26px] items-center justify-center rounded-[3px] bg-[#D92523] px-0.5 shadow-xs hover:scale-105 transition-transform">
              <span className="font-extrabold text-white text-[5.5px] tracking-tighter">UnionPay</span>
            </div>

            {/* DBBL Nexus / Card */}
            <div className="flex h-6 w-[26px] items-center justify-center rounded-[3px] bg-white px-0.5 shadow-xs hover:scale-105 transition-transform">
              <div className="flex size-3.5 items-center justify-center rounded-full border border-blue-600 text-blue-600 font-black text-[7px]">
                D
              </div>
            </div>

            {/* NexusPay */}
            <div className="flex h-6 w-[26px] flex-col items-center justify-center rounded-[3px] bg-white px-0.5 shadow-xs hover:scale-105 transition-transform">
              <span className="text-[5px] font-black text-slate-800 leading-none">Nexus</span>
              <div className="mt-0.5 flex h-0.5 w-3.5 rounded-full overflow-hidden">
                <div className="w-1/3 bg-blue-600" />
                <div className="w-1/3 bg-green-500" />
                <div className="w-1/3 bg-red-500" />
              </div>
            </div>

            {/* bKash */}
            <div className="flex h-6 w-[26px] items-center justify-center rounded-[3px] bg-white px-0.5 shadow-xs hover:scale-105 transition-transform">
              <div className="flex items-center gap-0.5">
                <span className="font-black text-[#D12053] text-[6.5px] tracking-tighter">bKash</span>
                <span className="text-[#D12053] text-[5.5px]">🐦</span>
              </div>
            </div>

            {/* Nagad */}
            <div className="flex h-6 w-[26px] items-center justify-center rounded-[3px] bg-white px-0.5 shadow-xs hover:scale-105 transition-transform">
              <div className="flex items-center gap-0.5">
                <span className="text-[6px]">🔥</span>
                <span className="font-black text-[#ED1C24] text-[6.5px]">নগদ</span>
              </div>
            </div>

            {/* Rocket */}
            <div className="flex h-6 w-[26px] flex-col items-center justify-center rounded-[3px] bg-white px-0.5 shadow-xs hover:scale-105 transition-transform">
              <span className="text-[4.5px] font-black text-[#8C3494] uppercase leading-none">Rocket</span>
              <span className="font-black text-[#8C3494] text-[6px] leading-none mt-0.5">রকেট</span>
            </div>

            {/* Upay */}
            <div className="flex h-6 w-[26px] flex-col items-center justify-center rounded-[3px] bg-white px-0.5 shadow-xs hover:scale-105 transition-transform">
              <div className="flex items-center gap-0.5">
                <span className="size-0.5 rounded-full bg-amber-400" />
                <span className="size-0.5 rounded-full bg-blue-600" />
              </div>
              <span className="font-black text-[#00519E] text-[6.5px] leading-none mt-0.5">উপায়</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
