/**
 * variant-utils.ts
 * ----------------
 * Small helper functions for working with item variants.
 * No React here – just plain data logic, so it's easy to read and test.
 *
 * Idea:
 *   The backend sends one row per VARIANT
 *     (e.g. "Glove – men – left – M", "Glove – men – right – L" ...)
 *   We group the rows by ITEM, so the user sees ONE "Glove" card,
 *   and picks Hand / Size / Tier with tabs on that card.
 */

import type { ItemSummary, ItemVariant } from "../interface";

/* ------------------------------------------------------------------ */
/* 1. Which fields can become tabs (shown in this order)              */
/* ------------------------------------------------------------------ */

export const OPTION_FIELDS = [
  { key: "tier", label: "Tier" },
  { key: "audience", label: "For" },
  { key: "hand", label: "Hand" },
  { key: "size", label: "Size" },
  { key: "color", label: "Colour" },
  { key: "packQuantity", label: "Pack" },
] as const;

export type OptionKey = (typeof OPTION_FIELDS)[number]["key"];

/** The user's current choice on a card, e.g. { hand: "left", size: "M" } */
export type Selection = Partial<Record<OptionKey, string>>;

/** One card = one item + all its variants */
export type ItemGroup = {
  item: ItemSummary;
  variants: ItemVariant[];
};

/* ------------------------------------------------------------------ */
/* 2. Small helpers                                                    */
/* ------------------------------------------------------------------ */

/** Read an option from a variant as a string (or null if empty). */
export function optionValue(variant: ItemVariant, key: OptionKey): string | null {
  const value = variant[key];
  return value === null || value === undefined ? null : String(value);
}

/** Can the user actually book this variant? */
export function isInStock(variant: ItemVariant): boolean {
  return variant.availability && variant.stockQty > 0;
}

/** First image of a variant (urls are already sorted by the backend). */
export function imageOf(variant: ItemVariant): string | undefined {
  return variant.urls[0]?.url;
}

/** Nice text for a tab, e.g. "left" → "Left-handed", 3 → "Pack of 3" */
export function optionLabel(key: OptionKey, value: string): string {
  if (key === "hand") return value === "left" ? "Left-handed" : "Right-handed";
  if (key === "packQuantity") return value === "1" ? "Single" : `Pack of ${value}`;
  if (key === "size") return value.toUpperCase();
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** All option values of one variant, e.g. { tier: "standard", hand: "left" } */
export function selectionOf(variant: ItemVariant): Selection {
  const selection: Selection = {};
  for (const { key } of OPTION_FIELDS) {
    const value = optionValue(variant, key);
    if (value !== null) selection[key] = value;
  }
  return selection;
}

/* ------------------------------------------------------------------ */
/* 3. Grouping and tabs                                                */
/* ------------------------------------------------------------------ */

/** Turn a flat list of variants into one group per item. */
export function groupByItem(variants: ItemVariant[]): ItemGroup[] {
  const groups = new Map<number, ItemGroup>();

  for (const variant of variants) {
    const existing = groups.get(variant.itemId);
    if (existing) {
      existing.variants.push(variant);
    } else {
      groups.set(variant.itemId, { item: variant.item, variants: [variant] });
    }
  }

  return [...groups.values()];
}

/**
 * Which tabs should a card show?
 * Only options that have 2 or more different values for this item.
 * (If every glove is "medium", there's nothing to choose, so no Size tabs.)
 */
export function getOptionTabs(variants: ItemVariant[]) {
  return OPTION_FIELDS.map(({ key, label }) => {
    // Tier always offers both choices; other options only what the data has
    const values = new Set<string>(key === "tier" ? ["standard", "premium"] : []);
    variants.forEach((v) => {
      const value = optionValue(v, key);
      if (value !== null) values.add(value);
    });
    return { key, label, values: [...values] };
  }).filter((tab) => tab.key === "tier" || tab.values.length > 1);
}
/**
 * Find the variant that best matches what the user wants.
 *
 * `mustMatch` is the tab the user just clicked – the result ALWAYS has
 * that value. Among those, we pick the one that keeps most of the user's
 * other choices, preferring variants that are in stock.
 */
export function findBestVariant(
  variants: ItemVariant[],
  wanted: Selection,
  mustMatch?: OptionKey,
): ItemVariant | undefined {
  const candidates = mustMatch
    ? variants.filter((v) => optionValue(v, mustMatch) === wanted[mustMatch])
    : variants;

  const score = (v: ItemVariant) => {
    let points = isInStock(v) ? 100 : 0; // in-stock first
    for (const { key } of OPTION_FIELDS) {
      if (wanted[key] !== undefined && optionValue(v, key) === wanted[key]) points++;
    }
    return points;
  };

  return [...candidates].sort((a, b) => score(b) - score(a))[0];
}