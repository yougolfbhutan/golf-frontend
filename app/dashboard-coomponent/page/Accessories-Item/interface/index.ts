export interface ItemCategorySummary {
  id: number;
  name: string;
}

export interface ItemSummary {
  id: number;
  name: string;
  description: string | null;
  categoryId: number;
  category: ItemCategorySummary;
}

export interface ItemVariantUrl {
  url: string;
  itemVariantId: number;
  sortOrder: number;
}

export interface ItemVariantDetail {
  id: number;
  itemId: number;
  sku: string;
  color: string | null;
  size: string | null;
  packQuantity: number;
  price: string; // Decimal -> string over JSON
  stockQty: number;
  availability: boolean;
  attributes: Record<string, unknown> | null;
  item: ItemSummary;
  urls: ItemVariantUrl[];
}

export interface CartItem {
  id: number;
  unitPrice: string; // Decimal -> string
  quantity: number;
  cartId: number;
  itemVariantId: number;
  itemVariant: ItemVariantDetail;
}

export interface Cart {
  id: number;
  customerId: number | null;
  createdAt: string; // ISO date string
  items: CartItem[];
}

export interface OrderBookingSummary {
  id: number;
  partyName: string | null;
  date: string; // ISO date string
  status: "pending" | "booked" | "cancelled";
}

export interface Order {
  id: number;
  status: "pending" | "paid" | "cancelled" | "refunded";
  totalPrice: string; // Decimal -> string
  createdAt: string;
  customerId: number | null;
  cartId: number | null;
  cart: Cart | null;
  bookings: OrderBookingSummary[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrderListData {
  order: Order[];
  meta: PaginationMeta;
}

export interface OrderListResult {
  status: number;
  data: OrderListData;
  message: string;
}

// Matches the outer envelope in your sample (data.data.order, data.data.meta)
export interface GetOrderResponse {
  status: number;
  message: string;
  data: OrderListResult;
}