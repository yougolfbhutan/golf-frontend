/**
 * use-equipment-lines.ts
 * ----------------------
 * Single source of truth for equipment rows + equipment total.
 * Used by: Scorecard, ScorecardTotalBar, BookYourRound (Pay total).
 *
 * Place at: booking-helper/use-equipment-lines.ts
 * (Your Scorecard currently imports "use-euipment-lines" - misspelled.
 *  Either name the file that way or fix the import. The Scorecard below
 *  uses the correct spelling.)
 */
import { useGolfAccessories } from "@/app/booking/booking-helper/golf-accesories/tanstack";
import { useGolfSets } from "@/app/booking/booking-helper/golf-sets/tanstack-function";
import { useMemo } from "react";
import { type AddonKey, PRICES } from "../../booking-data";
import type { BookingState } from "../../booking-logic";



const SET_KEY = "clubs" as AddonKey;

export type EquipmentLine = {
  id: string;
  label: string;
  qty: number;
  amount: number; // already multiplied by qty
};

/**
 * Pick the price that matches the player type.
 *
 * Your API currently returns ONE number (`price`). If you add
 * `priceNu` / `priceUsd` to the API, this function picks the right one
 * automatically. Until then it falls back to `price`.
 */
function priceFor(
  item: { price?: unknown; priceNu?: unknown; priceUsd?: unknown },
  who: BookingState["who"],
): number {
  const specific = who === "Bhutanese" ? item.priceNu : item.priceUsd;
  return Number(specific ?? item.price ?? 0) || 0;
}

/** Best-effort display name - adjust to your real field names. */
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

    const qty = state.players;

    // ---- Golf set (pick ONE) ----
    const setId = state.addons.includes(SET_KEY)
      ? (state.variant as Record<string, string | undefined>)[SET_KEY]
      : undefined;
    const set = (golfSets ?? []).find((s) => String(s.id) === setId);

    if (set) {
      const fallback = (
        PRICES[state.who] as unknown as Record<string, Record<string, number>>
      )[SET_KEY]?.[String(set.id)];

      const unit =
        priceFor(set as never, state.who) || Number(fallback ?? 0);

      lines.push({
        id: `set-${set.id}`,
        label: labelOf(set as never),
        qty,
        amount: unit * qty,
      });
    }

    // ---- Accessories (pick MANY, one variant per item) ----
    for (const id of state.accessoryIds ?? []) {
      const v = (accessories ?? []).find((a) => String(a.id) === id);
      if (!v) continue;

      lines.push({
        id: `acc-${v.id}`,
        label: labelOf(v as never),
        qty,
        amount: priceFor(v as never, state.who) * qty,
      });
    }

    const total = lines.reduce((sum, l) => sum + l.amount, 0);
    return { lines, total };
  }, [
    state.who,
    state.players,
    state.addons,
    state.variant,
    state.accessoryIds,
    golfSets,
    accessories,
  ]);
}