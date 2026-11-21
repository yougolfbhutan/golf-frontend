import type { BookingStep } from "../../booking-component/booking-guide";
import { fetchTeeTimes } from "../../booking-steps/Tee-time/tanstack";
import type { BookingConfig } from "../components/booking-from";

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


/* ---------- 1. Golf (your current form) ---------- */

// Fixed tee times, every 10 minutes from 6:30 to 14:00. Edit to suit your course.

const getToday = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
export const golfBooking: BookingConfig = {
  summaryTitle: "Bulk golf booking",
  currency: "$",
  noun: "players",
  tiers: [
    { id: "saarc", label: "SAARC" },
    { id: "nonSaarc", label: "Non-SAARC" },
  ],
  dateLabel: "Date",
  timeLabel: "Tee time",
  maxAdvanceDays: 21, // pre-booking allowed up to 3 weeks ahead

  // static tee times, same for every date (no backend call)
 fetchTimeSlots: async (date: string, signal?: AbortSignal) => {
    return await fetchTeeTimes(date || getToday(), signal);
  },

  charges: [
    { id: "green", label: "Green fee", perTier: { saarc: 200, nonSaarc: 250 } },
  ],
  splits: [
    {
      id: "hand",
      title: "Right or left handed?",
      summaryLabel: "Handedness",
      parts: [
        { id: "right", label: "Number of right-handed players", summaryLabel: "right" },
        { id: "left", label: "Number of left-handed players", summaryLabel: "left" },
      ],
    },
  ],
  extras: [
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
      placeholder: "Caddies, beginners, special requests...",
    },
  ],
};

/* ---------- 2. Rafting: same component, different data ---------- */
export const raftingBooking: BookingConfig = {
  summaryTitle: "River rafting trip",
  currency: "Nu.",
  noun: "guests",
  maxPerTier: 20,
  tiers: [
    { id: "adult", label: "Adult" },
    { id: "child", label: "Child" },
  ],
  timeLabel: "Departure",
  // fetchTimeSlots: async () => ["08:00", "10:00", "13:00", "15:00"],
  charges: [
    { id: "trip", label: "Rafting fee", perTier: { adult: 2800, child: 1800 } },
    {
      id: "suit",
      label: "Wetsuit rental",
      perTier: { adult: 400, child: 300 },
      waivable: {
        title: "Bringing your own wetsuit?",
        label: "with own wetsuit",
        summaryLabel: "Own wetsuit",
      },
    },
  ],
  splits: [
    {
      id: "level",
      title: "Experience level?",
      summaryLabel: "Experience",
      parts: [
        { id: "beginner", label: "Beginners", summaryLabel: "beginner" },
        { id: "experienced", label: "Experienced", summaryLabel: "experienced" },
      ],
    },
  ],
  extras: [
    { name: "name", label: "Full name", type: "text", required: true },
    { name: "phone", label: "Phone", type: "tel", required: true },
  ],
  submitLabel: "Reserve trip",
};

/* ---------- Usage ----------
import BookingForm from "./BookingForm";
import { golfBooking, raftingBooking } from "./booking-configs";

<BookingForm
  config={golfBooking}
  onSubmit={async (values, summary) => {
    await fetch("/api/bookings", {
      method: "POST",
      body: JSON.stringify({ ...values, total: summary.total }),
    });
  }}
/>

<BookingForm config={raftingBooking} onSubmit={...} />
---------------------------- */