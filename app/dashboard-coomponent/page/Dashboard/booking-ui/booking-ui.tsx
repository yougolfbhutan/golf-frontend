/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
/*
  Shared pieces for the booking screens (tee sheet + list).
  Put this file in the same folder as booking-page.tsx.
*/
import { Flag, Mail, Phone, Users } from "lucide-react";
import { VerticalModalForm } from "@/custom-components/vertical-modal";
import DynamicArrayForm from "@/custom-components/dynamic-array";
import type { Booking } from "../../Booking/interface";

/* ---------- status ---------- */

export const STATUS_STYLES: Record<string, { label: string; cls: string; dot: string }> = {
  pending: { label: "Pending", cls: "bg-amber-50 text-amber-900 ring-1 ring-inset ring-amber-300", dot: "bg-amber-500" },
  approved: { label: "Approved", cls: "bg-emerald-800 text-white", dot: "bg-emerald-200" },
  confirmed: { label: "Confirmed", cls: "bg-emerald-800 text-white", dot: "bg-emerald-200" },
  completed: { label: "Completed", cls: "bg-emerald-800 text-white", dot: "bg-emerald-200" },
  cancelled: { label: "Cancelled", cls: "bg-stone-100 text-stone-500 line-through", dot: "bg-stone-400" },
};

export function StatusBadge({ status }: { status?: string }) {
  const s = STATUS_STYLES[status ?? ""] ?? {
    label: status ?? "Unknown",
    cls: "bg-stone-100 text-stone-600",
    dot: "bg-stone-400",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export const isConfirmed = (s?: string) => ["approved", "confirmed", "completed"].includes(s ?? "");

/* ---------- formatting ---------- */

export function formatDate(date?: string, withYear = false) {
  if (!date) return "—";
  const d = new Date(`${date}T00:00:00`);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
  });
}

export function formatTime(time?: string) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h)) return time;
  return minutesToLabel(h * 60 + (m || 0));
}

export function minutesToLabel(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatMoney(currency?: string, amount?: number | string) {
  return `${currency ?? ""} ${Number(amount ?? 0).toLocaleString()}`.trim();
}

export function formatPhone(b: Booking) {
  if (!b.customer?.phone_no) return "";
  return `${b.customer.country_code ?? ""} ${b.customer.phone_no}`.trim();
}

export function getExtras(row: Booking) {
  return (row.items ?? [])
    .map((item: any) => {
      const name = item.golfSet?.name ?? item.ball?.name ?? item.glove?.name;
      return name ? `${name} × ${item.quantity}` : null;
    })
    .filter(Boolean) as string[];
}

/* ---------- details / approve panel ---------- */

export type PanelMode = "view" | "approve";

export function BookingDetailsPanel({
  booking,
  mode,
  onModeChange,
  onClose,
  onCancel,
  onApprove,
}: {
  booking: Booking | null;
  mode: PanelMode;
  onModeChange: (m: PanelMode) => void;
  onClose: () => void;
  onCancel: (b: Booking) => void;
  onApprove: (b: Booking, values: any) => void;
}) {
  const extras = booking ? getExtras(booking) : [];

  return (
    <VerticalModalForm
      title={mode === "approve" ? "Approve booking" : "Booking details"}
      isOpen={!!booking}
      onClose={onClose}
    >
      {booking && (
        <div className="space-y-5">
          <section className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-stone-900">{booking.customer?.name}</p>
              <div className="mt-1 space-y-0.5 text-sm text-stone-500">
                {booking.customer?.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    {booking.customer.email}
                  </p>
                )}
                {formatPhone(booking) && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    {formatPhone(booking)}
                  </p>
                )}
              </div>
            </div>
            <StatusBadge status={booking.status} />
          </section>

          <section className="rounded-lg bg-stone-50 p-4 ring-1 ring-stone-200">
            <div className="flex items-center gap-3">
              {booking.golfCourse?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={booking.golfCourse.imageUrl} alt="" className="h-12 w-12 rounded-md object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-emerald-800 text-white">
                  <Flag className="h-5 w-5" />
                </div>
              )}
              <div>
                <p className="font-medium text-stone-900">{booking.golfCourse?.name}</p>
                <p className="text-sm text-stone-600">
                  {formatDate(booking.teeDate, true)} at {formatTime(booking.teeTime)}
                </p>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-stone-200 pt-4 text-sm">
              <div>
                <dt className="text-stone-500">Players</dt>
                <dd className="flex items-center gap-1.5 font-medium text-stone-900">
                  <Users className="h-3.5 w-3.5 text-stone-400" />
                  {booking.numberOfGolfers}
                  {booking.golferCategory?.name ? ` · ${booking.golferCategory.name}` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-stone-500">Amount</dt>
                <dd className="font-medium tabular-nums text-stone-900">
                  {formatMoney(booking.currency, booking.totalAmount)}
                </dd>
              </div>
              {extras.length > 0 && (
                <div className="col-span-2">
                  <dt className="text-stone-500">Rentals</dt>
                  <dd className="mt-1 flex flex-wrap gap-1.5">
                    {extras.map((n) => (
                      <span key={n} className="rounded-md bg-white px-2 py-0.5 text-xs text-stone-700 ring-1 ring-stone-200">
                        {n}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>

            {booking.notes && (
              <p className="mt-4 border-t border-stone-200 pt-3 text-sm italic text-stone-600">
                “{booking.notes}”
              </p>
            )}
          </section>

          {mode === "view" && booking.status === "pending" && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onModeChange("approve")}
                className="flex-1 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                Approve booking
              </button>
              <button
                type="button"
                onClick={() => onCancel(booking)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-stone-700 ring-1 ring-inset ring-stone-300 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                Cancel booking
              </button>
            </div>
          )}

          {mode === "approve" && (
            <DynamicArrayForm
              title="Payment"
              initialValues={{ amount: booking.totalAmount || 0, paymentMode: "" }}
              buttonTitle="Approve booking"
              onSubmit={(...args: any[]) => onApprove(booking, args[0])}
            />
          )}
        </div>
      )}
    </VerticalModalForm>
  );
}