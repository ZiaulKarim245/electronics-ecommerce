import type { Metadata } from "next";
import InformationPage from "@/components/storefront/InformationPage";

export const metadata: Metadata = { title: "Privacy Policy", description: "How TechHub Bangladesh handles customer and storefront data." };

export default function PrivacyPage() {
  return <InformationPage eyebrow="Your information" title="Privacy policy" introduction="This page explains the types of information the storefront may handle, why it is used, and the choices available to customers." sections={[
    { title: "Information we handle", content: <p>This may include account and contact details, delivery information, order and invoice records, support conversations, warranty or RMA evidence, and technical data needed to operate and secure the storefront.</p> },
    { title: "How information is used", content: <p>Information is used to provide accounts, process and deliver orders, answer support requests, manage warranty claims, prevent abuse, maintain security, and meet operational or legal obligations.</p> },
    { title: "Service providers", content: <p>Necessary information may be shared with approved providers such as couriers, infrastructure services, warranty partners, or payment providers only when their service is used. We do not describe customer data as being sold.</p> },
    { title: "Retention and security", content: <p>Records are retained only as needed for the purposes described, dispute handling, security, and applicable obligations. Reasonable safeguards are used, but no internet service can promise absolute security.</p> },
    { title: "Your choices", content: <p>You may request help with your account information or privacy questions through the published support channels. Requests may require identity verification.</p> },
  ]} />;
}
