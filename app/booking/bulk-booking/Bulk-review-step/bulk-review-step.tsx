"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CalendarClock,
  Check,
  Loader2,
  Mail,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

import { AuthModal } from "@/app/(auth)/Auth-modal";
import { useAuth } from "@/app/context/auth-context";
import { isSystemUser } from "@/app/src/lib/auth/auth-roles";
import ReviewRow from "../../booking-steps/Review&pay/review-row/review-row";
import {
  type BulkState,
  findCourse,
  totalGolfers,
  MIN_GOLFERS,
  teeTimeLabel,
} from "../bulk-types/bulk-types";
import { useBookingMutation } from "../../booking-steps/Review&pay/tanstack";

// TODO: set this to the golfer category id your backend uses for bulk / tour groups.
// The customer booking sends golferCategoryId, so bulk sends one too.
const BULK_GOLFER_CATEGORY_ID = 1;

type Props = {
  booking: BulkState;
  onEditStep: (step: number) => void;
  onBookAnother: () => void;
  footer?: ReactNode;
};

export default function BulkReviewStep({
  booking,
  onEditStep,
  onBookAnother,
  footer,
}: Props) {
  const { user } = useAuth();
  const router = useRouter();

  const [authOpen, setAuthOpen] = useState(false);
  const [pendingCustomerId, setPendingCustomerId] = useState<string | number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ reference?: string } | null>(null);
  const { createBooking } = useBookingMutation(); // returns mutateAsync

  const course = findCourse(booking.courseId);
  const total = totalGolfers(booking);
  const ready = Boolean(course && booking.slot && total >= MIN_GOLFERS);
  const dateLabel = teeTimeLabel(booking.slot);

  async function submit(customerId: string | number) {
    if (submitting) return;
    if (!ready || !course || !booking.slot) {
      setError("Please complete all booking details before sending.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      // same payload shape as the customer booking
      const res = await createBooking({
        customerId: String(customerId),
        golfCourseId: course.id,
        golferCategoryId: BULK_GOLFER_CATEGORY_ID,
        teeDate: booking.slot.date,
        teeTime: booking.slot.time,
        numberOfGolfers: total,
        notes: `Bulk booking: ${booking.saarcGolfers} SAARC, ${booking.nonSaarcGolfers} non-SAARC golfers`,
        items: [],
        status: "pending",
      });

      // BookingsResponse has no `reference`; use the created booking id if the API returns it
      const created = res?.data?.data?.[0];
      setConfirmed({ reference: created?.id ? `#${created.id}` : undefined });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("We could not send your request. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // books once the new user is committed to context after sign in / sign up
  useEffect(() => {
    if (pendingCustomerId == null) return;
    const id = pendingCustomerId;
    setPendingCustomerId(null);
    submit(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingCustomerId]);

  function handleConfirm() {
    if (!user?.id) {
      setAuthOpen(true);
      return;
    }
    if (isSystemUser(user)) {
      router.replace("/dashboard");
      return;
    }
    submit(user.id);
  }

  /* ------------------------------ success screen ------------------------------ */
  if (confirmed) {
    return (
      <div
        role="status"
        className="mt-8 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5"
      >
        <div className="px-6 pb-6 pt-10 text-center sm:px-8">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-800 ring-8 ring-emerald-50">
            <Check className="size-8" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
            Request sent
          </h2>
          <p className="mx-auto mt-2 max-w-md text-slate-600">
            The course team will review your bulk booking and confirm it.
          </p>
          {confirmed.reference && (
            <p className="mt-3 inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              Reference {confirmed.reference}
            </p>
          )}
        </div>

        <dl className="mx-6 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:mx-8 sm:grid-cols-3">
          <SummaryCell icon={MapPin} label="Course" value={course?.name ?? "Your course"} />
          <SummaryCell
            icon={Users}
            label="Golfers"
            value={`${total} ${total === 1 ? "golfer" : "golfers"}`}
          />
          <SummaryCell icon={CalendarClock} label="First tee time" value={dateLabel} />
        </dl>

        {user?.email && (
          <p className="mx-6 mt-5 flex items-start gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 sm:mx-8">
            <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              We will email <span className="font-semibold">{user.email}</span> once the
              course team confirms.
            </span>
          </p>
        )}

        <div className="px-6 pb-8 pt-6 text-center sm:px-8">
          <button
            type="button"
            onClick={onBookAnother}
            className="rounded-xl bg-[#1F4D36] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#256343] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1F4D36]/30"
          >
            Make another bulk booking
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------- review screen ------------------------------ */
  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5">
      <div className="flex items-start gap-4 border-b border-slate-100 px-6 pb-5 pt-6 sm:px-8">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-800">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Review your bulk booking
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Check the details below. You can change anything before sending.
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100 px-6 sm:px-8">
        <ReviewRow label="Course" onChange={() => onEditStep(1)}>
          {course?.name ?? "—"}
        </ReviewRow>

        <ReviewRow label="Golfers" onChange={() => onEditStep(1)}>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Tile label="SAARC" value={booking.saarcGolfers} />
            <Tile label="Non-SAARC" value={booking.nonSaarcGolfers} />
            <Tile label="Total" value={total} strong />
          </div>
        </ReviewRow>

        <ReviewRow label="Date & tee time" onChange={() => onEditStep(2)}>
          {dateLabel}
        </ReviewRow>
      </div>

      <div className="space-y-4 px-6 pb-7 pt-6 sm:px-8">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!ready || submitting}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#256343] to-[#1F4D36] px-6 py-4 text-base font-semibold text-white shadow-lg shadow-[#1F4D36]/25 ring-1 ring-inset ring-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1F4D36]/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              Sending your request…
            </>
          ) : (
            <>
              {user ? "Send bulk booking" : "Sign in & send bulk booking"}
              <ArrowRight
                className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </>
          )}
        </button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-[#1F4D36]" aria-hidden="true" />
          The course team confirms your request. You won&rsquo;t be charged yet.
        </p>

        {footer && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-sm text-slate-600">
            {footer}
          </div>
        )}
      </div>

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={(loggedInUser) => {
          setAuthOpen(false);
          setError(null);
          if (isSystemUser(loggedInUser)) {
            router.replace("/dashboard");
            return;
          }
          if (ready) setPendingCustomerId(loggedInUser.id); // send right after login
        }}
      />
    </div>
  );
}

/* ------------------------------ small helpers ------------------------------ */

function Tile({
  label,
  value,
  strong,
}: {
  label: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <div
      className={
        strong
          ? "rounded-xl bg-emerald-50 px-3 py-2 ring-1 ring-emerald-200"
          : "rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200"
      }
    >
      <p className={strong ? "text-xl font-bold text-emerald-900" : "text-xl font-semibold text-slate-900"}>
        {value}
      </p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function SummaryCell({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white px-4 py-4 text-left">
      <dt className="flex items-center gap-1.5 text-xs text-slate-500">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  );
}