"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { imageOf, isInStock, type ItemGroup } from "../golf-options";
import type { ItemVariant } from "../interface";

type AccessoryCardProps = {
  group: ItemGroup;
  selectedVariantId?: string;
  onSelect: (variantId: string | undefined) => void;
  /** qty = how many; the price returned is unit price x qty */
  getPrice: (variant: ItemVariant, qty?: number) => string;
  /** How many the user wants (only used once the item is added) */
  quantity: number;
  /** Highest quantity allowed (the section already limits it by stock) */
  maxQuantity: number;
  /** Pressing "−" at 1 sends 0, which removes the item */
  onQuantityChange: (qty: number) => void;
};

// ---------- Which options does each kind of item have? ----------
type OptionKey = "tier" | "size" | "hand" | "color";

const OPTION_LABELS: Record<OptionKey, string> = {
  tier: "Tier",
  size: "Size",
  hand: "Hand",
  color: "Color",
};

// Field names on ItemVariant (first one found is used).
// Change these if your API uses different names.
const FIELDS: Record<OptionKey, string[]> = {
  tier: ["tier"],
  size: ["size"],
  hand: ["hand", "handedness"],
  color: ["color", "colour"],
};

// Gloves: tier + size + hand + color. Everything else (golf ball...): tier only.
const optionKeysFor = (categoryName: string): OptionKey[] =>
  /glove/i.test(categoryName) ? ["tier", "size", "hand", "color"] : ["tier"];

const valueOf = (v: ItemVariant, key: OptionKey): string | undefined => {
  const record = v as unknown as Record<string, unknown>;
  for (const field of FIELDS[key]) {
    const raw = record[field];
    if (raw != null && raw !== "") return String(raw);
  }
  return undefined;
};

type Picked = Partial<Record<OptionKey, string>>;

const pickedFrom = (v: ItemVariant, keys: OptionKey[]): Picked =>
  Object.fromEntries(keys.map((k) => [k, valueOf(v, k)])) as Picked;

// Find the variant that best matches the wanted options.
// `lock` = the option the user just clicked; it must match if possible.
function resolve(
  variants: ItemVariant[],
  wanted: Picked,
  keys: OptionKey[],
  lock?: OptionKey,
): ItemVariant {
  let pool = lock
    ? variants.filter((v) => valueOf(v, lock) === wanted[lock])
    : variants;
  if (pool.length === 0) pool = variants;

  const score = (v: ItemVariant) =>
    keys.filter((k) => valueOf(v, k) === wanted[k]).length * 2 +
    (isInStock(v) ? 1 : 0);

  return pool.reduce((best, v) => (score(v) > score(best) ? v : best), pool[0]);
}

const pretty = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

// "right" -> "Right hand", "premium" -> "Premium"
const describe = (key: OptionKey, value: string) =>
  key === "hand" ? `${pretty(value)} hand` : pretty(value);

