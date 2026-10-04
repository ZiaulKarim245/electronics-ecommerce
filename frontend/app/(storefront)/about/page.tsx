import type { Metadata } from "next";
import InformationPage from "@/components/storefront/InformationPage";

export const metadata: Metadata = { title: "About Us", description: "Learn how TechHub Bangladesh helps customers shop for electronics and build compatible PCs." };

export default function AboutPage() {
  return <InformationPage eyebrow="About the store" title="Technology shopping with clearer decisions" introduction="TechHub Bangladesh is an electronics storefront designed around transparent product information, useful comparison tools, and dependable after-sales support." sections={[
    { title: "What we offer", content: <p>Browse electronics, compare devices side by side, and use the PC Builder to assemble a compatible configuration before ordering.</p> },
    { title: "How we earn trust", content: <p>Product pages should clearly show price, stock state, specifications, warranty coverage, and the information needed to make an informed purchase.</p> },
    { title: "After your purchase", content: <p>Your account brings orders, invoices, warranty information, and RMA requests together so support remains structured after checkout.</p> },
  ]} />;
}
