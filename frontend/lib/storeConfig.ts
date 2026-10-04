export type CheckoutTemplate = "modern" | "precise" | "lucrative";
export type ProductLineTemplate = "modern" | "precise" | "lucrative";

export interface StoreConfig {
  checkoutTemplate: CheckoutTemplate;
  productLineTemplate: ProductLineTemplate;
  updatedAt?: string;
}

export const STORE_CONFIG_KEY = "techhub_store_config";
export const STORE_CONFIG_CHANGE_EVENT = "techhub_store_config_change";

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  checkoutTemplate: "lucrative",
  productLineTemplate: "modern",
  updatedAt: "2026-09-15T12:00:00.000Z",
};

export interface TemplateMetadata {
  id: string;
  templateNumber?: string;
  operationalTitle?: string;
  name: string;
  tagline: string;
  description: string;
  bestFor: string;
  features: string[];
  qualityStandards?: string[];
  tone: "cyan" | "emerald" | "amber" | "violet";
}

export const CHECKOUT_TEMPLATES_META: Record<CheckoutTemplate, TemplateMetadata> = {
  modern: {
    id: "modern",
    templateNumber: "Template 1",
    operationalTitle: "Express Single-Page Checkout",
    name: "Template 1: Express Single-Page Checkout",
    tagline: "A modern multi-card layout with all fields and order summary visible at once",
    description: "Keeps contact details, shipping location, delivery method, payment choice, and a sticky order summary together in one clean, responsive two-column view.",
    bestFor: "Fast retail tech, mobile shoppers, impulse gadget purchases, and D2C electronics.",
    features: [
      "Clean multi-card layout with simultaneous field visibility",
      "Sticky desktop order summary with read-only line items",
      "Direct Dhaka and nationwide delivery fee calculation",
      "Standardized terms consent and single-click order placement",
    ],
    qualityStandards: ["Modern Aesthetics", "Precise Calculations", "High-Converting (Lucrative)"],
    tone: "cyan",
  },
  precise: {
    id: "precise",
    templateNumber: "Template 2",
    operationalTitle: "Progressive Accordion Checkout",
    name: "Template 2: Progressive Accordion Checkout",
    tagline: "A guided step-by-step accordion with focused sequential disclosure",
    description: "Guides buyers through collapsible accordion sections for Contact, Shipping, Payment, and Confirmation, keeping focus high and scrolling low.",
    bestFor: "High-ticket electronics, custom PC orders, and shoppers who prefer a structured, step-by-step experience.",
    features: [
      "Progressive accordion flow with completed step checkmarks",
      "Integrated delivery instructions and logistics in shipping step",
      "Step-gated validation before unlocking subsequent sections",
      "Streamlined confirmation section free of duplicate review data",
    ],
    qualityStandards: ["Modern Aesthetics", "Precise Calculations", "High-Converting (Lucrative)"],
    tone: "amber",
  },
  lucrative: {
    id: "lucrative",
    templateNumber: "Template 3",
    operationalTitle: "Centered Minimalist Checkout",
    name: "Template 3: Centered Minimalist Checkout",
    tagline: "A clean, distraction-free single-column flow for focused completion",
    description: "A modern, centered single-column layout featuring a collapsible order summary drawer, auto-focus error recovery, and accessible payment controls.",
    bestFor: "Distraction-free purchasing, minimalist storefront aesthetics, mobile-first shoppers, and quick gadget checkouts.",
    features: [
      "Centered single-column layout with collapsible order summary drawer",
      "Auto-focus and smooth scroll to first invalid field on submission",
      "WCAG-compliant accessible payment controls",
      "Read-only order summary without quantity steppers",
    ],
    qualityStandards: ["Modern Aesthetics", "Precise Calculations", "High-Converting (Lucrative)"],
    tone: "emerald",
  },
};

