import { getCatalogProducts } from "@/lib/api/catalog";
import { mockCatalog } from "@/lib/data/catalog";

export async function GET() {
  try {
    const products = await getCatalogProducts();
    return Response.json({ status: "success", data: { products }, source: "backend" });
  } catch (error) {
    const allowMockData = process.env.NODE_ENV !== "production"
      && process.env.STOREFRONT_MOCK_DATA === "true";

    if (allowMockData) {
      return Response.json(
        { status: "success", data: { products: mockCatalog }, source: "development-mock" },
        { headers: { "Cache-Control": "no-store", "X-Data-Source": "development-mock" } },
      );
    }

    console.error("Catalog request failed", error);
    return Response.json(
      { status: "error", error: { code: "CATALOG_UNAVAILABLE", message: "Product data is temporarily unavailable." } },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
