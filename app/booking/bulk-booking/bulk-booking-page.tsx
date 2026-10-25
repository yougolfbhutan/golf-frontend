"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import { BULK_LAST_STEP, canContinueBulk, CLOSED_DAYS, initialBulk, type BulkState } from "./bulk-types/bulk-types";
import BulkCourseStep from "./bulk-course-step/bulk-step";
import { BulkNavigation } from "./bulk-guide/bulk-guide";
import BulkReviewStep from "./Bulk-review-step/bulk-review-step";
import BulkTeeTimeStep from "./bulk-tee-time/bulk-tee-time";
import BookingGuide from "../booking-component/booking-guide";
import { Bulk_BOOKING_STEPS } from "./data";

const REVIEW_STEP = BULK_LAST_STEP; // 3: course & golfers → tee time → review

export default function BulkBookingPage() {
  const params = useParams<{ id?: string }>();
  const golfcourseId = params?.id ?? "";

  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState<BulkState>(initialBulk);
  const [returnToReview, setReturnToReview] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const ok = canContinueBulk(step, booking);

  // bring the user back to the top on every step change (not on first load)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  function update(patch: Partial<BulkState>) {
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

  function goToStep(target: number) {
    if (target < step) setStep(target);
  }

  function reset() {
    setBooking(initialBulk);
    setReturnToReview(false);
    setStep(1);
  }

  const navigation = (
    <BulkNavigation
      step={step}
      canContinue={ok}
      onBack={() => (returnToReview ? finishEdit() : setStep(step - 1))}
      onNext={() => (returnToReview ? finishEdit() : setStep(step + 1))}
    />
  );

  return (
    // overflow-x-clip (not overflow-hidden) so sticky children keep working
    <div className="relative overflow-x-clip bg-[#E9ECEF]">
      {/* Same container + top padding as the pro booking page, so both tabs line up.
          The navbar spacer lives in the parent page, so top padding is small.
          scroll-mt-36 = navbar (4rem) + sticky tab bar (~5rem). */}
      <div
        ref={topRef}
        className="mx-auto max-w-6xl scroll-mt-36 px-4 pb-32 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pb-16"
      >
        <BookingGuide
          steps={Bulk_BOOKING_STEPS}
          step={step}
          onGoToStep={goToStep}
          canContinue={ok}
        />

        {returnToReview && step !== REVIEW_STEP && (
          <div
            role="status"
            className="mb-4 mt-4 flex flex-col gap-2 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-3"
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

        {/* No summary sidebar in the bulk flow, so no two-column grid here.
            (The old grid reserved an empty 320px column on laptops, which made
            the content narrower than the heading and tabs.) */}
        <div className="min-w-0">
          {step === 1 && (
            <BulkCourseStep
              booking={booking}
              onChange={update}
              golfcourseId={golfcourseId}
              footer={navigation}
            />
          )}
          {step === 2 && (
            <BulkTeeTimeStep
              booking={booking}
              onChange={update}
              closedDays={CLOSED_DAYS}
              footer={navigation}
            />
          )}
          {step === 3 && (
            <BulkReviewStep
              booking={booking}
              onEditStep={editFromReview}
              onBookAnother={reset}
              footer={navigation}
            />
          )}
        </div>
      </div>
    </div>
  );
}