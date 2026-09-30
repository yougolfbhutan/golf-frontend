import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GetOrderResponse } from "../interface";
import ADMIN_API_URL from "@/app/connected-backend/route/admin/adim-route";
import apiClient from "@/app/connected-backend/api-client/api-client";
import type { errorResponse } from "@/app/universal-interface/error.interface";

export function useGetOrders(page: number, limit: number = 10) {
  return useQuery<GetOrderResponse>({
    queryKey: ["order-list", page, limit],
    queryFn: async () => {
    const res = await  apiClient.get(`${ADMIN_API_URL.getOrders}?page=${page}&limit=${limit}`);
      return res.data;
    },
    // Keeps the previous page's rows visible while the next page loads,
    // instead of flashing an empty table.
    placeholderData: (previousData) => previousData,
  });
}




export function useDashboardGetOrders(page: number, limit: number = 10) {
  return useQuery<GetOrderResponse>({
    queryKey: ["order-list", page, limit],
    queryFn: async () => {
      const res = await apiClient.get(
        `${ADMIN_API_URL.getOrders}?status=pending&page=${page}&limit=${limit}`,
      );
      return res.data;
    },
    // Keeps the previous page's rows visible while the next page loads,
    // instead of flashing an empty table.
    placeholderData: (previousData) => previousData,
  });
}

interface MutationOptions {
  onSuccess?: (data: GetOrderResponse) => void;
  onError?: (error: errorResponse) => void;
}

const approveOrder = async ({ id }: { id: number | string }) => {
  const response = await apiClient.patch(
    `${ADMIN_API_URL.approveBooking}/order/${id}/approve`,
  );

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

const cancelOrder = async ({ id }: { id: number | string }) => {
  const response = await apiClient.patch(
    `${ADMIN_API_URL.approveBooking}/order/${id}/cancel`,
  );

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};
// Hook for all ItemVariant mutations
export const useUpdateOrderMutations = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation<
    GetOrderResponse,
    errorResponse,
    { id: number | string }
  >({
    mutationFn: approveOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["order-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const cancelMutation = useMutation<
    GetOrderResponse,
    errorResponse,
    { id: number | string }
  >({
    mutationFn: cancelOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["order-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  return {
    approveOrder: updateMutation.mutate,
    isApproving: updateMutation.isPending,
    cancelOrder: cancelMutation.mutate,
    isCanceling: cancelMutation.isPending,
    isLoading: updateMutation.isPending || cancelMutation.isPending,
  };
};
