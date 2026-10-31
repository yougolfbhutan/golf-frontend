import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import apiClient from "@/api-client/api-client";
import CUSTOMER_API_URL from "@/app/connected-backend/route/customer/customer-route";
import {
  kitItems,
  mapGolfSets,
  mapGloves,
  mapBalls,
  type KitCategoryId,
} from "../data";

const STALE_TIME = 10 * 60 * 1000; // data stays fresh for 10 minutes
const GC_TIME = 30 * 60 * 1000; // keep cached tabs for 30 minutes

// Throws on failure so React Query retries instead of caching an empty list
async function fetchList(url: string) {
  const res = await apiClient.get(url);
  const list = res.data?.data?.data;
  if (!Array.isArray(list)) throw new Error(`Unexpected response from ${url}`);
  return list;
}

const options = (key: string, url: string, enabled: boolean) => ({
  queryKey: ["kit", key],
  queryFn: () => fetchList(url),
  enabled,
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
  retry: 3,
  retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 8000),
});

/**
 * useKitItems("sets")  -> fetches only that tab (used by PackageStep)
 * useKitItems()        -> loads ALL lists (used by ReviewStep).
 *                         Tabs already opened come from the cache, so only
 *                         missing or stale lists are requested.
 */
export function useKitItems(activeCategory?: KitCategoryId) {
  const all = activeCategory === undefined;

  const [setsQ, glovesQ, ballsQ] = useQueries({
    queries: [
      options("sets", CUSTOMER_API_URL.golfSet, all || activeCategory === "sets"),
      options("gloves", CUSTOMER_API_URL.glove, all || activeCategory === "gloves"),
      options("balls", CUSTOMER_API_URL.ball, all || activeCategory === "balls"),
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

  // which queries decide the loading / error state
  const watched = all
    ? [setsQ, glovesQ, ballsQ]
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