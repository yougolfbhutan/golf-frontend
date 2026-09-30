import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BookingAndOrderResponse } from "../interface";
import ADMIN_API_URL from "@/app/connected-backend/route/admin/adim-route";
import apiClient from "@/app/connected-backend/api-client/api-client";
import type { errorResponse } from "@/app/universal-interface/error.interface";

export function useGetBookings(page: number, limit: number = 10) {
  return useQuery<BookingAndOrderResponse>({
    queryKey: ["booking-list", page, limit],
    queryFn: async () => {
      const res = await apiClient.get(
        `${ADMIN_API_URL.getBookings}?page=${page}&limit=${limit}`,
      );
      return res.data;
    },
    // Keeps the previous page's rows visible while the next page loads,
    // instead of flashing an empty table.
    placeholderData: (previousData) => previousData,
  });
}

export function useDashboardGetBookings(page: number, limit: number = 10) {
  return useQuery<BookingAndOrderResponse>({
    queryKey: ["booking-list", page, limit],
    queryFn: async () => {
      const res = await apiClient.get(
        `${ADMIN_API_URL.getBookings}?status=pending&page=${page}&limit=${limit}`,
      );
      return res.data;
    },
    // Keeps the previous page's rows visible while the next page loads,
    // instead of flashing an empty table.
    placeholderData: (previousData) => previousData,
  });
}
/* eslint-disable @typescript-eslint/no-explicit-any */

interface MutationOptions {
  onSuccess?: (data: BookingAndOrderResponse) => void;
  onError?: (error: errorResponse) => void;
}

const approveBooking = async ({ id }: { id: number | string }) => {
  const response = await apiClient.patch(
    `${ADMIN_API_URL.approveBooking}/booking/${id}/approve`,
  );

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

const cancelBooking = async ({ id }: { id: number | string }) => {
  const response = await apiClient.patch(
    `${ADMIN_API_URL.approveBooking}/booking/${id}/cancel`,
  );

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};
// Hook for all ItemVariant mutations
export const useUpdateBookingMutations = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation<
    BookingAndOrderResponse,
    errorResponse,
    { id: number | string }
  >({
    mutationFn: approveBooking,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["booking-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const cancelMutation = useMutation<
    BookingAndOrderResponse,
    errorResponse,
    { id: number | string }
  >({
    mutationFn: cancelBooking,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["booking-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  return {
    approveBooking: updateMutation.mutate,
    isApproving: updateMutation.isPending,
    cancelBooking: cancelMutation.mutate,
    isCanceling: cancelMutation.isPending,
    isLoading: updateMutation.isPending || cancelMutation.isPending,
  };
};
