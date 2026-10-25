"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { canContinue } from "./helper-function/canContinue";
import { initialBooking, type BookingState } from "./interface/interface";
import { lastStep } from "./helper-function/max-reachable-step";
import BookingNavigation from "./booking-component/booking-navigation";
import BookingGuide from "./booking-component/booking-guide";

import BookingSummaryCard from "./booking-steps/booking-summary-card/booking-summary-card";
import FixedSummary from "./booking-steps/booking-summary-card/fixed-summary-card";
import ReviewStep from "./booking-steps/Review&pay/review-page";
import PackageStep from "./booking-steps/Package/package-pagew";
import DateTimeStep from "./booking-steps/Tee-time/tee-time-page";
import CourseStep from "./booking-steps/course&golfers/golfer-course";

const REVIEW_STEP = lastStep;

export default function CustomerBookingPage() {
  const { id: golfcourseId } = useParams<{ id: string }>();

  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState<BookingState>(initialBooking);
  const [returnToReview, setReturnToReview] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const showSummary = step !== REVIEW_STEP;
  const ok = canContinue(step, booking);

  // every time the step changes, bring the user back to the top of the form
  // (skipped on first load so the page doesn't jump)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  function update(patch: Partial<BookingState>) {
    setBooking((prev) => ({ ...prev, ...patch }));
  }

  function editFromReview(target: number) {
    setReturnToReview(true);
    setStep(target);
  }

  function backToReview() {
    setReturnToReview(false);
    setStep(REVIEW_STEP);
  }

  // if a change cleared the tee time, send the user back to pick one
  function finishEdit() {
    if (!booking.slot) return editFromReview(2);
    backToReview();
  }

  // only completed steps can be clicked in the progress bar
  function goToStep(target: number) {
    if (target < step) setStep(target);
  }

  const navigation = (
    <BookingNavigation
      step={step}
      lastStep={lastStep}
      canContinue={ok}
      onBack={() => (returnToReview ? finishEdit() : setStep(step - 1))}
      onNext={() => (returnToReview ? finishEdit() : setStep(step + 1))}
    />
  );

  return (
    // overflow-x-clip (not overflow-hidden) so sticky children keep working
    <div className="relative overflow-x-clip bg-[#E9ECEF]">
      {/* The navbar spacer now lives in the parent page, so top padding is small.
          scroll-mt-36 = navbar (4rem) + sticky tab bar (~5rem) so the scroll
          target isn't hidden underneath them. */}
      <div
        ref={topRef}
        className="mx-auto max-w-6xl scroll-mt-36 px-4 pb-32 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pb-16"
      >
        <BookingGuide step={step} canContinue={ok} onGoToStep={goToStep} />

        {returnToReview && step !== REVIEW_STEP && (
          <div
            role="status"
            className="mb-4 flex flex-col gap-2 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-3"
          >
            <span>
              {booking.slot
                ? "You're changing your booking. Your other choices are kept."
                : "Your tee time was cleared. Please pick a new one."}
            </span>
            <button
              type="button"
              onClick={finishEdit}
              className="shrink-0 self-start font-semibold text-emerald-900 underline underline-offset-4 sm:self-auto"
            >
              Back to review
            </button>
          </div>
        )}

        <div
          className={cn(
            "lg:grid lg:gap-8",
            showSummary && "lg:grid-cols-[minmax(0,1fr)_320px]",
          )}
        >
          <div className="min-w-0">
            {step === 1 && (
              <CourseStep
                booking={booking}
                onChange={update}
                golfcourseId={golfcourseId}
                footer={navigation}
              />
            )}
            {step === 2 && (
              <DateTimeStep
                booking={booking}
                onChange={update}
                closedDays={[2]}
                footer={navigation}
              />
            )}
            {step === 3 && (
              <PackageStep
                booking={booking}
                onChange={update}
                footer={navigation}
              />
            )}
            {step === 4 && (
              <ReviewStep
                booking={booking}
                onEditStep={editFromReview}
                golfcourseId={golfcourseId}
                footer={navigation}
              />
            )}

            {/* phones and tablets: full summary below the step */}
            {showSummary && (
              <div className="mt-6 lg:hidden">
                <BookingSummaryCard booking={booking} />
              </div>
            )}
          </div>

          {/* desktop: fixed beside the step */}
          {showSummary && (
            <FixedSummary>
              <BookingSummaryCard booking={booking} />
            </FixedSummary>
          )}
        </div>
      </div>
    </div>
  );
}