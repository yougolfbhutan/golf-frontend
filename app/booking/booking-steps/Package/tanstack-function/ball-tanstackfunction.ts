import apiClient from "@/api-client/api-client";
import { useQuery } from "@tanstack/react-query";
import CUSTOMER_API_URL from "@/app/connected-backend/route/customer/customer-route";
import type { getBallResponse } from "../interface/ball-interface";

export function useGetBalls() {
  return useQuery<getBallResponse>({
    queryKey: ["Ball-list"],
    queryFn: async () => {
  
      const res = await apiClient.get(CUSTOMER_API_URL.ball);
      return res.data;
    },
  });
}
