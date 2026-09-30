import type { CourseCardProps } from "./interface";

export type Course = CourseCardProps["course"];

export interface BookingFormValues {
  date: Date | undefined;
  teeTime: string;
  players: number;
  holes: "9" | "18";
  cartRental: boolean;
  fullName: string;
  email: string;
  phone: string;
  notes: string;
}

export type BookingErrors = Partial<Record<keyof BookingFormValues, string>>;

export const initialBookingValues: BookingFormValues = {
  date: undefined,
  teeTime: "",
  players: 2,
  holes: "18",
  cartRental: false,
  fullName: "",
  email: "",
  phone: "",
  notes: "",
};

export const CART_FEE_PER_PLAYER = 25;

/** Turns "$450" / "450 USD" / 450 into 450 */
export function parseFee(fee: string | number | undefined): number {
  if (typeof fee === "number") return fee;
  if (!fee) return 0;
  const n = parseFloat(fee.replace(/[^0-9.]/g, ""));
  return Number.isNaN(n) ? 0 : n;
}

export function validateBooking(v: BookingFormValues): BookingErrors {
  const errors: BookingErrors = {};
  if (!v.date) errors.date = "Choose a date to play.";
  if (!v.teeTime) errors.teeTime = "Pick a tee time.";
  if (v.fullName.trim().length < 2) errors.fullName = "Enter the name for the booking.";
  if (!/^\S+@\S+\.\S+$/.test(v.email)) errors.email = "Enter a valid email address.";
  if (v.phone.replace(/\D/g, "").length < 7) errors.phone = "Enter a phone number we can reach you on.";
  return errors;
}