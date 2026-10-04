import { featuredProducts } from "./products";
import type { Product } from "@/components/storefront/ProductCard";

export interface CampaignOffer {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  bengaliHeadline?: string;
  badge: string;
  badgeColor: string;
  campaignTag: string;
  mainHighlight: string;
  discountBadge: string;
  startDate: string;
  endDate: string;
  location?: string;
  countdown?: string;
  image?: string;
  bgGradient: string;
  accentColor: string;
  bannerTheme: "gaming" | "apple" | "night" | "festive" | "ryzen" | "mobile";
  description: string;
  terms: string[];
  productIds: number[];
}

export const campaignOffers: CampaignOffer[] = [
  {
    id: 1,
    slug: "night-offer",
    title: "Night Offer",
    subtitle: "Exclusive Night Discounts: 9 PM to 9 AM Every Day on Top Brands!",
    bengaliHeadline: "নাইট অফার: প্রতিদিন রাত ৯টা থেকে সকাল ৯টা পর্যন্ত বিশেষ ছাড়",
    badge: "Night Fest",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    campaignTag: "Everyday 9 PM – 9 AM",
    mainHighlight: "Same Tech. Better Deals.",
    discountBadge: "NIGHT PRICE CUT",
    startDate: "19 Sep 2026",
    endDate: "30 Sep 2026",
    location: "Online Only",
    countdown: "10h 27m 46s",
    bgGradient: "bg-gradient-to-br from-[#060a17] via-[#0d1630] to-[#040814]",
    accentColor: "#38bdf8",
    bannerTheme: "night",
    description:
      "Take advantage of our signature Night Offer campaign. Shop every night between 9:00 PM and 9:00 AM to unlock exclusive flash discounts on graphics cards, gaming monitors, and high-performance PC components with priority morning dispatch.",
    terms: [
      "Offer is valid daily from 9:00 PM to 9:00 AM exclusively for online website orders.",
      "Additional 5% instant cashback when paying through bKash, Nagad, or selected debit/credit cards.",
      "Limited quantities available per customer per night session.",
      "Orders placed during the night offer receive priority next-day dispatch.",
      "Standard official brand warranty applies to all purchased products.",
    ],
    productIds: [1, 4, 7],
  },
  {
    id: 2,
    slug: "msi-price-bond-offer",
    title: "MSI Prize Bond Offers",
    subtitle: "Buy Selected MSI Gaming Gear & Win Guaranteed Prize Bonds up to ৳9,000!",
    bengaliHeadline: "এমএসআই প্রাইজ বন্ড অফার: সর্বোচ্চ ৯,০০০ টাকা প্রাইজ বন্ড উপহার",
    badge: "Prize Bond",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/40",
    campaignTag: "MSI Official Promotion",
    mainHighlight: "Up to ৳9,000 TK Prize Bond",
    discountBadge: "PRIZE BOND GIFT",
    startDate: "24 Jul 2026",
    endDate: "30 Sep 2026",
    location: "All Outlets",
    countdown: "01d 01h 06m",
    bgGradient: "bg-gradient-to-br from-[#1a0505] via-[#2d0a0a] to-[#120202]",
    accentColor: "#ef4444",
    bannerTheme: "gaming",
    description:
      "Gear up with official MSI gaming hardware and claim guaranteed Bangladesh Bank Prize Bonds up to ৳9,000. Elevate your battlestation while holding winning tickets for nationwide prize bond draws.",
    terms: [
      "Valid on purchase of eligible MSI gaming motherboards, graphics cards, and gaming laptops.",
      "Physical prize bonds will be handed over instantly upon purchase invoice at any authorized outlet.",
      "Online customers will receive registered sealed prize bonds via secure insured courier.",
      "2-Year official replacement warranty with 24/7 technical assistance.",
      "Offer valid while prize bond stocks last.",
    ],
    productIds: [6, 1],
  },
  {
    id: 3,
    slug: "10-years-laptop-offer",
    title: "10 Years Celebration",
    subtitle: "Grand 10 Years Anniversary Fest: Massive Price Cuts & Free Gift Hampers on Laptops!",
    bengaliHeadline: "১০ বছর পূর্তি মেগা অফার: এক্সক্লুসিভ ল্যাপটপ ডিসকাউন্ট ও উপহার",
    badge: "Anniversary Fest",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    campaignTag: "10 Years Milestone",
    mainHighlight: "Exciting Price Discount & Hampers",
    discountBadge: "ANNIVERSARY DEAL",
    startDate: "07 Sep 2026",
    endDate: "30 Sep 2026",
    location: "Online & All Outlets",
    countdown: "01d 01h 06m",
    bgGradient: "bg-gradient-to-br from-[#260808] via-[#451010] to-[#190404]",
    accentColor: "#f59e0b",
    bannerTheme: "festive",
    description:
      "Celebrating 10 glorious years of empowering Bangladesh's tech enthusiasts. Enjoy historic price cuts on premium laptops including Apple MacBook Pro and gaming flagships, plus free anniversary gift hampers containing backpacks, sleeves, and accessories.",
    terms: [
      "Available across all physical branches nationwide and through our official online web store.",
      "0% EMI facility available for 6, 9, and 12 months with leading commercial banks.",
      "Free 10-Year Anniversary commemorative gift pack included with every qualifying laptop.",
      "Official 1-Year Apple Care or brand warranty with genuine BTRC approval.",
    ],
    productIds: [3],
  },
  {
    id: 4,
    slug: "mobile-deal",
    title: "Mobile Deal",
    subtitle: "Buy Mobile & Get Exciting Discount with Free Nationwide Delivery!",
    bengaliHeadline: "বাটন কিংবা টাচফোন মোবাইল ডিলে হবে সবার স্বপ্নপূরণ",
    badge: "Mobile Deal",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/40",
    campaignTag: "Official Smartphone Fest",
    mainHighlight: "Up to ৳15,000 Off + Free Delivery",
    discountBadge: "৳15,000 DISCOUNT",
    startDate: "12 Sep 2026",
    endDate: "30 Sep 2026",
    location: "Online & All Outlets",
    countdown: "07d 12h 30m",
    bgGradient: "bg-gradient-to-br from-[#0c2340] via-[#103b66] to-[#071629]",
    accentColor: "#38bdf8",
    bannerTheme: "mobile",
    description:
      "Upgrade to next-generation AI smartphones with unmatched discounts. Receive complimentary original fast-charging adapters, screen protectors, and zero-cost door-to-door courier delivery to any location in Bangladesh.",
    terms: [
      "100% Genuine official BTRC verified IMEI with full brand warranty.",
      "Free 45W Original Fast Charger adapter included in the box with flagship models.",
      "Free express shipping to all 64 districts in Bangladesh.",
      "7-Day replacement guarantee for manufacturing hardware defects.",
    ],
    productIds: [5],
  },
  {
    id: 5,
    slug: "triple-desktop-offer",
    title: "Triple Desktop Offer",
    subtitle: "Buy Desktop PC & Get Exciting Discount, 4-in-1 Combo & Gym Bag Gifts!",
    bengaliHeadline: "ট্রিপল x3 ডেস্কটপ অফার: আকর্ষণীয় মূল্যছাড় ও উপহার সামগ্রী",
    badge: "Triple Bonus",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    campaignTag: "Desktop PC Bonanza",
    mainHighlight: "Huge Price Cuts + 4-in-1 Combo",
    discountBadge: "COMBO + GIFTS",
    startDate: "07 Sep 2026",
    endDate: "30 Sep 2026",
    location: "All Outlets",
    countdown: "10d 18h 45m",
    bgGradient: "bg-gradient-to-br from-[#062c1e] via-[#0d4a34] to-[#041c13]",
    accentColor: "#10b981",
    bannerTheme: "gaming",
    description:
      "Build your ultimate dream workstation or gaming desktop. Score massive combo savings on graphics cards and multi-threaded processors, accompanied by a free 4-in-1 RGB gaming combo and an official waterproof gym bag.",
    terms: [
      "Includes free professional system assembly, thermal paste application, and cable routing.",
      "Free 4-in-1 Gaming Combo (Keyboard, Mouse, Mousepad, Headset) included.",
      "Complimentary Star Tech branded duffle/gym bag with every qualifying rig.",
      "3-Year component warranty with lifetime free labor servicing.",
    ],
    productIds: [1, 2, 6],
  },
  {
    id: 6,
    slug: "ryzen-pc-build-offer",
    title: "Ryzen PC Build Offer",
    subtitle: "Build This Ryzen Desktop PC & Get a 24\" Frameless IPS Monitor Completely Free!",
    bengaliHeadline: "রাইজেন কাস্টম পিসি বিল্ড অফার: সাথে ২৪ ইঞ্চি মনিটর একদম ফ্রি!",
    badge: "Free Monitor",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    campaignTag: "AMD Powered Campaign",
    mainHighlight: "Get a 24\" IPS Monitor Free",
    discountBadge: "FREE 24\" MONITOR",
    startDate: "07 Sep 2026",
    endDate: "30 Sep 2026",
    location: "All Outlets",
    countdown: "08d 19h 15m",
    bgGradient: "bg-gradient-to-br from-[#261507] via-[#422208] to-[#170c04]",
    accentColor: "#f97316",
    bannerTheme: "ryzen",
    description:
      "Harness the immense computing power of AMD Ryzen processors. Build a complete custom gaming or content-creation system and walk away with a complimentary 24-inch 100Hz frameless IPS monitor at zero additional cost.",
    terms: [
      "Qualifies when building a complete system powered by AMD Ryzen 7000 or 5000 series.",
      "Complimentary 24-inch Frameless 100Hz IPS Monitor provided with warranty.",
      "Stress-tested with 24-hour benchmark burn-in before handover.",
      "Official 3-Year warranty on processor, motherboard, and RAM.",
    ],
    productIds: [2, 7, 6],
  },
];

export function getOfferBySlug(slug: string): CampaignOffer | undefined {
  return campaignOffers.find((offer) => offer.slug === slug);
}

export function getOfferProducts(offer: CampaignOffer): Product[] {
  return featuredProducts.filter((p) => offer.productIds.includes(p.id));
}
