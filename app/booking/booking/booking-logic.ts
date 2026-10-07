import {
  ADDONS,
  COURSES,
  MIN_DAYS_AHEAD,
  PRICES,
  type AddonKey,
  type CourseId,
  type ExtraKey,
  type Level,
  type Passport,
  type PayMethod,
  type SlotId,
  type Step,
  type Who,
} from "./booking-data";

export interface BookingState {
  step: Step;
  who: Who | "";
  passport: Passport | "";
  course: CourseId | "";
  level: Level | "";
  ownGear: boolean | null; // null = not answered yet
  addons: AddonKey[]; // "coaching", "companion", and "clubs" (marker for a backend golf set)
  /** Selected backend golf set id, saved under the "clubs" key */
  variant: Partial<Record<string, string>>;
  options: Partial<Record<string, Record<string, string>>>;
  players: number;
  date: string; // yyyy-mm-dd
  slot: SlotId | "";
  details: { name: string; phone: string; email: string,specialRequests?: string }; // New field for special requests
  accessoryIds?: string[]; // booked accessory variant ids, e.g. ["12", "15"]
  accessoryQuantities?: Record<string, number>; // ← add this, e.g. { "12": 3 }
specialRequests?: string; // New field for special requests
  payment: {
    method: PayMethod | "";
    dkAccount: string;
    cardNumber: string;
    cardExpiry: string;
    cardCvc: string;
  };
    golfers: number;      // how many people are playing (1–4)
  setQuantity: number; 
  setQuantities: Record<string, number>; // id → how many sets (total ≤ golfers)
}

export type FieldKey =
  | "who" | "passport" | "course" | "level" | "ownGear" | "slot" | "method"
  | "date" | "name" | "phone" | "email" | "dk" | "card";
export type Errors = Partial<Record<FieldKey, string>>;
export type UpdateBooking = (patch: Partial<BookingState>) => void;

export interface StepProps {
  state: BookingState;
  update: UpdateBooking;
  errors: Errors;
}

export const initialState: BookingState = {
  step: 1,
  who: "",
  passport: "",
  course: "",
  level: "",
  ownGear: null,
  addons: [],
  variant: {},
  options: {},
  players: 1,
  date: "",
  slot: "",
  golfers: 0,
  setQuantity: 1,
  setQuantities: {},
  details: { name: "", phone: "", email: "" },
  payment: {
    method: "",
    dkAccount: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  },
};

/** Add-ons offered, in display order: coaching for new golfers, companion for visitors. */
export function addonList(s: BookingState): ExtraKey[] {
  const list: ExtraKey[] = [];
  if (s.level === "newbie") list.push("coaching");
if (s.who === "Non-Bhutanese") list.push("companion");  return list;
}

export function roundPrice(s: BookingState): number {
  if (!s.who) return 0;
  // Residents pay one rate, so they don't need to pick a passport.
  const passport = s.passport || (s.who === "Bhutanese" ? "intl" : "");
  if (!passport) return 0;
  return PRICES[s.who].round[passport];
}

export function addonPrice(s: BookingState, key: ExtraKey): number {
  if (!s.who) return 0;
  return PRICES[s.who][key];
}

export function formatMoney(who: Who | "", amount: number): string {
  if (who === "Non-Bhutanese") return `$${amount.toLocaleString("en-US")}`;
  if (who === "Bhutanese") return `Nu ${amount.toLocaleString("en-IN")}`;
  return amount.toLocaleString("en-US");
}

export function courseOf(s: BookingState) {
  return COURSES.find((c) => c.id === s.course); // undefined until chosen
}

export interface Line {
  label: string;
  qty: number;
  amount: number;
}

/**
 * Round + coaching/companion only.
 * Equipment rows come from useEquipmentLines (backend data).
 */
