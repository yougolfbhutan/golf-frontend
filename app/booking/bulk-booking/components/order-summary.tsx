"use client";

import { CalendarDays, Clock, Users } from "lucide-react";
import { Oswald } from "next/font/google";
import type {
  BookingConfig,
  BookingValues,
  BookingSummary,
} from "@/app/booking/bulk-booking/components/booking-from"; // adjust path

const condensed = Oswald({ subsets: ["latin"], weight: ["500", "600", "700"] });

const formatDate = (iso: string) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function OrderSummary({
  cfg,
  values,
  summary,
}: {
  cfg: BookingConfig;
  values: BookingValues;
  summary: BookingSummary;
}) {
  const fmt = (n: number) => `${cfg.currency}${n.toLocaleString()}`;

  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">
        {/* green header */}
        <div className="bg-gradient-to-br from-[#2DBE6C] to-[#0E9F4F] p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
            Order summary
          </p>
          <h3 className={`${condensed.className} mt-1 text-2xl uppercase leading-tight`}>
            {cfg.summaryTitle}
          </h3>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(values.date)}
            </span>
            {values.time && (
              <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">
                <Clock className="h-3.5 w-3.5" />
                {values.time}
              </span>
            )}
            <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">
              <Users className="h-3.5 w-3.5" />
              {summary.people} {cfg.noun}
            </span>
          </div>
        </div>

        {/* who is playing */}
        <div className="px-6 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Players
          </p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {cfg.tiers
              .filter((t) => (values.counts[t.id] ?? 0) > 0)
              .map((t) => (
                <li key={t.id} className="flex justify-between text-slate-700">
                  <span>{t.label}</span>
                  <span className="font-semibold text-slate-900">{values.counts[t.id]}</span>
                </li>
              ))}
          </ul>
        </div>

        {/* price lines */}
        {summary.lines.length > 0 && (
          <div className="mx-6 mt-5 border-t border-dashed border-slate-300 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Charges
            </p>
            <ul className="mt-2 space-y-2 text-sm">
              {summary.lines.map((l) => (
                <li key={l.key} className="flex justify-between gap-4">
                  <span className={l.deduction ? "text-[#0E9F4F]" : "text-slate-600"}>
                    {l.label}
                  </span>
                  <span
                    className={`shrink-0 font-semibold ${
                      l.deduction ? "text-[#0E9F4F]" : "text-slate-900"
                    }`}
                  >
                    {l.deduction ? "−" : ""}
                    {fmt(l.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* total */}
        <div className="mt-5 flex items-end justify-between bg-slate-50 px-6 py-5">
          <span className="text-sm font-semibold text-slate-600">Total to pay</span>
          <span className={`${condensed.className} text-4xl text-slate-900`}>
            {fmt(summary.total)}
          </span>
        </div>
      </div>
    </aside>
  );
}