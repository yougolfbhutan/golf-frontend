"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export type TeeSlot = { time: string; spotsLeft: number };

type Props = {
  slots: TeeSlot[];
  golfers: number;
  value: string | null;
  onChange?: (time: string | null) => void;
  /** at or below this many spots left, show the amber "filling up" colour */
  fillingUpAt?: number;
};

function spotsLabel(spotsLeft: number, golfers: number) {
  if (spotsLeft <= 0) return "Full";
  if (spotsLeft < golfers) return `Only ${spotsLeft} left`;
  return `${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left`;
}

export default function TimeSlotPicker({
  slots,
  golfers,
  value,
  fillingUpAt = 2,
  onChange,
}: Props) {
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
          const unavailable = s.spotsLeft < golfers;
          const filling = !unavailable && s.spotsLeft <= fillingUpAt;

          return (
            <ToggleGroupItem
              key={s.time}
              value={s.time}
              disabled={unavailable}
              aria-label={`${s.time}, ${spotsLabel(s.spotsLeft, golfers)}`}
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
                {spotsLabel(s.spotsLeft, golfers)}
              </span>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>

      {/* legend */}
      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-600" /> Open
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" /> Filling up
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-300" /> Full or too few
          spots
        </span>
      </div>
    </div>
  );
}
