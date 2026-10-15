"use client";
import { Minus, Plus, Star } from "lucide-react";
import type { BookingState } from "../../interface/interface";
import { CATEGORIES, MAX_GOLFERS } from "./data";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import ImageSliderCard from "../../booking-component/image-slider-component";
import { coursesdata } from "@/app/homepagecomponents/golfcourse/courses";
import { useEffect, type ReactNode } from "react";
import CategoryCard from "../../booking-component/category-card";
import QuantityStepper from "../../booking-component/quantity-stepper";

type Props = {
  booking: BookingState;
  onChange: (patch: Partial<BookingState>) => void;
  golfcourseId: string;
    footer?: ReactNode;

};

export default function CourseStep({ footer,booking, onChange, golfcourseId }: Props) {
  useEffect(() => {
    if (booking.courseId) return; // don't overwrite what the user picked
    const match = coursesdata.find(
      (c) => c.bookingId === golfcourseId || String(c.id) === golfcourseId,
    );
    if (match) onChange({ courseId: match.bookingId ?? String(match.id) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [golfcourseId]);

  return (
    <div className="mt-8 space-y-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
      <div>
        <p className="mt-1 text-base text-black">
          Choose a course, then tell us who&apos;s playing. Everyone in one
          booking pays the same category rate.
        </p>
      </div>
      {/* Course */}
      <section>
        <p className="mb-3 text-sm font-bold">Course</p>
        <div
          role="radiogroup"
          aria-label="Course"
          className="grid gap-4 sm:grid-cols-2"
        >
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
        </div>
      </section>
      {/* Golfer category */}
      <section>
        <p className="mb-3 text-sm font-bold">Golfer category</p>
        <div
          role="radiogroup"
          aria-label="Golfer category"
          className="grid gap-3 sm:grid-cols-3"
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
      <section>
        <p className="mb-3 text-sm font-bold">Number of golfers</p>
        <div className="flex flex-wrap items-center gap-5">
          <QuantityStepper
            value={booking.golfers}
            min={1}
            max={MAX_GOLFERS}
            label="golfer"
            onChange={(golfers) => onChange({ golfers, slot: null })}
          />

          {/* golfer dots */}
          <div className="flex gap-2" aria-hidden>
            {Array.from({ length: MAX_GOLFERS }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-8 w-8 rounded-full transition-colors duration-200",
                  i < booking.golfers ? "bg-[#1F4D36]" : "bg-[#E4EBE5]",
                )}
              />
            ))}
          </div>

          <span className="text-sm text-slate-500">
            Up to {MAX_GOLFERS} per tee time
          </span>
        </div>
      </section>
            {footer && <div className="border-t border-slate-200 pt-6">{footer}</div>}

    </div>
  );
}
