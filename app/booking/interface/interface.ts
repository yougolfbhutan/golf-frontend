import type { Gender, Hand, KitState } from "../booking-steps/Package/data";

export type BookingState = {
  categoryId: string | null;
  courseId: string | null;
  golfers: number;
  date: string | null;
  slot: { date: string; time: string } | null;
  packageId: string | null; // "standard" | "premium" | "green-fee"
  gender: Gender;
  hand?: Hand; // "left" | "right"
  kit: KitState;
  proShopItems: string[];
};

export const initialBooking: BookingState = {
  categoryId: null,
  courseId: null,
  golfers: 2,
  date: null,
  slot: null,
  packageId: null,
  gender: "men",
  hand: "right",
  kit: {},
  proShopItems: [],
};