import type { BookingState } from "../interface/interface";

export function canContinue(step: number, booking: BookingState): boolean {
  switch (step) {
    case 1:
      return !!booking.courseId && booking.golfers > 0;
    case 2:
      return !!booking.slot;
    case 3:
      return !!booking.packageId;
    case 4:
      return true; // optional
    default:
      return true;
  }
}