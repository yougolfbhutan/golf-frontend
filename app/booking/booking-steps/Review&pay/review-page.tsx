/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { format, parseISO } from "date-fns";
import axios from "axios";
import { AlertCircle, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

import type { BookingState } from "../../interface/interface";
import ReviewRow from "./review-row/review-row";
import { useKitItems } from "../Package/helper/useKitItems";
import { getBookingSummary } from "../booking-summary-card/booking-summary";
import { AuthModal } from "@/app/(auth)/Auth-modal";
import { useAuth } from "@/app/context/auth-context";
import { useBookingMutation } from "./tanstack";
import BookingConfirmed from "./booking-confirmed";
import { isSystemUser } from "@/app/src/lib/auth/auth-roles";
import { useRouter } from "next/navigation";

type Props = {
  booking: BookingState;
  onEditStep: (step: number) => void;
  golfcourseId: string;
  footer?: ReactNode;
  /** Optional: reset the wizard so the golfer can book again */
  onBookAnother?: () => void;
};

type Confirmed = {
  reference?: string;
  email?: string;
  total?:any
};

/* ---------------------------------- helpers --------------------------------- */

function kitToItems(kit: Record<string, number>) {
  const items: Array<
    { golfSetId: number; quantity: number } | { ballId: number; quantity: number }
  > = [];

  for (const [key, quantity] of Object.entries(kit)) {
    if (!quantity) continue;
    const [type, rawId] = key.split("-");
    const id = Number(rawId);
    if (type === "set") items.push({ golfSetId: id, quantity });
    else if (type === "ball") items.push({ ballId: id, quantity });
  }
  return items;
}

/** Works with raw axios errors AND with errors your hooks re-throw as { status, data, message } */
function readError(e: unknown): { status?: number; message: string } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err = e as any;

  if (axios.isAxiosError(e)) {
    if (!e.response) {
      return { message: "We couldn't reach the server. Check your connection and try again." };
    }
    return {
      status: e.response.status,
      message: e.response.data?.message ?? "Something went wrong. Please try again.",
    };
  }

  return {
    status: err?.status ?? err?.statusCode,
    message: err?.data?.message ?? err?.message ?? "Something went wrong. Please try again.",
  };
}

function friendlyMessage(status: number | undefined, fallback: string) {
  switch (status) {
    case 401:
      return "Please sign in to finish your booking.";
    case 409:
      return "Sorry, that tee time was just taken. Please choose another slot.";
    case 422:
    case 400:
      return fallback || "Some booking details look incomplete. Please check and try again.";
    default:
      return fallback;
  }
}

/* --------------------------------- component -------------------------------- */

