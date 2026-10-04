"use client";

import { useEffect, useMemo, useRef, useState, useTransition, Suspense } from "react";
import { useParams, useRouter, useSearchParams, notFound } from "next/navigation";
import { CategoryPageSkeleton } from "@/components/ui/Skeleton";

import ProductCard, { type Product } from "@/components/storefront/ProductCard";
import Breadcrumbs from "@/components/storefront/Breadcrumbs";
import { type ProductVisualType } from "@/components/storefront/ProductVisual";
import Link from "next/link";




interface FilterCriterion {
  name: string;
  options: string[];
}

interface CategoryConfig {
  title: string;
  seoDescription: string;
  pills: { name: string; href: string }[];
  filters: FilterCriterion[];
}

const categoryConfigs: { [key: string]: CategoryConfig } = {
  desktops: {
    title: "Desktop",
    seoDescription:
      "Desktop PC Price in Bangladesh starts from BDT 25,000 and depending on configuration can go up to BDT 600,000+. At TechHub you can get the latest configured custom Desktop PC, Gaming PC, Brand PC, All-in-One PC, Portable Mini PC etc. Browse below and order yours now!",
    pills: [
      { name: "All Desktops", href: "/desktops" },
      { name: "AI PC", href: "/ai-pc" },
      { name: "Desktop Offer", href: "/desktop-offer" },
      { name: "Star PC", href: "/star-pc" },
      { name: "Gaming PC", href: "/gaming-pc" },
      { name: "Brand PC", href: "/brand-pc" },
      { name: "All-in-One PC", href: "/all-in-one-pc" },
      { name: "Portable Mini PC", href: "/portable-mini-pc" },
      { name: "Apple Mac Mini", href: "/apple-mac-mini" },
      { name: "Apple iMac", href: "/apple-imac" },
      { name: "Apple Mac Studio", href: "/apple-mac-studio" },
    ],
    filters: [
      { name: "Desktop Type", options: ["Custom PC", "Gaming PC", "Star PC", "Brand PC", "All-in-One PC", "Portable Mini PC", "Apple Mac"] },
      { name: "Processor Brand", options: ["Intel", "AMD", "Apple"] },
      { name: "Processor Series", options: ["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "Intel Celeron / Core 3", "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "Apple M2 / M3"] },
      { name: "RAM (Memory)", options: ["8GB", "16GB", "32GB", "64GB"] },
      { name: "Storage", options: ["256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD"] },
      { name: "Graphics", options: ["Integrated / Shared", "Dedicated 4GB", "Dedicated 8GB", "Dedicated 12GB+"] },
    ],
  },
  laptop: {
    title: "Laptop",
    seoDescription:
      "Latest Laptop Price in Bangladesh starts from BDT 35,000 for student/office laptops to BDT 450,000 for high-end Apple MacBooks and RTX Gaming Laptops with official warranty.",
    pills: [
      { name: "All Laptops", href: "/laptop" },
      { name: "Gaming Laptop", href: "/gaming-laptop" },
      { name: "Premium Ultrabook", href: "/ultrabook" },
      { name: "Apple MacBook", href: "/macbook" },
      { name: "Budget Laptops", href: "/budget-laptop" },
      { name: "Touch Screen Laptop", href: "/touch-laptop" },
    ],
    filters: [
      { name: "Laptop Brand", options: ["Apple", "Asus", "Lenovo", "HP", "Dell", "MSI", "Acer"] },
      { name: "Screen Size", options: ["13.3 Inch", "14.0 Inch", "15.6 Inch", "16.0 Inch", "17.3 Inch"] },
      { name: "Processor", options: ["Intel Core i3/i5", "Intel Core i7/i9", "AMD Ryzen 5/7", "Apple M2/M3"] },
      { name: "RAM", options: ["8 GB", "16 GB", "32 GB", "64 GB"] },
    ],
  },
  component: {
    title: "Computer Hardware & PC Component",
    seoDescription:
      "Buy 100% genuine PC parts in Bangladesh with official brand warranty. Build your custom gaming or workstation desktop with processors, motherboards, GPUs, and power supplies.",
    pills: [
      { name: "Processor (CPU)", href: "/processor" },
      { name: "Motherboard", href: "/motherboard" },
      { name: "Graphics Card (GPU)", href: "/gpu" },
      { name: "RAM (Memory)", href: "/ram" },
      { name: "Power Supply (PSU)", href: "/psu" },
      { name: "Storage (SSD / M.2)", href: "/storage" },
      { name: "Casing", href: "/casing" },
      { name: "CPU Cooler", href: "/cooler" },
    ],
    filters: [
      { name: "Component Type", options: ["Processor", "Motherboard", "Graphics Card", "RAM", "SSD", "PSU", "Casing"] },
      { name: "Brand", options: ["AMD", "Intel", "NVIDIA", "Asus", "MSI", "Gigabyte", "Corsair", "Samsung"] },
      { name: "Warranty Duration", options: ["1 Year", "2 Years", "3 Years", "5 Years", "Lifetime"] },
    ],
  },
  monitor: {
    title: "Monitor",
    seoDescription:
      "Explore 1080p FHD, 2K QHD, 4K UHD, and Curved OLED gaming monitors in Bangladesh from Samsung, LG, Asus, MSI, and Dell at best prices.",
    pills: [
      { name: "Gaming Monitor", href: "/gaming-monitor" },
      { name: "4K Monitor", href: "/4k-monitor" },
      { name: "Curved Monitor", href: "/curved-monitor" },
      { name: "OLED Monitor", href: "/oled-monitor" },
      { name: "Budget Office Monitor", href: "/office-monitor" },
    ],
    filters: [
      { name: "Brand", options: ["Samsung", "LG", "Asus", "MSI", "Dell", "BenQ", "Acer"] },
      { name: "Display Size", options: ['21.5" - 24"', '27"', '32"', '34" - 49" Ultra-Wide'] },
      { name: "Refresh Rate", options: ["75Hz", "100Hz", "144Hz", "165Hz", "240Hz+"] },
      { name: "Panel Type", options: ["IPS", "OLED", "VA", "TN"] },
    ],
  },
  phone: {
    title: "Smartphones & Mobile",
    seoDescription:
      "Latest official smartphone prices in Bangladesh. Buy Apple iPhone, Samsung Galaxy, Xiaomi, and Google Pixel with BTRC official approval and IMEI warranty.",
    pills: [
      { name: "Apple iPhone", href: "/iphone" },
      { name: "Samsung Galaxy", href: "/samsung-phone" },
      { name: "Xiaomi / Redmi", href: "/xiaomi-phone" },
      { name: "Google Pixel", href: "/pixel-phone" },
      { name: "Feature Phones", href: "/feature-phone" },
    ],
    filters: [
      { name: "Brand", options: ["Apple", "Samsung", "Xiaomi", "Google", "OnePlus", "Realme"] },
      { name: "Storage", options: ["64 GB", "128 GB", "256 GB", "512 GB", "1 TB"] },
      { name: "Network", options: ["5G Ready", "4G LTE"] },
    ],
  },
  power: {
    title: "UPS & Power Supply",
    seoDescription:
      "Protect your precious electronics from voltage fluctuations and power outages with Online, Offline, and Line-Interactive UPS systems.",
    pills: [
      { name: "Online UPS", href: "/online-ups" },
      { name: "Offline UPS", href: "/offline-ups" },
      { name: "Voltage Stabilizer", href: "/voltage-stabilizer" },
      { name: "Solar Inverter", href: "/inverter" },
    ],
    filters: [
      { name: "Brand", options: ["Apollo", "MaxGreen", "Prolink", "APC", "Kstar"] },
      { name: "Capacity", options: ["650VA", "1200VA", "2000VA", "3KVA", "6KVA", "10KVA"] },
    ],
  },
  networking: {
    title: "Router & Networking Device",
    seoDescription:
      "High-speed Wi-Fi 6 & Wi-Fi 7 routers, Mesh systems, Gigabit switches, and optical fiber accessories in Bangladesh.",
    pills: [
      { name: "Wi-Fi 6 / 7 Router", href: "/router" },
      { name: "Mesh Wi-Fi", href: "/mesh-wifi" },
      { name: "Network Switch", href: "/network-switch" },
      { name: "Access Point", href: "/access-point" },
    ],
    filters: [
      { name: "Brand", options: ["TP-Link", "Tenda", "Netgear", "MikroTik", "Cisco", "D-Link"] },
      { name: "Wi-Fi Speed", options: ["300 Mbps", "1200 Mbps (AC)", "1800 Mbps (AX)", "3000 Mbps+"] },
      { name: "Antennas", options: ["2 Antennas", "4 Antennas", "6+ Antennas"] },
    ],
  },
  tablet: {
    title: "Tablet PC & iPad",
    seoDescription:
      "Buy Apple iPad, iPad Air, iPad Pro, Samsung Galaxy Tab, and graphic drawing tablets in Bangladesh with official brand warranty and stylus support.",
    pills: [
      { name: "Apple iPad", href: "/ipad" },
      { name: "iPad Pro", href: "/ipad-pro" },
      { name: "Samsung Galaxy Tab", href: "/samsung-tab" },
      { name: "Drawing Tablet", href: "/drawing-tablet" },
      { name: "Kids Tablet", href: "/kids-tablet" },
    ],
    filters: [
      { name: "Brand", options: ["Apple", "Samsung", "Xiaomi", "Huion", "Wacom", "Lenovo"] },
      { name: "Screen Size", options: ['8.7"', '10.2"', '11.0"', '12.9" - 14.6"'] },
      { name: "RAM & Storage", options: ["4GB / 64GB", "6GB / 128GB", "8GB / 256GB", "16GB / 512GB+"] },
      { name: "Cellular Support", options: ["Wi-Fi Only", "Wi-Fi + 5G LTE (SIM)"] },
    ],
  },
  gaming: {
    title: "Gaming Accessories & Gear",
    seoDescription:
      "Upgrade your battle-station with mechanical keyboards, RGB gaming mice, spatial audio headsets, and ergonomic gaming chairs.",
    pills: [
      { name: "Mechanical Keyboard", href: "/keyboard" },
      { name: "Gaming Mouse", href: "/mouse" },
      { name: "Gaming Headset", href: "/headset" },
      { name: "Gaming Chair", href: "/gaming-chair" },
      { name: "Game Controller", href: "/controller" },
    ],
    filters: [
      { name: "Brand", options: ["Razer", "Logitech G", "SteelSeries", "Fantech", "Redragon", "Corsair"] },
      { name: "Connectivity", options: ["Wired USB", "Wireless 2.4GHz", "Bluetooth"] },
      { name: "Lighting", options: ["RGB Chroma", "Single Color", "No LED"] },
    ],
  },
  accessories: {
    title: "Computer & Electronics Accessories",
    seoDescription:
      "Wide selection of external SSDs, USB-C multi-port hubs, power banks, fast charging cables, webcams, and cleaning kits in Bangladesh.",
    pills: [
      { name: "External Storage", href: "/external-hdd" },
      { name: "USB Hub & Docks", href: "/usb-hub" },
      { name: "Power Bank & Cable", href: "/power-bank" },
      { name: "Webcam & Mic", href: "/webcam" },
      { name: "Laptop Stand", href: "/laptop-stand" },
    ],
    filters: [
      { name: "Category", options: ["Storage & Enclosures", "Docks & Adapters", "Power & Chargers", "Audio & Video"] },
      { name: "Brand", options: ["Anker", "Baseus", "UGREEN", "SanDisk", "Transcend", "Logitech"] },
      { name: "Connector Type", options: ["USB-C", "USB 3.0", "Thunderbolt 4", "Lightning"] },
    ],
  },
  "office-equipment": {
    title: "Office Equipment & Automation",
    seoDescription:
      "Buy laser printers, all-in-one ink tanks, 4K business projectors, barcode scanners, and paper shredders in Bangladesh with official brand warranty.",
    pills: [
      { name: "Laser & Ink Printer", href: "/printer" },
      { name: "All-in-One Ink Tank", href: "/ink-tank-printer" },
      { name: "Projector & Screen", href: "/projector" },
      { name: "Barcode Scanner", href: "/barcode-scanner" },
      { name: "Paper Shredder", href: "/paper-shredder" },
      { name: "Photocopier", href: "/photocopier" },
    ],
    filters: [
      { name: "Brand", options: ["HP", "Epson", "Canon", "Brother", "Zebra", "ViewSonic"] },
      { name: "Type", options: ["Single Function", "Multi-Function", "Laser", "Ink Tank", "Projector"] },
      { name: "Connectivity", options: ["Wi-Fi", "USB", "Ethernet LAN", "Bluetooth"] },
    ],
  },
  camera: {
    title: "Camera, Lens & Drone",
    seoDescription:
      "Official mirrorless cameras, professional DSLR bodies, cinema lenses, gimbals, and DJI drones in Bangladesh from Sony, Canon, Nikon, and Fujifilm.",
    pills: [
      { name: "Mirrorless Camera", href: "/mirrorless-camera" },
      { name: "DSLR Camera", href: "/dslr-camera" },
      { name: "Action Camera", href: "/action-camera" },
      { name: "Camera Lens", href: "/camera-lens" },
      { name: "Gimbal & Stabilizer", href: "/gimbal" },
      { name: "Drone & Quadcopter", href: "/drone" },
    ],
    filters: [
      { name: "Brand", options: ["Sony", "Canon", "Nikon", "Fujifilm", "GoPro", "DJI", "Insta360"] },
      { name: "Sensor Type", options: ["Full Frame", "APS-C", "Micro Four Thirds", "1-Inch"] },
      { name: "Video Resolution", options: ["4K 60fps", "4K 120fps", "8K UHD", "1080p FHD"] },
    ],
  },
  security: {
    title: "Security & Surveillance System",
    seoDescription:
      "HD CCTV cameras, Smart Wi-Fi IP cameras, 4K DVR/NVR kits, biometric attendance, and smart door locks in Bangladesh from Dahua, Hikvision, and Ezviz.",
    pills: [
      { name: "IP & Wi-Fi Camera", href: "/ip-camera" },
      { name: "CCTV Camera", href: "/cctv-camera" },
      { name: "DVR & NVR Kit", href: "/dvr-nvr" },
      { name: "Smart Door Lock", href: "/smart-lock" },
      { name: "Biometric Attendance", href: "/attendance-machine" },
      { name: "Video Doorbell", href: "/video-doorbell" },
    ],
    filters: [
      { name: "Brand", options: ["Hikvision", "Dahua", "Ezviz", "Imou", "TP-Link Tapo", "ZKTeco"] },
      { name: "Camera Resolution", options: ["2 Megapixel (1080p)", "3MP - 4MP 2K", "5MP - 8MP 4K"] },
      { name: "Form Factor", options: ["Dome", "Bullet", "PTZ (Pan/Tilt)", "Doorbell"] },
    ],
  },
  software: {
    title: "Original Software & License",
    seoDescription:
      "Buy 100% genuine software licenses in Bangladesh. Official Microsoft Windows 11, Office 365, Kaspersky, Bitdefender antivirus, and Adobe Creative Cloud.",
    pills: [
      { name: "Microsoft Windows 11", href: "/windows-os" },
      { name: "Microsoft Office 365", href: "/microsoft-office" },
      { name: "Antivirus & Security", href: "/antivirus" },
      { name: "Adobe Creative Cloud", href: "/adobe" },
      { name: "Server License", href: "/server-license" },
    ],
    filters: [
      { name: "Brand", options: ["Microsoft", "Kaspersky", "Bitdefender", "ESET", "Adobe", "Norton"] },
      { name: "License Type", options: ["Lifetime Retail", "1-Year Subscription", "OEM License"] },
      { name: "User Count", options: ["1 User", "3 Users", "5 Users", "Multi-Device"] },
    ],
  },
  "server-storage": {
    title: "Server & Enterprise Storage",
    seoDescription:
      "Enterprise Rack & Tower servers, Synology NAS, enterprise hard drives, and ECC server memory in Bangladesh from Dell EMC, HPE, Lenovo, and Synology.",
    pills: [
      { name: "Rack Server", href: "/rack-server" },
      { name: "Tower Server", href: "/tower-server" },
      { name: "NAS Storage", href: "/nas-storage" },
      { name: "Enterprise Server HDD", href: "/enterprise-hdd" },
      { name: "Server RAM & ECC", href: "/server-ram" },
    ],
    filters: [
      { name: "Brand", options: ["Dell EMC", "HPE", "Lenovo", "Synology", "QNAP", "Seagate Exos"] },
      { name: "Form Factor", options: ["1U Rack", "2U Rack", "Tower", "2-Bay NAS", "4-Bay NAS"] },
      { name: "Processor Support", options: ["Intel Xeon Silver/Gold", "AMD EPYC", "Single Socket", "Dual Socket"] },
    ],
  },
  gadget: {
    title: "Smart Gadget & Wearables",
    seoDescription:
      "Latest trending smartwatches, active noise-cancelling TWS earbuds, Bluetooth speakers, and fitness trackers in Bangladesh from Apple, Samsung, Haylou, and Anker.",
    pills: [
      { name: "Smart Watch", href: "/smart-watch" },
      { name: "Earbuds (TWS)", href: "/earbuds" },
      { name: "Bluetooth Speaker", href: "/bluetooth-speaker" },
      { name: "Smart Band", href: "/smart-band" },
      { name: "Stylus & Pen", href: "/stylus" },
    ],
    filters: [
      { name: "Brand", options: ["Apple", "Samsung", "Xiaomi", "Amazfit", "Haylou", "Anker Soundcore", "JBL"] },
      { name: "Feature", options: ["Active Noise Cancelling (ANC)", "AMOLED Display", "Water Resistant (IP68)", "Calling Support"] },
      { name: "Battery Life", options: ["Up to 24 Hours", "Up to 3 Days", "Up to 7-14 Days"] },
    ],
  },
  tv: {
    title: "Television & Home Audio",
    seoDescription:
      "Official 4K UHD Smart TVs, QLED & OLED displays, Soundbars, and Google TVs in Bangladesh from Sony Bravia, Samsung, LG, and Xiaomi with brand warranty.",
    pills: [
      { name: "4K UHD Smart TV", href: "/4k-smart-tv" },
      { name: "OLED & QLED TV", href: "/oled-tv" },
      { name: "Google / Android TV", href: "/google-tv" },
      { name: "Soundbar & Audio", href: "/soundbar" },
      { name: "TV Box & Stick", href: "/tv-box" },
    ],
    filters: [
      { name: "Brand", options: ["Sony", "Samsung", "LG", "Xiaomi", "Haier", "Walton"] },
      { name: "Screen Size", options: ['32 Inch', '43 Inch', '55 Inch', '65 Inch', '75 Inch+'] },
      { name: "Resolution", options: ["4K Ultra HD", "Full HD (1080p)", "8K UHD"] },
      { name: "Operating System", options: ["Google TV", "Android TV", "Tizen OS (Samsung)", "webOS (LG)"] },
    ],
  },
  appliance: {
    title: "Home & Kitchen Appliance",
    seoDescription:
      "Smart inverter Air Conditioners (AC), refrigerators, washing machines, microwave ovens, and air purifiers in Bangladesh from Gree, General, Samsung, and Panasonic.",
    pills: [
      { name: "Inverter AC", href: "/inverter-ac" },
      { name: "Non-Inverter AC", href: "/non-inverter-ac" },
      { name: "Refrigerator", href: "/refrigerator" },
      { name: "Washing Machine", href: "/washing-machine" },
      { name: "Microwave Oven", href: "/microwave-oven" },
      { name: "Air Purifier", href: "/air-purifier" },
    ],
    filters: [
      { name: "Brand", options: ["Gree", "General", "Samsung", "Panasonic", "Midea", "LG", "Walton"] },
      { name: "Capacity / Ton", options: ["1.0 Ton (12,000 BTU)", "1.5 Ton (18,000 BTU)", "2.0 Ton (24,000 BTU)"] },
      { name: "Energy Saving", options: ["Inverter (Up to 70% Saving)", "Non-Inverter", "5-Star Rating"] },
    ],
  },
};

