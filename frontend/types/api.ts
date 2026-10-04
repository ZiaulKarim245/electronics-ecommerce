import type { DetailedProduct } from "./catalog";

/** Shared response envelope expected from the Laravel REST API. */
export interface ApiSuccess<T> {
  status: "success";
  data: T;
  message?: string;
}

export interface ApiError {
  status: "error";
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
}

export interface ApiPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiPaginatedData<T> extends ApiPagination {
  data: T[];
}

export interface BackendWarrantyOption {
  price: number;
  regular_price: number;
  duration: string;
}

export interface BackendProduct {
  id: number;
  slug: string;
  title: string;
  model: string;
  brand: string;
  category: string;
  stock_status: "In Stock" | "Pre-Order" | "Out of Stock" | "Upcoming";
  official_warranty: BackendWarrantyOption;
  shop_warranty: BackendWarrantyOption;
  key_features: string[];
  specifications: Array<{ group: string; key: string; value: string }>;
  video_url?: string | null;
  driver_download_url?: string | null;
  visual_type: "gpu" | "cpu" | "laptop" | "monitor" | "smartphone" | "motherboard" | "ram" | "storage" | "psu" | "casing" | "cooler";
}

export type CatalogApiResponse = ApiSuccess<ApiPaginatedData<BackendProduct>>;

export interface BackendCategory {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  children_count: number;
  children: Array<{
    id: number;
    name: string;
    slug: string;
    icon: string | null;
  }>;
}

export type CategoryApiResponse = ApiSuccess<BackendCategory[]>;
export type FeaturedProductsApiResponse = ApiSuccess<BackendProduct[]>;


export interface AuthenticatedStaff {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export type SessionApiResponse = ApiSuccess<{ user: AuthenticatedStaff }>;

/** Response returned by the frontend's server-side catalog route handler. */
export interface StorefrontCatalogResponse {
  status: "success";
  data: { products: DetailedProduct[] };
  source: "backend" | "development-mock";
}
