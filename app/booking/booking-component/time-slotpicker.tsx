"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { TeeTimeStatus } from "../booking-steps/Tee-time/interface/interface";

export type TeeSlot = {
  time: string; // "07:00"
  spotsLeft: number;
  status: TeeTimeStatus; // decided by the backend
};

type Props = {
  slots: TeeSlot[];
  value: string | null;
  onChange?: (time: string | null) => void;
  /** at or below this many spots left, show the amber "filling up" colour */
  fillingUpAt?: number;
};

function spotsLabel(s: TeeSlot) {
  if (s.status !== "AVAILABLE") return s.spotsLeft <= 0 ? "Full" : "Unavailable";
  return `${s.spotsLeft} spot${s.spotsLeft === 1 ? "" : "s"} left`;
}

export default function TimeSlotPicker({
  slots,
  value,
  fillingUpAt = 2,
  onChange,
}: Props) {
  if (slots.length === 0) return null;

  return (
    <div className="space-y-6">
      <ToggleGroup
        type="single"
        value={value ?? ""}
        onValueChange={(v) => onChange?.(v || null)}
        spacing={8}
        className="grid w-full grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6"
      >
        {slots.map((s) => {
          // the backend decides: anything not AVAILABLE is disabled
          const unavailable = s.status !== "AVAILABLE";
          const filling = !unavailable && s.spotsLeft <= fillingUpAt;

          return (
            <ToggleGroupItem
              key={s.time}
              value={s.time}
              disabled={unavailable}
              aria-label={`${s.time}, ${spotsLabel(s)}`}
              className={cn(
                "h-auto w-full flex-col gap-0.5 rounded-xl border border-slate-200 bg-white px-2 py-2.5",
                "hover:border-slate-400 hover:bg-white",
                "data-[state=on]:border-[#1F4D36] data-[state=on]:bg-[#D9E8DD] data-[state=on]:shadow-sm",
                unavailable &&
                  "border-slate-200 bg-[#E8EEE9] hover:border-slate-200 hover:bg-[#E8EEE9] disabled:opacity-100",
              )}
            >
              <span
                className={cn(
                  "text-sm font-bold tabular-nums",
                  unavailable && "text-slate-500 line-through",
                )}
              >
                {s.time}
              </span>
              <span
                className={cn(
                  "text-[11px] font-medium",
                  unavailable
                    ? "text-slate-500"
                    : filling
                      ? "text-amber-600"
                      : "text-emerald-700",
                )}
              >
                {spotsLabel(s)}
              </span>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
}