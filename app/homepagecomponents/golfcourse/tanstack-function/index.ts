import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { CreateBookingInput, SignUpResponseAttributes } from "../../interface";
import apiClient from "@/app/connected-backend/api-client/api-client";
import type { errorResponse } from "@/app/universal-interface/error.interface";
import CUSTOMER_API_URL from "@/app/connected-backend/route/customer/customer-route";
// ---------- Booking ----------
export interface CreateBookingAttributes {
  partyName: string;
  partyEmail: string;
  partyPhone: string;
  teeTime: string;
  teeOffDate: string;
  golfCourseName?: string;
  carrySetId?: number;
  numberOfPlayers: number;
  totalPrice?: number;
  specialRequest?: string;
}

export interface BookingResponse {
  status: string;
  message: string;
}

export const INITIAL_BOOKING_VALUES: CreateBookingAttributes = {
  partyName: "",
  partyEmail: "",
  partyPhone: "",
  teeTime: "",
  teeOffDate: "",
  golfCourseName: "",
  carrySetId: 0,
  numberOfPlayers: 1,
  totalPrice: 0,
  specialRequest: "",
};

export interface MutationOptions<TData = unknown, TError = unknown> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

// API call
const createBooking = async (data: CreateBookingAttributes): Promise<BookingResponse> => {
    const response = await apiClient.post(CUSTOMER_API_URL.createBooking, data); 
    
  if (response.data?.success === false) {
    throw response.data as errorResponse;
  }
  return response.data;
};

// Hook
export const useCreateBookingMutation = (options?: MutationOptions<BookingResponse, errorResponse>) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<BookingResponse, errorResponse, CreateBookingAttributes>({
    mutationFn: createBooking,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["Create-Booking"] }); // if needed
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  return {
    createBooking: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
