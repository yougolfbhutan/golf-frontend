import type { ReactNode } from "react";
import { ChevronRight, Info, Zap, Heart, RefreshCcw } from "lucide-react";
import { Button } from "./button";

/* ---------------------------------------------------------- */
/* Types                                                        */
/* ---------------------------------------------------------- */

interface LineItem {
  label: string;
  price: string;
  indent?: boolean;
}

interface TrustBadge {
  icon: ReactNode;
  label: ReactNode;
}

interface TeeTimeSelectorProps {
  dateLabel: string;
  dateValue: string;
  timeLabel: string;
  playersLabel: string;
  onDateClick?: () => void;
  onTimeClick?: () => void;
}

interface PriceSummaryProps {
  lineItems: LineItem[];
}

interface RateNotesProps {
  notes: string[];
  onAddonsClick?: () => void;
}

interface TrustBadgesProps {
  badges?: TrustBadge[];
}

interface BookingCardProps {
  title?: string;
  dateLabel: string;
  dateValue: string;
  timeLabel: string;
  playersLabel: string;
  lineItems: LineItem[];
  notes: string[];
  totalPrice: string;
  onDateClick?: () => void;
  onTimeClick?: () => void;
  onAddonsClick?: () => void;
  onBookNow?: () => void;
  trustBadges?: TrustBadge[];
}

/* ---------------------------------------------------------- */
/* Tee time / date + players selector                          */
/* ---------------------------------------------------------- */

export function TeeTimeSelector({
  dateLabel,
  dateValue,
  timeLabel,
  playersLabel,
  onDateClick,
  onTimeClick,
}: TeeTimeSelectorProps) {
  return (
    <div className="grid grid-cols-2 divide-x divide-neutral-200 overflow-hidden rounded-lg border border-neutral-200">
      <button
        onClick={onDateClick}
        className="flex flex-col gap-0.5 px-4 py-3 text-left hover:bg-neutral-50"
      >
        <span className="text-xs font-medium text-neutral-500">
          Select Date of Play
        </span>
        <span className="text-sm font-semibold text-emerald-700">
          {dateLabel}
        </span>
        <span className="text-xs font-semibold text-emerald-700">
          {dateValue}
        </span>
      </button>
      <button
        onClick={onTimeClick}
        className="flex flex-col gap-0.5 px-4 py-3 text-left hover:bg-neutral-50"
      >
        <span className="text-xs font-medium text-neutral-500">
          Tee Times &amp; Players
        </span>
        <span className="text-sm font-semibold text-emerald-700">
          {timeLabel}
        </span>
        <span className="text-xs font-semibold text-emerald-700">
          {playersLabel}
        </span>
      </button>
    </div>
  );
}

/* ---------------------------------------------------------- */
/* Price breakdown                                              */
/* ---------------------------------------------------------- */

export function PriceSummary({ lineItems }: PriceSummaryProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-neutral-200 pb-4">
      {lineItems.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between text-sm"
        >
          <span
            className={
              item.indent
                ? "pl-4 text-neutral-500"
                : "font-semibold text-neutral-900"
            }
          >
            {item.label}
          </span>
          <span
            className={item.indent ? "text-neutral-500" : "font-semibold text-neutral-900"}
          >
            {item.price}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------- */
/* Rate includes / notes                                        */
/* ---------------------------------------------------------- */

export function RateNotes({ notes, onAddonsClick }: RateNotesProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-neutral-500">
          Rate Includes / Notes
        </span>
        <button
          onClick={onAddonsClick}
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-emerald-700 hover:underline"
        >
          Rentals &amp; Add-ons
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
      <ul className="flex flex-col gap-1.5 text-sm text-neutral-700">
        {notes.map((note, i) =>
          note === "Free Cancellation" ? (
            <li key={i} className="flex items-center gap-1">
              - <span className="underline">{note}</span>
              <Info className="h-3.5 w-3.5 text-neutral-400" />
            </li>
          ) : (
            <li key={i}>- {note}</li>
          ),
        )}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------- */
/* Trust badges row                                              */
/* ---------------------------------------------------------- */

const defaultTrustBadges: TrustBadge[] = [
  {
    icon: <Zap className="h-5 w-5 text-neutral-700" />,
    label: (
      <>
        Instant Booking
        <br />
        Confirmation
      </>
    ),
  },
  {
    icon: <Heart className="h-5 w-5 text-neutral-700" />,
    label: (
      <>
        Trusted by
        <br />
        1M+ Golfers
      </>
    ),
  },
  {
    icon: <RefreshCcw className="h-5 w-5 text-neutral-700" />,
    label: (
      <>
        Free Changes
        <br />
        &amp; Cancellations
      </>
    ),
  },
];

export function TrustBadges({ badges = defaultTrustBadges }: TrustBadgesProps) {
  return (
    <div className="flex items-center justify-between pt-2 text-center text-xs text-neutral-500">
      {badges.map((badge, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          {badge.icon}
          {badge.label}
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------- */
/* Booking card (composes the above)                            */
/* ---------------------------------------------------------- */

export default function BookingCard({
  title = "Book a Tee Time",
  dateLabel,
  dateValue,
  timeLabel,
  playersLabel,
  lineItems,
  notes,
  totalPrice,
  onDateClick,
  onTimeClick,
  onAddonsClick,
  onBookNow,
  trustBadges,
}: BookingCardProps) {
  return (
    <div className="sticky top-6 rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex flex-col gap-5 p-6">
        <h2 className="text-lg font-bold text-neutral-900">{title}</h2>

        <TeeTimeSelector
          dateLabel={dateLabel}
          dateValue={dateValue}
          timeLabel={timeLabel}
          playersLabel={playersLabel}
          onDateClick={onDateClick}
          onTimeClick={onTimeClick}
        />

        <PriceSummary lineItems={lineItems} />

        <RateNotes notes={notes} onAddonsClick={onAddonsClick} />

        <Button size="lg" onClick={onBookNow} className="flex items-center justify-between px-5">
          <span>Book Now</span>
          <span>{totalPrice}</span>
        </Button>

        <TrustBadges badges={trustBadges} />
      </div>
    </div>
  );
}