export  interface Party {
  name: string;
  email: string;
  phone: string;
}

export interface GolfCourse {
  id: number;
  name: string;
  price: string;
}

export interface CarrySet {
  id: number;
  name: string;
  available: boolean;
  caddieId: number;
  peopleCategoryId: number;
  roundTypeId: number;
  images: string[];
}

export interface OrderItem {
  sku: string;
  name: string;
  category: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  image: string;
}

export interface Order {
  id: number;
  status: string; // e.g. "pending" | "paid"
  totalPrice: string;
  createdAt: string; // ISO date string
  items: OrderItem[];
}

export interface BookingResult {
  id: number;
  date: string; // ISO date string
  status: string; // e.g. "pending" | "booked" | "cancelled"
  party: Party;
  golfCourse: GolfCourse;
  carrySet: CarrySet;
  order: Order;
}

export interface Meta {
  page: number;
  limit: number;
  totalPages: number | null;
}

export interface BookingData {
  results: BookingResult[];
  meta: Meta;
}

export interface InnerResponse {
  status: number;
  data: BookingData;
  message: string;
}

export interface BookingAndOrderResponse {
  status: number;
  message: string;
  data: InnerResponse;
}