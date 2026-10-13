"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import BookingHeader from "./booking-tabs/booking-tabs";
import { canContinue } from "./helper-function/canContinue";
import { initialBooking, type BookingState } from "./interface/interface";
import {
  getMaxReachableStep,
  lastStep,
} from "./helper-function/max-reachable-step";
import BookingNavigation from "./booking-component/booking-navigation";


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

  const maxReachableStep = getMaxReachableStep(booking, lastStep);
  const showSummary = step !== REVIEW_STEP;

  function update(patch: Partial<BookingState>) {
    setBooking((prev) => ({ ...prev, ...patch }));
  }

  function goToStep(target: number) {
    setReturnToReview(false);
    setStep(target);
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

  return (
    <div className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 pb-32 lg:pb-16">
      <BookingHeader
        currentStep={step}
        onStepClick={goToStep}
        maxReachableStep={Math.max(maxReachableStep, step)}
      />

      {returnToReview && step !== REVIEW_STEP && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm">
          <span>
            {booking.slot
              ? "You're changing your booking. Your other choices are kept."
              : "Your tee time was cleared. Please pick a new one."}
          </span>
          <button
            type="button"
            onClick={finishEdit}
            className="shrink-0 font-medium text-[#1F4D36] underline-offset-4 hover:underline"
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
            />
          )}
          {step === 2 && (
            <DateTimeStep
              booking={booking}
              onChange={update}
              closedDays={[2]}
            />
          )}
          {step === 3 && <PackageStep booking={booking} onChange={update} />}
          {step === 4 && (
            <ReviewStep
              booking={booking}
              onEditStep={editFromReview}
              golfcourseId={golfcourseId}
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

      <BookingNavigation
        step={step}
        lastStep={lastStep}
        canContinue={canContinue(step, booking)}
        onBack={() => (returnToReview ? finishEdit() : setStep(step - 1))}
        onNext={() => (returnToReview ? finishEdit() : setStep(step + 1))}
      />
    </div>
  );
}