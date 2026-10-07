"use client";

/**
 * extras-section.tsx
 * ------------------
 * Optional extras shown at the bottom of the Equipment step.
 * Nothing is ticked by default - the golfer chooses.
 * Ticking a box adds the key to state.addons, and the Scorecard
 * picks it up through bookingLines()/bookingTotal().
 *
 * Place at: steps/extras-section.tsx
 */
import { cn } from "@/lib/utils";
import { type ExtraKey, ADDONS } from "../booking/booking-data";
import { type StepProps, addonList, formatMoney, addonPrice } from "../booking/booking-logic";

export function ExtrasSection({ state, update }: Pick<StepProps, "state" | "update">) {
  // Coaching for everyone, companion for visitors only
  const extras = addonList(state);
  if (extras.length === 0) return null;

  const toggle = (key: ExtraKey, checked: boolean) => {
    const without = state.addons.filter((a) => a !== key);
    update({ addons: checked ? [...without, key] : without });
  };

  return (
    <section aria-labelledby="extras-title" className="mt-10">
      <h3 id="extras-title" className="text-lg font-semibold">
        Extras
      </h3>
      <p className="mb-4 mt-1 text-sm text-muted-foreground">
        Optional. Tick what you&apos;d like to add.
      </p>

      <ul className="grid gap-3">
        {extras.map((key) => {
          const addon = ADDONS[key];
          const checked = state.addons.includes(key);
          const id = `extra-${key}`;

          return (
            <li key={key}>
              <label
                htmlFor={id}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-colors",
                  "focus-within:ring-2 focus-within:ring-[#10B759]/50",
                  checked
                    ? "border-[#10B759] bg-[#10B759]/5"
                    : "border-border hover:bg-muted/50",
                )}
              >
                <input
                  id={id}
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => toggle(key, e.target.checked)}
                  className="mt-1 size-5 shrink-0 accent-[#10B759]"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{addon.name}</span>
                  <span className="block text-sm text-muted-foreground">
                    {addon.description}
                  </span>
                </span>
                <span className="shrink-0 text-right text-sm font-semibold">
                  {formatMoney(state.who, addonPrice(state, key))}
                  <span className="block text-xs font-normal text-muted-foreground">
                    per golfer
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}