/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ItemVariantUpdateBySkuAttributes {
  color?: string;
  size?: string;
  packQuantity?: number;
  price?: number;
  stockQty?: number;     // increments existing stock
  availability?: boolean;
  attributes?: Record<string, any>;
  urls?: string[];
}

export interface ItemVariantUrl {
  url: string;
  itemVariantId: number;
  sortOrder: number;
}

export interface ItemVariantItem {
  name: string;
  description: string;
}

export interface ItemVariant {
  id: number;
  itemId: number;
  sku: string;
  color: string | null;
  size: string | null;
  packQuantity: number;
  price: string; // returned as string (likely a Decimal serialized) — use number if you parse it
  stockQty: number;
  availability: boolean;
  attributes: Record<string, unknown> | null; // shape unknown, adjust if you know the JSON structure
  urls: ItemVariantUrl[];
  item: ItemVariantItem;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ItemVariantsData {
  itemVariants: ItemVariant[];
  meta: Meta;
}

export interface GetItemVariantsResponse {
  status: number;
  message: string;
  data: ItemVariantsData;
}