export function bookingLines(s: BookingState): Line[] {
  const n = s.players;
  const course = courseOf(s);
  const lines: Line[] = [
    {
      label: `Round${course ? ` at ${course.short}` : ""} (green fee, caddie, refreshments)`,
      qty: n,
      amount: roundPrice(s) * n,
    },
  ];
  for (const key of addonList(s)) {
    if (!s.addons.includes(key)) continue;
    lines.push({
      label: ADDONS[key].name,
      qty: n,
      amount: addonPrice(s, key) * n,
    });
  }
  return lines;
}

export function bookingTotal(s: BookingState): number {
  return bookingLines(s).reduce((sum, l) => sum + l.amount, 0);
}

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function earliestDate(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + MIN_DAYS_AHEAD);
  return d;
}

export function formatDate(iso: string, long = false): string {
  if (!iso) return "Not chosen yet";
  return new Date(`${iso}T00:00:00`).toLocaleDateString(
    "en-GB",
    long
      ? { weekday: "long", day: "numeric", month: "long", year: "numeric" }
      : { weekday: "short", day: "numeric", month: "short" },
  );
}

/** Errors for choices the golfer hasn't made yet. Call before "Next". */
export function validateChoices(s: BookingState, step: Step): Errors {
  const e: Errors = {};
  if (step === 1) {
    if (!s.who) e.who = "Tell us if you're visiting or a resident.";
    if (s.who === "Non-Bhutanese" && !s.passport) e.passport = "Choose your passport type.";
    if (!s.course) e.course = "Choose a course.";
  }
  if (step === 2 && !s.level) e.level = "Choose your experience level.";
  if (step === 3 && s.ownGear === null) e.ownGear = "Tell us if you're bringing your own clubs.";
  if (step === 4) {
    if (!s.date) e.date = "Choose a date.";
    if (!s.slot) e.slot = "Choose a time slot.";
  }
  return e;
}
export function toBackendPayload(s: BookingState) {
  const playerType =
    s.who === "Bhutanese" ? "local" : s.passport === "saarc" ? "saarc" : "international";

  return {
    playerType,
    golfCourseId: s.course,
    skillLevel: s.level,
    teeOffDate: s.date,
    teeTime: s.slot,
    numberOfPlayers: s.players,
    partyName: s.details.name.trim(),
    partyEmail: s.details.email.trim(),
    partyPhone: s.details.phone.trim(),
    nationality:
      s.who === "Bhutanese" ? "Bhutanese" : s.passport === "saarc" ? "SAARC" : "International",
    specialRequest: s.details.specialRequests?.trim() || undefined,
    coaching: s.addons.includes("coaching"),
    companion: s.addons.includes("companion"),
    golfSets: Object.entries(s.setQuantities)
      .filter(([, q]) => q > 0)
      .map(([id, quantity]) => ({ golfSetId: Number(id), quantity })),
    items: Object.entries(s.accessoryQuantities ?? {})
      .filter(([, q]) => q > 0)
      .map(([id, quantity]) => ({ itemVariantId: Number(id), quantity })),
  };
}
// export function validatePayment(s: BookingState): Errors {
//   const e: Errors = {};
//   const digits = (v: string) => v.replace(/\D/g, "");
//   if (s.details.name.trim().length < 2) e.name = "Enter your full name.";
//   if (digits(s.details.phone).length < 8)
//     e.phone = "Enter a mobile number we can call.";
//   if (!/^\S+@\S+\.\S+$/.test(s.details.email))
//     e.email = "Enter a valid email address.";
//   if (!s.payment.method) {
//     e.method = "Choose how you'd like to pay.";
//   } else if (s.payment.method === "dk") {
//     if (digits(s.payment.dkAccount).length < 8)
//       e.dk = "Enter your DK Bank account or registered mobile number.";
//   } else if (
//     digits(s.payment.cardNumber).length < 15 ||
//     !/^\d{2}\/\d{2}$/.test(s.payment.cardExpiry.trim()) ||
//     digits(s.payment.cardCvc).length < 3
//   ) {
//     e.card = "Check your card number, expiry (MM/YY) and security code.";
//   }
//   return e;
// }