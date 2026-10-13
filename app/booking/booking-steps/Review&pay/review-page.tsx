"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import type { BookingState } from "../../interface/interface";
import ReviewRow from "./review-row/review-row";
import { useKitItems } from "../Package/helper/useKitItems";
import { getBookingSummary } from "../booking-summary-card/booking-summary";
import { AuthModal } from "@/app/(auth)/Auth-modal";
import axios from "axios";
import apiClient from "@/app/connected-backend/api-client/api-client";
import { useAuth } from "@/app/context/auth-context";

type Props = {
  booking: BookingState;
  onEditStep: (step: number) => void;
  golfcourseId: string;
};

function kitToItems(kit: Record<string, number>) {
  const items: Array<
    | { golfSetId: number; quantity: number }
    | { ballId: number; quantity: number }
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

export default function ReviewStep({ booking, onEditStep }: Props) {
  const { user } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  const { items } = useKitItems();

  const { course, category, pkg, kitLines, unitPrice, total, money } =
    getBookingSummary(booking, items);

  async function submit(customerId: string | number) {
    if (submitting) return;

    if (!booking.slot || !course || !category) {
      setError("Please complete all booking details before confirming.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        customerId: String(customerId),
        golfCourseId: course.id,
        golferCategoryId: Number(category.id),
        teeDate: booking.slot.date,
        teeTime: booking.slot.time,
        numberOfGolfers: booking.golfers,
        notes: "yho",
        items: kitToItems(booking.kit),
        status: "pending",
      };

      console.log("Submitting booking:", payload);
      const res = await apiClient.post("https://golf-backend-4h1w.onrender.com/booking", payload);
      console.log("Booking response:", res.data);

      setConfirmationId(res.data?.data?.id ?? res.data?.id ?? "created");
    } catch (e) {
      console.error("booking failed:", e);

      if (axios.isAxiosError(e) && e.response?.status === 401) {
        setError("Your session has expired. Please sign in again.");
        setAuthOpen(true);
        return;
      }

      setError(
        axios.isAxiosError(e)
          ? (e.response?.data?.message ?? "Something went wrong")
          : "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleConfirm() {
    if (!user?.id) {
      setAuthOpen(true); // after login, onSuccess below books
      return;
    }
    submit(user.id);
  }

  if (confirmationId) {
    return (
      <div className="mt-8 rounded-2xl border bg-white p-8 text-center shadow-xl">
        <h2 className="text-2xl font-bold">Booking confirmed</h2>
        <p className="mt-2 text-sm text-slate-500">Reference: {confirmationId}</p>
      </div>
    );
  }

  const ready = booking.courseId && booking.slot && booking.categoryId;

  return (
    <div className="mt-8 space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
      <h2 className="text-2xl font-bold tracking-tight">Review your booking</h2>

      <div className="divide-y">
        <ReviewRow label="Course" onChange={() => onEditStep(1)}>
          {course?.name ?? "—"}
        </ReviewRow>
        <ReviewRow label="Golfers" onChange={() => onEditStep(1)}>
          {booking.golfers} × {category?.label ?? "—"}
        </ReviewRow>
        <ReviewRow label="Date & tee time" onChange={() => onEditStep(2)}>
          {booking.slot
            ? `${format(parseISO(booking.slot.date), "EEEE d MMMM yyyy")} at ${booking.slot.time}`
            : "—"}
        </ReviewRow>
        <ReviewRow label="Package" onChange={() => onEditStep(3)}>
          {pkg?.title ?? "—"}
          {pkg && ` · ${money(unitPrice)} / golfer`}
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

      <div className="flex items-center justify-between border-t pt-4">
        <span className="font-semibold">Total</span>
        <span className="text-xl font-extrabold">{money(total)}</span>
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={!ready || submitting}
        className="w-full rounded-xl bg-[#1F4D36] px-4 py-3 font-semibold text-white disabled:opacity-50"
      >
        {submitting ? "Confirming…" : "Confirm booking"}
      </button>

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={(loggedInUser) => {
          setAuthOpen(false);
          submit(loggedInUser.id); // book immediately after sign-in
        }}
      />
    </div>
  );
}