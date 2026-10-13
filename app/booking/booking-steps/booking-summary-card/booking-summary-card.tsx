"use client";

import { format, parseISO } from "date-fns";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { BookingState } from "../../interface/interface";
import { getBookingSummary } from "./booking-summary";
import { kitCategories } from "../Package/data";
import { useKitItems } from "../Package/helper/useKitItems";

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="min-w-0 text-muted-foreground">{k}</span>
      <span className="shrink-0 text-right font-semibold">{v}</span>
    </div>
  );
}

const NotChosen = () => (
  <span className="font-medium italic text-muted-foreground">Not chosen</span>
);

type CardProps = {
  booking: BookingState;
  hideHeader?: boolean;
  className?: string;
};

export default function BookingSummaryCard({
  booking,
  hideHeader = false,
  className,
}: CardProps) {
  const { course, category, lines, total, money } = getBookingSummary(booking);
  const { items } = useKitItems();

  // kit items the user picked, grouped by category
  const chosenByCategory = kitCategories
    .map((cat) => ({
      id: cat.id,
      label: cat.label,
      picked: items
        .filter((i) => i.category === cat.id && (booking.kit?.[i.id] ?? 0) > 0)
        .map((i) => ({ id: i.id, title: i.title, qty: booking.kit[i.id] })),
    }))
    .filter((g) => g.picked.length > 0);

  return (
    <Card
      aria-label="Booking summary"
      className={cn("gap-0 overflow-hidden py-0", className)}
    >
      {!hideHeader && (
        <CardHeader
          className="py-4 text-white"
          style={{ background: "#1F4D36" }}
        >
          <CardTitle className="text-lg">
            {course?.name ?? "Choose a course"}
          </CardTitle>
          {category && <p className="text-sm opacity-85">{category.label}</p>}
        </CardHeader>
      )}

      <CardContent className="grid gap-2 py-5 text-sm">
        <Row
          k="Date"
          v={
            booking.date ? (
              format(parseISO(booking.date), "EEE d MMM")
            ) : (
              <NotChosen />
            )
          }
        />
        <Row k="Tee time" v={booking.slot?.time ?? <NotChosen />} />
        <Row k="Golfers" v={String(booking.golfers)} />

        {lines.length > 0 && (
          <>
            <Separator className="my-2" />
            {lines.map((l) => (
              <Row key={l.label} k={l.label} v={money(l.amount)} />
            ))}
          </>
        )}

        {/* chosen kits: name and quantity */}
        {chosenByCategory.length > 0 && (
          <>
            <Separator className="my-2" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Your kit
            </p>
            {chosenByCategory.map((g) => (
              <div key={g.id} className="grid gap-1">
                <span className="text-xs text-muted-foreground">{g.label}</span>
                {g.picked.map((p) => (
                  <Row key={p.id} k={p.title} v={`× ${p.qty}`} />
                ))}
              </div>
            ))}
          </>
        )}

        <Separator className="my-2" />
        <div className="flex items-baseline justify-between">
          <span>Total</span>
          <span aria-live="polite" className="text-2xl font-bold tabular-nums">
            {money(total)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

/** Phones and tablets: collapsible bar showing course and live total */
export function MobileSummary({ booking }: { booking: BookingState }) {
  const { course, total, money } = getBookingSummary(booking);

  return (
    <details className="group mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-[#1F4D36] px-4 py-3 text-white [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 truncate font-semibold">
          {course?.name ?? "Your booking"}
        </span>
        <span className="flex shrink-0 items-center gap-2 font-bold tabular-nums">
          {money(total)}
          <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
        </span>
      </summary>

      <BookingSummaryCard
        booking={booking}
        hideHeader
        className="rounded-none border-0 shadow-none"
      />
    </details>
  );
}