"use client";

import { useMemo, type ReactNode } from "react";
import { format, parseISO, startOfToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import type { BookingState } from "../../interface/interface";

import { coursesdata } from "@/app/homepagecomponents/golfcourse/courses";
import TimeSlotPicker, {
  type TeeSlot,
} from "../../booking-component/time-slotpicker";
import { useGetTeeTimes } from "../../booking-steps/Tee-time/tanstack";

type Props = {
  booking: BookingState;
  onChange: (patch: Partial<BookingState>) => void;
  footer?: ReactNode;
};

export default function DateTimeStep({ booking, onChange, footer }: Props) {
  // the selected date is sent to the backend; it returns that day's tee times
  const {
    data,
    isLoading: loading,
    isError,
    refetch,
  } = useGetTeeTimes(booking.date ?? undefined);

  // backend shape -> picker shape (no filtering, the backend decides)
  const slots = useMemo<TeeSlot[]>(
    () =>
      (data ?? []).map((s) => ({
        time: s.teeTime,
        spotsLeft: s.placesLeft,
        status: s.status,
      })),
    [data],
  );

  const error = isError ? "Could not load tee times. Please try again." : null;

  const course = coursesdata.find(
    (c) => (c.bookingId ?? String(c.id)) === booking.courseId,
  );
  const selectedDate = booking.date ? parseISO(booking.date) : undefined;

  if (!booking.courseId) {
    return (
      <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
        <p className="text-sm text-slate-600">
          Please choose a course in the first step before picking a tee time.
        </p>
      </div>
    );
  }

  const ready = !!selectedDate && !loading && !error;

  return (
    <div className="mt-8 space-y-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Pick a date and tee time
        </h2>
        <p className="mt-1 text-base text-slate-500">
          {course?.name} · {booking.golfers}{" "}
          {booking.golfers === 1 ? "golfer" : "golfers"}
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
            // a new date clears the tee time and loads that day's times
            onChange({ date: d ? format(d, "yyyy-MM-dd") : null, slot: null })
          }
          disabled={{ before: startOfToday() }}
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
          <div
            className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6"
            aria-busy="true"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        )}

        {selectedDate && !loading && error && (
          <div className="flex items-center gap-3 text-sm text-red-600" role="alert">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg border border-red-200 px-3 py-1 font-medium hover:bg-red-50"
            >
              Try again
            </button>
          </div>
        )}

        {ready && slots.length === 0 && (
          <p className="text-sm text-slate-500">No tee times on this day.</p>
        )}

        {ready && slots.length > 0 && (
          <TimeSlotPicker
            slots={slots}
            value={booking.slot?.time ?? null}
            onChange={(time) =>
              onChange({
                slot: time && booking.date ? { date: booking.date, time } : null,
              })
            }
          />
        )}
      </section>

      {footer && <div className="border-t border-slate-200 pt-6">{footer}</div>}
    </div>
  );
}