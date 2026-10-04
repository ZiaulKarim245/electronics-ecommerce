import type { Metadata } from "next";
import InformationPage from "@/components/storefront/InformationPage";

export const metadata: Metadata = { title: "Payment Policy", description: "Current payment methods and payment safety guidance for TechHub Bangladesh." };

export default function PaymentsPage() {
  return <InformationPage eyebrow="Safe checkout" title="Payment policy" introduction="Only payment methods displayed and confirmed during checkout are available for your order. Online payment gateways are not currently advertised as active." sections={[
    { title: "Cash on delivery", content: <p>Cash on delivery may be offered for eligible products and delivery areas. Availability is confirmed at checkout and may depend on order verification.</p> },
    { title: "Future online payments", content: <p>If an online gateway is enabled later, its provider, fees, instructions, and confirmation state will be shown clearly at checkout before you place the order.</p> },
    { title: "Payment safety", content: <p>Never share a card PIN, mobile financial service PIN, password, or one-time passcode with support staff. Use only payment instructions displayed through the official checkout.</p> },
    { title: "Refund route", content: <p>Approved refunds are returned using an available and verified method. The method and expected processing window are communicated when the refund is approved.</p> },
  ]} />;
}
