
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
 
/* One rental item. Send exactly ONE of golfSetId, gloveId or ballId. */
export type CreateBookingItem =
  | { golfSetId: number; gloveId?: never; ballId?: never; quantity: number }
  | { gloveId: number; golfSetId?: never; ballId?: never; quantity: number }
  | { ballId: number; golfSetId?: never; gloveId?: never; quantity: number };
 
export interface CreateBookingApprovedPayload {
  customerId: number; // 1 or more
  golfCourseId: number; // 1 or more
  golferCategoryId?: number; // optional
  teeDate: string; // "YYYY-MM-DD", e.g. "2026-11-14"
  teeTime: string; // "HH:mm", e.g. "07:15"
  numberOfGolfers: number; // 1 to 20 on the backend
  notes?: string; // up to 500 characters
  items?: CreateBookingItem[]; // up to 20 items, quantity 1 to 100 each
  status?: BookingStatus;
}
