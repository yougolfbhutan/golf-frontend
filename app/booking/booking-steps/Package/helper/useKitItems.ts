import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { golfSetsQuery, glovesQuery, ballsQuery } from "./kit-queries";
import {
  kitItems,
  mapGolfSets,
  mapGloves,
  mapBalls,
  type KitCategoryId,
} from "../data";

/**
 * useKitItems("sets")  -> fetches only that list
 * useKitItems()        -> loads all lists (PackageStep, ReviewStep).
 * Lists already loaded anywhere in the app come straight from the cache.
 */
export function useKitItems(activeCategory?: KitCategoryId) {
  const all = activeCategory === undefined;

  const [setsQ, glovesQ, ballsQ] = useQueries({
    queries: [
      { ...golfSetsQuery, enabled: all || activeCategory === "sets" },
      { ...glovesQuery, enabled: all || activeCategory === "gloves" },
      { ...ballsQuery, enabled: all || activeCategory === "balls" },
    ],
  });

  const items = useMemo(
    () => [
      ...mapGolfSets(setsQ.data ?? []),
      ...mapGloves(glovesQ.data ?? []),
      ...mapBalls(ballsQ.data ?? []),
      ...kitItems,
    ],
    [setsQ.data, glovesQ.data, ballsQ.data],
  );

  // which queries decide the loading / error state.
  // Kit cards are built from golf sets, so with "all" we only wait for sets;
  // balls and gloves fill in when they arrive.
  const watched = all
    ? [setsQ]
    : activeCategory === "sets"
      ? [setsQ]
      : activeCategory === "gloves"
        ? [glovesQ]
        : activeCategory === "balls"
          ? [ballsQ]
          : []; // static categories (e.g. caddie) have no API

  return {
    items,
    isLoading: watched.some((q) => q.isLoading),
    isError: watched.some((q) => q.isError),
    refetch: () => {
      watched.forEach((q) => q.refetch());
    },
  };
}