import type { Metadata } from "next";
import InformationPage from "@/components/storefront/InformationPage";

export const metadata: Metadata = { title: "Terms and Conditions", description: "Terms governing use of the TechHub Bangladesh storefront and purchases." };

export default function TermsPage() {
  return <InformationPage eyebrow="Store terms" title="Terms and conditions" introduction="By using the storefront or placing an order, you agree to these terms together with the policies linked from this page. Product-specific warranty terms remain part of the purchase information." sections={[
    { title: "Products and information", content: <p>We work to keep descriptions, prices, availability, images, and specifications accurate. A listing error may be corrected, and an affected order may require customer confirmation before fulfilment.</p> },
    { title: "Orders", content: <p>Submitting checkout is an order request. An order is accepted after required verification, stock confirmation, and any applicable payment confirmation. We may refuse or cancel suspicious, duplicate, incorrectly priced, or unavailable orders and communicate the outcome.</p> },
    { title: "Accounts and acceptable use", content: <p>You are responsible for accurate information and reasonable account security. Do not misuse the storefront, interfere with its operation, access another person&apos;s account, or submit unlawful or fraudulent requests.</p> },
    { title: "Warranty and after-sales support", content: <p>Coverage varies by product, brand, distributor, and condition. The product page, invoice, serial record, and applicable warranty policy determine the available service route.</p> },
    { title: "Policy changes", content: <p>These terms may be updated when the service or operational requirements change. The version shown when an order is placed applies to that transaction unless another requirement applies.</p> },
  ]} />;
}
