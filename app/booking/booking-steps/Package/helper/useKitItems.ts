import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api-client/api-client";
import CUSTOMER_API_URL from "@/app/connected-backend/route/customer/customer-route";

// ADJUST these imports to wherever your mappers and static items live.
// From your error, mapGolfSets lives in Package/data/index.ts
import { kitItems, mapGolfSets, mapGloves, mapBalls } from "../data";

export const KIT_QUERY_KEY = ["kit-items"] as const;
export const KIT_STALE_TIME = 10 * 60 * 1000; // 10 minutes

// Pull the array out of the response body: res.data.data.data
// (your original hooks returned res.data, then read data?.data.data).
// Array.isArray means a wrong shape gives [] instead of crashing.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toArray = (res: PromiseSettledResult<any>) =>
  res.status === "fulfilled" && Array.isArray(res.value.data?.data?.data)
    ? res.value.data.data.data
    : [];

// Fetch golf sets, gloves and balls in parallel.
// allSettled: if one endpoint fails, the other two still show up.
export async function fetchKitData() {
  const [sets, gloves, balls] = await Promise.allSettled([
    apiClient.get(CUSTOMER_API_URL.golfSet),
    apiClient.get(CUSTOMER_API_URL.glove),
    apiClient.get(CUSTOMER_API_URL.ball),
  ]);

  // temporary: check the real response shape, then delete this line
  // console.log("kit responses", sets, gloves, balls);

  return {
    sets: toArray(sets),
    gloves: toArray(gloves),
    balls: toArray(balls),
    hasError: [sets, gloves, balls].some((r) => r.status === "rejected"),
  };
}

export function useKitItems() {
  const { data, isLoading, isError } = useQuery({
    queryKey: KIT_QUERY_KEY,
    queryFn: fetchKitData,
    staleTime: KIT_STALE_TIME,
  });

  // memoised so downstream useEffects don't re-run on every render
  const items = useMemo(
    () => [
      ...mapGolfSets(data?.sets ?? []),
      ...mapGloves(data?.gloves ?? []),
      ...mapBalls(data?.balls ?? []),
      ...kitItems,
    ],
    [data],
  );

  return {
    items,
    isLoading,
    isError: isError || (data?.hasError ?? false),
  };
}