export default function ReviewStep({ footer, booking, onEditStep, onBookAnother }: Props) {
  const { user } = useAuth();
  const { items } = useKitItems();
  const { createBooking } = useBookingMutation(); // must return mutateAsync (see tanstack.ts)

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);
const router = useRouter();

  // Set after a successful sign-in / register. The effect below books once
  // React has committed the new user to context (so the auth token is ready).
  const [pendingCustomerId, setPendingCustomerId] = useState<string | number | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const { course, category, pkg, kitLines, unitPrice, total, money } = getBookingSummary(
    booking,
    items,
  );

  const ready = Boolean(booking.courseId && booking.slot && booking.categoryId);
  const dateLabel = booking.slot
    ? `${format(parseISO(booking.slot.date), "EEEE d MMMM yyyy")} at ${booking.slot.time}`
    : "—";

  async function submit(customerId: string | number) {
    if (submitting) return;

    if (!booking.slot || !course || !category) {
      setError("Please complete all booking details before confirming.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await createBooking({
        customerId: String(customerId),
        golfCourseId: course.id,
        golferCategoryId: Number(category.id),
        teeDate: booking.slot.date,
        teeTime: booking.slot.time,
        numberOfGolfers: booking.golfers,
        notes: "",
        items: kitToItems(booking.kit),
        status: "pending",
      });

      
      const saved = Array.isArray((res.data as any)?.data)
        ? (res.data as any).data[0]
        : res.data;

      setConfirmed({
        reference: saved?.id ? `GB-${String(saved.id).padStart(5, "0")}` : undefined,
        email: saved?.customer?.email ?? user?.email,
        total: saved?.totalAmount != null
          ? `${saved.currency ?? "Nu."} ${Number(saved.totalAmount).toLocaleString()}`
          : undefined,
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      const { status, message } = readError(e);
      setError(friendlyMessage(status, message));

      // Session expired → sign in again in the modal, then book automatically
      if (status === 401) setAuthOpen(true);
    } finally {
      setSubmitting(false);
    }
  }

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
      <div ref={topRef}>
        <BookingConfirmed
          reference={confirmed.reference}
          email={confirmed.email ?? user?.email}
          courseName={course?.name ?? "your course"}
          dateLabel={dateLabel}
          golfersLabel={`${booking.golfers} × ${category?.label ?? "golfer"}`}
          packageLabel={pkg?.title}
          total={money(total)}
          onBookAnother={onBookAnother}
        />
      </div>
    );
  }

  /* ------------------------------- review screen ------------------------------ */
  return (
    <div
      ref={topRef}
      className="mt-8 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5"
    >
      <div className="border-b border-slate-100 px-6 pb-5 pt-6 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1F4D36]">
          Last step
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Review your booking
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Check the details below. You can change anything before confirming.
        </p>
      </div>

      <div className="divide-y divide-slate-100 px-6 sm:px-8">
        <ReviewRow label="Course" onChange={() => onEditStep(1)}>
          {course?.name ?? "—"}
        </ReviewRow>
        <ReviewRow label="Golfers" onChange={() => onEditStep(1)}>
          {booking.golfers} × {category?.label ?? "—"}
        </ReviewRow>
        <ReviewRow label="Date & tee time" onChange={() => onEditStep(2)}>
          {dateLabel}
        </ReviewRow>
        <ReviewRow label="Package" onChange={() => onEditStep(3)}>
          {pkg?.title ?? "—"}
          {/* {pkg && <span className="text-slate-500"> · {money(unitPrice)} / golfer</span>} */}
        </ReviewRow>
        <ReviewRow label="Kit & extras" onChange={() => onEditStep(3)}>
          {kitLines.length === 0 ? (
            <span className="text-slate-500">Nothing added</span>
          ) : (
            <ul className="space-y-0.5">
              {kitLines.map(({ item, qty }) => (
                <li key={item.id}>
                  {item.title} × {qty}
                </li>
              ))}
            </ul>
          )}
        </ReviewRow>
      </div>

      <div className="mx-6 mt-2 flex items-baseline justify-between rounded-2xl bg-[#F3F6F2] px-5 py-4 sm:mx-8">
        <span className="text-sm font-semibold text-slate-700">Total</span>
        <span className="text-2xl font-extrabold tracking-tight text-slate-900">
          {money(total)}
        </span>
      </div>

      <div className="space-y-4 px-6 pb-7 pt-6 sm:px-8">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!ready || submitting}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl
            bg-gradient-to-b from-[#256343] to-[#1F4D36] px-6 py-4 text-base font-semibold
            text-white shadow-lg shadow-[#1F4D36]/25 ring-1 ring-inset ring-white/10
            transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl
            active:translate-y-0 active:scale-[0.98]
            focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1F4D36]/30
            disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Booking your tee time…
            </>
          ) : (
            <>
              {user ? "Confirm booking" : "Sign in & confirm booking"}
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-[#1F4D36]" />
          Secure booking · You won&rsquo;t be charged yet
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
          setPendingCustomerId(loggedInUser.id); // books right after login – no redirect
        }}
      />
    </div>
  );
}