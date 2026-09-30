"use client";

import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "radix-ui/toggle-group";

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

export default function TeeTimePicker({
  value,
  onChange,
  disabled,
  times = DEFAULT_TIMES,
  unavailable = [],
  error,
}: TeeTimePickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label>Tee time</Label>
      {disabled ? (
        <p className="rounded-sm border border-dashed border-neutral-300 px-3 py-4 text-center text-sm text-neutral-500">
          Choose a date first to see open tee times.
        </p>
      ) : (
        <ToggleGroup
          type="single"
          value={value}
          onValueChange={(v) => v && onChange(v)}
          className="grid grid-cols-3 gap-2 sm:grid-cols-4"
        >
          {times.map((t) => {
            const taken = unavailable.includes(t);
            return (
              <ToggleGroupItem
                key={t}
                value={t}
                disabled={taken}
                aria-label={to12h(t)}
                className="h-9 rounded-sm border border-neutral-200 text-xs data-[state=on]:border-[#10B759] data-[state=on]:bg-[#10B759] data-[state=on]:text-white disabled:line-through"
              >
                {to12h(t)}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export { to12h };