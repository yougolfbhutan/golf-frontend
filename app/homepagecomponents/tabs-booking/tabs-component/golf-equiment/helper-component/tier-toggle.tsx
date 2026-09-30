"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { GolfSet } from "../interface";

export type Tier = "premium" | "regular";

const TIER_META: Record<
  Tier,
  { emoji: string; label: string; caption: string }
> = {
  premium: { emoji: "✨", label: "Premium", caption: "Brand new sets" },
  regular: { emoji: "🩶", label: "Regular", caption: "Good condition used" },
};

interface TierStat {
  key: Tier;
  price: number | null; // null when no set exists for this tier
  count: number;
}

function deriveTierStats(sets: GolfSet[]): TierStat[] {
  return (Object.keys(TIER_META) as Tier[]).map((tier) => {
    const matching = sets.filter((s) => s.tier === tier);
    const price =
      matching.length > 0 ? Math.min(...matching.map((s) => s.price)) : null;
    return { key: tier, price, count: matching.length };
  });
}

export function TierToggle({
  sets, // sets already filtered by category, both tiers included
  value,
  onChange,
}: {
  sets: GolfSet[];
  value: Tier;
  onChange: (value: Tier) => void;
}) {
  // Derived from real data, not hardcoded — price and availability always
  // match what's actually in `sets` for the currently selected category.
  const tierStats = useMemo(() => deriveTierStats(sets), [sets]);

  return (
    <div className="mb-6 grid grid-cols-2 gap-3">
      {tierStats.map((stat) => {
        const meta = TIER_META[stat.key];
        const isActive = value === stat.key;
        const isDisabled = stat.count === 0;

        return (
          <button
            key={stat.key}
            type="button"
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange(stat.key)}
            className={cn(
              "rounded-lg border px-4 py-3 text-center transition-colors",
              isActive
                ? "bg-emerald-950 text-amber-50"
                : "bg-muted/40 text-emerald-950",
              isDisabled && "cursor-not-allowed opacity-40",
            )}
          >
            <p className="text-sm font-semibold">
              {meta.emoji} {meta.label}
            </p>
            <p className="text-lg font-bold">
              {stat.price !== null ? `$${stat.price} / round` : "Unavailable"}
            </p>
            <p
              className={cn(
                "text-xs",
                isActive ? "text-amber-100/70" : "text-muted-foreground",
              )}
            >
              {stat.count > 0 ? meta.caption : "No sets in this category"}
            </p>
          </button>
        );
      })}
    </div>
  );
}