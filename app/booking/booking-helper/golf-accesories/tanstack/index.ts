import apiClient from "@/app/connected-backend/api-client/api-client";
import CUSTOMER_API_URL from "@/app/connected-backend/route/customer/customer-route";
import { useQuery } from "@tanstack/react-query";
import type { ItemVariantsResponse } from "../interface";

export function useGolfAccessories() {
  return useQuery<ItemVariantsResponse>({
    queryKey: ["golf-accessories-list"],
    queryFn: async () => {
    const res = await  apiClient.get(`${CUSTOMER_API_URL.getAccessories}`);
      return res.data;
    },
    // Keeps the previous page's rows visible while the next page loads,
    // instead of flashing an empty table.
    placeholderData: (previousData) => previousData,
  });
}
