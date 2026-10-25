/* eslint-disable @typescript-eslint/no-explicit-any */
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";



export interface CreateBookingPayload {
  customerId: string; // UUID
  golfCourseId: number;
  teeDate: string; // "YYYY-MM-DD"
  teeTime: string; // "HH:mm" (24-hour)
  numberOfGolfers: number;

  // customer booking only (bulk booking leaves these out)
  golferCategoryId?: number;
  notes?: string;
  items?: any[];
  status?: BookingStatus;
}

export interface Booking {
  id: number;
  customerId: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone_no: string;
    country_code: string;
  };
  golfCourseId: number;
  golfCourse: {
    id: number;
    name: string;
    imageUrl: string;
  };
  golferCategoryId: number;
  golferCategory: {
    id: number;
    name: string;
  };
  teeDate: string;
  teeTime: string;
  numberOfGolfers: number;
  status: string;
  totalAmount: number;
  currency: string;
  notes: string | null;
  items: {
    id: number;
    golfSetId: number | null;
    golfSet: { id: number; name: string; imageUrl: string } | null;
    ballId: number | null;
    ball: { id: number; name: string; imageUrl: string } | null;
    quantity: number;
    unitPrice: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface BookingsResponse {
  reference: string | undefined;
  success: boolean;
  message: string;
  data: {
    data: Booking[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}