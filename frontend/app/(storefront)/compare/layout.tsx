import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Products",
  description: "Compare prices, technical specifications, and key features of tech products side-by-side at TechHub Bangladesh.",
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
