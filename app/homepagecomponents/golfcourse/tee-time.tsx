"use client";

import { ToggleGroup, ToggleGroupItem } from "radix-ui/toggle-group";
import { cn } from "@/lib/utils";

const DEFAULT_TIMES = [
  "06:30", "07:00", "07:30", "08:00", "08:30", "09:00",
  "09:30", "10:00", "10:30", "11:00", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30",
];

interface TeeTimePickerProps {
  value: string;
  onChange: (time: string) => void;
  disabled?: boolean;
  times?: string[];
  /** Slots already taken for the chosen date */
  unavailable?: string[];
  error?: string;
}

function to12h(t: string) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${((h + 11) % 12) + 1}:${m.toString().padStart(2, "0")} ${suffix}`;
}

/** "13:30" -> "1:30" (short label, the row label shows AM/PM) */
function short(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${m.toString().padStart(2, "0")}`;
}

export default function TeeTimePicker({
  value,
  onChange,
  disabled,
  times = DEFAULT_TIMES,
  unavailable = [],
  error,
}: TeeTimePickerProps) {
  const groups = [
    { label: "AM", items: times.filter((t) => Number(t.split(":")[0]) < 12) },
    { label: "PM", items: times.filter((t) => Number(t.split(":")[0]) >= 12) },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Tee time</span>
        {value && !disabled && (
          <span className="rounded-full bg-[#10B759]/10 px-2 py-0.5 text-[11px] font-semibold text-[#0b8a43]">
            {to12h(value)}
          </span>
        )}
      </div>

      {disabled ? (
        <p className="text-xs text-muted-foreground">Choose a date first.</p>
      ) : (
        <div className="space-y-1">
          {groups.map(({ label, items }) => (
            <div key={label} className="flex items-start gap-1.5">
              <span className="w-5 shrink-0 pt-[5px] text-[10px] font-semibold uppercase text-muted-foreground">
                {label}
              </span>
              <ToggleGroup
                type="single"
                value={value}
                onValueChange={(v) => v && onChange(v)}
                aria-label={`${label} tee times`}
                className="flex flex-1 flex-wrap gap-1"
              >
                {items.map((t) => (
                  <ToggleGroupItem
                    key={t}
                    value={t}
                    disabled={unavailable.includes(t)}
                    aria-label={to12h(t)}
                    className={cn(
                      "h-6 w-11 rounded-md border text-[11px] font-medium tabular-nums transition-colors",
                      "hover:border-[#10B759]/60 hover:bg-[#10B759]/5",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B759]/50",
                      "data-[state=on]:border-[#10B759] data-[state=on]:bg-[#10B759] data-[state=on]:text-white",
                      "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-muted disabled:text-muted-foreground disabled:line-through disabled:hover:bg-muted",
                    )}
                  >
                    {short(t)}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export { to12h };