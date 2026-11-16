import apiClient from "@/api-client/api-client";
import CUSTOMER_API_URL from "@/app/connected-backend/route/customer/customer-route";
import type { BallAttributes } from "../interface/ball-interface";
import type { GloveAttributes } from "../interface/glove-interface";
import type { GolfSetAttributes } from "../interface/interface";


const STALE_TIME = 10 * 60 * 1000;
const GC_TIME = 30 * 60 * 1000;

// response shape: { data: { data: [...] }, success, message }
async function fetchList<T>(url: string): Promise<T[]> {
  const res = await apiClient.get(url);
  const list = res.data?.data?.data;
  if (!Array.isArray(list)) throw new Error(`Unexpected response from ${url}`);
  return list as T[];
}

const common = {
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
  retry: 1,
  retryDelay: 1000,
};

export const golfSetsQuery = {
  queryKey: ["kit", "sets"] as const,
  queryFn: () => fetchList<GolfSetAttributes>(CUSTOMER_API_URL.golfSet),
  ...common,
};

export const glovesQuery = {
  queryKey: ["kit", "gloves"] as const,
  queryFn: () => fetchList<GloveAttributes>(CUSTOMER_API_URL.glove),
  ...common,
};

export const ballsQuery = {
  queryKey: ["kit", "balls"] as const,
  queryFn: () => fetchList<BallAttributes>(CUSTOMER_API_URL.ball),
  ...common,
};