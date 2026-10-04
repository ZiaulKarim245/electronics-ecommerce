import type { Metadata } from "next";
import Link from "next/link";
import InformationPage from "@/components/storefront/InformationPage";
import { storefrontConfig } from "@/lib/storefrontConfig";

export const metadata: Metadata = { title: "Contact Us", description: "Contact TechHub Bangladesh for product, order, warranty, and RMA support." };

export default function ContactPage() {
  const hasDirectContact = Boolean(storefrontConfig.supportPhone || storefrontConfig.supportEmail || storefrontConfig.whatsappHref);
  return <InformationPage eyebrow="Customer support" title="How can we help?" introduction="Choose the support route that matches your question. Keep your order number, invoice, or product serial number ready when applicable." sections={[
    { title: "Direct contact", content: hasDirectContact ? <div className="space-y-2">{storefrontConfig.supportPhone && storefrontConfig.supportPhoneHref && <p>Phone: <a className="font-bold text-secondary hover:underline" href={storefrontConfig.supportPhoneHref}>{storefrontConfig.supportPhone}</a></p>}{storefrontConfig.supportEmail && <p>Email: <a className="font-bold text-secondary hover:underline" href={`mailto:${storefrontConfig.supportEmail}`}>{storefrontConfig.supportEmail}</a></p>}{storefrontConfig.whatsappHref && <p><a className="font-bold text-secondary hover:underline" href={storefrontConfig.whatsappHref} target="_blank" rel="noopener noreferrer">Start a WhatsApp consultation <span className="sr-only">(opens in a new tab)</span></a></p>}</div> : <p>Direct contact details have not been published yet. Please use your account for order and RMA support.</p> },
    { title: "Order and RMA support", content: <p>Sign in to view orders or submit a structured return or warranty request. <Link href="/account/login" className="font-bold text-secondary hover:underline">Open your account →</Link></p> },
    { title: "Warranty verification", content: <p>Use the public warranty tool when you have a product serial number or IMEI. <Link href="/warranty" className="font-bold text-secondary hover:underline">Verify warranty →</Link></p> },
    { title: "Location and hours", content: <div>{storefrontConfig.address ? <p>{storefrontConfig.address}</p> : <p>A customer-facing location has not been published.</p>}{storefrontConfig.businessHours && <p className="mt-2">Support hours: {storefrontConfig.businessHours}</p>}</div> },
  ]} />;
}
