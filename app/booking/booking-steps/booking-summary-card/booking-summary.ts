import { coursesdata } from "@/app/homepagecomponents/golfcourse/courses";
import type { BookingState } from "../../interface/interface";
import { CATEGORIES } from "../course&golfers/data";
import {
  packages,
  formatPrice,
  type KitItem,
  type CategoryId,
} from "../Package/data";

/**
 * The price keys of the two groups in CATEGORIES (the `priceKey` field).
 * They match the entries in course&golfers/data.ts.
 */
const SAARC_KEY: CategoryId = "saarc";
const NON_SAARC_KEY: CategoryId = "international";

/**
 * A booking, optionally with a group split. Bulk bookings fill the split
 * fields; a normal single booking leaves them out and works as before.
 */
export type SummaryInput = BookingState & {
  saarcGolfers?: number;
  nonSaarcGolfers?: number;
  no_of_right_handed?: number;
  no_of_left_handed?: number;
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

/**
 * Everything the summary needs.
 * Only the green fee is priced here. The package / kits (golf sets, balls,
 * gloves) are shown as counts only; their cost is worked out by the backend.
 */
export function getBookingSummary(
  booking: SummaryInput,
  items: KitItem[] = [],
) {
  const course = coursesdata.find(
    (c) => (c.bookingId ?? String(c.id)) === booking.courseId,
  );

  const category = CATEGORIES.find((c) => c.id === booking.categoryId);
  // Price key ("bhutanese", "saarc", ...), not the backend id ("1", "2", "3")
  const priceKey = category?.priceKey ?? "bhutanese";

  // kept so other steps can still show the package name
  const pkg = packages.find((p) => p.id === booking.packageId);

  /* ---------- group split (bulk bookings) ---------- */
  const saarc = Math.max(0, booking.saarcGolfers ?? 0);
  const nonSaarc = Math.max(0, booking.nonSaarcGolfers ?? 0);
  const hasSplit = saarc + nonSaarc > 0;

  const golfers = hasSplit
    ? saarc + nonSaarc
    : Math.max(1, booking.golfers ?? 1);

  /* ---------- handedness: right-handed is whatever is not left ---------- */
  const left = clamp(booking.no_of_left_handed ?? 0, 0, golfers);
  const right = golfers - left;
  const hasHandedness = (booking.no_of_left_handed ?? 0) > 0 || hasSplit;

  const money = (amount: number | undefined | null) =>
    formatPrice(amount ?? 0, priceKey);

  /* ---------- green fee ---------- */
  const saarcCategory = CATEGORIES.find((c) => c.priceKey === SAARC_KEY);
  const nonSaarcCategory = CATEGORIES.find((c) => c.priceKey === NON_SAARC_KEY);

  const saarcUnit = saarcCategory?.price ?? 0;
  const nonSaarcUnit = nonSaarcCategory?.price ?? 0;

  // single booking: one price for everyone. bulk: each group pays its own price.
  const unitPrice = hasSplit ? 0 : (category?.price ?? 0);
  const greenFeeTotal = hasSplit
    ? saarcUnit * saarc + nonSaarcUnit * nonSaarc
    : unitPrice * golfers;

  // chosen kit items with how many: no amounts
  const kitLines = items
    .filter((i) => (booking.kit?.[i.id] ?? 0) > 0)
    .map((item) => ({ item, qty: booking.kit?.[item.id] ?? 0 }));

  // total number of kits = golf sets chosen (one per golfer)
  const kitCount = kitLines
    .filter((l) => l.item.category === "sets")
    .reduce((sum, l) => sum + l.qty, 0);

  const lines: { label: string; amount: number }[] = hasSplit
    ? [
        saarc > 0 && saarcUnit > 0
          ? { label: `SAARC green fee × ${saarc}`, amount: saarcUnit * saarc }
          : null,
        nonSaarc > 0 && nonSaarcUnit > 0
          ? {
              label: `Non-SAARC green fee × ${nonSaarc}`,
              amount: nonSaarcUnit * nonSaarc,
            }
          : null,
      ].filter((l): l is { label: string; amount: number } => l !== null)
    : unitPrice > 0
      ? [{ label: `Green fee × ${golfers}`, amount: greenFeeTotal }]
      : [];

  return {
    course,
    category,
    categoryId: priceKey,
    pkg,
    golfers,
    // group split + handedness
    hasSplit,
    saarc,
    nonSaarc,
    hasHandedness,
    right,
    left,
    lines,
    kitLines,
    kitCount,
    unitPrice,
    // old name kept so other files don't break; it now holds the green fee only
    packageTotal: greenFeeTotal,
    greenFeeTotal,
    total: greenFeeTotal,
    money,
  };
}