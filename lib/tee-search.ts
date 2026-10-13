import { COURSES, GOLFER_TYPES } from "@/app/booking/tee-time/tee-options";

export type TeeSearch = {
  course: string;
  golferType: string;
  golfers: number;
};

/** Validates raw input. Returns a clean TeeSearch, or null if invalid. */
export function parseTeeSearch(input: {
  course: string;
  golferType: string;
  golfers: string | number;
}): TeeSearch | null {
  const golfers = Number(input.golfers);

  const validCourse = COURSES.some((c) => c.value === input.course);
  const validType = GOLFER_TYPES.some((t) => t.value === input.golferType);

  const validGolfers = Number.isInteger(golfers) && golfers >= 1 && golfers <= 4;

  if (!validCourse || !validType  || !validGolfers) return null;
  return { course: input.course, golferType: input.golferType, golfers };
}

/* ---------- Stateless ID: the data lives inside the id, nothing is stored ---------- */

/** TeeSearch → URL-safe id string (works in the browser and on the server). */
export function encodeTeeSearch(s: TeeSearch): string {
  const raw = [s.course, s.golferType, s.golfers].join("|");
  return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** id string → validated TeeSearch, or null if the id is malformed or tampered with. */
export function decodeTeeSearch(id: string): TeeSearch | null {
  try {
    const b64 = id.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const [course, date, golferType, golfers] = atob(padded).split("|");
    if (!course || !date || !golferType || !golfers) return null;
    return parseTeeSearch({ course, golferType, golfers });
  } catch {
    return null;
  }
}