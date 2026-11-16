"use client";

import { type ReactNode, useEffect } from "react";
import { coursesdata } from "@/app/homepagecomponents/golfcourse/courses";
import {
  MAX_PER_TYPE,
  MIN_GOLFERS,
  type BulkState,
} from "../bulk-types/bulk-types";
import CardCarousel from "../../booking-component/card-carasouel";
import ImageSliderCard from "../../booking-component/image-slider-component";
import { bulkAmounts, formatUSD, NON_SAARC_RATE, SAARC_RATE } from "../helper/bulk-types";

type Props = {
  booking: BulkState;
  onChange: (patch: Partial<BulkState>) => void;
  golfcourseId: string;
  footer?: ReactNode;
};

const MAX_TOTAL = MAX_PER_TYPE;
const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);
const toInt = (v: string) => {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? 0 : n;
};

function SectionTitle({ title, help }: { title: string; help?: string }) {
  return (
    <div className="mb-3">
      <h2 className="font-sans text-base font-bold text-slate-900 sm:text-lg">{title}</h2>
      {help && <p className="text-sm text-slate-600">{help}</p>}
    </div>
  );
}

/** Big +/- stepper. Typing is still possible, but most people just tap. */
function Stepper({
  id,
  label,
  value,
  max,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  max: number;
  onChange: (n: number) => void;
}) {
  const btn =
    "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-2xl font-semibold text-slate-900 hover:bg-slate-50 active:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1F4D36]";
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        className={btn}
        disabled={value <= 0}
        onClick={() => onChange(clamp(value - 1, 0, max))}
      >
        −
      </button>
      <input
        id={id}
        aria-label={label}
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        value={value}
        onFocus={(e) => e.target.select()}
        onChange={(e) => onChange(clamp(toInt(e.target.value), 0, max))}
        className="h-12 w-20 rounded-lg border border-slate-300 bg-white text-center text-xl font-bold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1F4D36]"
      />
      <button
        type="button"
        aria-label={`Increase ${label}`}
        className={btn}
        disabled={value >= max}
        onClick={() => onChange(clamp(value + 1, 0, max))}
      >
        +
      </button>
    </div>
  );
}

/** One question: "how many are X?" The other group is calculated, never typed. */
function SplitRow({
  id,
  question,
  help,
  value,
  total,
  restLabel,
  onChange,
}: {
  id: string;
  question: string;
  help?: string;
  value: number;
  total: number;
  restLabel: string;
  onChange: (n: number) => void;
}) {
  const chip =
    "rounded-full border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1F4D36]";
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <label htmlFor={id} className="block font-semibold text-slate-900">
        {question}
      </label>
      {help && <p className="mb-3 text-xs text-slate-500">{help}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Stepper id={id} label={question} value={value} max={total} onChange={onChange} />
        <div className="flex gap-2">
          <button type="button" className={chip} onClick={() => onChange(0)}>
            None
          </button>
          <button type="button" className={chip} onClick={() => onChange(total)}>
            All
          </button>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-600" aria-live="polite">
        {restLabel}: <b className="text-slate-900">{total - value}</b>
      </p>
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

  // Single source of truth: total, SAARC count, left-handed count.
  // Everything else is derived so the two splits can never disagree.
  const total = booking.saarcGolfers + booking.nonSaarcGolfers;
  const saarc = booking.saarcGolfers;
  const left = clamp(booking.no_of_left_handed, 0, total);

  // amounts: SAARC × $160, non-SAARC × $220
  const { saarcAmount, nonSaarcAmount, total: totalAmount } = bulkAmounts(booking);

  const setTotal = (n: number) => {
    const nextSaarc = Math.min(saarc, n);
    const nextLeft = Math.min(left, n);
    onChange({
      saarcGolfers: nextSaarc,
      nonSaarcGolfers: n - nextSaarc, // new golfers default to non-SAARC
      no_of_left_handed: nextLeft,
      no_of_right_handed: n - nextLeft, // new golfers default to right-handed
    });
  };

  const setSaarc = (n: number) => onChange({ saarcGolfers: n, nonSaarcGolfers: total - n });
  const setLeft = (n: number) => onChange({ no_of_left_handed: n, no_of_right_handed: total - n });

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

      {/* ---------- Golfers ---------- */}
      <section>
        <SectionTitle title="Golfers" help="Enter the total once, then adjust only what is different." />

        <div className="rounded-xl border-2 border-[#1F4D36] bg-[#1F4D36]/5 p-4">
          <label htmlFor="total-golfers" className="block font-semibold text-slate-900">
            How many golfers in total?
          </label>
          <div className="mt-3">
            <Stepper
              id="total-golfers"
              label="Total golfers"
              value={total}
              max={MAX_TOTAL}
              onChange={setTotal}
            />
          </div>
        </div>

        {total >= MIN_GOLFERS && (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <SplitRow
              id="saarc-golfers"
              question="How many are from SAARC countries?"
              help={`${formatUSD(SAARC_RATE)} each. Afghanistan, Bangladesh, Bhutan, India, Maldives, Nepal, Pakistan, Sri Lanka`}
              value={saarc}
              total={total}
              restLabel={`Non-SAARC golfers (${formatUSD(NON_SAARC_RATE)} each)`}
              onChange={setSaarc}
            />
            <SplitRow
              id="left-handed-golfers"
              question="How many are left-handed?"
              help="Everyone else is counted as right-handed."
              value={left}
              total={total}
              restLabel="Right-handed golfers"
              onChange={setLeft}
            />
          </div>
        )}

        {/* ---------- Price ---------- */}
        {total >= MIN_GOLFERS && (
          <div
            className="mt-4 rounded-xl border-2 border-[#1F4D36] bg-[#1F4D36]/5 p-4"
            aria-live="polite"
          >
            <h3 className="font-semibold text-slate-900">Estimated green fee</h3>

            <dl className="mt-3 space-y-2 text-sm text-slate-700">
              <div className="flex justify-between gap-4">
                <dt>
                  {saarc} SAARC × {formatUSD(SAARC_RATE)}
                </dt>
                <dd className="font-semibold text-slate-900">{formatUSD(saarcAmount)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>
                  {total - saarc} Non-SAARC × {formatUSD(NON_SAARC_RATE)}
                </dt>
                <dd className="font-semibold text-slate-900">{formatUSD(nonSaarcAmount)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-[#1F4D36]/20 pt-2 text-base">
                <dt className="font-bold text-slate-900">Total ({total} golfers)</dt>
                <dd className="font-bold text-[#1F4D36]">{formatUSD(totalAmount)}</dd>
              </div>
            </dl>

            <p className="mt-2 text-xs text-slate-500">
              {total - left} right-handed, {left} left-handed
            </p>
          </div>
        )}

        {total < MIN_GOLFERS && (
          <p className="mt-3 text-sm text-slate-600" aria-live="polite">
            Add at least 1 golfer to continue.
          </p>
        )}
      </section>

      {footer && <div className="border-t border-slate-200 pt-6">{footer}</div>}
    </div>
  );
}