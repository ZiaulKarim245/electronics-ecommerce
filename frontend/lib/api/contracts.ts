import type { BackendProduct, CatalogApiResponse } from "@/types/api";

const stockStatuses = new Set(["In Stock", "Pre-Order", "Out of Stock", "Upcoming"]);
const visualTypes = new Set(["gpu", "cpu", "laptop", "monitor", "smartphone", "motherboard", "ram", "storage", "psu", "casing", "cooler"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isWarranty(value: unknown) {
  return isRecord(value)
    && isFiniteNumber(value.price)
    && isFiniteNumber(value.regular_price)
    && isString(value.duration);
}

function isSpecification(value: unknown) {
  return isRecord(value) && isString(value.group) && isString(value.key) && isString(value.value);
}

function isBackendProduct(value: unknown): value is BackendProduct {
  if (!isRecord(value)) return false;
  return isFiniteNumber(value.id)
    && isString(value.slug)
    && isString(value.title)
    && isString(value.model)
    && isString(value.brand)
    && isString(value.category)
    && isString(value.stock_status)
    && stockStatuses.has(value.stock_status)
    && isWarranty(value.official_warranty)
    && isWarranty(value.shop_warranty)
    && Array.isArray(value.key_features)
    && value.key_features.every(isString)
    && Array.isArray(value.specifications)
    && value.specifications.every(isSpecification)
    && (value.video_url === undefined || value.video_url === null || isString(value.video_url))
    && (value.driver_download_url === undefined || value.driver_download_url === null || isString(value.driver_download_url))
    && isString(value.visual_type)
    && visualTypes.has(value.visual_type);
}

export function parseCatalogResponse(value: unknown): CatalogApiResponse {
  if (!isRecord(value) || value.status !== "success" || !isRecord(value.data)) {
    throw new Error("Catalog API returned an invalid response envelope");
  }

  const data = value.data;
  if (!Array.isArray(data.data) || !data.data.every(isBackendProduct)) {
    throw new Error("Catalog API returned invalid product data");
  }

  for (const key of ["current_page", "last_page", "per_page", "total"] as const) {
    if (!isFiniteNumber(data[key])) throw new Error(`Catalog API pagination field '${key}' is invalid`);
  }

  return value as unknown as CatalogApiResponse;
}
