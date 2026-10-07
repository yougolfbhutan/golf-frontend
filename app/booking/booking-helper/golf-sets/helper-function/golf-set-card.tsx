/**
 * golf-set-card.tsx
 * -----------------
 * One golf set card (styled like the accessory cards).
 * Only one set can be chosen: the parent decides what happens on select.
 */
"use client";

import Image from "next/image";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GolfSet } from "../interface";

type GolfSetCardProps = {
  set: GolfSet;
  price: string; // already formatted, e.g. "Nu 500"
  selected: boolean;
  recommended?: boolean;
  onToggle: () => void;
};

export function GolfSetCard({
  set,
  price,
  selected,
  recommended,
  onToggle,
}: GolfSetCardProps) {
  const isPremium = set.tier === "premium";

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-1.5",
        "shadow-sm transition-all duration-300",
        selected
          ? "border-green-600 bg-green-50/40 shadow-md ring-2 ring-green-600/10"
          : "border-border hover:-translate-y-0.5 hover:border-green-600/40 hover:shadow-lg",
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        {set.url ? (
          <Image
            src={set.url}
            alt={set.name}
            fill
            sizes="280px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </span>
        )}

        <div className="absolute left-2 top-2 flex gap-1">
          {isPremium && (
            <span className="rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
              Premium
            </span>
          )}
          {recommended && (
            <span className="rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
              Recommended
            </span>
          )}
        </div>

        {selected && (
          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white shadow ring-2 ring-white/70">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        )}

        <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-800 shadow-sm backdrop-blur">
          Golf Set
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col px-2 pb-2 pt-3">
        <h4 className="line-clamp-1 text-sm font-bold leading-tight">
          {set.name}
        </h4>

        {/* Always reserves 2 lines so cards stay equal height */}
        <p className="mt-1 line-clamp-2 min-h-[2rem] text-xs leading-4 text-muted-foreground">
          {set.description || "No description available."}
        </p>

        {/* Price + action */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="text-base font-extrabold tracking-tight text-green-700">
            {price}
          </span>

          <button
            type="button"
            onClick={onToggle}
            aria-pressed={selected}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold",
              "transition-all duration-200 active:scale-95",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2",
              selected
                ? "bg-green-100 text-green-800 ring-1 ring-green-600/30 hover:bg-green-200"
                : "bg-green-600 text-white shadow shadow-green-600/25 hover:bg-green-700",
            )}
          >
            {selected ? (
              <>
                <Check className="h-3.5 w-3.5" strokeWidth={3} /> Added
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" strokeWidth={3} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}