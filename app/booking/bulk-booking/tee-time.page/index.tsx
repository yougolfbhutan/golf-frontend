"use client";

import { useEffect, type ReactNode } from "react";
import { format, isBefore, parseISO, startOfToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import type { BookingState } from "../../interface/interface";

import { coursesdata } from "@/app/homepagecomponents/golfcourse/courses";
import { useTeeSlots } from "../../booking-component/use-tee-slots";
import TimeSlotPicker from "../../booking-component/time-slotpicker";

/**
 * Only the fields this step needs, so both the normal booking
 * and the bulk booking can use it. `golfers` is optional (bulk = 1).
 */
type TeeTimeBooking = Pick<BookingState, "courseId" | "date" | "slot"> & {
  golfers?: number;
};

type Props = {
  booking: TeeTimeBooking;
  onChange: (patch: Partial<Pick<BookingState, "date" | "slot">>) => void;
  /** days of the week the course is closed: 0 = Sunday ... 6 = Saturday */
  closedDays?: number[];
  /** replaces the line under the heading (bulk booking uses its own text) */
  subtitle?: string;
  footer?: ReactNode;
};

export default function DateTimeStep({
  booking,
  onChange,
  footer,
  subtitle,
  closedDays = [],
}: Props) {
  const golfers = booking.golfers ?? 1;
  const { slots, loading, error } = useTeeSlots(booking.courseId, booking.date);

  const course = coursesdata.find(
    (c) => (c.bookingId ?? String(c.id)) === booking.courseId,
  );
  const selectedDate = booking.date ? parseISO(booking.date) : undefined;

  // a date from the home-page search may be closed or already past
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
          Pick a date and tee time
        </h2>
        <p className="mt-1 text-base text-slate-500">
          {subtitle ??
            `${course?.name ?? ""} · showing times with room for ${golfers} ${
              golfers === 1 ? "golfer" : "golfers"
            }.`}
        </p>
      </div>

      {/* Date */}
      <section>
        <p className="mb-3 text-base font-bold">Date</p>
        <Calendar
          mode="single"
          selected={selectedDate}
          // open on the month of the prefilled date, not always this month
          defaultMonth={selectedDate}
          onSelect={(d) =>
            // changing the date clears the tee time
            onChange({ date: d ? format(d, "yyyy-MM-dd") : null, slot: null })
          }
          disabled={[{ before: startOfToday() }, { dayOfWeek: closedDays }]}
          className="rounded-xl border p-3 [--primary-foreground:#fff] [--primary:#1F4D36]"
        />
      </section>

      {/* Tee time */}
      <section>
        <p className="mb-3 text-base font-bold">
          Tee time
          {selectedDate && ` · ${format(selectedDate, "EEEE d MMMM")}`}
        </p>

        {!selectedDate && (
          <p className="text-base text-slate-500">
            Choose a date to see tee times.
          </p>
        )}

        {selectedDate && loading && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-xl bg-slate-100"
              />
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
          golfers={golfers}
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