import apiClient from "@/app/connected-backend/api-client/api-client";
import CUSTOMER_API_URL from "@/app/connected-backend/route/customer/customer-route";
import { useQuery } from "@tanstack/react-query";
import type { GolfSetsResponse } from "../interface";

export function useGolfSets() {
  return useQuery<GolfSetsResponse>({
    queryKey: ["golf-list"],
    queryFn: async () => {
    const res = await  apiClient.get(`${CUSTOMER_API_URL.getCarrysetCaddie}`);
      return res.data;
    },
    // Keeps the previous page's rows visible while the next page loads,
    // instead of flashing an empty table.
    placeholderData: (previousData) => previousData,
  });
}
