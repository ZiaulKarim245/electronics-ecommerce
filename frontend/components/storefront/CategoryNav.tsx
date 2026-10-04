"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export interface SubCategory {
  name: string;
  href: string;
  hasSubmenu?: boolean;
}

export interface NavCategory {
  name: string;
  href: string;
  subcategories?: SubCategory[];
}

export const navCategories: NavCategory[] = [
  {
    name: "Desktop",
    href: "/desktops",
    subcategories: [
      { name: "AI PC", href: "/ai-pc" },
      { name: "Desktop Offer", href: "/desktop-offer" },
      { name: "Star PC (Custom Build)", href: "/star-pc" },
      { name: "Gaming PC", href: "/gaming-pc" },
      { name: "Brand PC", href: "/brand-pc" },
      { name: "All-in-One PC", href: "/all-in-one-pc" },
      { name: "Portable Mini PC", href: "/portable-mini-pc" },
      { name: "Apple Mac Mini", href: "/apple-mac-mini" },
      { name: "Apple iMac", href: "/apple-imac" },
      { name: "Apple Mac Studio", href: "/apple-mac-studio" },
      { name: "Apple Mac Pro", href: "/apple-mac-pro" },
      { name: "Show All Desktop", href: "/desktops" },
    ],
  },
  {
    name: "Laptop",
    href: "/laptop",
    subcategories: [
      { name: "All Laptops", href: "/laptop" },
      { name: "Gaming Laptop", href: "/gaming-laptop" },
      { name: "Premium Ultrabook", href: "/ultrabook" },
      { name: "Apple MacBook", href: "/macbook" },
      { name: "Touch Screen Laptop", href: "/touch-laptop" },
      { name: "Budget Office Laptop", href: "/budget-laptop" },
      { name: "Laptop Accessories", href: "/laptop-accessories" },
    ],
  },
  {
    name: "Component",
    href: "/component",
    subcategories: [
      { name: "Processor (CPU)", href: "/processor" },
      { name: "Motherboard", href: "/motherboard" },
      { name: "Graphics Card (GPU)", href: "/gpu" },
      { name: "RAM (Memory)", href: "/ram" },
      { name: "Power Supply (PSU)", href: "/psu" },
      { name: "Storage (SSD & HDD)", href: "/storage" },
      { name: "Casing & Enclosure", href: "/casing" },
      { name: "CPU Cooler & Liquid", href: "/cooler" },
    ],
  },
  {
    name: "Monitor",
    href: "/monitor",
    subcategories: [
      { name: "Gaming Monitor (144Hz+)", href: "/gaming-monitor" },
      { name: "4K / Ultra-Wide Monitor", href: "/4k-monitor" },
      { name: "Curved OLED Monitor", href: "/oled-monitor" },
      { name: "Budget Office Monitor", href: "/office-monitor" },
      { name: "Portable Monitor", href: "/portable-monitor" },
    ],
  },
  {
    name: "Power",
    href: "/power",
    subcategories: [
      { name: "Online UPS", href: "/online-ups" },
      { name: "Offline UPS", href: "/offline-ups" },
      { name: "Line Interactive UPS", href: "/line-interactive-ups" },
      { name: "Voltage Stabilizer", href: "/voltage-stabilizer" },
      { name: "Solar Inverter & IPS", href: "/inverter" },
    ],
  },
  {
    name: "Phone",
    href: "/phone",
    subcategories: [
      { name: "Apple iPhone", href: "/iphone" },
      { name: "Samsung Galaxy", href: "/samsung-phone" },
      { name: "Xiaomi / Redmi", href: "/xiaomi-phone" },
      { name: "Google Pixel", href: "/pixel-phone" },
      { name: "OnePlus", href: "/oneplus-phone" },
      { name: "Feature Phone", href: "/feature-phone" },
    ],
  },
  {
    name: "Tablet",
    href: "/tablet",
    subcategories: [
      { name: "Apple iPad", href: "/ipad" },
      { name: "iPad Pro & Air", href: "/ipad-pro" },
      { name: "Samsung Galaxy Tab", href: "/samsung-tab" },
      { name: "Graphics Drawing Tablet", href: "/drawing-tablet" },
      { name: "Kids Tablet", href: "/kids-tablet" },
    ],
  },
  {
    name: "Office Equipment",
    href: "/office-equipment",
    subcategories: [
      { name: "Laser & Ink Printer", href: "/printer" },
      { name: "All-in-One Ink Tank", href: "/ink-tank-printer" },
      { name: "Projector & Screen", href: "/projector" },
      { name: "Barcode Scanner & POS", href: "/barcode-scanner" },
      { name: "Paper Shredder", href: "/paper-shredder" },
      { name: "Photocopier", href: "/photocopier" },
    ],
  },
  {
    name: "Camera",
    href: "/camera",
    subcategories: [
      { name: "Mirrorless Camera", href: "/mirrorless-camera" },
      { name: "DSLR Camera", href: "/dslr-camera" },
      { name: "Action & Vlogging Camera", href: "/action-camera" },
      { name: "Camera Lens", href: "/camera-lens" },
      { name: "Gimbal & Stabilizer", href: "/gimbal" },
      { name: "Drone & Quadcopter", href: "/drone" },
    ],
  },
  {
    name: "Security",
    href: "/security",
    subcategories: [
      { name: "IP & Wi-Fi Camera", href: "/ip-camera" },
      { name: "CCTV Dome & Bullet", href: "/cctv-camera" },
      { name: "DVR & NVR Kit", href: "/dvr-nvr" },
      { name: "Smart Door Lock", href: "/smart-lock" },
      { name: "Biometric Attendance", href: "/attendance-machine" },
      { name: "Video Doorbell", href: "/video-doorbell" },
    ],
  },
  {
    name: "Networking",
    href: "/networking",
    subcategories: [
      { name: "Wi-Fi 6 / 7 Router", href: "/router" },
      { name: "Mesh Wi-Fi System", href: "/mesh-wifi" },
      { name: "Network Switch & PoE", href: "/network-switch" },
      { name: "Access Point & Range Extender", href: "/access-point" },
      { name: "Network Cable & Patch Cord", href: "/network-cable" },
    ],
  },
  {
    name: "Software",
    href: "/software",
    subcategories: [
      { name: "Microsoft Windows 11", href: "/windows-os" },
      { name: "Microsoft Office 365", href: "/microsoft-office" },
      { name: "Antivirus & Internet Security", href: "/antivirus" },
      { name: "Adobe Creative Cloud", href: "/adobe" },
      { name: "Server & Database License", href: "/server-license" },
    ],
  },
  {
    name: "Servers",
    href: "/server-storage",
    subcategories: [
      { name: "Rack Server", href: "/rack-server" },
      { name: "Tower Server", href: "/tower-server" },
      { name: "NAS Network Storage", href: "/nas-storage" },
      { name: "Enterprise Server HDD", href: "/enterprise-hdd" },
      { name: "Server RAM & ECC", href: "/server-ram" },
    ],
  },
  {
    name: "Accessories",
    href: "/accessories",
    subcategories: [
      { name: "Keyboard & Mouse Combo", href: "/keyboard" },
      { name: "Headphone & Earphone", href: "/headset" },
      { name: "USB Hub & Docking Station", href: "/usb-hub" },
      { name: "Power Bank & Cable", href: "/power-bank" },
      { name: "External Hard Drive & SSD", href: "/external-hdd" },
      { name: "Laptop Stand & Backpack", href: "/laptop-stand" },
    ],
  },
  {
    name: "Gadget",
    href: "/gadget",
    subcategories: [
      { name: "Smart Watch", href: "/smart-watch" },
      { name: "Earbuds (TWS)", href: "/earbuds" },
      { name: "Bluetooth Speaker", href: "/bluetooth-speaker" },
      { name: "Smart Fitness Band", href: "/smart-band" },
      { name: "Stylus & Smart Pen", href: "/stylus" },
    ],
  },
  {
    name: "Gaming",
    href: "/gaming",
    subcategories: [
      { name: "Gaming Console (PS5/Xbox)", href: "/gaming-console" },
      { name: "Gaming Chair & Desk", href: "/gaming-chair" },
      { name: "Mechanical Gaming Keyboard", href: "/keyboard" },
      { name: "Gaming Mouse & Pad", href: "/mouse" },
      { name: "Gaming Headset", href: "/headset" },
      { name: "Game Controller & Wheel", href: "/controller" },
    ],
  },
  {
    name: "TV",
    href: "/tv",
    subcategories: [
      { name: "4K Ultra HD Smart TV", href: "/4k-smart-tv" },
      { name: "OLED & QLED TV", href: "/oled-tv" },
      { name: "Google / Android TV", href: "/google-tv" },
      { name: "Soundbar & Home Theater", href: "/soundbar" },
      { name: "TV Box & Streaming Stick", href: "/tv-box" },
    ],
  },
  {
    name: "Appliance",
    href: "/appliance",
    subcategories: [
      { name: "Inverter Air Conditioner (AC)", href: "/inverter-ac" },
      { name: "Non-Inverter AC", href: "/non-inverter-ac" },
      { name: "Refrigerator & Deep Fridge", href: "/refrigerator" },
      { name: "Washing Machine", href: "/washing-machine" },
      { name: "Microwave & Electric Oven", href: "/microwave-oven" },
      { name: "Air Purifier & Humidifier", href: "/air-purifier" },
    ],
  },
];

