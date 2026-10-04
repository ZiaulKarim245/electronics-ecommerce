import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/data/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.title,
    description: `Buy ${product.title} at best price in Bangladesh with official warranty, express delivery and EMI support at TechHub Bangladesh.`,
  };
}

export default function ProductDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
