"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@heroui/react";
import { cn } from "@/lib/utils";
import { AccessoryCard } from "../golf-accessories-card";
import { type ItemGroup, groupByItem } from "../golf-options";
import type { ItemVariant } from "../interface";
import { HorizontalSlider } from "../../horizontal-slider";

export type TierValue = "standard" | "premium";

type AccessoriesSectionProps = {
  variants: ItemVariant[];
  /** The package chosen by the parent (Standard / Premium). No tabs here any more. */
  tier: TierValue;
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  selectedIds: string[];
  onSelect: (group: ItemGroup, variantId: string | undefined) => void;
  /** qty = how many; the price returned is unit price x qty */
  getPrice: (variant: ItemVariant, qty?: number) => string;
  /** Quantity per variant id, e.g. { "12": 3 }. Missing = 1 */
  quantities: Record<string, number>;
  /** Hard limit per accessory (also limited by stock) */
  maxQuantity: number;
  /** qty < 1 removes the accessory */
  onQuantityChange: (variantId: string, qty: number) => void;
};

const GRID = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

// "golf-ball" -> "Golf Ball"
const formatCategory = (slug: string) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

// Variants with no tier show under both packages
const matchesTier = (v: ItemVariant, tier: TierValue) =>
  !v.tier || v.tier === tier;

// How many of this variant can be rented: the stock, capped by maxQuantity
const limitFor = (v: ItemVariant | undefined, max: number): number => {
  const stock =
    (v as { quantity?: number } | undefined)?.quantity ??
    (v as { stock?: number } | undefined)?.stock;
  return typeof stock === "number" && stock > 0 ? Math.min(stock, max) : max;
};

export function AccessoriesSection({
  variants,
  tier,
  isPending,
  isError,
  onRetry,
  selectedIds,
  onSelect,
  getPrice,
  quantities,
  maxQuantity,
  onQuantityChange,
}: AccessoriesSectionProps) {
  const [category, setCategory] = useState<string>("");

  // 1. One group per item (keeps ALL its variants)
  const allGroups = useMemo(() => groupByItem(variants), [variants]);

  // 2. EVERY category in the data (gloves, golf ball...), same for both packages
  const allCategoryNames = useMemo(() => {
    const names: string[] = [];
    allGroups.forEach((g) => {
      const name = g.item.category.name;
      if (!names.includes(name)) names.push(name);
    });
    return names;
  }, [allGroups]);

  // 3. Apply the package from the parent.
  //    full  = every variant (used when saving)
  //    shown = only the variants of the chosen package (used by the card)
  const tierGroups = useMemo(
    () =>
      allGroups
        .map((group) => ({
          full: group,
          shown: {
            ...group,
            variants: group.variants.filter((v) => matchesTier(v, tier)),
          },
        }))
        .filter(({ shown }) => shown.variants.length > 0),
    [allGroups, tier],
  );

  // 4. Sub-tabs: all categories, with the item count for THIS package (can be 0)
  const categories = useMemo(
    () =>
      allCategoryNames.map((name) => ({
        name,
        count: tierGroups.filter((g) => g.shown.item.category.name === name)
          .length,
      })),
    [allCategoryNames, tierGroups],
  );

  const activeCategory = allCategoryNames.includes(category)
    ? category
    : (allCategoryNames[0] ?? "");

  // 5. Items of the active category in the chosen package
  const visible = useMemo(
    () =>
      tierGroups.filter(
        ({ shown }) => shown.item.category.name === activeCategory,
      ),
    [tierGroups, activeCategory],
  );

  return (
    <section className="mb-10">
      {isPending && (
        <div className={GRID}>
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-80 rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-amber-50 p-4 text-amber-900">
          <p className="text-sm">We couldn&apos;t load the accessories.</p>
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}

      {!isPending && !isError && (
        <>
          {/* Gloves | Golf Ball ... (follows the package chosen above) */}
          {categories.length > 0 && (
            <div
              role="tablist"
              aria-label="Accessory category"
              className="mb-4 flex flex-wrap gap-2"
            >
              {categories.map(({ name, count }) => {
                const active = name === activeCategory;
                return (
                  <button
                    key={name}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategory(name)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "border-green-600 bg-green-50 text-green-800"
                        : "border-border bg-background text-muted-foreground hover:border-green-600/40 hover:text-foreground",
                    )}
                  >
                    {formatCategory(name)}
                    <span className="text-[10px] opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
          )}

          {visible.length > 0 ? (
            <HorizontalSlider>
              {visible.map(({ full, shown }) => {
                const bookedId = shown.variants
                  .map((v) => String(v.id))
                  .find((id) => selectedIds.includes(id));

                const bookedVariant = shown.variants.find(
                  (v) => String(v.id) === bookedId,
                );

                return (
                  <div
                    key={`${shown.item.id}-${tier}`}
                    className="w-[260px] shrink-0 snap-start sm:w-[280px]"
                  >
                    <AccessoryCard
                      group={shown}
                      selectedVariantId={bookedId}
                      onSelect={(variantId) => onSelect(full, variantId)}
                      getPrice={getPrice}
                      quantity={bookedId ? (quantities[bookedId] ?? 1) : 0}
                      maxQuantity={limitFor(bookedVariant, maxQuantity)}
                      onQuantityChange={(qty) => {
                        if (bookedId) onQuantityChange(bookedId, qty);
                      }}
                    />
                  </div>
                );
              })}
            </HorizontalSlider>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              No {tier} {formatCategory(activeCategory).toLowerCase()} available
              yet. Try the other package.
            </p>
          )}
        </>
      )}
    </section>
  );
}