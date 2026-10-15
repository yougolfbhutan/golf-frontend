import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import apiClient from "@/app/connected-backend/api-client/api-client";
import type { BookingsResponse, CreateBookingPayload } from "../interface";
import type { errorResponse } from "@/app/universal-interface/error.interface";
import CUSTOMER_API_URL from "@/app/connected-backend/route/customer/customer-route";

export interface MutationOptions<TData = unknown, TError = unknown> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

// API call
const bookingCourse = async (
  data: CreateBookingPayload,
): Promise<BookingsResponse> => {
  try {
    const response = await apiClient.post<BookingsResponse>(
      CUSTOMER_API_URL.bookingCourse,
      data,
    );

    if (response.data?.success === false) {
      throw response.data as unknown as errorResponse;
    }

    return response.data; // { success, message, data: user }
  } catch (err) {
    // Turn axios 4xx/5xx errors into your errorResponse shape
    if (axios.isAxiosError(err)) {
      throw (err.response?.data ?? {
        success: false,
        message: err.message,
      }) as errorResponse;
    }
    throw err;
  }
};

// Hook
export const useBookingMutation = (
  options?: MutationOptions<BookingsResponse, errorResponse>,
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    BookingsResponse,
    errorResponse,
    CreateBookingPayload
  >({
    mutationFn: bookingCourse,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["booking-course"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  return {
    createBooking: mutation.mutateAsync, // was mutation.mutate
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};