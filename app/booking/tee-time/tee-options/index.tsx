export type Option = { value: string; label: string };

export const COURSES: Option[] = [
  { value: "paro-valley-links-18", label: "Paro Valley Links · 18 holes" },
  { value: "royal-thimphu-9", label: "Royal Thimphu · 9 holes" },
  { value: "royal-thimphu-18", label: "Royal Thimphu · 18 holes" },
];

export const GOLFER_TYPES: Option[] = [
  { value: "bhutanese", label: "Bhutanese" },
  { value: "resident", label: "Resident" },
  { value: "tourist", label: "Tourist" },
];

export const GOLFER_COUNTS: Option[] = [1, 2, 3, 4].map((n) => ({
  value: String(n),
  label: String(n),
}));

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function toISO(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function formatDate(d: Date) {
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function buildDates(days = 30): Option[] {
  const now = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    return { value: toISO(d), label: formatDate(d) };
  });
}