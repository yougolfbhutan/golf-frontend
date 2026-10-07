/**
 * golf-sets-section.tsx
 * ---------------------
 * The "Golf sets" part of the page:
 *   - loading skeletons
 *   - error message + "Try again" button
 *   - a horizontal slider of GolfSetCards
 *
 * Two ways to use it:
 *   1. Pick ONE (old way):   selectedId + onSelect
 *   2. Pick MANY (new way):  selectedIds + onToggle (+ isDisabled to lock cards)
 *
 * It does NOT fetch or filter by itself – the parent passes everything in.
 */
"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@heroui/react";
import { cn } from "@/lib/utils";
import { HorizontalSlider } from "../../horizontal-slider";
import { GolfSetCard } from "./golf-set-card";
import type { GolfSet } from "../interface";

type GolfSetsSectionProps = {
  sets: GolfSet[]; // already filtered by tier + audience
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  getPrice: (set: GolfSet) => string;
  isRecommended?: boolean;

  /** Pick ONE: undefined = no set chosen */
  selectedId?: string;
  onSelect?: (id: string | undefined) => void;

  /** Pick MANY: ids of every chosen set, and a toggle for one set */
  selectedIds?: string[];
  onToggle?: (id: string) => void;
  /** Return true to lock a card (e.g. every golfer already has a set) */
  isDisabled?: (set: GolfSet) => boolean;
};

const GRID = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

export function GolfSetsSection({
  sets,
  isPending,
  isError,
  onRetry,
  selectedId,
  onSelect,
  selectedIds,
  onToggle,
  isDisabled,
  getPrice,
  isRecommended,
}: GolfSetsSectionProps) {
  const isSelected = (id: string) =>
    selectedIds ? selectedIds.includes(id) : selectedId === id;

  const toggle = (id: string, selected: boolean) => {
    if (onToggle) return onToggle(id);
    onSelect?.(selected ? undefined : id);
  };

  return (
    <section className="mb-10">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold">Golf sets</h3>
        {!isPending && !isError && (
          <span className="text-sm text-muted-foreground">
            {sets.length} {sets.length === 1 ? "set" : "sets"}
          </span>
        )}
      </div>

      {/* 1. Loading */}
      {isPending && (
        <div className={GRID}>
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-80 rounded-xl" />
          ))}
        </div>
      )}

      {/* 2. Error */}
      {isError && (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-amber-50 p-4 text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
          <p className="text-sm">We couldn&apos;t load the golf sets.</p>
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}

      {/* 3. Data */}
      {!isPending && !isError && (
        <>
          {sets.length > 0 ? (
            <HorizontalSlider>
              {sets.map((set) => {
                const id = String(set.id);
                const selected = isSelected(id);
                const disabled = !selected && !!isDisabled?.(set);
                return (
                  <div
                    key={set.id}
                    aria-disabled={disabled || undefined}
                    // a locked card can't be clicked or reached with the keyboard
                    onClickCapture={(e) => {
                      if (!disabled) return;
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onKeyDownCapture={(e) => {
                      if (!disabled) return;
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={cn(
                      "w-[260px] shrink-0 snap-start transition-opacity sm:w-[280px]",
                      disabled && "pointer-events-none opacity-50 grayscale",
                    )}
                  >
                    <GolfSetCard
                      set={set}
                      price={getPrice(set)}
                      selected={selected}
                      recommended={isRecommended}
                      // Tap = choose, tap again = remove
                      onToggle={() => toggle(id, selected)}
                    />
                  </div>
                );
              })}
            </HorizontalSlider>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              No sets match this choice. Try another tab.
            </p>
          )}
        </>
      )}
    </section>
  );
}