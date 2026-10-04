import type { Metadata } from "next";
import InformationPage from "@/components/storefront/InformationPage";

export const metadata: Metadata = { title: "Shipping Policy", description: "Delivery coverage, charges, tracking, and receiving guidance for TechHub Bangladesh orders." };

export default function ShippingPage() {
  return <InformationPage eyebrow="Customer care" title="Shipping policy" introduction="We serve delivery locations across Bangladesh where courier coverage is available. The checkout is the source of truth for delivery availability, charges, and estimates for an order." sections={[
    { title: "Charges and estimates", content: <p>Available delivery methods, charges, and estimated arrival windows are shown before an order is confirmed. Estimates may change because of location, stock, weather, holidays, or courier conditions.</p> },
    { title: "Order processing", content: <p>We may contact you to verify the order and delivery details. Dispatch begins after required verification and stock confirmation.</p> },
    { title: "Tracking and receiving", content: <p>Tracking information is provided when supported by the selected courier. Inspect the outer package at delivery and report visible damage, missing items, or an incorrect product promptly through customer support.</p> },
    { title: "Failed delivery", content: <p>Incorrect contact details, an unreachable recipient, or repeated failed attempts may cause an order to be returned or require a new delivery charge.</p> },
  ]} />;
}
