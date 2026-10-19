"use client";

import { type ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { BookingState } from "../../interface/interface";
import { CATEGORIES, MAX_GOLFERS } from "./data";
import { coursesdata } from "@/app/homepagecomponents/golfcourse/courses";
import ImageSliderCard from "../../booking-component/image-slider-component";
import CategoryCard from "../../booking-component/category-card";
import QuantityStepper from "../../booking-component/quantity-stepper";
import CardCarousel from "../../booking-component/card-carasouel";

type Props = {
  booking: BookingState;
  onChange: (patch: Partial<BookingState>) => void;
  golfcourseId: string;
  footer?: ReactNode;
};

/** small heading + one line telling the user what to do in this section */
function SectionTitle({ title, help }: { title: string; help: string }) {
  return (
    <div className="mb-3">
      <h2 className="font-sans text-base font-bold text-slate-900 sm:text-lg">
        {title}
      </h2>
      <p className="text-sm text-slate-600">{help}</p>
    </div>
  );
}

export default function CourseStep({
  footer,
  booking,
  onChange,
  golfcourseId,
}: Props) {
  useEffect(() => {
    if (booking.courseId) return; // don't overwrite what the user picked
    const match = coursesdata.find(
      (c) => c.bookingId === golfcourseId || String(c.id) === golfcourseId,
    );
    if (match) onChange({ courseId: match.bookingId ?? String(match.id) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [golfcourseId]);

  const selectedIndex = coursesdata.findIndex(
    (c) => (c.bookingId ?? String(c.id)) === booking.courseId,
  );

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

      {/* ---------- Golfer category ---------- */}
      <section>
        <SectionTitle
          title="Golfer category"
          help="Choose the category that fits your group. It sets the green fee."
        />
        <div
          role="radiogroup"
          aria-label="Golfer category"
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {CATEGORIES.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              selected={booking.categoryId === c.id}
              onSelect={() => onChange({ categoryId: c.id })}
            />
          ))}
        </div>
      </section>

      {/* ---------- Number of golfers ---------- */}
      <section>
        <SectionTitle
          title="Number of golfers"
          help={`Use + and − to set how many are playing (up to ${MAX_GOLFERS} per tee time).`}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
          <div className="flex items-center gap-4">
            <QuantityStepper
              value={booking.golfers}
              min={1}
              max={MAX_GOLFERS}
              label="golfer"
              // 36px buttons on phones, 40px from sm up (merged by tailwind-merge)
              classNames={{
                button: "h-9 w-9 sm:h-10 sm:w-10",
                value: "w-8 text-base sm:w-10 sm:text-lg",
              }}
              onChange={(golfers) => onChange({ golfers, slot: null })}
            />
            <span className="text-sm font-medium text-slate-700 sm:hidden">
              {booking.golfers} of {MAX_GOLFERS}
            </span>
          </div>

          {/* golfer dots: smaller on phones, wrap if there are many */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2" aria-hidden>
            {Array.from({ length: MAX_GOLFERS }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-6 w-6 rounded-full transition-colors duration-200 sm:h-8 sm:w-8",
                  i < booking.golfers ? "bg-[#1F4D36]" : "bg-[#E4EBE5]",
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {footer && <div className="border-t border-slate-200 pt-6">{footer}</div>}
    </div>
  );
}