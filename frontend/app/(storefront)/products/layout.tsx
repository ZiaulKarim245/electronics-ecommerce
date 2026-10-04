import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse the complete catalog of computers, laptops, components, and gadgets at TechHub Bangladesh.",
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
