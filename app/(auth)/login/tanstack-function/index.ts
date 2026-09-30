import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { SignInAttributes, SignUpResponseAttributes } from "../../interface";
import apiClient from "@/app/connected-backend/api-client/api-client";
import type { SignInAttributes, SignUpResponseAttributes } from "../interface";
import type { errorResponse } from "@/app/universal-interface/error.interface";
import CUSTOMER_API_URL from "@/app/connected-backend/route/customer/customer-route";

export interface MutationOptions<TData = unknown, TError = unknown> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

// API call
const loginUser = async (data: SignInAttributes): Promise<SignUpResponseAttributes> => {
    const response = await apiClient.post(CUSTOMER_API_URL.login, data); 
    
  if (response.data?.success === false) {
    throw response.data as errorResponse;
  }
  return response.data;
};

// Hook
export const useLoginMutation = (options?: MutationOptions<SignUpResponseAttributes, errorResponse>) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<SignUpResponseAttributes, errorResponse, SignInAttributes>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["Login-User"] }); // if needed
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
