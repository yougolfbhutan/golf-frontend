"use client";

import { Check, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type BookingStep = {
  label: string;
  title: string;
  help: string;
  /** shown when the user can't continue yet; leave empty on the last step */
  todo?: string;
};

export const DEFAULT_BOOKING_STEPS: BookingStep[] = [
  {
    label: "Course & golfers",
    title: "Choose your course and how many are playing",
    help: "Pick the golf course, then use the + and − buttons to set the number of golfers.",
    todo: "Select a course and at least 1 golfer to continue.",
  },
  {
    label: "Tee time",
    title: "Pick a date and tee time",
    help: "Choose a day on the calendar, then tap one of the available times. Greyed-out days are closed.",
    todo: "Select a date and a tee time to continue.",
  },
  {
    label: "Accessories",
    title: "Choose your package",
    help: "Packages add extras like carts, caddies or meals. Choose the one that suits your group.",
    todo: "Select a package to continue.",
  },
  {
    label: "Review & pay",
    title: "Check your booking and pay",
    help: "Make sure everything looks right. Use Edit next to any section to change it. Nothing is charged until you pay.",
  },
];

type Props = {
  step: number; // 1-based
  canContinue: boolean;
  /** only called for steps the user has already completed */
  onGoToStep: (step: number) => void;
  /** optional — falls back to DEFAULT_BOOKING_STEPS */
  steps?: BookingStep[];
};

export default function BookingGuide({
  step,
  canContinue,
  onGoToStep,
  steps = DEFAULT_BOOKING_STEPS,
}: Props) {
  const total = steps.length;
  if (total === 0) return null;

  // keep step inside 1..total so a bad value can't crash the page
  const safeStep = Math.min(Math.max(step, 1), total);
  const current = steps[safeStep - 1];
  const isReview = safeStep === total;

  return (
    <section aria-label="Booking progress" className="mb-5 space-y-4">
      {/* ---- mobile: compact progress bar ---- */}
      <div className="sm:hidden">
        <div className="mb-2 flex items-baseline justify-between text-sm">
          <span className="font-semibold text-slate-900">
            Step {safeStep} of {total}
          </span>
          <span className="text-slate-600">{current.label}</span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={safeStep}
          aria-label={`Step ${safeStep} of ${total}`}
          className="flex gap-1.5"
        >
          {steps.map((s, i) => (
            <span
              key={`${i}-${s.label}`}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i + 1 <= safeStep ? "bg-[#1F4D36]" : "bg-slate-300",
              )}
            />
          ))}
        </div>
      </div>

      {/* ---- tablet / desktop: full stepper ---- */}
      <ol className="hidden items-center sm:flex">
        {steps.map((s, i) => {
          const n = i + 1;
          const done = n < safeStep;
          const active = n === safeStep;
          return (
            <li
              key={`${i}-${s.label}`}
              className={cn("flex items-center", n < total && "flex-1")}
            >
              <button
                type="button"
                disabled={!done}
                onClick={() => onGoToStep(n)}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "group flex items-center gap-2.5 rounded-full py-1 pr-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4D36]/40",
                  done ? "cursor-pointer" : "cursor-default",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                    done && "bg-[#1F4D36] text-white group-hover:bg-[#173a29]",
                    active && "bg-[#1F4D36] text-white ring-4 ring-[#1F4D36]/20",
                    !done && !active && "bg-white text-slate-500 ring-1 ring-slate-300",
                  )}
                >
                  {done ? <Check className="h-4 w-4" aria-hidden /> : n}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    active ? "font-semibold text-slate-900" : "text-slate-600",
                    done && "group-hover:underline underline-offset-4",
                  )}
                >
                  {s.label}
                </span>
              </button>
              {n < total && (
                <span
                  aria-hidden
                  className={cn(
                    "mx-3 h-0.5 flex-1 rounded-full",
                    done ? "bg-[#1F4D36]" : "bg-slate-300",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* ---- instructions: what to do on this step ---- */}
      {/* <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h1 className="text-lg font-bold leading-snug text-slate-900 sm:text-xl">
          {current.title}
        </h1>
        <p className="mt-1 max-w-prose text-sm text-slate-600 sm:text-base">
          {current.help}
        </p>

        {!isReview && (
          <p
            role="status"
            aria-live="polite"
            className={cn(
              "mt-3 flex items-start gap-2 rounded-xl px-3 py-2 text-sm font-medium",
              canContinue
                ? "bg-emerald-50 text-emerald-900"
                : "bg-amber-50 text-amber-900",
            )}
          >
            {canContinue ? (
              <>
                <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                All set. Press Continue when you&rsquo;re ready.
              </>
            ) : (
              <>
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {current.todo || "Complete this step to continue."}
              </>
            )}
          </p>
        )}
      </div> */}
    </section>
  );
}