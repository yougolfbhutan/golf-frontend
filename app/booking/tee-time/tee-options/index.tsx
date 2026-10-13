export type Option = { value: string; label: string };

export const COURSES: Option[] = [
  { value: "1", label: "Drakpoi Golf Course" },
  { value: "2", label: "Royal Thimphu Golf Course" },
];

export const GOLFER_TYPES: Option[] = [
  { value: "1", label: "SAARC" },
  { value: "2", label: "Bhutanese" },
  { value: "3", label: "Non-SAARC" },
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