interface DynamicProduct {
  id: number;
  title: string;
  categorySlug: string;
  specs: string[];
  regularPrice?: number;
  discountPrice: number;
  saveAmount?: number;
  slug: string;
  visualType: ProductVisualType;
  availability: "In Stock" | "Pre Order" | "Up Coming";
  attributes: Record<string, string[]>;
}

const dynamicProductCatalog: DynamicProduct[] = [
  // Desktops - 16 Authentic Configurations matching StarTech BD & Techland BD
  {
    id: 101,
    title: "AMD Ryzen 3 3200G Budget Desktop PC With Monitor",
    categorySlug: "desktops",
    specs: [
      "AMD Ryzen 3 3200G Processor with Vega 8 Graphics",
      "Gigabyte B450M AM4 Micro ATX Motherboard",
      "8GB DDR4 3200MHz RAM & 256GB NVMe SSD",
      "Eurovision 21.45\" 100Hz FHD Borderless Monitor",
    ],
    regularPrice: 32000,
    discountPrice: 28800,
    saveAmount: 3200,
    slug: "amd-ryzen-3-3200g-budget-desktop-pc-with-monitor",
    visualType: "desktop",
    availability: "In Stock",
    attributes: {
      "Desktop Type": ["Custom PC", "Star PC"],
      "Processor Brand": ["AMD"],
      "Processor Series": ["AMD Ryzen 3"],
      "RAM (Memory)": ["8GB"],
      Storage: ["256GB SSD"],
      Graphics: ["Integrated / Shared"],
    },
  },
  {
    id: 102,
    title: "AMD Ryzen 5 5600GT Budget Desktop PC",
    categorySlug: "desktops",
    specs: [
      "AMD Ryzen 5 5600GT AM4 Processor with Radeon Graphics",
      "MSI A520M-A PRO AM4 AMD ATX Motherboard",
      "Netac Shadow III 8GB DDR4 3200MHz Desktop RAM",
      "Colorful CN600 PRO 256GB M.2 NVMe SSD",
    ],
    regularPrice: 39000,
    discountPrice: 36500,
    saveAmount: 2500,
    slug: "amd-ryzen-5-5600gt-budget-desktop-pc",
    visualType: "desktop",
    availability: "In Stock",
    attributes: {
      "Desktop Type": ["Custom PC", "Star PC"],
      "Processor Brand": ["AMD"],
      "Processor Series": ["AMD Ryzen 5"],
      "RAM (Memory)": ["8GB"],
      Storage: ["256GB SSD"],
      Graphics: ["Integrated / Shared"],
    },
  },
  {
    id: 103,
    title: "AMD Ryzen 7 5700G Custom Gaming Desktop PC",
    categorySlug: "desktops",
    specs: [
      "AMD Ryzen 7 5700G 8-Core Processor with Radeon Graphics",
      "GIGABYTE B450M K AMD AM4 Micro ATX Motherboard",
      "AITC Kingsman Innovator 16GB DDR4 3200MHz RAM",
      "Colorful CN600 PRO 512GB M.2 NVMe SSD",
    ],
    regularPrice: 52000,
    discountPrice: 48000,
    saveAmount: 4000,
    slug: "amd-ryzen-7-5700g-custom-gaming-desktop-pc",
    visualType: "desktop",
    availability: "In Stock",
    attributes: {
      "Desktop Type": ["Gaming PC", "Custom PC"],
      "Processor Brand": ["AMD"],
      "Processor Series": ["AMD Ryzen 7"],
      "RAM (Memory)": ["16GB"],
      Storage: ["512GB SSD"],
      Graphics: ["Integrated / Shared"],
    },
  },
  {
    id: 104,
    title: "Intel Core i3-12100 12th Gen Budget Desktop PC",
    categorySlug: "desktops",
    specs: [
      "Intel Core i3-12100 12th Gen Alder Lake Processor",
      "MSI PRO H610M-S DDR4 m-ATX Motherboard",
      "Corsair Vengeance LPX 8GB 3200MHz DDR4 RAM",
      "Colorful CN600 PRO 256GB M.2 NVMe SSD",
    ],
    regularPrice: 34000,
    discountPrice: 31500,
    saveAmount: 2500,
    slug: "intel-core-i3-12100-12th-gen-budget-desktop-pc",
    visualType: "desktop",
    availability: "In Stock",
    attributes: {
      "Desktop Type": ["Star PC", "Custom PC"],
      "Processor Brand": ["Intel"],
      "Processor Series": ["Intel Core i3"],
      "RAM (Memory)": ["8GB"],
      Storage: ["256GB SSD"],
      Graphics: ["Integrated / Shared"],
    },
  },
  {
    id: 105,
    title: "Intel 12th Gen Core i5-12400 Everyday Workstation PC",
    categorySlug: "desktops",
    specs: [
      "Intel 12th Gen Core i5-12400 Alder Lake 6-Core Processor",
      "MSI PRO H610M-S DDR4 m-ATX Motherboard",
      "Corsair Vengeance LPX 16GB DDR4 3200MHz RAM",
      "Colorful CN600 PRO 512GB M.2 NVMe SSD",
    ],
    regularPrice: 49500,
    discountPrice: 46200,
    saveAmount: 3300,
    slug: "intel-12th-gen-core-i5-12400-desktop-pc",
    visualType: "desktop",
    availability: "In Stock",
    attributes: {
      "Desktop Type": ["Star PC", "Custom PC"],
      "Processor Brand": ["Intel"],
      "Processor Series": ["Intel Core i5"],
      "RAM (Memory)": ["16GB"],
      Storage: ["512GB SSD"],
      Graphics: ["Integrated / Shared"],
    },
  },
  {
    id: 106,
    title: "Intel Core i7 14700 14th Gen RTX 3050 Gaming Desktop PC",
    categorySlug: "desktops",
    specs: [
      "Intel Core i7 14700 14th Gen Raptor Lake Processor",
      "MSI PRO B760M-E DDR5 m-ATX Motherboard",
      "Corsair VENGEANCE RGB 16GB DDR5 6000MHz RAM",
      "Colorful GeForce RTX 3050 Ultra 8GB GDDR6 GPU",
    ],
    regularPrice: 115000,
    discountPrice: 108000,
    saveAmount: 7000,
    slug: "intel-core-i7-14700-14th-gen-gaming-desktop-pc",
    visualType: "desktop",
    availability: "In Stock",
    attributes: {
      "Desktop Type": ["Gaming PC"],
      "Processor Brand": ["Intel"],
      "Processor Series": ["Intel Core i7"],
      "RAM (Memory)": ["16GB"],
      Storage: ["1TB SSD"],
      Graphics: ["Dedicated 8GB"],
    },
  },
  {
    id: 107,
    title: "Intel Core i9 14900K RTX 4080 Super Extreme Gaming PC",
    categorySlug: "desktops",
    specs: [
      "Intel Core i9-14900K 24-Core Unlocked Desktop Processor",
      "ASUS ROG Strix Z790-E Gaming WiFi II Motherboard",
      "Corsair Dominator Titanium 32GB (2x16GB) DDR5 6400MHz",
      "ZOTAC Gaming GeForce RTX 4080 SUPER Trinity 16GB GPU",
    ],
    regularPrice: 385000,
    discountPrice: 365000,
    saveAmount: 20000,
    slug: "intel-core-i9-14900k-rtx-4080-super-gaming-pc",
    visualType: "desktop",
    availability: "Pre Order",
    attributes: {
      "Desktop Type": ["Gaming PC"],
      "Processor Brand": ["Intel"],
      "Processor Series": ["Intel Core i9"],
      "RAM (Memory)": ["32GB"],
      Storage: ["2TB SSD"],
      Graphics: ["Dedicated 12GB+"],
    },
  },
  {
    id: 108,
    title: "AMD Ryzen 9 7950X RTX 4070 Ti Super 3D Workstation PC",
    categorySlug: "desktops",
    specs: [
      "AMD Ryzen 9 7950X 16-Core 32-Thread 5.7GHz Processor",
      "GIGABYTE X670 AORUS ELITE AX AM5 ATX Motherboard",
      "G.Skill Ripjaws S5 32GB DDR5 6000MHz Desktop RAM",
      "GIGABYTE GeForce RTX 4070 Ti SUPER Gaming OC 16GB GPU",
    ],
    regularPrice: 295000,
    discountPrice: 278000,
    saveAmount: 17000,
    slug: "amd-ryzen-9-7950x-rtx-4070-ti-super-workstation-pc",
    visualType: "desktop",
    availability: "In Stock",
    attributes: {
      "Desktop Type": ["Gaming PC", "Custom PC"],
      "Processor Brand": ["AMD"],
      "Processor Series": ["AMD Ryzen 9"],
      "RAM (Memory)": ["32GB"],
      Storage: ["1TB SSD"],
      Graphics: ["Dedicated 12GB+"],
    },
  },
  {
    id: 109,
    title: "Asus NUC 14 Essential Intel N97 Portable Mini PC",
    categorySlug: "desktops",
    specs: [
      "Processor: Intel N97 12W 4-Core 4-Threads",
      "RAM: 8GB DDR5 4800MHz (Supports up to 16GB)",
      "Storage: 256GB M.2 NVMe PCIe SSD",
      "Intel Wi-Fi 6E AX211, Bluetooth 5.3, 2.5G LAN",
    ],
    regularPrice: 29500,
    discountPrice: 27000,
    saveAmount: 2500,
    slug: "asus-nuc-14-essential-intel-n97-mini-pc",
    visualType: "desktop",
    availability: "In Stock",
    attributes: {
      "Desktop Type": ["Portable Mini PC"],
      "Processor Brand": ["Intel"],
      "Processor Series": ["Intel Celeron / Core 3"],
      "RAM (Memory)": ["8GB"],
      Storage: ["256GB SSD"],
      Graphics: ["Integrated / Shared"],
    },
  },
  {
    id: 110,
    title: "ASUS ExpertCenter PN53 Ryzen 5 7535H Portable Mini PC",
    categorySlug: "desktops",
    specs: [
      "Processor: AMD Ryzen 5 7535H 6C/12T up to 4.55GHz",
      "RAM: 16GB DDR5 4800MHz (Dual Slot Support)",
      "Storage: 512GB M.2 2280 PCIe 4.0 NVMe SSD",
      "Integrated AMD Radeon 660M Graphics, Wi-Fi 6E",
    ],
    regularPrice: 58000,
    discountPrice: 53500,
    saveAmount: 4500,
    slug: "asus-expertcenter-pn53-ryzen-5-7535h-mini-pc",
    visualType: "desktop",
    availability: "In Stock",
    attributes: {
      "Desktop Type": ["Portable Mini PC"],
      "Processor Brand": ["AMD"],
      "Processor Series": ["AMD Ryzen 5"],
      "RAM (Memory)": ["16GB"],
      Storage: ["512GB SSD"],
      Graphics: ["Integrated / Shared"],
    },
  },
  {
    id: 111,
    title: "Asus ExpertCenter D500 Core i5 14400 Mini Tower Brand PC",
    categorySlug: "desktops",
    specs: [
      "Intel Core i5 14400 14th Gen 10-Core Processor",
      "Intel B760 Chipset Motherboard, TPM 2.0 Security",
      "8GB DDR5 4800MHz RAM (Expandable to 64GB)",
      "512GB M.2 NVMe PCIe 4.0 SSD, USB Mouse & Keyboard",
    ],
    regularPrice: 69000,
    discountPrice: 64500,
    saveAmount: 4500,
    slug: "asus-expertcenter-d500-core-i5-14400-brand-pc",
    visualType: "desktop",
    availability: "In Stock",
    attributes: {
      "Desktop Type": ["Brand PC"],
      "Processor Brand": ["Intel"],
      "Processor Series": ["Intel Core i5"],
      "RAM (Memory)": ["8GB"],
      Storage: ["512GB SSD"],
      Graphics: ["Integrated / Shared"],
    },
  },
  {
    id: 112,
    title: "AOC A33 Intel Celeron N5095 23.8\" FHD All in One PC",
    categorySlug: "desktops",
    specs: [
      "Intel Celeron N5095 (4-Core, Up to 2.90 GHz)",
      "23.8\" Full HD (1920x1080) Borderless IPS Display",
      "8GB DDR4 RAM, 256GB NVMe PCIe SSD",
      "Built-in Stereo Speaker, Wireless Keyboard & Mouse",
    ],
    regularPrice: 36500,
    discountPrice: 33900,
    saveAmount: 2600,
    slug: "aoc-a33-intel-celeron-n5095-all-in-one-pc",
    visualType: "monitor",
    availability: "In Stock",
    attributes: {
      "Desktop Type": ["All-in-One PC"],
      "Processor Brand": ["Intel"],
      "Processor Series": ["Intel Celeron / Core 3"],
      "RAM (Memory)": ["8GB"],
      Storage: ["256GB SSD"],
      Graphics: ["Integrated / Shared"],
    },
  },
  {
    id: 113,
    title: "ASUS ExpertCenter P400 AiO Core 7 240H 23.8\" FHD All-in-One PC",
    categorySlug: "desktops",
    specs: [
      "Intel Core 7 240H 16MB Cache, up to 5.40 GHz",
      "23.8\" FHD Anti-glare IPS Display with 100% sRGB",
      "16GB DDR5 5200MHz RAM, 1TB NVMe PCIe 4.0 SSD",
      "720p HD Camera with Privacy Shutter, Wi-Fi 6E",
    ],
    regularPrice: 125000,
    discountPrice: 118000,
    saveAmount: 7000,
    slug: "asus-expertcenter-p400-aio-core-7-all-in-one-pc",
    visualType: "monitor",
    availability: "In Stock",
    attributes: {
      "Desktop Type": ["All-in-One PC"],
      "Processor Brand": ["Intel"],
      "Processor Series": ["Intel Core i7"],
      "RAM (Memory)": ["16GB"],
      Storage: ["1TB SSD"],
      Graphics: ["Integrated / Shared"],
    },
  },
  {
    id: 114,
    title: "Apple Mac Mini M2 Chip (8-Core CPU, 10-Core GPU, 8GB RAM, 256GB SSD)",
    categorySlug: "desktops",
    specs: [
      "Apple M2 Chip with 8-Core CPU and 10-Core GPU",
      "8GB Unified Memory, 256GB Superfast SSD",
      "Two Thunderbolt 4 Ports, HDMI, USB-A, Gigabit Ethernet",
      "macOS Sonoma, Support for up to Two Displays",
    ],
    regularPrice: 78000,
    discountPrice: 72500,
    saveAmount: 5500,
    slug: "apple-mac-mini-m2-8gb-256gb",
    visualType: "desktop",
    availability: "In Stock",
    attributes: {
      "Desktop Type": ["Apple Mac", "Portable Mini PC"],
      "Processor Brand": ["Apple"],
      "Processor Series": ["Apple M2 / M3"],
      "RAM (Memory)": ["8GB"],
      Storage: ["256GB SSD"],
      Graphics: ["Integrated / Shared"],
    },
  },
  {
    id: 115,
    title: "Apple iMac 24\" 4.5K Retina Display M3 Chip (8GB RAM, 256GB SSD)",
    categorySlug: "desktops",
    specs: [
      "Apple M3 Chip (8-Core CPU, 8-Core GPU)",
      "24-inch 4.5K Retina Display (4480x2520, 500 nits)",
      "8GB Unified Memory, 256GB SSD Storage",
      "1080p FaceTime HD Camera, Magic Keyboard & Mouse",
    ],
    regularPrice: 185000,
    discountPrice: 172000,
    saveAmount: 13000,
    slug: "apple-imac-24-inch-4-5k-retina-m3",
    visualType: "monitor",
    availability: "In Stock",
    attributes: {
      "Desktop Type": ["Apple Mac", "All-in-One PC"],
      "Processor Brand": ["Apple"],
      "Processor Series": ["Apple M2 / M3"],
      "RAM (Memory)": ["8GB"],
      Storage: ["256GB SSD"],
      Graphics: ["Integrated / Shared"],
    },
  },
  {
    id: 116,
    title: "AMD Ryzen 5 5600 Dedicated Gaming Desktop PC (GTX 1650 4GB)",
    categorySlug: "desktops",
    specs: [
      "AMD Ryzen 5 5600 6-Core 12-Thread 4.4GHz Processor",
      "GIGABYTE B450M K AMD AM4 Micro ATX Motherboard",
      "Corsair Vengeance LPX 16GB 3200MHz DDR4 RAM",
      "MSI GeForce GTX 1650 D6 VENTUS XS OCV3 4GB GPU",
    ],
    regularPrice: 60000,
    discountPrice: 56000,
    saveAmount: 4000,
    slug: "amd-ryzen-5-5600-gaming-desktop-pc",
    visualType: "desktop",
    availability: "In Stock",
    attributes: {
      "Desktop Type": ["Gaming PC", "Custom PC"],
      "Processor Brand": ["AMD"],
      "Processor Series": ["AMD Ryzen 5"],
      "RAM (Memory)": ["16GB"],
      Storage: ["512GB SSD"],
      Graphics: ["Dedicated 4GB"],
    },
  },
  // Laptops
  {
    id: 201,
    title: "Apple MacBook Pro 16\" (M3 Pro Chip, 18GB RAM, 512GB SSD)",
    categorySlug: "laptop",
    specs: ["Apple M3 Pro (12-Core CPU)", "16.2\" Liquid Retina XDR 120Hz", "18GB Unified Memory", "Up to 22 Hours Battery"],
    regularPrice: 315000,
    discountPrice: 298000,
    saveAmount: 17000,
    slug: "apple-macbook-pro-16-m3-pro",
    visualType: "laptop",
    availability: "In Stock",
    attributes: { "Laptop Brand": ["Apple"], "Screen Size": ["16.0 Inch"], Processor: ["Apple M2/M3"], RAM: ["16 GB"] },
  },
  {
    id: 202,
    title: "Asus ROG Strix G16 RTX 4070 Gaming Laptop",
    categorySlug: "laptop",
    specs: ["Intel Core i9-14900HX", "NVIDIA RTX 4070 8GB GDDR6", "16GB DDR5 5600MHz", "16\" QHD 240Hz Nebula Display"],
    regularPrice: 245000,
    discountPrice: 228000,
    saveAmount: 17000,
    slug: "asus-rog-strix-g16-rtx4070",
    visualType: "laptop",
    availability: "In Stock",
    attributes: { "Laptop Brand": ["Asus"], "Screen Size": ["16.0 Inch"], Processor: ["Intel Core i7/i9"], RAM: ["16 GB"] },
  },
  // Components
  {
    id: 301,
    title: "NVIDIA GeForce RTX 4070 SUPER 12GB GDDR6X",
    categorySlug: "component",
    specs: ["12GB GDDR6X 192-bit", "Boost Clock: 2475 MHz", "Ada Lovelace, DLSS 3.5", "Recommended PSU: 650W"],
    regularPrice: 84000,
    discountPrice: 79500,
    saveAmount: 4500,
    slug: "geforce-rtx-4070-super-12gb",
    visualType: "gpu",
    availability: "In Stock",
    attributes: { "Component Type": ["Graphics Card"], Brand: ["NVIDIA"], "Warranty Duration": ["3 Years"] },
  },
  {
    id: 302,
    title: "AMD Ryzen 7 7800X3D AM5 Gaming Processor",
    categorySlug: "component",
    specs: ["8 Cores, 16 Threads 5.0GHz", "104MB 3D V-Cache", "Socket AM5, DDR5 Ready", "120W TDP Architecture"],
    regularPrice: 48500,
    discountPrice: 44999,
    saveAmount: 3501,
    slug: "amd-ryzen-7-7800x3d-am5-processor",
    visualType: "cpu",
    availability: "In Stock",
    attributes: { "Component Type": ["Processor"], Brand: ["AMD"], "Warranty Duration": ["3 Years"] },
  },
  // Monitors
  {
    id: 401,
    title: "Samsung Odyssey OLED G8 34\" 175Hz Curved Gaming Monitor",
    categorySlug: "monitor",
    specs: ["34\" UWQHD (3440 x 1440) OLED", "Curved 1800R Cinematic", "175Hz Refresh, 0.03ms GTG", "Smart TV Streaming Built-in"],
    regularPrice: 145000,
    discountPrice: 132000,
    saveAmount: 13000,
    slug: "samsung-odyssey-oled-g8-34-curved",
    visualType: "monitor",
    availability: "Pre Order",
    attributes: { Brand: ["Samsung"], "Display Size": ['34\" - 49\" Ultra-Wide'], "Refresh Rate": ["165Hz"], "Panel Type": ["OLED"] },
  },
  // Phone
  {
    id: 501,
    title: "Apple iPhone 15 Pro Max 256GB (Natural Titanium)",
    categorySlug: "phone",
    specs: ["A17 Pro Chip with 6-core GPU", "6.7\" Super Retina XDR OLED", "48MP Main Camera + 5x Telephoto", "USB-C 3.0 with MagSafe"],
    regularPrice: 185000,
    discountPrice: 172000,
    saveAmount: 13000,
    slug: "apple-iphone-15-pro-max-256gb",
    visualType: "smartphone",
    availability: "In Stock",
    attributes: { Brand: ["Apple"], Storage: ["256 GB"], Network: ["5G Ready"] },
  },
  // Tablet
  {
    id: 601,
    title: "Apple iPad Pro 11-inch M4 Chip (Wi-Fi 256GB - Space Black)",
    categorySlug: "tablet",
    specs: ["Ultra Retina XDR OLED Display", "Apple M4 Chip with 10-core GPU", "ProMotion 120Hz & True Tone", "Supports Apple Pencil Pro"],
    regularPrice: 135000,
    discountPrice: 124000,
    saveAmount: 11000,
    slug: "apple-ipad-pro-11-m4",
    visualType: "smartphone",
    availability: "In Stock",
    attributes: { Brand: ["Apple"], "Screen Size": ['11.0\"'], "RAM & Storage": ["8GB / 256GB"], "Cellular Support": ["Wi-Fi Only"] },
  },
  // Networking
  {
    id: 701,
    title: "TP-Link Archer AX73 AX5400 Dual-Band Gigabit Wi-Fi 6 Router",
    categorySlug: "networking",
    specs: ["5400 Mbps Wi-Fi 6 Speed", "6x High-Gain Antennas with Beamforming", "OneMesh Supported", "USB 3.0 Media Sharing Port"],
    regularPrice: 15500,
    discountPrice: 13800,
    saveAmount: 1700,
    slug: "tp-link-archer-ax73-wifi6",
    visualType: "casing",
    availability: "In Stock",
    attributes: { Brand: ["TP-Link"], "Wi-Fi Speed": ["3000 Mbps+"], Antennas: ["6+ Antennas"] },
  },
  // Gaming
  {
    id: 801,
    title: "Razer BlackWidow V4 Pro Mechanical RGB Gaming Keyboard",
    categorySlug: "gaming",
    specs: ["Razer Green Mechanical Clicky Switches", "Razer Chroma RGB Underglow", "Dedicated Macro Keys & Command Dial", "Magnetic Plush Wrist Rest"],
    regularPrice: 26500,
    discountPrice: 23900,
    saveAmount: 2600,
    slug: "razer-blackwidow-v4-pro",
    visualType: "cooler",
    availability: "In Stock",
    attributes: { Brand: ["Razer"], Connectivity: ["Wired USB"], Lighting: ["RGB Chroma"] },
  },
  // Power / UPS
  {
    id: 901,
    title: "Apollo 1120VA Offline UPS with Metal Body",
    categorySlug: "power",
    specs: ["Capacity: 1120VA / 600W", "Input Voltage: 100V-240V AC", "Backup Time: 25-30 Minutes", "Built-in AVR Stabilizer"],
    regularPrice: 7200,
    discountPrice: 6500,
    saveAmount: 700,
    slug: "apollo-1120va-offline-ups",
    visualType: "psu",
    availability: "In Stock",
    attributes: { Brand: ["Apollo"], Capacity: ["1200VA"] },
  },
  // Accessories
  {
    id: 1001,
    title: "Samsung T7 Shield 2TB Portable USB 3.2 NVMe SSD",
    categorySlug: "accessories",
    specs: ["Read speed up to 1050 MB/s", "IP65 Dust and Water Resistant", "Rugged Drop Resistant Rubber Body", "USB-C & USB-A Cables Included"],
    regularPrice: 22500,
    discountPrice: 19800,
    saveAmount: 2700,
    slug: "samsung-t7-shield-2tb",
    visualType: "storage",
    availability: "Up Coming",
    attributes: { Category: ["Storage & Enclosures"], Brand: ["Samsung"], "Connector Type": ["USB-C", "USB 3.0"] },
  },
  // Office Equipment
  {
    id: 1101,
    title: "HP Smart Tank 580 All-in-One Wireless Color Ink Tank Printer",
    categorySlug: "office-equipment",
    specs: ["Print, Scan, Copy & Wireless", "Print Speed: Up to 12 ppm (Black)", "Low Cost Per Page Printing", "Wi-Fi, Bluetooth LE, Hi-Speed USB 2.0"],
    regularPrice: 24500,
    discountPrice: 22800,
    saveAmount: 1700,
    slug: "hp-smart-tank-580-all-in-one",
    visualType: "casing",
    availability: "In Stock",
    attributes: { Brand: ["HP"], Type: ["Multi-Function", "Ink Tank"], Connectivity: ["Wi-Fi", "USB", "Bluetooth"] },
  },
  {
    id: 1102,
    title: "Canon imageCLASS LBP2900B Single Function Monochrome Laser Printer",
    categorySlug: "office-equipment",
    specs: ["Single Function Laser Printer", "Print Speed: Up to 12 ppm", "Laser Jet Technology (Cartridge 303)", "USB 2.0 Interface"],
    regularPrice: 19800,
    discountPrice: 18500,
    saveAmount: 1300,
    slug: "canon-imageclass-lbp2900b-laser-printer",
    visualType: "casing",
    availability: "In Stock",
    attributes: { Brand: ["Canon"], Type: ["Single Function", "Laser"], Connectivity: ["USB"] },
  },
  // Camera
  {
    id: 1201,
    title: "Sony Alpha A7 IV Full-Frame Mirrorless Digital Camera Body",
    categorySlug: "camera",
    specs: ["33MP Full-Frame Exmor R CMOS Sensor", "BIONZ XR Image Processor", "Up to 10 fps Shooting, ISO 100-51200", "4K 60p Video in 10-Bit, S-Cinetone"],
    regularPrice: 275000,
    discountPrice: 258000,
    saveAmount: 17000,
    slug: "sony-alpha-a7-iv-mirrorless-camera",
    visualType: "smartphone",
    availability: "In Stock",
    attributes: { Brand: ["Sony"], "Sensor Type": ["Full Frame"], "Video Resolution": ["4K 60fps"] },
  },
  {
    id: 1202,
    title: "DJI Mini 4 Pro Fly More Combo Drone with RC 2 Controller",
    categorySlug: "camera",
    specs: ["Sub-249g Ultralight Folding Drone", "Omnidirectional Active Obstacle Sensing", "4K/60fps HDR True Vertical Shooting", "Up to 34 Mins Flight Time"],
    regularPrice: 135000,
    discountPrice: 124000,
    saveAmount: 11000,
    slug: "dji-mini-4-pro-fly-more-combo",
    visualType: "smartphone",
    availability: "In Stock",
    attributes: { Brand: ["DJI"], "Sensor Type": ["1-Inch"], "Video Resolution": ["4K 60fps"] },
  },
  // Security
  {
    id: 1301,
    title: "Ezviz C6N 2MP 1080p Smart Wi-Fi Pan & Tilt Night Vision IP Camera",
    categorySlug: "security",
    specs: ["Full HD 1080p Resolution", "360-Degree Motorized Pan & Tilt", "Smart IR Night Vision up to 10m", "Two-Way Audio Talk & MicroSD Slot"],
    regularPrice: 2800,
    discountPrice: 2450,
    saveAmount: 350,
    slug: "ezviz-c6n-pan-tilt-ip-camera",
    visualType: "smartphone",
    availability: "In Stock",
    attributes: { Brand: ["Ezviz"], "Camera Resolution": ["2 Megapixel (1080p)"], "Form Factor": ["PTZ (Pan/Tilt)"] },
  },
  // Software
  {
    id: 1401,
    title: "Microsoft Windows 11 Pro 64-bit Genuine Retail License",
    categorySlug: "software",
    specs: ["Official Genuine Microsoft License", "BitLocker Device Encryption", "Remote Desktop & Windows Sandbox", "Lifetime Single PC Activation"],
    regularPrice: 19500,
    discountPrice: 16900,
    saveAmount: 2600,
    slug: "microsoft-windows-11-pro-license",
    visualType: "storage",
    availability: "In Stock",
    attributes: { Brand: ["Microsoft"], "License Type": ["Lifetime Retail"], "User Count": ["1 User"] },
  },
  // Server & Storage
  {
    id: 1501,
    title: "Synology DiskStation DS224+ 2-Bay Network Attached Storage (NAS)",
    categorySlug: "server-storage",
    specs: ["Intel Celeron J4125 4-Core 2.0GHz", "2GB DDR4 Non-ECC (Up to 6GB)", "2x 3.5\"/2.5\" SATA Drive Bays", "Dual 1GbE LAN Ports with Failover"],
    regularPrice: 52000,
    discountPrice: 48500,
    saveAmount: 3500,
    slug: "synology-diskstation-ds224-plus-nas",
    visualType: "storage",
    availability: "In Stock",
    attributes: { Brand: ["Synology"], "Form Factor": ["2-Bay NAS"], "Processor Support": ["Single Socket"] },
  },
  // Gadget
  {
    id: 1601,
    title: "Apple Watch Series 9 GPS 45mm Midnight Aluminum Case",
    categorySlug: "gadget",
    specs: ["S9 SiP with 64-bit Dual-Core Processor", "Always-On Retina OLED 2000 Nits Display", "Double Tap Gesture Control", "Blood Oxygen & ECG Sensor"],
    regularPrice: 58000,
    discountPrice: 52500,
    saveAmount: 5500,
    slug: "apple-watch-series-9-gps-45mm",
    visualType: "smartphone",
    availability: "In Stock",
    attributes: { Brand: ["Apple"], Feature: ["AMOLED Display", "Water Resistant (IP68)", "Calling Support"], "Battery Life": ["Up to 24 Hours"] },
  },
  // TV
  {
    id: 1701,
    title: "Sony Bravia KD-55X75K 55-Inch 4K UHD Smart Google TV",
    categorySlug: "tv",
    specs: ["4K Processor X1 with 4K X-Reality PRO", "Motionflow XR 200 / 240Hz", "Google TV with Voice Remote", "Open Baffle Speaker with Dolby Audio"],
    regularPrice: 82000,
    discountPrice: 74900,
    saveAmount: 7100,
    slug: "sony-bravia-55-inch-4k-smart-google-tv",
    visualType: "monitor",
    availability: "In Stock",
    attributes: { Brand: ["Sony"], "Screen Size": ["55 Inch"], Resolution: ["4K Ultra HD"], "Operating System": ["Google TV"] },
  },
  // Appliance
  {
    id: 1801,
    title: "Gree 1.5 Ton Fairy Split Inverter Air Conditioner (GS-18XFV32)",
    categorySlug: "appliance",
    specs: ["1.5 Ton / 18,000 BTU Inverter AC", "Up to 60% Energy Saving", "Cold Plasma & Golden Fin Technology", "Eco-Friendly R32 Refrigerant"],
    regularPrice: 78000,
    discountPrice: 71500,
    saveAmount: 6500,
    slug: "gree-1-5-ton-fairy-split-inverter-ac",
    visualType: "cooler",
    availability: "In Stock",
    attributes: { Brand: ["Gree"], "Capacity / Ton": ["1.5 Ton (18,000 BTU)"], "Energy Saving": ["Inverter (Up to 70% Saving)"] },
  },
];

