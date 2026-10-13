import apiClient from "@/api-client/api-client";
import { useQuery } from "@tanstack/react-query";
import type { getGolfSetResponse } from "../interface/interface";
import CUSTOMER_API_URL from "@/app/connected-backend/route/customer/customer-route";

export function useGetGolfSets() {
  return useQuery<getGolfSetResponse>({
    queryKey: ["golf-set-list"],
    queryFn: async () => {
  
      const res = await apiClient.get(CUSTOMER_API_URL.golfSet);
      console.log("Golf sets fetched:", res.data);
      return res.data;
    },
  });
}
