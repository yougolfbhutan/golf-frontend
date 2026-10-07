/**
 * use-equipment-lines.ts
 * ----------------------
 * Single source of truth for equipment rows + equipment total.
 * Used by: Scorecard, ScorecardTotalBar, BookYourRound (Pay total).
 *
 * Place at: booking-helper/use-equipment-lines.ts
 * (Your Scorecard imports "use-euipment-lines" - misspelled. Either name the
 *  file that way or fix the import in scorecard.tsx.)
 */
import { useMemo } from "react";

import { useGolfSets } from "./golf-sets/tanstack-function";
import { useGolfAccessories } from "./golf-accesories/tanstack";
import type { BookingState } from "../booking/booking-logic";

export type EquipmentLine = {
  id: string;
  label: string;
  qty: number;
  amount: number; // already multiplied by qty
};

/**
 * Pick the price that matches the player type.
 * Uses `priceNu` for locals and `priceUsd` for visitors when the API sends
 * them, and falls back to the single `price` field.
 */
function priceFor(
  item: { price?: unknown; priceNu?: unknown; priceUsd?: unknown },
  who: BookingState["who"],
): number {
  
  const specific = who === "Bhutanese" ? item.priceNu : item.priceUsd;
  console.log("who:", who);
  console.log("specific:", specific);
  return Number(specific ?? item.price ?? 0) || 0;
}

/** Display name of a golf set or accessory. */
function labelOf(item: Record<string, unknown>): string {
  return String(item.name ?? item.title ?? item.label ?? "Item");
}

export function useEquipmentLines(state: BookingState) {
  const setsQuery = useGolfSets();
  const accQuery = useGolfAccessories();

  const golfSets = setsQuery.data?.data?.golfSets;
  const accessories = accQuery.data?.data.Souvenirs;

  return useMemo(() => {
    const lines: EquipmentLine[] = [];
    if (!state.who) return { lines, total: 0 };

    // ---- Golf sets: one row for EACH chosen set (id → quantity) ----
    const setQuantities = state.setQuantities ?? {};

    for (const [id, qty] of Object.entries(setQuantities)) {
      if (qty < 1) continue;
      const set = (golfSets ?? []).find((s) => String(s.id) === id);
      if (!set) continue;

      lines.push({
        id: `set-${id}`,
        label: labelOf(set as never),
        qty,
        amount: priceFor(set as never, state.who) * qty,
      });
    }

    // ---- Accessories: one row for each chosen variant ----
    const quantities = state.accessoryQuantities ?? {};

    for (const id of state.accessoryIds ?? []) {
      const v = (accessories ?? []).find((a) => String(a.id) === id);
      if (!v) continue;

      const accQty = Math.max(quantities[id] ?? 1, 1);

      lines.push({
        id: `acc-${v.id}`,
        label: labelOf(v as never),
        qty: accQty,
        amount: priceFor(v as never, state.who) * accQty,
      });
    }

    const total = lines.reduce((sum, l) => sum + l.amount, 0);
    return { lines, total };
  }, [
    state.who,
    state.setQuantities,
    state.accessoryIds,
    state.accessoryQuantities,
    golfSets,
    accessories,
  ]);
}
