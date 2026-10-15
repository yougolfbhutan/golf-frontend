"use client";

import Link from "next/link";
import { CalendarDays, Check, Flag, Mail, Users } from "lucide-react";

type Props = {
  reference?: string;
  email?: string;
  courseName: string;
  dateLabel: string;
  golfersLabel: string;
  packageLabel?: string;
  total: string;
  onBookAnother?: () => void;
  /** Where golfers see their bookings */
  bookingsHref?: string;
};

export default function BookingConfirmed({
  reference,
  email,
  courseName,
  dateLabel,
  golfersLabel,
  packageLabel,
  total,
  onBookAnother,
  bookingsHref = "/my-bookings",
}: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-8 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5
        animate-in fade-in slide-in-from-bottom-2 duration-500"
    >
      {/* Header */}
      <div className="flex flex-col items-center px-6 pb-6 pt-10 text-center sm:px-10">
        <div className="relative mb-5">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#1F4D36]/20 [animation-iteration-count:2]" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#1F4D36] text-white shadow-lg shadow-[#1F4D36]/30">
            <Check className="h-8 w-8" strokeWidth={3} />
          </span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
          Your tee time is requested
        </h2>
        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-slate-600">
          Thank you! We&rsquo;ve sent your booking to <strong>{courseName}</strong>. The course
          will confirm it shortly
          {email ? (
            <>
              {" "}and we&rsquo;ll email you at <strong>{email}</strong>
            </>
          ) : null}
          .
        </p>

        {reference && (
          <div className="mt-5 rounded-full bg-[#F3F6F2] px-4 py-1.5 text-sm text-slate-700">
            Booking reference{" "}
            <span className="font-mono font-semibold tracking-wide text-slate-900">
              #{reference}
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <dl className="mx-6 divide-y divide-slate-100 rounded-2xl border border-slate-100 sm:mx-10">
        <Detail icon={<Flag className="h-4 w-4" />} label="Course" value={courseName} />
        <Detail icon={<CalendarDays className="h-4 w-4" />} label="When" value={dateLabel} />
        <Detail icon={<Users className="h-4 w-4" />} label="Golfers" value={golfersLabel} />
        {packageLabel && (
          <Detail icon={<Mail className="h-4 w-4" />} label="Package" value={packageLabel} />
        )}
        <div className="flex items-center justify-between bg-[#F3F6F2] px-4 py-3.5">
          <dt className="text-sm font-semibold text-slate-700">Total (pay at the course)</dt>
          <dd className="text-lg font-extrabold text-slate-900">{total}</dd>
        </div>
      </dl>

      {/* What happens next */}
      <div className="mx-6 mt-6 rounded-2xl bg-slate-50 px-5 py-4 text-sm text-slate-600 sm:mx-10">
        <p className="mb-2 font-semibold text-slate-800">What happens next</p>
        <ol className="list-inside list-decimal space-y-1">
          <li>The course reviews your request.</li>
          <li>You get a confirmation email.</li>
          <li>Arrive 20 minutes before your tee time and check in at the pro shop.</li>
        </ol>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 px-6 pb-8 pt-6 sm:flex-row sm:px-10">
        <Link
          href={bookingsHref}
          className="flex flex-1 items-center justify-center rounded-2xl bg-[#1F4D36] px-6 py-3.5 font-semibold text-white
            shadow-md shadow-[#1F4D36]/20 transition hover:bg-[#256343]"
        >
          View my bookings
        </Link>
        {onBookAnother && (
          <button
            type="button"
            onClick={onBookAnother}
            className="flex flex-1 items-center justify-center rounded-2xl border border-slate-200 px-6 py-3.5 font-semibold
              text-slate-800 transition hover:bg-slate-50"
          >
            Book another tee time
          </button>
        )}
      </div>
    </div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3F6F2] text-[#1F4D36]">
        {icon}
      </span>
      <dt className="w-20 shrink-0 text-sm text-slate-500">{label}</dt>
      <dd className="text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}