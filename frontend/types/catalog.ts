export interface TechnicalSpecification {
  group: string;
  key: string;
  value: string;
}

export type ProductStockStatus = "In Stock" | "Pre-Order" | "Out of Stock" | "Upcoming";

import type { ProductVisualType } from "@/components/storefront/ProductVisual";
export type { ProductVisualType };

export interface WarrantyOption {
  price: number;
  regularPrice: number;
  duration: string;
}

export interface DetailedProduct {
  id: number;
  slug: string;
  title: string;
  model: string;
  brand: string;
  category: string;
  stockStatus: ProductStockStatus;
  officialWarranty: WarrantyOption;
  shopWarranty: WarrantyOption;
  keyFeatures: string[];
  specifications: TechnicalSpecification[];
  videoUrl?: string;
  driverDownloadUrl?: string;
  rating: number;
  reviewsCount: number;
  ratingBreakdown: { [star: number]: number };
  visualType: ProductVisualType;
}
