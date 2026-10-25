"use client";

import { useEffect, type ReactNode } from "react";
import { format, isBefore, parseISO, startOfToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import TimeSlotPicker from "../../booking-component/time-slotpicker";
import { useTeeSlots } from "../../booking-component/use-tee-slots";
import { type BulkState, findCourse, totalGolfers } from "../bulk-types/bulk-types";
;

type Props = {
  booking: BulkState;
  onChange: (patch: Partial<BulkState>) => void;
  /** days of the week the course is closed: 0 = Sunday ... 6 = Saturday */
  closedDays?: number[];
  footer?: ReactNode;
};

/** Date and first tee time for a bulk booking (own copy, works with BulkState). */
export default function BulkTeeTimeStep({
  booking,
  onChange,
  footer,
  closedDays = [],
}: Props) {
  const { slots, loading, error } = useTeeSlots(booking.courseId, booking.date);

  const course = findCourse(booking.courseId);
  const total = totalGolfers(booking);
  const selectedDate = booking.date ? parseISO(booking.date) : undefined;

  // a saved date may be closed or already past
  const dateNotAllowed =
    !!selectedDate &&
    (isBefore(selectedDate, startOfToday()) ||
      closedDays.includes(selectedDate.getDay()));

  useEffect(() => {
    if (dateNotAllowed) onChange({ date: null, slot: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateNotAllowed]);

  // no course picked yet: show a message, don't crash
  if (!booking.courseId) {
    return (
      <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
        <p className="text-sm text-slate-600">
          Please choose a course in the first step before picking a tee time.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Pick a date and first tee time
        </h2>
        <p className="mt-1 text-base text-slate-500">
          {course?.name} · {total} {total === 1 ? "golfer" : "golfers"}. Choose
          the first tee time. The course team arranges the other groups.
        </p>
      </div>

      {/* Date */}
      <section>
        <p className="mb-3 text-base font-bold">Date</p>
        <Calendar
          mode="single"
          selected={selectedDate}
          defaultMonth={selectedDate}
          onSelect={(d) =>
            // changing the date clears the tee time
            onChange({ date: d ? format(d, "yyyy-MM-dd") : null, slot: null })
          }
          disabled={[{ before: startOfToday() }, { dayOfWeek: closedDays }]}
          className="rounded-xl border p-3 [--primary-foreground:#fff] [--primary:#1F4D36]"
        />
      </section>

      {/* First tee time */}
      <section>
        <p className="mb-3 text-base font-bold">
          First tee time
          {selectedDate && ` · ${format(selectedDate, "EEEE d MMMM")}`}
        </p>

        {!selectedDate && (
          <p className="text-base text-slate-500">Choose a date to see tee times.</p>
        )}

        {selectedDate && loading && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        )}

        {selectedDate && error && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        {selectedDate && !loading && !error && slots.length === 0 && (
          <p className="text-sm text-slate-500">No tee times on this day.</p>
        )}

        <TimeSlotPicker
          slots={slots}
          golfers={1} // any open slot works as the first tee time
          value={booking.slot?.time ?? null}
          onChange={(time) =>
            onChange({
              slot: time && booking.date ? { date: booking.date, time } : null,
            })
          }
        />
      </section>

      {footer && <div className="border-t border-slate-200 pt-6">{footer}</div>}
    </div>
  );
}