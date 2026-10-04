import { NextRequest, NextResponse } from "next/server";
import { mockCatalog } from "@/lib/data/catalog";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim().toLowerCase() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const matching = mockCatalog.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.model.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );

  const totalCount = matching.length;

  const suggestions = matching.slice(0, 10).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    brand: p.brand,
    category: p.category,
    price: p.officialWarranty.price,
    regularPrice: p.officialWarranty.regularPrice,
    stockStatus: p.stockStatus,
    visualType: p.visualType,
  }));

  return NextResponse.json({ suggestions, totalCount });
}
