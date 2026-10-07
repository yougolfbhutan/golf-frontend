import { Check } from "lucide-react";
import { STEP_NAMES } from "./booking-data";
import { cn } from "@/lib/utils";

export function ProgressSteps({ current }: { current: number }) {
  const steps = [1, 2, 3, 4, 5];
  return (
    <ol aria-label="Booking steps" className="mb-6 grid grid-cols-5 gap-1">
      {steps.map((s) => {
        const done = s < current;
        const active = s === current;
        return (
          <li
            key={s}
            aria-current={active ? "step" : undefined}
            className={cn(
              "relative flex flex-col items-center gap-1.5 text-center text-sm font-bold sm:text-base",
              active ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {s > 1 && (
              <span
                aria-hidden="true"
                className={cn("absolute right-1/2 top-[18px] h-1 w-full sm:top-[21px]", s <= current ? "bg-primary" : "bg-border")}
              />
            )}
            <span
              className={cn(
                "relative z-10 grid size-9 place-items-center rounded-full border-[3px] bg-background text-sm sm:size-11 sm:text-base",
                done && "border-primary bg-primary text-primary-foreground",
                active && "border-primary text-foreground shadow-[0_0_0_5px_var(--accent)]",
                !done && !active && "border-border",
              )}
            >
              {done ? <Check className="size-5" aria-hidden="true" /> : s}
              {done && <span className="sr-only">Step {s} complete</span>}
            </span>
            <span className="text-xs sm:text-base">{STEP_NAMES[s]}</span>
          </li>
        );
      })}
    </ol>
  );
}
