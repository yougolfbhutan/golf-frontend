import apiClient from "@/api-client/api-client";
import { useQuery } from "@tanstack/react-query";
import CUSTOMER_API_URL from "@/app/connected-backend/route/customer/customer-route";
import type { getGloveResponse } from "../interface/glove-interface";

export function useGetGloves() {
  return useQuery<getGloveResponse>({
    queryKey: ["glove-list"],
    queryFn: async () => {
  
      const res = await apiClient.get(CUSTOMER_API_URL.glove);
      return res.data;
    },
  });
}
