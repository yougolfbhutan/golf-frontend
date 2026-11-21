// use-get-tee-times.ts
import apiClient from "@/api-client/api-client";
import { useQuery } from "@tanstack/react-query";
import CUSTOMER_API_URL from "@/app/connected-backend/route/customer/customer-route";
import type { getTeeTimeResponse, TeeTimeAttributes } from "../interface/interface";

export async function fetchTeeTimes(
  date: string,
  signal?: AbortSignal
): Promise<TeeTimeAttributes[]> {
  const res = await apiClient.get<getTeeTimeResponse>(CUSTOMER_API_URL.teeTime, {
    params: { date },
    signal,
  });

  const list = res.data?.data;
  console.log("fetchTeeTimes", date, list);
  if (!Array.isArray(list)) throw new Error("Unexpected tee time response");
  return list;
}

export function useGetTeeTimes(date?: string) {
  return useQuery<TeeTimeAttributes[]>({
    queryKey: ["tee-times", date],
    queryFn: ({ signal }) => fetchTeeTimes(date!, signal),
    enabled: !!date,
    staleTime: 30 * 1000,
  });
}