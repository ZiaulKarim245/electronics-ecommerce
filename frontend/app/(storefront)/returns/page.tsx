import type { Metadata } from "next";
import Link from "next/link";
import InformationPage from "@/components/storefront/InformationPage";

export const metadata: Metadata = { title: "Returns and Refunds", description: "Return, inspection, RMA, and refund guidance for TechHub Bangladesh orders." };

export default function ReturnsPage() {
  return <InformationPage eyebrow="Customer care" title="Returns and refunds" introduction="Return outcomes depend on the product condition, the reason for return, warranty terms, and inspection. This policy does not limit rights that apply under law." sections={[
    { title: "Report a problem", content: <p>Report a damaged, incorrect, incomplete, or faulty item as soon as reasonably possible. Keep the product, packaging, accessories, invoice, and serial labels together for assessment.</p> },
    { title: "Inspection and eligibility", content: <p>We inspect returned products before approving a replacement, repair, store adjustment, or refund. Physical damage, missing parts, altered serial labels, misuse, or unsupported modification can affect eligibility.</p> },
    { title: "Products needing special handling", content: <p>Activated devices, software or license products, custom-built PCs, and opened sealed items may require manufacturer or warranty assessment instead of a standard change-of-mind return.</p> },
    { title: "Start a request", content: <p>Use your account to identify the order and submit the reason, photos, and serial information. <Link href="/account/login" className="font-bold text-secondary hover:underline">Open orders and RMA →</Link></p> },
  ]} />;
}
