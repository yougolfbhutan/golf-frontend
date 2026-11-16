import apiClient from "@/api-client/api-client";
import { useQuery } from "@tanstack/react-query";
import CUSTOMER_API_URL from "@/app/connected-backend/route/customer/customer-route";
import type { getTeeTimeResponse, TeeTimeAttributes } from "../interface/interface";

export function useGetTeeTimes(date?: string) {
  return useQuery<TeeTimeAttributes[]>({
    queryKey: ["tee-times", date],
    queryFn: async () => {
      const res = await apiClient.get<getTeeTimeResponse>(CUSTOMER_API_URL.teeTime, {
        params: { date },
      });
      const list = res.data?.data;
      if (!Array.isArray(list)) throw new Error("Unexpected tee time response");
      return list;
    },
    enabled: !!date,     // only fetch once a date is picked
    staleTime: 30 * 1000, // slots change as people book, so keep this short
  });
}