export default function CategoryNav() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="relative z-10 hidden border-b border-slate-200 bg-white shadow-xs xl:block">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
        {navCategories.map((item, idx) => {
          const hasChildren = Boolean(item.subcategories && item.subcategories.length > 0);
          const isOpen = openDropdown === item.name;
          const isRightAligned = idx >= navCategories.length - 5;
          const isActive =
            pathname === item.href ||
            Boolean(item.subcategories?.some((sub) => sub.href === pathname));

          return (
            <div
              key={item.name}
              className="relative group shrink-0"
              onMouseEnter={() => setOpenDropdown(item.name)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {/* Category Top Link */}
              <Link
                href={item.href}
                onClick={() => setOpenDropdown(null)}
                className={`hover-gradient-text nav-border-hover relative z-20 block whitespace-nowrap px-1.5 2xl:px-2.5 py-[10px] text-[13px] 2xl:text-[14px] font-semibold -mb-px ${isActive || isOpen ? "nav-item-active" : ""
                  }`}
              >
                {item.name}
              </Link>


              {/* Cascading Dropdown Menu */}
              {hasChildren && isOpen && (
                <div
                  className={`absolute ${isRightAligned ? "right-0" : "left-0"
                    } top-[calc(100%+1px)] z-50 w-60 rounded-xl border border-slate-200 bg-white py-2 shadow-xl text-slate-800 animate-in fade-in slide-in-from-top-1 duration-150`}
                >
                  <div className="flex flex-col divide-y divide-slate-100">
                    {item.subcategories!.map((sub) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={() => setOpenDropdown(null)}
                          className={`group/sub flex items-center justify-between px-4 py-2.5 text-xs font-semibold transition ${isSubActive
                              ? "text-primary bg-primary/5 font-bold"
                              : "text-slate-700 hover:bg-slate-50 hover-gradient-text"
                            }`}
                        >
                          <span className="truncate">{sub.name}</span>
                          {sub.hasSubmenu && (
                            <span className="text-[10px] text-primary font-bold group-hover/sub:translate-x-0.5 transition">
                              ▶
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
