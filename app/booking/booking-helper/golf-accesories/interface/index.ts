export type Tier = "standard" | "premium";
export type Audience = "men" | "women" | "junior";
export type Handedness = "left" | "right";

export interface ItemVariantUrl {
  url: string;
  itemVariantId: number;
  sortOrder: number;
}

export interface ItemCategory {
  id: number;
  name: string; // e.g. "golf-ball"
}

export interface ItemSummary {
  id: number;
  name: string;
  description: string | null;
  categoryId: number;
  category: ItemCategory;
}

export interface ItemVariant {
  id: number;
  itemId: number;
  sku: string;
  variantKey: string;
  tier: Tier | null;
  audience: Audience | null;
  color: string | null;
  size: string | null;
  hand: Handedness | null;
  packQuantity: number;
  price: string; // Prisma Decimal is sent as a string: "240"
  stockQty: number;
  availability: boolean;
  attributes: Record<string, unknown> | null;
  item: ItemSummary;
  urls: ItemVariantUrl[];
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export type ItemVariantsResponse = ApiResponse<{
  Souvenirs: ItemVariant[]; // key name exactly as your API sends it
}>;