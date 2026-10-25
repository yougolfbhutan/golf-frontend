"use client";

import { type ReactNode, useEffect } from "react";
import { coursesdata } from "@/app/homepagecomponents/golfcourse/courses";
import { MAX_PER_TYPE, MIN_GOLFERS, toCount, totalGolfers, type BulkState } from "../bulk-types/bulk-types";
import CardCarousel from "../../booking-component/card-carasouel";
import ImageSliderCard from "../../booking-component/image-slider-component";

type Props = {
  booking: BulkState;
  onChange: (patch: Partial<BulkState>) => void;
  golfcourseId: string;
  footer?: ReactNode;
};

function SectionTitle({ title, help }: { title: string; help: string }) {
  return (
    <div className="mb-3">
      <h2 className="font-sans text-base font-bold text-slate-900 sm:text-lg">{title}</h2>
      <p className="text-sm text-slate-600">{help}</p>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-lg font-semibold text-slate-900 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1F4D36]";

function CountField({
  id,
  label,
  help,
  value,
  onChange,
}: {
  id: string;
  label: string;
  help: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <label htmlFor={id} className="block font-semibold text-slate-900">
        {label}
      </label>
      <p className="mb-2 text-xs text-slate-500">{help}</p>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        max={MAX_PER_TYPE}
        placeholder="0"
        value={value === 0 ? "" : value}
        onChange={(e) => onChange(toCount(e.target.value))}
        className={inputCls}
      />
    </div>
  );
}

export default function BulkCourseStep({ booking, onChange, golfcourseId, footer }: Props) {
  // preselect the course when opened from a course page
  useEffect(() => {
    if (booking.courseId || !golfcourseId) return;
    const match = coursesdata.find(
      (c) => c.bookingId === golfcourseId || String(c.id) === golfcourseId,
    );
    if (match) onChange({ courseId: match.bookingId ?? String(match.id) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [golfcourseId]);

  const selectedIndex = coursesdata.findIndex(
    (c) => (c.bookingId ?? String(c.id)) === booking.courseId,
  );
  const total = totalGolfers(booking);

  return (
    <div className="mt-4 space-y-8 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xl shadow-slate-900/10 sm:mt-8 sm:p-6 lg:p-8">
      {/* ---------- Course ---------- */}
      <section>
        <SectionTitle
          title="Course"
          help="Tap a course to select it. Swipe or use the arrows to see more."
        />
        <div role="radiogroup" aria-label="Course">
          <CardCarousel scrollToIndex={selectedIndex}>
            {coursesdata.map((c) => {
              const courseId = c.bookingId ?? String(c.id);
              return (
                <ImageSliderCard
                  key={c.id}
                  images={c.image}
                  title={c.name}
                  location={c.location}
                  meta={`${c.holes} holes · Par ${c.par} · ${c.length}`}
                  tags={c.features.slice(0, 3)}
                  selected={booking.courseId === courseId}
                  onClick={() => onChange({ courseId, slot: null })}
                />
              );
            })}
          </CardCarousel>
        </div>
      </section>

      {/* ---------- Number of golfers ---------- */}
      <section>
        <SectionTitle
          title="Number of golfers"
          help="Type how many golfers come from each group. You can leave one empty."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <CountField
            id="saarc-golfers"
            label="SAARC country golfers"
            help="Afghanistan, Bangladesh, Bhutan, India, Maldives, Nepal, Pakistan, Sri Lanka"
            value={booking.saarcGolfers}
            onChange={(saarcGolfers) => onChange({ saarcGolfers })}
          />
          <CountField
            id="non-saarc-golfers"
            label="Non-SAARC country golfers"
            help="All other countries"
            value={booking.nonSaarcGolfers}
            onChange={(nonSaarcGolfers) => onChange({ nonSaarcGolfers })}
          />
        </div>
        <p className="mt-3 text-sm text-slate-600" aria-live="polite">
          Total golfers: <b className="text-slate-900">{total}</b>
          {total < MIN_GOLFERS && " · add at least 1 golfer to continue"}
        </p>
      </section>

      {footer && <div className="border-t border-slate-200 pt-6">{footer}</div>}
    </div>
  );
}