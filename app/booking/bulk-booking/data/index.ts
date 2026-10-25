import type { BookingStep } from "../../booking-component/booking-guide";

export const Bulk_BOOKING_STEPS: BookingStep[] = [
  {
    label: "Course & golfers",
    title: "Choose your course and how many are playing",
    help: "Pick the golf course, then use the + and − buttons to set the number of golfers.",
    todo: "Select a course and at least 1 golfer to continue.",
  },
  {
    label: "Tee time",
    title: "Pick a date and tee time",
    help: "Choose a day on the calendar, then tap one of the available times. Greyed-out days are closed.",
    todo: "Select a date and a tee time to continue.",
  },
  {
    label: "Review & pay",
    title: "Check your booking and pay",
    help: "Make sure everything looks right. Use Edit next to any section to change it. Nothing is charged until you pay.",
  },
];