"use client";

import { Users } from "lucide-react";
import QuantityStepper from "./quantity-stepper";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

/**
 * Drop this into the "Course & golfers" step.
 * Stacks on phones, sits side by side from `sm` up.
 * The stepper buttons are 36px on phones and 40px on larger screens.
 */
export default function GolfersField({ value, onChange, min = 1, max = 4 }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D9E8DD] text-[#1F4D36]">
          <Users className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="font-semibold text-slate-900">Number of golfers</p>
          <p className="text-sm text-slate-600">
            Use + and − to change. Up to {max} golfers per tee time.
          </p>
        </div>
      </div>

      <QuantityStepper
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        label="golfer"
        variant="green"
        size="md"
        className="self-start sm:self-auto"
        classNames={{
          // tailwind-merge lets these override the md size on small screens only
          button: "h-9 w-9 sm:h-10 sm:w-10",
          value: "w-8 text-base sm:w-10 sm:text-lg",
        }}
      />
    </div>
  );
}