const formatCategory = (slug: string) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export function AccessoryCard({
  group,
  selectedVariantId,
  onSelect,
  getPrice,
  quantity,
  maxQuantity,
  onQuantityChange,
}: AccessoryCardProps) {
  const { item, variants } = group;
  const checked = selectedVariantId !== undefined;
  const optionKeys = optionKeysFor(item.category.name);

  const selectedVariant = variants.find(
    (v) => String(v.id) === selectedVariantId,
  );

  // What the user has picked on this card
  const [picked, setPicked] = useState<Picked>(() =>
    pickedFrom(
      selectedVariant ?? resolve(variants, {}, optionKeys),
      optionKeys,
    ),
  );

  const current = selectedVariant ?? resolve(variants, picked, optionKeys);

  const inStock = isInStock(current);
  const image = imageOf(current);
  const disabled = !inStock && !checked;
  const isPremium = current.tier === "premium";

  // Stock left for the variant shown on the card
  const stock: number | undefined =
    (current as { quantity?: number }).quantity ??
    (current as { stock?: number }).stock;

  // One row per option. Rows with a single value are shown but not clickable.
  const rows = optionKeys
    .map((key) => ({
      key,
      values: [
        ...new Set(
          variants.map((v) => valueOf(v, key)).filter((x): x is string => !!x),
        ),
      ],
    }))
    .filter((row) => row.values.length > 0);

  // "Premium · Large · Right hand · Black"
  const summary = optionKeys
    .map((key) => {
      const value = valueOf(current, key);
      return value ? describe(key, value) : null;
    })
    .filter(Boolean)
    .join(" · ");

  const chooseOption = (key: OptionKey, value: string) => {
    const next = resolve(variants, { ...picked, [key]: value }, optionKeys, key);
    setPicked(pickedFrom(next, optionKeys));
    // If already added, swap the booked variant too
    if (checked) onSelect(String(next.id));
  };

  const add = () => onSelect(String(current.id));

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-1.5",
        "shadow-sm transition-all duration-300",
        checked
          ? "border-green-600 bg-green-50/40 shadow-md ring-2 ring-green-600/10"
          : "border-border hover:-translate-y-0.5 hover:border-green-600/40 hover:shadow-lg",
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        {image ? (
          <Image
            src={image}
            alt={item.name}
            fill
            sizes="260px"
            className={cn(
              "object-cover transition-transform duration-500 group-hover:scale-110",
              !inStock && "grayscale",
            )}
          />
        ) : (
          <span className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </span>
        )}

        <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-800 shadow-sm backdrop-blur">
          {formatCategory(item.category.name)}
        </span>

        {isPremium && (
          <span className="absolute left-2 top-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
            Premium
          </span>
        )}

        {checked && (
          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white shadow ring-2 ring-white/70">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        )}

        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="rounded-full bg-foreground px-3 py-1 text-[11px] font-semibold text-background">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col px-2 pb-2 pt-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="line-clamp-1 text-sm font-bold leading-tight">
            {item.name}
          </h4>

          {inStock && stock !== undefined && (
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                stock <= 5
                  ? "bg-amber-100 text-amber-800"
                  : "bg-green-100 text-green-800",
              )}
            >
              {stock <= 5 ? `Only ${stock} left` : `${stock} in stock`}
            </span>
          )}
        </div>

        <p className="mt-1 line-clamp-2 min-h-[2rem] text-xs leading-4 text-muted-foreground">
          {item.description || "No description available."}
        </p>

        {/* Option pickers */}
        {rows.length > 0 && (
          <div className="mt-3 space-y-2">
            {rows.map(({ key, values }) => {
              const currentValue = valueOf(current, key);
              const single = values.length === 1;

              return (
                <div key={key} className="flex flex-wrap items-center gap-1.5">
                  <span className="w-10 shrink-0 text-[10px] font-semibold uppercase text-muted-foreground">
                    {OPTION_LABELS[key]}
                  </span>

                  {/* COLOR: round swatches */}
                  {key === "color" ? (
                    <>
                      {values.map((value) => {
                        const active = currentValue === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            title={pretty(value)}
                            aria-label={pretty(value)}
                            aria-pressed={active}
                            disabled={single}
                            onClick={() => chooseOption(key, value)}
                            style={{ backgroundColor: value.toLowerCase() }}
                            className={cn(
                              "h-5 w-5 rounded-full border border-black/20 transition",
                              active
                                ? "ring-2 ring-green-600 ring-offset-2"
                                : "hover:scale-110",
                              single && "cursor-default",
                            )}
                          />
                        );
                      })}
                      {currentValue && (
                        <span className="text-[11px] font-medium">
                          {pretty(currentValue)}
                        </span>
                      )}
                    </>
                  ) : (
                    /* TIER / SIZE / HAND: text pills */
                    values.map((value) => {
                      const active = currentValue === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          disabled={single}
                          onClick={() => chooseOption(key, value)}
                          aria-pressed={active}
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors",
                            active
                              ? "border-green-600 bg-green-600 text-white"
                              : "border-border bg-background text-foreground hover:border-green-600/50",
                            single && "cursor-default",
                          )}
                        >
                          {pretty(value)}
                        </button>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* What exactly will be booked */}
        {summary && (
          <p className="mt-2 text-[11px] font-medium text-green-800">
            {summary}
          </p>
        )}

        {/* Price + action */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          {/* Line total once added; unit price underneath when qty > 1 */}
          <div className="flex flex-col leading-tight">
            <span className="text-base font-extrabold tracking-tight text-green-700">
              {getPrice(current, checked ? quantity : 1)}
            </span>
            {checked && quantity > 1 && (
              <span className="text-[10px] text-muted-foreground">
                {getPrice(current, 1)} each
              </span>
            )}
          </div>

          {checked ? (
            /* Quantity stepper: "−" at 1 removes the item */
            <div
              role="group"
              aria-label={`Quantity of ${item.name}`}
              className="inline-flex items-center gap-1 rounded-full bg-green-100 p-0.5 ring-1 ring-green-600/30"
            >
              <button
                type="button"
                onClick={() => onQuantityChange(quantity - 1)}
                aria-label="Decrease quantity"
                className="flex h-7 w-7 items-center justify-center rounded-full text-green-800 transition hover:bg-green-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
              >
                <Minus className="h-3.5 w-3.5" strokeWidth={3} />
              </button>

              <span
                className="min-w-6 text-center text-sm font-bold tabular-nums text-green-900"
                aria-live="polite"
              >
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => onQuantityChange(quantity + 1)}
                disabled={quantity >= maxQuantity}
                aria-label="Increase quantity"
                className="flex h-7 w-7 items-center justify-center rounded-full text-green-800 transition hover:bg-green-200 active:scale-95 disabled:opacity-40 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={3} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={add}
              disabled={disabled}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold",
                "bg-green-600 text-white shadow shadow-green-600/25 hover:bg-green-700",
                "transition-all duration-200 active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2",
                disabled &&
                  "cursor-not-allowed bg-muted text-muted-foreground shadow-none hover:bg-muted",
              )}
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={3} /> Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
}