const categoryGroups: Record<string, string> = {
  // Desktops - Full StarTech / Techland Subcategory Routing
  desktops: "desktops",
  "ai-pc": "desktops",
  "gaming-pc": "desktops",
  "star-pc": "desktops",
  "desktop-offer": "desktops",
  "brand-pc": "desktops",
  "all-in-one-pc": "desktops",
  "portable-mini-pc": "desktops",
  "apple-mac-mini": "desktops",
  "apple-imac": "desktops",
  "apple-mac-studio": "desktops",
  "apple-mac-pro": "desktops",
  "intel-pc": "desktops",
  "ryzen-pc": "desktops",
  "special-pc": "desktops",
  // Laptop
  "gaming-laptop": "laptop", ultrabook: "laptop", macbook: "laptop", "budget-laptop": "laptop", "touch-laptop": "laptop", "laptop-accessories": "laptop",
  // Components
  gpu: "component", processor: "component", motherboard: "component", ram: "component", storage: "component", psu: "component", casing: "component", cooler: "component",
  // Monitor
  "gaming-monitor": "monitor", "4k-monitor": "monitor", "curved-monitor": "monitor", "oled-monitor": "monitor", "office-monitor": "monitor", "portable-monitor": "monitor",
  // Phone
  iphone: "phone", "samsung-phone": "phone", "xiaomi-phone": "phone", "pixel-phone": "phone", "oneplus-phone": "phone", "feature-phone": "phone",
  // Tablet
  ipad: "tablet", "ipad-pro": "tablet", "samsung-tab": "tablet", "drawing-tablet": "tablet", "kids-tablet": "tablet",
  // Office Equipment
  printer: "office-equipment", "ink-tank-printer": "office-equipment", projector: "office-equipment", "barcode-scanner": "office-equipment", "paper-shredder": "office-equipment", photocopier: "office-equipment",
  // Camera
  "mirrorless-camera": "camera", "dslr-camera": "camera", "action-camera": "camera", "camera-lens": "camera", gimbal: "camera", drone: "camera",
  // Security
  "ip-camera": "security", "cctv-camera": "security", "dvr-nvr": "security", "smart-lock": "security", "attendance-machine": "security", "video-doorbell": "security",
  // Networking
  router: "networking", "mesh-wifi": "networking", "network-switch": "networking", "access-point": "networking", "network-cable": "networking",
  // Software
  "windows-os": "software", "microsoft-office": "software", antivirus: "software", adobe: "software", "server-license": "software",
  // Server & Storage
  "rack-server": "server-storage", "tower-server": "server-storage", "nas-storage": "server-storage", "enterprise-hdd": "server-storage", "server-ram": "server-storage",
  // Accessories
  "external-hdd": "accessories", "usb-hub": "accessories", "power-bank": "accessories", webcam: "accessories", "laptop-stand": "accessories",
  // Gadget
  "smart-watch": "gadget", earbuds: "gadget", "bluetooth-speaker": "gadget", "smart-band": "gadget", stylus: "gadget",
  // Gaming
  keyboard: "gaming", mouse: "gaming", headset: "gaming", "gaming-chair": "gaming", controller: "gaming", "gaming-console": "gaming",
  // TV
  "4k-smart-tv": "tv", "oled-tv": "tv", "google-tv": "tv", soundbar: "tv", "tv-box": "tv",
  // Appliance
  "inverter-ac": "appliance", "non-inverter-ac": "appliance", refrigerator: "appliance", "washing-machine": "appliance", "microwave-oven": "appliance", "air-purifier": "appliance",
  // Power
  "online-ups": "power", "offline-ups": "power", "line-interactive-ups": "power", "voltage-stabilizer": "power", inverter: "power",
};

