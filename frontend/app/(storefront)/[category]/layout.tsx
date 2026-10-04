import type { Metadata } from "next";

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
  "ai-pc": "AI PC",
  "desktop-offer": "Desktop PC Offer",
  "star-pc": "Star PC (Custom Build)",
  "gaming-pc": "Gaming Desktop PC",
  "brand-pc": "Brand Desktop PC",
  "all-in-one-pc": "All-in-One PC",
  "portable-mini-pc": "Portable Mini PC",
  "apple-mac-mini": "Apple Mac Mini",
  "apple-imac": "Apple iMac",
  "apple-mac-studio": "Apple Mac Studio",
  "apple-mac-pro": "Apple Mac Pro",
  "gaming-laptop": "Gaming Laptop",
  "premium-ultrabook": "Premium Ultrabook Laptop",
  "budget-laptop": "Budget Laptop",
  "oled-laptop": "OLED Display Laptop",
  "touchscreen-laptop": "Touchscreen Laptop",
  macbook: "Apple MacBook",
  processor: "Processor / CPU",
  motherboard: "Motherboard",
  "graphics-card": "Graphics Card / GPU",
  "ram-desktop": "Desktop RAM",
  "ram-laptop": "Laptop RAM",
  "power-supply": "Power Supply Unit (PSU)",
  casing: "Computer Casing",
  "casing-cooler": "Casing Cooler Fan",
  "cpu-cooler": "CPU Cooler",
  ssd: "Solid State Drive (SSD)",
  "hard-disk": "Hard Disk Drive (HDD)",
  "custom-liquid-cooling": "Liquid Cooling System",
  "optical-drive": "Optical Disk Drive",
  "gaming-monitor": "Gaming Monitor",
  "4k-monitor": "4K Ultra HD Monitor",
  "curved-monitor": "Curved Monitor",
  "ultrawide-monitor": "Ultrawide Monitor",
  "portable-monitor": "Portable Monitor",
  "touch-monitor": "Touch Screen Monitor",
  "smart-monitor": "Smart Monitor",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const slug = (category || "").toLowerCase();

  const name =
    categoryNameMap[slug] ||
    slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const cleanTitle = name.toLowerCase().includes("price in bangladesh")
    ? name
    : `${name} Price in Bangladesh`;

  return {
    title: cleanTitle,
    description: `Latest ${name} price in Bangladesh with official brand warranty and home delivery at TechHub Bangladesh.`,
  };
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
