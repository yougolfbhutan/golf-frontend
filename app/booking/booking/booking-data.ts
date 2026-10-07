// ─────────────────────────────────────────────────────────────
// Booking data. Edit prices, courses and add-ons here.
// Equipment (golf sets, balls, gloves, accessories) now comes
// from the backend, so it is NOT listed here any more.
// ─────────────────────────────────────────────────────────────

export type Who = "Bhutanese" | "Non-Bhutanese";
export type Passport = "intl" | "saarc";
export type Level = "newbie" | "established";
export type CourseId = "rtgc" | "drakpoi";
/** 24-hour tee time, e.g. "07:15" or "14:45". */
export type SlotId = string;
export type PayMethod = "dk" | "card";

/** Add-ons priced here: coaching for everyone, companion for visitors. */
export type ExtraKey = "coaching" | "companion";

/**
 * "clubs" is only a marker saved in state.addons when a golf set is
 * picked in the Equipment step. Its price comes from the backend.
 */
export type AddonKey = ExtraKey | "clubs";

export type Step = 1 | 2 | 3 | 4 | 5 | 6;

export interface PriceSheet {
  round: Record<Passport, number>;
  coaching: number;
  companion: number;
}

/**
 * PLACEHOLDER PRICES – replace with your confirmed rates.
 * Visitors pay in US dollars, residents in Ngultrum. All prices are per golfer.
 * Round = green fee, caddie and light refreshments.
 */
export const PRICES: Record<Who, PriceSheet> = {
  "Non-Bhutanese": {
    round: { intl: 180, saarc: 140 },
    coaching: 50,
    companion: 40,
  },
  "Bhutanese": {
    round: { intl: 1500, saarc: 1500 },
    coaching: 1500,
    companion: 0, // visitor-only extra, not shown to residents
  },
};

export interface Course {
  id: CourseId;
  name: string;
  short: string;
  description: string;
}

export const COURSES: Course[] = [
  {
    id: "rtgc",
    name: "Royal Thimphu Golf Course",
    short: "Royal Thimphu",
    description: "Bhutan's oldest course, in central Thimphu. Gentle and scenic.",
  },
  {
    id: "drakpoi",
    name: "Drakpoi Golf Course",
    short: "Drakpoi",
    description: "Rolling fairways and ponds in Dechencholing. More challenging.",
  },
];

// ─── Tee times ───────────────────────────────────────────────
// First tee 7:00 am, last tee 3:00 pm, one tee time every 15 minutes.
export const TEE_START = "07:00";
export const TEE_END = "15:00"; // included
export const TEE_INTERVAL_MIN = 15;

export interface Slot {
  id: SlotId; // "07:00" ... "15:00" (24-hour, saved in booking state)
  time: string; // "7:00 am" ... "3:00 pm" (shown to the golfer)
  description: string; // "Morning" or "Afternoon"
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** "07:15" -> "7:15 am", "15:00" -> "3:00 pm" */
export function formatTime(hhmm: string): string {
  if (!hhmm) return "Not chosen yet";
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

function buildSlots(): Slot[] {
  const slots: Slot[] = [];
  for (let t = toMinutes(TEE_START); t <= toMinutes(TEE_END); t += TEE_INTERVAL_MIN) {
    const id = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
    slots.push({
      id,
      time: formatTime(id),
      description: t < 12 * 60 ? "Morning" : "Afternoon",
    });
  }
  return slots;
}

export const SLOTS: Slot[] = buildSlots(); // 33 tee times

export interface Addon {
  name: string;
  description: string;
  note?: string;
}

export const ADDONS: Record<ExtraKey, Addon> = {
  coaching: {
    name: "Golf coaching",
    description: "One hour with a coach before you play",
  },
  companion: {
    name: "Companion",
    description: "A non-playing guest who walks the course with you",
  },
};

/** New golfers get a golf set and coaching suggested. */
export const NEWBIE_ADDONS: AddonKey[] = ["clubs", "coaching"];

export const STEP_NAMES: Record<number, string> = {
  1: "Course",
  2: "Experience",
  3: "Equipment",
  4: "Date",
  5: "Pay",
};

export const MAX_PLAYERS = 8;
export const MIN_DAYS_AHEAD = 2;
// export const HELP_PHONE = "[your number]";