import { BOOKING_STEPS } from "../booking-tabs/booking-tabs";
import type { BookingState } from "../interface/interface";

export function getMaxReachableStep(booking: BookingState, totalSteps: number) {
  if (!booking.courseId) return 1;
  if (!booking.slot) return 2;
  if (!booking.packageId) return 3;
  return totalSteps;
}

  export const lastStep = BOOKING_STEPS.length;
