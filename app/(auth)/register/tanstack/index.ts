import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { SignInAttributes, SignUpResponseAttributes } from "../../interface";
import apiClient from "@/app/connected-backend/api-client/api-client";
import type { errorResponse } from "@/app/universal-interface/error.interface";
import CUSTOMER_API_URL from "@/app/connected-backend/route/customer/customer-route";
import type { RegisterAttributes } from "../../interface";
import type { RegisterResponse } from "../interface";

export interface MutationOptions<TData = unknown, TError = unknown> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

// API call
const registerUser = async (data: RegisterAttributes): Promise<RegisterResponse> => {
    const response = await apiClient.post(CUSTOMER_API_URL.register, data); 
    
  if (response.data?.success === false) {
    throw response.data as errorResponse;
  }
  return response.data;
};

// Hook
export const useRegisterMutation = (options?: MutationOptions<RegisterResponse, errorResponse>) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<RegisterResponse, errorResponse, RegisterAttributes>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["Register-User"] }); // if needed
      options?.onSuccess?.(data);
      console.log(data)
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  return {
    register: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
