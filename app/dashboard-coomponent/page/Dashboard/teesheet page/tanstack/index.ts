/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ADMIN_API_URL from "@/app/connected-backend/route/admin/adim-route";
import apiClient from "@/app/connected-backend/api-client/api-client";
import type { errorResponse } from "@/app/universal-interface/error.interface";
import type { GolfSetGetResponse } from "../../../CaddieCarryset/carryset/interface/indec";
import type { CreateBookingApprovedPayload } from "../interface";
import type { BookingGetResponse } from "../../../Booking/interface";


interface MutationOptions {
  onSuccess?: (data: GolfSetGetResponse) => void;
  onError?: (error: errorResponse) => void;
}

// ============= API CALLS =============

const approveBooking = async ({
  id,
  data,
}: {
  id: number | string;
  data: CreateBookingApprovedPayload;
}) => {
  const response = await apiClient.patch(
    `${ADMIN_API_URL.booking}/${id}`,
    data
  );

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Delete Golfset
const cancelBooking = async (id: number | string) => {
  const response = await apiClient.patch(`${ADMIN_API_URL.booking}/${id}/cancel`);

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};
export const useApproveBookingMutations = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  
  const updateMutation = useMutation<
    GolfSetGetResponse,
    errorResponse,
    { id: number | string; data: CreateBookingApprovedPayload }
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

  const deleteMutation = useMutation<
    GolfSetGetResponse,
    errorResponse,
    number | string
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
    updateBooking: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    cancelBooking: deleteMutation.mutate,
    isCanceling: deleteMutation.isPending,
    isLoading:
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};

export function useGetBookings(page: number, limit: number = 10) {
  return useQuery<BookingGetResponse>({
    queryKey: ["booking-list", page, limit],
    queryFn: async () => {
      const res = await apiClient.get(
        `${ADMIN_API_URL.booking}?page=${page}&limit=${limit}`,
      );
      return res.data;
    },
    // Keeps the previous page's rows visible while the next page loads,
    // instead of flashing an empty table.
    placeholderData: (previousData) => previousData,
  });
}
