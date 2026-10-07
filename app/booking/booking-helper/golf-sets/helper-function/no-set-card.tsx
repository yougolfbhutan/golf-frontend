/**
 * no-set-card.tsx
 * ---------------
 * "I'll bring my own clubs" option, so the user can un-choose a set.
 * Must be rendered inside the same <RadioGroup> as the GolfSetCards.
 */
"use client";

import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export const NO_SET = "none";

export function NoSetCard({ selected }: { selected: boolean }) {
  return (
    <label
      htmlFor="golf-set-none"
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed p-4",
        selected ? "border-primary bg-primary/5" : "hover:border-primary/50",
      )}
    >
      <RadioGroupItem id="golf-set-none" value={NO_SET} />
      <span>
        <span className="block font-bold">No set needed</span>
        <span className="text-sm text-muted-foreground">
          I&apos;ll bring my own clubs
        </span>
      </span>
    </label>
  );
}