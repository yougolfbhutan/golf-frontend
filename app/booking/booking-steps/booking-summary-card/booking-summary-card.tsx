"use client";

import {
  CalendarDays,
  ChevronDown,
  Clock,
  Flag,
  Globe,
  Hand,
  Package,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getBookingSummary, type SummaryInput } from "./booking-summary";
import { kitCategories } from "../Package/data";
import { useKitItems } from "../Package/helper/useKitItems";

const BRAND = "#1F4D36";

/* ---------- money: always shows the dollar sign ---------- */

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// 25 -> "$25.00"
const money = (amount: number) => usd.format(Number(amount) || 0);

/* ---------- small building blocks ---------- */

function DetailTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
      <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
        <Icon className="size-3.5 text-[#1F4D36]" aria-hidden />
        {label}
      </span>
      <span className=" text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

/** One group of the party, e.g. "SAARC 6 · Non-SAARC 4" */
function SplitTile({
  icon: Icon,
  label,
  parts,
}: {
  icon: React.ElementType;
  label: string;
  parts: { name: string; count: number }[];
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
      <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
        <Icon className="size-3.5 text-[#1F4D36]" aria-hidden />
        {label}
      </span>
      <div className="grid gap-1">
        {parts.map((p) => (
          <div
            key={p.name}
            className="flex items-baseline justify-between gap-2 text-sm"
          >
            <span className="text-slate-600">{p.name}</span>
            <span className="font-semibold tabular-nums text-slate-900">
              {p.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriceRow({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <span className="min-w-0 text-slate-600">{k}</span>
      <span className="shrink-0 font-semibold tabular-nums text-slate-900">
        {v}
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </p>
  );
}

const NotChosen = () => (
  <span className="font-normal italic text-slate-400">Not chosen</span>
);

/* ---------- main card ---------- */

type CardProps = {
  booking: SummaryInput;
  hideHeader?: boolean;
  className?: string;
};

export default function BookingSummaryCard({
  booking,
  hideHeader = false,
  className,
}: CardProps) {
  // load the kit items first, so the summary can list what was chosen
  const { items } = useKitItems();

  const {
    course,
    category,
    pkg,
    golfers,
    hasSplit,
    saarc,
    nonSaarc,
    hasHandedness,
    right,
    left,
    lines,
    kitLines,
    kitCount,
    total,
  } = getBookingSummary(booking, items);

  // chosen kit items grouped by category: names and counts only, no amounts
  const chosenByCategory = kitCategories
    .map((cat) => ({
      id: cat.id,
      label: cat.label,
      picked: kitLines.filter((l) => l.item.category === cat.id),
    }))
    .filter((g) => g.picked.length > 0);

  return (
    <Card
      aria-label="Booking summary"
      className={cn(
        "gap-0 overflow-hidden rounded-2xl border-slate-200/80 py-0 shadow-lg shadow-slate-900/5",
        className,
      )}
    >
      {!hideHeader && (
        <CardHeader
          className="relative gap-1 overflow-hidden px-5 py-5 text-white"
          style={{
            background: `linear-gradient(135deg, ${BRAND} 0%, #2C6B4B 100%)`,
          }}
        >
          {/* soft decorative circle */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-white/10"
          />
          <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-white/70">
            <Flag className="size-3.5" aria-hidden />
            Your booking
          </span>
          <CardTitle className="text-xl font-bold leading-tight">
            {course?.name ?? "Choose a course"}
          </CardTitle>
          {/* a mixed group has no single category, so the chip is for single bookings */}
          {!hasSplit && category && (
            <span className="mt-1 w-fit rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium ring-1 ring-white/25">
              {category.label}
            </span>
          )}
        </CardHeader>
      )}

      <CardContent className="grid gap-5 px-5 py-5">
        {/* date / time / golfers */}
        <div className="grid grid-cols-3 gap-2">
          <DetailTile icon={CalendarDays} label="Date" value={booking.date} />
          <DetailTile
            icon={Clock}
            label="Tee time"
            value={booking.slot?.time ?? <NotChosen />}
          />
          <DetailTile icon={Users} label="Golfers" value={String(golfers)} />
        </div>

        {/* who is playing: nationality group + handedness */}
        {(hasSplit || hasHandedness) && (
          <div className="grid gap-2 sm:grid-cols-2">
            {hasSplit && (
              <SplitTile
                icon={Globe}
                label="Country"
                parts={[
                  { name: "SAARC", count: saarc },
                  { name: "Non-SAARC", count: nonSaarc },
                ]}
              />
            )}
            {hasHandedness && (
              <SplitTile
                icon={Hand}
                label="Handedness"
                parts={[
                  { name: "Right-handed", count: right },
                  { name: "Left-handed", count: left },
                ]}
              />
            )}
          </div>
        )}

        {/* prices: green fee only */}
        {lines.length > 0 && (
          <div className="grid gap-2">
            <SectionLabel>Fees</SectionLabel>
            {lines.map((l) => (
              <PriceRow key={l.label} k={l.label} v={money(l.amount)} />
            ))}
          </div>
        )}

        {/* chosen kits: how many, no amounts */}
        {kitLines.length > 0 && (
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <SectionLabel>Your kit</SectionLabel>
              {kitCount > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-[#1F4D36] ring-1 ring-emerald-200">
                  <Package className="size-3.5" aria-hidden />
                  {pkg?.title ? `${pkg.title} · ` : ""}
                  {kitCount} {kitCount === 1 ? "kit" : "kits"}
                </span>
              )}
            </div>

            {chosenByCategory.map((g) => (
              <div key={g.id} className="grid gap-1.5">
                <span className="text-xs font-medium text-slate-500">
                  {g.label}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {g.picked.map(({ item, qty }) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
                    >
                      {item.title}
                      <span className="rounded-md bg-slate-100 px-1.5 text-[11px] font-semibold tabular-nums text-slate-600">
                        ×{qty}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* total */}
      <div className="flex items-center justify-between gap-4 border-t border-emerald-100 bg-emerald-50/60 px-5 py-4">
        <div className="grid">
          <span className="text-sm font-semibold text-slate-900">Total</span>
          <span className="text-xs text-slate-500">
            {golfers} {golfers === 1 ? "golfer" : "golfers"}
          </span>
        </div>
        <span
          aria-live="polite"
          className="text-2xl font-bold tabular-nums text-[#1F4D36]"
        >
          {money(total)}
        </span>
      </div>
    </Card>
  );
}

/* ---------- phones and tablets ---------- */

/** Collapsible bar showing course and live total */
export function MobileSummary({ booking }: { booking: SummaryInput }) {
  const { items } = useKitItems();
  const { course, total } = getBookingSummary(booking, items);

  return (
    <details className="group mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-slate-900/5 lg:hidden">
      <summary
        className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-white [&::-webkit-details-marker]:hidden"
        style={{
          background: `linear-gradient(135deg, ${BRAND} 0%, #2C6B4B 100%)`,
        }}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/15 ring-1 ring-white/25">
            <Flag className="size-4" aria-hidden />
          </span>
          <span className="grid min-w-0">
            <span className="text-[11px] uppercase tracking-wider text-white/70">
              Your booking
            </span>
            <span className="truncate font-semibold">
              {course?.name ?? "Choose a course"}
            </span>
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="text-lg font-bold tabular-nums">{money(total)}</span>
          <span className="grid size-7 place-items-center rounded-full bg-white/15">
            <ChevronDown
              className="size-4 transition-transform duration-200 group-open:rotate-180"
              aria-hidden
            />
          </span>
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