export const PRODUCT_LINE_TEMPLATES_META: Record<ProductLineTemplate, TemplateMetadata> = {
  modern: {
    id: "modern",
    templateNumber: "Template 1",
    operationalTitle: "Modern Card Grid",
    name: "Template 1: Modern Card Grid",
    tagline: "Sleek, rounded cards with hover elevation",
    description: "A balanced 3-4 column grid layout with rounded visual containers, subtle spec pills, centered pricing, and elegant quick buttons.",
    bestFor: "General consumer electronics, laptops, branded desktops, and smart gadgets.",
    features: [
      "Clean visual cards with smooth hover zoom effect",
      "Clean price display with strikethrough discount",
      "Stock availability pulse indicator",
      "Streamlined 'Add to Cart' and 'View Details' actions",
    ],
    qualityStandards: ["Modern Aesthetics", "Precise Specs", "High-Converting (Lucrative)"],
    tone: "cyan",
  },
  precise: {
    id: "precise",
    templateNumber: "Template 2",
    operationalTitle: "Precise Technical Spec List",
    name: "Template 2: Precise Technical Spec List",
    tagline: "StarTech/Techland style spec-dense horizontal list",
    description: "Engineered for tech enthusiasts and gamers who need detailed specs at a glance. Includes key features bullets, warranty badges, and side-by-side compare.",
    bestFor: "Gaming PCs, custom builds, motherboards, processors, and technical components.",
    features: [
      "Horizontal spec-dense list with complete feature bullets",
      "Side-by-side [🛒 Add to Cart] and [⇄ Compare] controls",
      "Warranty breakdown (Official vs Shop) and stock status pill",
      "Direct spec scanning without opening product detail page",
    ],
    qualityStandards: ["Modern Aesthetics", "Precise Specs", "High-Converting (Lucrative)"],
    tone: "amber",
  },
  lucrative: {
    id: "lucrative",
    templateNumber: "Template 3",
    operationalTitle: "Lucrative Deal Showcase",
    name: "Template 3: Lucrative Deal Showcase",
    tagline: "High-converting cards with EMI & maximum savings emphasis",
    description: "Features eye-catching green savings banners, star ratings with verified review counts, 0% EMI monthly calculation badges, and glowing 'Buy Now' buttons.",
    bestFor: "Flash deal campaigns, premium flagship devices, and high-ticket electronics.",
    features: [
      "Bold green 'Save ৳X,XXX' badge on top left",
      "Star rating display with verified customer count (★★★★★ 4.9)",
      "Instant 0% EMI calculation badge ('From ৳X,XXX/mo')",
      "High-contrast glowing 'Buy Now' and Cart action buttons",
    ],
    qualityStandards: ["Modern Aesthetics", "Precise Specs", "High-Converting (Lucrative)"],
    tone: "emerald",
  },
};

export function getStoredConfig(): StoreConfig {
  if (typeof window === "undefined") {
    return DEFAULT_STORE_CONFIG;
  }
  try {
    const raw = localStorage.getItem(STORE_CONFIG_KEY);
    if (!raw) return DEFAULT_STORE_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      checkoutTemplate: ["modern", "precise", "lucrative"].includes(parsed.checkoutTemplate)
        ? parsed.checkoutTemplate
        : DEFAULT_STORE_CONFIG.checkoutTemplate,
      productLineTemplate: ["modern", "precise", "lucrative"].includes(parsed.productLineTemplate)
        ? parsed.productLineTemplate
        : DEFAULT_STORE_CONFIG.productLineTemplate,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch {
    return DEFAULT_STORE_CONFIG;
  }
}

export function saveStoredConfig(patch: Partial<StoreConfig>): StoreConfig {
  const current = getStoredConfig();
  const next: StoreConfig = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORE_CONFIG_KEY, JSON.stringify(next));
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new CustomEvent(STORE_CONFIG_CHANGE_EVENT, { detail: next }));
    } catch {
      // Storage fallback
    }
  }
  return next;
}