const desktopSubcategoryMap: Record<string, { title: string; filterGroup?: string; filterValue?: string; seoDesc?: string }> = {
  "gaming-pc": {
    title: "Gaming Desktop PC",
    filterGroup: "Desktop Type",
    filterValue: "Gaming PC",
    seoDesc: "Buy high-performance custom gaming desktops in Bangladesh with NVIDIA RTX and AMD Radeon graphics cards for competitive eSports and 4K gaming.",
  },
  "brand-pc": {
    title: "Brand Desktop PC",
    filterGroup: "Desktop Type",
    filterValue: "Brand PC",
    seoDesc: "Explore brand PCs in Bangladesh from Asus, Dell, HP, Lenovo, and Acer with official warranty, robust build quality, and pre-installed Windows.",
  },
  "star-pc": {
    title: "Star Custom Desktop PC",
    filterGroup: "Desktop Type",
    filterValue: "Star PC",
    seoDesc: "Pre-configured and tested desktop computers offering maximum value for students, offices, and content creators with official parts warranty.",
  },
  "all-in-one-pc": {
    title: "All-in-One PC",
    filterGroup: "Desktop Type",
    filterValue: "All-in-One PC",
    seoDesc: "Space-saving All-in-One PCs featuring slim edge-to-edge displays, built-in stereo speakers, webcams, and wireless peripherals for tidy modern workspaces.",
  },
  "portable-mini-pc": {
    title: "Portable Mini PC",
    filterGroup: "Desktop Type",
    filterValue: "Portable Mini PC",
    seoDesc: "Ultra-compact mini desktop computers from Asus NUC, ExpertCenter, and Apple Mac Mini offering full desktop performance in palm-sized chassis.",
  },
  "apple-mac-mini": {
    title: "Apple Mac Mini",
    filterGroup: "Desktop Type",
    filterValue: "Apple Mac",
    seoDesc: "Apple Mac Mini featuring blazing-fast Apple M2 and M2 Pro chips with lightning-fast unified memory and Thunderbolt 4 connectivity.",
  },
  "apple-imac": {
    title: "Apple iMac",
    filterGroup: "Desktop Type",
    filterValue: "Apple Mac",
    seoDesc: "Apple 24-inch 4.5K Retina iMac powered by the M3 chip with color-matched Magic Keyboard and Magic Mouse in vibrant aluminum finishes.",
  },
  "apple-mac-studio": {
    title: "Apple Mac Studio",
    filterGroup: "Desktop Type",
    filterValue: "Apple Mac",
    seoDesc: "Supercharged pro workstation desktop PC for creative powerhouses powered by Apple M2 Max and M2 Ultra chips.",
  },
  "ai-pc": {
    title: "AI Desktop PC",
    seoDesc: "Next-gen AI Desktop PCs equipped with dedicated Neural Processing Units (NPUs) and high-VRAM RTX GPUs for on-device AI generation and LLMs.",
  },
  "desktop-offer": {
    title: "Desktop Offers & Special Deals",
    seoDesc: "Special discount bundle offers on complete desktop PC packages with monitor, keyboard, mouse, and power backup at unbeatable prices in Bangladesh.",
  },
};

