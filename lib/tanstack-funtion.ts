/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/app/connected-backend/api-client/api-client";
import ADMIN_API_URL from "@/app/connected-backend/route/admin/adim-route";
import CUSTOMER_API_URL from "@/app/connected-backend/route/customer/customer-route";
import { useQuery } from "@tanstack/react-query";

export function useProfile() {
  return useQuery<any>({
    queryKey: ["User-list"],
    queryFn: async () => {
    const res = await  apiClient.get(`${CUSTOMER_API_URL.getUserProfile}`);
    console.log("useProfile: Retrieved user data:", res);
      return res.data;

    },
    // Keeps the previous page's rows visible while the next page loads,
    // instead of flashing an empty table.
    placeholderData: (previousData: any) => previousData,
  });
}