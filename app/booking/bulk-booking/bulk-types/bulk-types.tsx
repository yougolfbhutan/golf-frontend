import { format, parseISO } from "date-fns";
import { coursesdata } from "@/app/homepagecomponents/golfcourse/courses";
import type { BookingState } from "../../interface/interface";

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */
export const MIN_GOLFERS = 1; // at least one golfer in total (any mix)
export const MAX_PER_TYPE = 200;
export const CLOSED_DAYS = [2]; // same closed day as the normal booking flow (0 = Sunday)

// bulk booking has only 3 steps: no package step
export const BULK_STEPS = ["Course and golfers", "Date and tee time", "Review"];
export const BULK_LAST_STEP = BULK_STEPS.length;

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
// courseId, date and slot use the same types as the normal booking,
// so the shared DateTimeStep works with both flows
export type BulkState = {
  courseId: BookingState["courseId"];
  saarcGolfers: number;
  nonSaarcGolfers: number;
  date: BookingState["date"];
  slot: BookingState["slot"];
};

export const initialBulk: BulkState = {
  courseId: null,
  saarcGolfers: 0,
  nonSaarcGolfers: 0,
  date: null,
  slot: null,
};

export type BulkBookingPayload = {
  customerId: string;
  golfCourseId: number | string;
  teeDate: string;
  teeTime: string;
  saarcGolfers: number;
  nonSaarcGolfers: number;
  totalGolfers: number;
  bookingType: "bulk";
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
export const totalGolfers = (b: BulkState) => b.saarcGolfers + b.nonSaarcGolfers;

export const findCourse = (courseId: string | null) =>
  coursesdata.find((c) => (c.bookingId ?? String(c.id)) === courseId);

export function canContinueBulk(step: number, b: BulkState) {
  if (step === 1) return Boolean(b.courseId) && totalGolfers(b) >= MIN_GOLFERS;
  if (step === 2) return Boolean(b.slot);
  return true;
}

export function teeTimeLabel(slot: BulkState["slot"]) {
  return slot
    ? `${format(parseISO(slot.date), "EEEE d MMMM yyyy")} at ${slot.time}`
    : "—";
}

/** turns what was typed into a whole number between 0 and MAX_PER_TYPE */
export const toCount = (v: string) =>
  Math.min(MAX_PER_TYPE, Math.max(0, parseInt(v, 10) || 0));

/**
 * TODO: replace with your real API call (same style as useBookingMutation).
 * Throw an error to show a message to the tour operator.
 */
export async function sendBulkBooking(
  payload: BulkBookingPayload,
): Promise<{ reference?: string }> {
  console.log("Bulk booking request", payload);
  return {};
}