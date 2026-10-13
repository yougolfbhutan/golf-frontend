import { coursesdata } from "@/app/homepagecomponents/golfcourse/courses";
import type { BookingState } from "../../interface/interface";
import { CATEGORIES } from "../course&golfers/data";
import { packages, formatPrice, type KitItem } from "../Package/data";

export function getBookingSummary(
  booking: BookingState,
  items: KitItem[] = [],
) {
  const course = coursesdata.find(
    (c) => (c.bookingId ?? String(c.id)) === booking.courseId,
  );

  const category = CATEGORIES.find((c) => c.id === booking.categoryId);
  // Price key ("bhutanese", "saarc", ...), not the backend id ("1", "2", "3")
  const priceKey = category?.priceKey ?? "bhutanese";

  const pkg = packages.find((p) => p.id === booking.packageId);

  const money = (amount: number | undefined | null) =>
    formatPrice(amount ?? 0, priceKey);

  // Package price per golfer; if no package is chosen, fall back to the category green fee
  const unitPrice = pkg
    ? (pkg.prices?.[priceKey] ?? 0)
    : (category?.price ?? 0);
  const packageTotal = unitPrice * booking.golfers;

  const kitLines = items
    .filter((i) => (booking.kit?.[i.id] ?? 0) > 0)
    .map((item) => ({ item, qty: booking.kit[item.id] }));

  const lines =
    unitPrice > 0
      ? [
          {
            label: `${pkg?.title ?? "Green fee"} × ${booking.golfers}`,
            amount: packageTotal,
          },
        ]
      : [];

  return {
    course,
    category,
    categoryId: priceKey,
    pkg,
    lines,
    kitLines,
    unitPrice,
    packageTotal,
    total: packageTotal,
    money,
  };
}