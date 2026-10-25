"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { BULK_LAST_STEP, BULK_STEPS } from "../bulk-types/bulk-types";

/** Title + progress bar. Only finished steps can be clicked. */
export function BulkGuide({
  step,
  onGoToStep,
}: {
  step: number;
  onGoToStep: (n: number) => void;
}) {
  return (
    <div className="mb-2">
      <h1 className="text-2xl font-bold text-slate-900">
        Bulk booking for tour operators
      </h1>
      <p className="mt-1 text-slate-600">
        Book a group of golfers in {BULK_LAST_STEP} steps.
      </p>

      <ol className="mt-4 flex items-center gap-2 text-sm" aria-label="Booking progress">
        {BULK_STEPS.map((label, i) => {
          const n = i + 1;
          const done = n < step;
          const current = n === step;
          return (
            <li key={label} className="flex items-center gap-2">
              <button
                type="button"
                disabled={!done}
                onClick={() => onGoToStep(n)}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 font-semibold transition-colors",
                  current && "bg-[#1F4D36] text-white",
                  done && "bg-emerald-100 text-emerald-900 hover:bg-emerald-200",
                  !done && !current && "bg-white text-slate-500",
                )}
              >
                <span className="grid size-5 place-items-center rounded-full bg-white/25 text-xs">
                  {done ? <Check className="size-3" /> : n}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </button>
              {n < BULK_LAST_STEP && <span className="h-px w-4 bg-slate-300 sm:w-8" />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Back / Next buttons. Next is named after the step it leads to. */
export function BulkNavigation({
  step,
  canContinue,
  onBack,
  onNext,
}: {
  step: number;
  canContinue: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  const nextLabel = step < BULK_LAST_STEP ? BULK_STEPS[step] : null;

  return (
    <div className="flex items-center justify-between gap-3">
      {step > 1 ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1F4D36]"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
      ) : (
        <span />
      )}
      {nextLabel && (
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1F4D36] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#256343] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F4D36] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {nextLabel}
          <ArrowRight className="size-4" />
        </button>
      )}
    </div>
  );
}