const productRanking: Record<number, { publishedRank: number; popularity: number }> = {
  101: { publishedRank: 16, popularity: 95 },
  102: { publishedRank: 15, popularity: 93 },
  103: { publishedRank: 14, popularity: 91 },
  104: { publishedRank: 13, popularity: 89 },
  105: { publishedRank: 12, popularity: 88 },
  106: { publishedRank: 11, popularity: 96 },
  107: { publishedRank: 10, popularity: 98 },
  108: { publishedRank: 9, popularity: 92 },
  109: { publishedRank: 8, popularity: 85 },
  110: { publishedRank: 7, popularity: 84 },
  111: { publishedRank: 6, popularity: 87 },
  112: { publishedRank: 5, popularity: 86 },
  113: { publishedRank: 4, popularity: 90 },
  114: { publishedRank: 3, popularity: 94 },
  115: { publishedRank: 2, popularity: 97 },
  116: { publishedRank: 1, popularity: 91 },
  201: { publishedRank: 13, popularity: 96 },
  202: { publishedRank: 12, popularity: 94 },
  301: { publishedRank: 11, popularity: 98 },
  302: { publishedRank: 9, popularity: 97 },
  401: { publishedRank: 10, popularity: 89 },
  501: { publishedRank: 8, popularity: 99 },
  601: { publishedRank: 14, popularity: 90 },
  701: { publishedRank: 6, popularity: 86 },
  801: { publishedRank: 4, popularity: 93 },
  901: { publishedRank: 3, popularity: 78 },
  1001: { publishedRank: 2, popularity: 84 },
  1101: { publishedRank: 15, popularity: 85 },
  1102: { publishedRank: 16, popularity: 87 },
  1201: { publishedRank: 17, popularity: 95 },
  1202: { publishedRank: 18, popularity: 93 },
  1301: { publishedRank: 19, popularity: 91 },
  1401: { publishedRank: 20, popularity: 80 },
  1501: { publishedRank: 21, popularity: 86 },
  1601: { publishedRank: 22, popularity: 97 },
  1701: { publishedRank: 23, popularity: 92 },
  1801: { publishedRank: 24, popularity: 89 },
};

function CategoryPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawSlug = (params?.category as string) || "desktops";
  const categorySlug = rawSlug.toLowerCase();

  // Validate that the category actually exists. If invalid route/url, trigger standard 404 page
  const isValidCategory = categoryGroups[categorySlug] !== undefined || categoryConfigs[categorySlug] !== undefined;
  if (!isValidCategory) {
    notFound();
  }

  const baseCategorySlug = categoryGroups[categorySlug] || categorySlug;

  const defaultMaxPrice = baseCategorySlug === "desktops" ? 400000 : 1100000;

  // Initialize state from URL search parameters if present
  const [minPrice, setMinPrice] = useState(() => {
    const val = Number(searchParams.get("minPrice"));
    return !isNaN(val) && val > 0 ? val : 0;
  });
  const [maxPrice, setMaxPrice] = useState(() => {
    const val = Number(searchParams.get("maxPrice"));
    return !isNaN(val) && val > 0 ? val : defaultMaxPrice;
  });
  const [showCount, setShowCount] = useState(20);
  const [sortBy, setSortBy] = useState(() => searchParams.get("sort") || "Default");
  const [filterOpen, setFilterOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const toggleCollapse = (name: string) => {
    setCollapsedSections((prev) => ({ ...prev, [name]: !prev[name] }));
  };
  const [page, setPage] = useState(() => {
    const val = Number(searchParams.get("page"));
    return !isNaN(val) && val > 1 ? val : 1;
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [inputValue, setInputValue] = useState(() => searchParams.get("q") || "");
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || "");
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    // When paused or stopped writing (800ms), start spinner & execute search
    debounceTimerRef.current = setTimeout(() => {
      setIsLoading(true);
      setTimeout(() => {
        setSearchQuery(value);
        setPage(1);
        setIsLoading(false);
      }, 800);
    }, 800);
  };

  const [activeFilters, setActiveFilters] = useState<{ [group: string]: string[] }>(() => {
    const initial: { [group: string]: string[] } = {};
    searchParams.forEach((val, key) => {
      if (!["minPrice", "maxPrice", "sort", "page", "showCount"].includes(key) && val) {
        initial[key] = val.split(",").map((s) => decodeURIComponent(s.trim())).filter(Boolean);
      }
    });
    return initial;
  });

  // Bidirectional URL synchronization without scroll jump
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const nextParams = new URLSearchParams();
    if (minPrice > 0) nextParams.set("minPrice", String(minPrice));
    if (maxPrice < defaultMaxPrice) nextParams.set("maxPrice", String(maxPrice));
    if (sortBy && sortBy !== "Default") nextParams.set("sort", sortBy);
    if (page > 1) nextParams.set("page", String(page));

    Object.entries(activeFilters).forEach(([group, vals]) => {
      if (vals.length > 0) {
        nextParams.set(group, vals.join(","));
      }
    });

    const queryString = nextParams.toString();
    const newUrl = queryString ? `/${categorySlug}?${queryString}` : `/${categorySlug}`;
    router.replace(newUrl, { scroll: false });
  }, [activeFilters, minPrice, maxPrice, sortBy, page, categorySlug, defaultMaxPrice, router]);

  // Dynamic Config Resolution
  const config =
    categoryConfigs[baseCategorySlug] || {
      title: `${categorySlug.replace(/-/g, " ").toUpperCase()} Price in Bangladesh`,
      seoDescription: `Find the best verified prices for ${categorySlug} in Bangladesh with official warranty and express courier delivery.`,
      pills: categoryConfigs["desktops"].pills,
      filters: categoryConfigs["component"].filters,
    };

  const desktopSub = baseCategorySlug === "desktops" ? desktopSubcategoryMap[categorySlug] : undefined;
  const pageTitle = desktopSub?.title || config.title;
  const pageSeoDesc = desktopSub?.seoDesc || config.seoDescription;

  useEffect(() => {
    const categoryNameMap: Record<string, string> = {
      desktops: "Desktop PC",
      laptop: "Laptop",
      component: "Computer Component",
      monitor: "Monitor",
      smartphones: "Smartphone & Mobile Phone",
      ups: "UPS",
      networking: "Router & Networking Device",
      "tablet-pc": "Tablet PC & iPad",
      gaming: "Gaming Accessories & Gear",
      accessories: "Computer Accessories",
      "office-equipment": "Office Equipment",
      camera: "Camera, Lens & Drone",
      "security-system": "Security & Surveillance System",
      software: "Original Software & License",
      "server-storage": "Server & Enterprise Storage",
      gadget: "Smart Gadgets & Wearables",
      tv: "Television & Home Audio",
      appliances: "Home & Kitchen Appliances",
    };

    const baseName = desktopSub?.title || categoryNameMap[baseCategorySlug] || config.title;
    const formattedTitle = baseName.toLowerCase().includes("price in bangladesh")
      ? baseName
      : `${baseName} Price in Bangladesh`;

    document.title = `${formattedTitle} | TechHub Bangladesh`;
  }, [desktopSub, baseCategorySlug, config.title]);

  const toggleOption = (group: string, option: string) => {
    setPage(1);
    setActiveFilters((prev) => {
      const current = prev[group] || [];
      const updated = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      if (updated.length === 0) {
        const { [group]: _removed, ...rest } = prev;
        void _removed;
        return rest;
      }
      return { ...prev, [group]: updated };
    });
  };

  const selectedFilterCount = Object.values(activeFilters).reduce((total, values) => total + values.length, 0);
  const hasPriceFilter = minPrice > 0 || maxPrice < defaultMaxPrice;
  const [headerHeight, setHeaderHeight] = useState(69);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const headerEl = document.querySelector("header");
      if (headerEl) {
        setHeaderHeight(headerEl.getBoundingClientRect().height);
      }
    };
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  useEffect(() => {
    if (!filterOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFilterOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [filterOpen]);

  const matchingProducts = useMemo(() => dynamicProductCatalog
    .filter((item) => {
      const matchesCategory = item.categorySlug === baseCategorySlug;
      const matchesPrice = item.discountPrice >= minPrice && item.discountPrice <= maxPrice;

      // Subcategory auto-scoping if user navigated directly to /gaming-pc, /brand-pc etc.
      const matchesSubcategory =
        !desktopSub?.filterValue ||
        (activeFilters["Desktop Type"] && activeFilters["Desktop Type"].length > 0) ||
        (item.attributes[desktopSub.filterGroup || "Desktop Type"] || []).includes(desktopSub.filterValue);

      const matchesOptions = Object.entries(activeFilters).every(([group, selected]) => {
        if (group === "Availability") return selected.includes(item.availability);
        const productValues = item.attributes[group] || [];
        return selected.some((option) => productValues.includes(option));
      });
      const cleanSearch = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !cleanSearch ||
        item.title.toLowerCase().includes(cleanSearch) ||
        item.specs.some((spec) => spec.toLowerCase().includes(cleanSearch)) ||
        Object.values(item.attributes).some((vals) => vals.some((v) => v.toLowerCase().includes(cleanSearch)));

      return matchesCategory && matchesPrice && matchesSubcategory && matchesOptions && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "Low") {
        return a.discountPrice - b.discountPrice;
      }
      if (sortBy === "High") {
        return b.discountPrice - a.discountPrice;
      }
      if (sortBy === "Newest") {
        return (productRanking[b.id]?.publishedRank ?? 0) - (productRanking[a.id]?.publishedRank ?? 0);
      }
      if (sortBy === "Popular") {
        return (productRanking[b.id]?.popularity ?? 0) - (productRanking[a.id]?.popularity ?? 0);
      }
      return 0; // Default order
    }), [activeFilters, baseCategorySlug, desktopSub, maxPrice, minPrice, sortBy, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(matchingProducts.length / showCount));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * showCount;
  const filteredProducts = matchingProducts.slice(pageStart, pageStart + showCount);

  const clearAllFilters = () => {
    setActiveFilters({});
    setMinPrice(0);
    setMaxPrice(defaultMaxPrice);
    setInputValue("");
    setSearchQuery("");
    setPage(1);
    router.replace(`/${categorySlug}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === safePage) return;
    setPage(newPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 180, behavior: "smooth" });
    }
  };

  // Authentic Ryans / Star Tech pagination algorithm:
  // Shows 5 consecutive numbers before the ellipsis:
  // - Near start: [1, 2, 3, 4, 5, "...", totalPages]
  // - In middle:  [1, "...", P-1, P, P+1, "...", totalPages]
  // - Near end:   [1, "...", totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages]
  const getPaginationItems = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const items: (number | string)[] = [];

    if (safePage <= 4) {
      // Near start: 1, 2, 3, 4, 5, ..., totalPages (matching your screenshot)
      for (let i = 1; i <= 5; i++) {
        items.push(i);
      }
      items.push("ellipsis-right");
      items.push(totalPages);
    } else if (safePage >= totalPages - 3) {
      // Near end: 1, ..., totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages
      items.push(1);
      items.push("ellipsis-left");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // In middle: 1, ..., safePage - 1, safePage, safePage + 1, ..., totalPages
      items.push(1);
      items.push("ellipsis-left");
      items.push(safePage - 1);
      items.push(safePage);
      items.push(safePage + 1);
      items.push("ellipsis-right");
      items.push(totalPages);
    }

    return items;
  };



  const toProduct = (product: DynamicProduct): Product => ({
    id: product.id,
    title: product.title,
    category: product.categorySlug,
    specs: product.specs,
    regularPrice: product.regularPrice ?? product.discountPrice,
    discountedPrice: product.discountPrice,
    badge: product.saveAmount ? `Save: ৳${product.saveAmount.toLocaleString()}` : undefined,
    inStock: product.availability === "In Stock",
    availability: product.availability,
    warrantyType: "Official",
    warrantyDuration: "3 Years",
    slug: product.slug,
    visualType: product.visualType,
  });

  return (
    <>
      {/* Reusable Breadcrumbs — Rendered flush beneath CategoryNav just like other storefront pages */}
      <Breadcrumbs
        items={
          categorySlug !== baseCategorySlug
            ? [
              { label: "Home", href: "/" },
              { label: categoryConfigs[baseCategorySlug]?.title || "Desktop", href: `/${baseCategorySlug}` },
              { label: pageTitle },
            ]
            : [
              { label: "Home", href: "/" },
              { label: pageTitle },
            ]
        }
      />

      {/* Category SEO Header & Intro — StarTech / Techland Production Style */}
      <section className="border-b border-card-border/70 bg-white py-3.5 sm:py-4.5">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          {/* Category Title */}
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            {pageTitle}
          </h1>

          {/* SEO Description */}
          {pageSeoDesc && (
            <p className="mt-1 text-xs text-slate-600 sm:text-[13px] leading-relaxed max-w-5xl">
              {pageSeoDesc}
            </p>
          )}

          {/* Subcategory Pills */}
          {config.pills && config.pills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar" aria-label="Subcategories">
              {config.pills.map((pill) => {
                const pillSlug = pill.href.replace(/^\//, "");
                const isActive = categorySlug === pillSlug && categorySlug !== baseCategorySlug;
                return (
                  <Link
                    key={pill.name}
                    href={pill.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition shadow-2xs ${isActive
                      ? "border-primary bg-primary text-white font-semibold"
                      : "border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary"
                      }`}
                  >
                    {pill.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Main Grid: Dynamic Sidebar + Product Cards */}
      <main className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">

          {/* Backdrop with White Close Icon on Top Right of Backdrop - starts below header, covers bottom bar */}
          {filterOpen && (
            <div
              style={{ top: `${headerHeight}px` }}
              className="fixed inset-x-0 bottom-0 z-[75] bg-slate-950/60 lg:hidden"
            >
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="absolute top-3.5 right-[calc(min(85vw,340px)+12px)] flex size-8 items-center justify-center text-white/90 hover:text-white transition cursor-pointer"
                aria-label="Close filter drawer"
              >
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="w-full h-full" onClick={() => setFilterOpen(false)} />
            </div>
          )}

          {/* Filter Sidebar: In-place on desktop (lg+), Slide-over from right below header covering bottom bar on mobile (<lg) */}
          <aside
            id="category-filters"
            aria-label="Product filters"
            style={{ top: filterOpen ? `${headerHeight}px` : undefined }}
            className={`fixed inset-y-0 right-0 z-[80] w-[min(85vw,340px)] space-y-3 overflow-y-auto bg-white p-4 pb-16 shadow-2xl transition-transform duration-300 ease-out lg:static lg:z-auto lg:top-auto lg:w-auto lg:translate-x-0 lg:overflow-visible lg:bg-transparent lg:p-0 lg:shadow-none ${filterOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            {/* Price Range Box */}
            <div className="rounded-sm border border-slate-200 bg-white p-4">
              <h3 className="text-[17px] font-medium text-slate-900 pb-3">
                Price Range
              </h3>
              <div className="space-y-4 pt-1">
                {/* Styled Track Slider */}
                <div className="relative flex items-center px-1">
                  <input
                    type="range"
                    min={0}
                    max={defaultMaxPrice}
                    step={1000}
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(Number(e.target.value)); setPage(1); }}
                    className="startech-slider w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-[#e2e8f0]"
                    style={{
                      background: `linear-gradient(to right, #ef4a23 0%, #ef4a23 ${(maxPrice / defaultMaxPrice) * 100}%, #e2e8f0 ${(maxPrice / defaultMaxPrice) * 100}%, #e2e8f0 100%)`
                    }}
                  />
                </div>

                {/* Two Price Display / Input Boxes */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center justify-center rounded-xs border border-slate-300 bg-white px-3 py-1.5 text-center text-sm font-semibold text-slate-800">
                    <input
                      type="number"
                      min={0}
                      max={maxPrice}
                      step={500}
                      value={minPrice}
                      onChange={(e) => { setMinPrice(Math.min(Number(e.target.value), maxPrice)); setPage(1); }}
                      className="w-full bg-transparent text-center text-sm font-semibold text-slate-800 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div className="flex items-center justify-center rounded-xs border border-slate-300 bg-white px-3 py-1.5 text-center text-sm font-semibold text-slate-800">
                    <input
                      type="number"
                      min={minPrice}
                      max={defaultMaxPrice}
                      step={500}
                      value={maxPrice}
                      onChange={(e) => { setMaxPrice(Math.max(Number(e.target.value), minPrice)); setPage(1); }}
                      className="w-full bg-transparent text-center text-sm font-semibold text-slate-800 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Accordion */}
            <div className="rounded-sm border border-slate-200 bg-white p-4">
              <button
                type="button"
                onClick={() => toggleCollapse("Availability")}
                className="flex w-full items-center justify-between text-left cursor-pointer"
              >
                <h3 className="text-[17px] font-medium text-slate-900">Availability</h3>
                <svg
                  className={`size-4 text-slate-800 transition-transform duration-200 ${collapsedSections["Availability"] ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              </button>
              {!collapsedSections["Availability"] && (
                <div className="mt-4 space-y-3 text-[14px]">
                  {["In Stock", "Pre Order", "Up Coming"].map((status) => {
                    const checked = (activeFilters.Availability || []).includes(status);
                    return (
                      <label key={status} className="flex items-center gap-3 cursor-pointer select-none group">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleOption("Availability", status)}
                          className="size-4 rounded-xs border-slate-400 text-[#ef4a23] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#ef4a23]"
                        />
                        <span className={`text-[14px] ${checked ? "font-medium text-slate-900" : "text-slate-700 group-hover:text-slate-900"}`}>
                          {status}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Dynamic Context-Aware Filter Accordions */}
            {config.filters.map((filter) => {
              const selected = activeFilters[filter.name] || [];
              const isCollapsed = collapsedSections[filter.name];

              return (
                <div key={filter.name} className="rounded-sm border border-slate-200 bg-white p-4">
                  <button
                    type="button"
                    onClick={() => toggleCollapse(filter.name)}
                    className="flex w-full items-center justify-between text-left cursor-pointer"
                  >
                    <h3 className="text-[17px] font-medium text-slate-900">{filter.name}</h3>
                    <svg
                      className={`size-4 text-slate-800 transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  {!isCollapsed && (
                    <div className="mt-4 space-y-3 text-[14px]">
                      {filter.options.map((opt) => {
                        const checked = selected.includes(opt);
                        return (
                          <label key={opt} className="flex items-center gap-3 cursor-pointer select-none group">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleOption(filter.name, opt)}
                              className="size-4 rounded-xs border-slate-400 text-[#ef4a23] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#ef4a23]"
                            />
                            <span className={`text-[14px] ${checked ? "font-medium text-slate-900" : "text-slate-700 group-hover:text-slate-900"}`}>
                              {opt}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </aside>

          {/* Right Product Grid Area */}
          <div>
            {/* Top Sorting & Filter Toolbar — Production Responsive Design */}
            <div className="rounded-2xl border border-card-border bg-card p-3 sm:p-4 shadow-xs mb-4">
              {/* Desktop / Tablet Row (lg+): Search Bar on left, Controls on right */}
              {/* Mobile / Small Screen (<lg): Full width search input on top, Filter toggle button below */}
              <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
                {/* Search by product name in this category */}
                <div className="relative w-full lg:max-w-md">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search by product name..."
                    className="w-full h-10 lg:h-9 rounded-xl lg:rounded-lg border border-slate-200 bg-white pl-3.5 pr-9 text-xs sm:text-[13px] text-foreground placeholder:text-slate-400 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-0 transition"
                    aria-label="Search by product name in this category"
                  />

                  {/* Spinning Icon & "Working..." Indicator */}
                  {isLoading && (
                    <div className="pointer-events-none absolute inset-y-0 inset-x-2 z-20 flex items-center justify-center bg-white/90 backdrop-blur-[1px] rounded-md transition-opacity">
                      <div className="flex items-center gap-2">
                        <svg className="size-4 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        <span className="text-xs font-bold text-slate-800 tracking-wide">Working...</span>
                      </div>
                    </div>
                  )}

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>

                  {inputValue && !isLoading && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange("")}
                      className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground text-xs p-1"
                      aria-label="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Mobile / Tablet Controls Bar (<lg) — matches Image 1 */}
                <div className="flex items-center justify-between gap-3 lg:hidden">
                  <button
                    type="button"
                    onClick={() => setFilterOpen(true)}
                    className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-surface px-3 text-xs font-semibold text-foreground transition hover:bg-card active:scale-95 cursor-pointer"
                    aria-expanded={filterOpen}
                    aria-controls="category-filters"
                  >
                    <svg className="size-4 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="6" x2="20" y2="6" />
                      <line x1="6" y1="12" x2="18" y2="12" />
                      <line x1="9" y1="18" x2="15" y2="18" />
                    </svg>
                    <span>Filter {selectedFilterCount > 0 && `(${selectedFilterCount})`}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <span className="font-medium text-slate-600">Sort By:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                      className="rounded-lg border border-slate-200 bg-surface px-2.5 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-slate-800 cursor-pointer"
                    >
                      <option value="Default">Default</option>
                      <option value="Low">Price (Low &gt; High)</option>
                      <option value="High">Price (High &gt; Low)</option>
                      <option value="Newest">Newest</option>
                      <option value="Popular">Most Popular</option>
                    </select>
                  </div>
                </div>

                {/* Desktop Controls (lg+) */}
                <div className="hidden lg:flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-muted">Show:</span>
                    <select
                      value={showCount}
                      onChange={(e) => { setShowCount(Number(e.target.value)); setPage(1); }}
                      className="rounded-lg border border-slate-200 bg-surface px-2.5 py-1.5 font-semibold text-foreground outline-none focus:border-slate-800 cursor-pointer"
                    >
                      <option value={20}>20</option>
                      <option value={40}>40</option>
                      <option value={60}>60</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-muted">Sort By:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                      className="rounded-lg border border-slate-200 bg-surface px-2.5 py-1.5 font-semibold text-foreground outline-none focus:border-slate-800 cursor-pointer"
                    >
                      <option value="Default">Default</option>
                      <option value="Low">Price (Low &gt; High)</option>
                      <option value="High">Price (High &gt; Low)</option>
                      <option value="Newest">Newest</option>
                      <option value="Popular">Most Popular</option>
                    </select>
                  </div>

                  {/* View Mode Toggle: Grid & List */}
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-muted">View:</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        aria-label="Grid view"
                        title="Grid view"
                        className={`p-1 rounded-sm transition cursor-pointer ${viewMode === "grid" ? "text-foreground" : "text-slate-400 hover:text-foreground"}`}
                      >
                        <svg className="size-4" viewBox="0 0 16 16" fill="currentColor">
                          <rect x="1" y="1" width="6" height="6" rx="0.5" />
                          <rect x="9" y="1" width="6" height="6" rx="0.5" />
                          <rect x="1" y="9" width="6" height="6" rx="0.5" />
                          <rect x="9" y="9" width="6" height="6" rx="0.5" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("list")}
                        aria-label="List view"
                        title="List view"
                        className={`p-1 rounded-sm transition cursor-pointer ${viewMode === "list" ? "text-foreground" : "text-slate-400 hover:text-foreground"}`}
                      >
                        <svg className="size-4" viewBox="0 0 16 16" fill="currentColor">
                          <rect x="1" y="2" width="3" height="3" rx="0.5" />
                          <rect x="6" y="2" width="9" height="3" rx="0.5" />
                          <rect x="1" y="6.5" width="3" height="3" rx="0.5" />
                          <rect x="6" y="6.5" width="9" height="3" rx="0.5" />
                          <rect x="1" y="11" width="3" height="3" rx="0.5" />
                          <rect x="6" y="11" width="9" height="3" rx="0.5" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Standard Product Cards Grid / List with Loading State */}
            <div className="relative">
              {/* Overlay with spinning loading icon and 'Working...' text indicator */}
              {isLoading && (
                <div
                  className="absolute inset-0 z-30 flex items-center justify-center transition-opacity duration-300"
                  aria-live="polite"
                  aria-busy="true"
                >
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-xs">
                    <svg className="size-5 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span className="text-xs font-bold text-slate-800 tracking-wide">Working...</span>
                  </div>
                </div>
              )}

              {/* Grid content container with blur-sm and opacity-50 transition when isLoading is true */}
              <div
                className={`transition-all duration-300 ease-in-out ${isLoading ? "blur-xs sm:blur-sm opacity-50 pointer-events-none select-none" : "blur-none opacity-100"
                  }`}
              >
                {filteredProducts.length === 0 ? (
                  <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-card-border bg-card p-8 text-center shadow-xs">
                    <span className="text-4xl">🔍</span>
                    <h3 className="mt-3 text-sm font-bold text-foreground">No products found in this category</h3>
                    <p className="mt-1 max-w-sm text-xs text-muted">No products match your current filters.</p>
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="mt-5 min-h-11 rounded-xl bg-secondary px-5 text-xs font-bold text-white transition hover:bg-secondary-hover"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className={viewMode === "grid" ? "grid gap-3.5 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "flex flex-col gap-3.5"}>
                    {filteredProducts.map(toProduct).map((product) => (
                      <ProductCard key={product.id} product={product} variant="listing" layout={viewMode} />
                    ))}
                  </div>
                )}
              </div>
            </div>



            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-card-border/80 pt-5">
              {/* Left Side (Desktop lg+): Showing X - Y of Z items */}
              <span className="hidden lg:inline text-sm text-slate-500 font-medium">
                Showing <strong className="text-foreground font-semibold">{pageStart + 1} – {pageStart + filteredProducts.length}</strong> of <strong className="text-foreground font-semibold">{matchingProducts.length}</strong> items
              </span>

              {/* Left Side (Responsive <lg): Image 1 layout with [20 ⌵] + Showing X out of Y products */}
              <div className="flex lg:hidden items-center gap-2.5 sm:gap-3 order-2 sm:order-1">
                <div className="relative">
                  <select
                    value={showCount}
                    onChange={(e) => { setShowCount(Number(e.target.value)); setPage(1); }}
                    className="h-8 sm:h-[34px] rounded-lg border border-slate-300 bg-white px-2.5 pr-6 sm:px-3 sm:pr-7 text-xs font-semibold text-slate-800 shadow-2xs outline-none focus:border-slate-800 cursor-pointer appearance-none"
                    aria-label="Select products per page"
                  >
                    <option value={20}>20</option>
                    <option value={40}>40</option>
                    <option value={60}>60</option>
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg className="size-3 sm:size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>

                <span className="text-xs sm:text-[13px] text-slate-600 font-medium">
                  Showing {Math.min(showCount, matchingProducts.length)} out of {matchingProducts.length} products
                </span>
              </div>

              {/* Right Side: Pagination Control Bar */}
              <nav
                className="inline-flex h-8 sm:h-[34px] items-stretch overflow-hidden rounded-lg border border-slate-300 bg-white shadow-2xs order-1 sm:order-2"
                aria-label="Product pagination"
              >
                {/* Previous Button (<) */}
                <button
                  type="button"
                  disabled={safePage === 1}
                  onClick={() => handlePageChange(safePage - 1)}
                  aria-label="Previous page"
                  className="flex w-8 sm:w-[34px] items-center justify-center border-r border-slate-200 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-400 cursor-pointer"
                >
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Numbered Page Buttons */}
                {getPaginationItems().map((item, idx) => {
                  if (typeof item === "string") {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        className="flex min-w-[30px] sm:min-w-[34px] items-center justify-center border-r border-slate-200 px-1.5 text-[11px] font-semibold text-slate-400 select-none bg-slate-50/40"
                      >
                        …
                      </span>
                    );
                  }

                  const isCurrent = item === safePage;
                  return (
                    <button
                      key={`page-${item}`}
                      type="button"
                      onClick={() => handlePageChange(item)}
                      aria-current={isCurrent ? "page" : undefined}
                      className={`flex min-w-[32px] sm:min-w-[34px] items-center justify-center border-r border-slate-200 px-2 text-xs transition cursor-pointer ${isCurrent
                        ? "bg-[#1b4382] text-white font-bold"
                        : "text-slate-700 font-medium hover:bg-slate-50 hover:text-[#1b4382]"
                        }`}
                    >
                      {item}
                    </button>
                  );
                })}

                {/* Next Button (>) */}
                <button
                  type="button"
                  disabled={safePage === totalPages}
                  onClick={() => handlePageChange(safePage + 1)}
                  aria-label="Next page"
                  className="flex w-8 sm:w-[34px] items-center justify-center text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-400 cursor-pointer"
                >
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>



          </div>
        </div>
      </main>
    </>
  );
}

export default function DynamicCategoryPage() {
  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <CategoryPageContent />
    </Suspense>
  );
}


