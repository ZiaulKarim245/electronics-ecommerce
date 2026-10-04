export const DEMO_SESSION_COOKIE = "business_portal_demo_session";

export function isBusinessDemoEnabled() {
  return process.env.NODE_ENV !== "production"
    && process.env.APP_SURFACE === "business"
    && process.env.BUSINESS_DEMO_MODE === "true";
}

export function getBusinessDemoCredentials() {
  return {
    email: process.env.BUSINESS_DEMO_EMAIL ?? "admin@techhub.test",
    password: process.env.BUSINESS_DEMO_PASSWORD ?? "Demo@12345",
  };
}

export function getBusinessDemoSessionToken() {
  return process.env.BUSINESS_DEMO_SESSION_TOKEN ?? "techhub-local-demo-session";
}

export interface DemoRecord {
  reference: string;
  title: string;
  detail: string;
  status: string;
  tone: "cyan" | "amber" | "emerald" | "rose" | "slate";
}

export const demoRecords = {
  catalog: [
    { reference: "SKU-LAP-0142", title: "ASUS TUF Gaming A15", detail: "Ryzen 7 · 16GB · 512GB · RTX 4060", status: "Published", tone: "emerald" },
    { reference: "SKU-PHN-0088", title: "Samsung Galaxy A55 5G", detail: "8GB · 256GB · Awesome Navy", status: "Draft", tone: "slate" },
    { reference: "SKU-GPU-0031", title: "GeForce RTX 4070 SUPER", detail: "12GB GDDR6X · Official warranty", status: "Published", tone: "emerald" },
  ],
  inventory: [
    { reference: "GRN-260905-018", title: "Galaxy A55 stock intake", detail: "12 units · IMEI registration required", status: "Serial pending", tone: "amber" },
    { reference: "SKU-GPU-0031", title: "RTX 4070 SUPER", detail: "2 available · Reorder level 3", status: "Low stock", tone: "rose" },
    { reference: "SN-RTX4070-882194", title: "Assigned serial", detail: "Reserved for order TH-10482", status: "Reserved", tone: "cyan" },
  ],
  orders: [
    { reference: "TH-10482", title: "৳128,500 · Dhaka", detail: "3 items · COD · Customer verified", status: "Ready to pack", tone: "cyan" },
    { reference: "TH-10481", title: "৳84,900 · Rangpur", detail: "Advance delivery charge requires review", status: "Payment review", tone: "amber" },
    { reference: "TH-10477", title: "৳212,000 · Chattogram", detail: "Courier return ratio above threshold", status: "Risk review", tone: "rose" },
  ],
  recovery: [
    { reference: "CHK-7821", title: "৳96,400 · 34 minutes ago", detail: "Gaming laptop and mouse · Phone available", status: "Call now", tone: "cyan" },
    { reference: "CHK-7814", title: "৳42,800 · 2 hours ago", detail: "PC components · WhatsApp available", status: "Follow up", tone: "amber" },
    { reference: "CHK-7798", title: "৳18,500 · Yesterday", detail: "Smartwatch · Assigned to sales", status: "Contacted", tone: "slate" },
  ],
  pos: [
    { reference: "REG-DHK-01", title: "Main counter", detail: "Opening cash ৳15,000 · 6 transactions", status: "Open", tone: "emerald" },
    { reference: "QT-260905-22", title: "Custom gaming PC quotation", detail: "৳164,300 · Valid for 3 days", status: "Sent", tone: "cyan" },
    { reference: "POS-88142", title: "Counter sale", detail: "৳8,900 · Cash · Receipt 80mm", status: "Completed", tone: "emerald" },
  ],
  rma: [
    { reference: "RMA-26091", title: "ASUS TUF Gaming A15", detail: "Display issue · Technician assigned", status: "Diagnosing", tone: "amber" },
    { reference: "RMA-26088", title: "Samsung Galaxy A55", detail: "Submitted to distributor service center", status: "Distributor", tone: "cyan" },
    { reference: "RMA-26079", title: "Logitech G502", detail: "Replacement approved", status: "Ready for pickup", tone: "emerald" },
  ],
  campaigns: [
    { reference: "/offer/gaming-week", title: "Gaming Week", detail: "12 featured products · Ends Sep 12", status: "Live", tone: "emerald" },
    { reference: "/offer/iphone-preorder", title: "iPhone pre-order", detail: "Express form · Starts Sep 15", status: "Scheduled", tone: "cyan" },
    { reference: "/offer/flash-accessories", title: "Accessories flash sale", detail: "Countdown and 8 products", status: "Draft", tone: "slate" },
  ],
  reports: [
    { reference: "TODAY", title: "Net sales ৳486,200", detail: "Estimated gross margin ৳62,450", status: "Live summary", tone: "cyan" },
    { reference: "REGISTER", title: "Expected cash ৳124,500", detail: "Main counter · Settlement pending", status: "Needs settlement", tone: "amber" },
    { reference: "EXPENSE", title: "Operating expenses ৳18,250", detail: "7 approved entries today", status: "Recorded", tone: "slate" },
  ],
  team: [
    { reference: "USR-001", title: "Demo Administrator", detail: "Full portal access", status: "Admin", tone: "cyan" },
    { reference: "USR-014", title: "Inventory Manager", detail: "Catalog, inventory and serial access", status: "Active", tone: "emerald" },
    { reference: "USR-021", title: "RMA Officer", detail: "Warranty and service-ticket access", status: "Active", tone: "emerald" },
  ],
} satisfies Record<string, DemoRecord[]>;

export function getBusinessDemoRecords(module: string): DemoRecord[] {
  if (!isBusinessDemoEnabled()) return [];
  return demoRecords[module as keyof typeof demoRecords] ?? [];
}
