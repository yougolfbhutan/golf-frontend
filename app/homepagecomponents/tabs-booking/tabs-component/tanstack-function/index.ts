// import { CreateResponseAttributes } from "@/app/error-interface/successresponse";
import type { errorResponse } from "@/app/universal-interface/error.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ExtractItemDataResponse } from "../golf-addons/interface";
import type { BookingFormValues } from "../../booking-form-values";
import apiClient from "@/api-client/api-client";
interface MutationOptions {
  onSuccess?: (data: ExtractItemDataResponse) => void;
  onError?: (error: errorResponse) => void;
}
// Create AccountGroup
const createBook = async (data: BookingFormValues) => {
  const response = await apiClient.post(
    "http://localhost:4000/customer/booking",
    data,
  );

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// // Update AccountType
// const updateAccountType = async ({
//   id,
//   data,
// }: {
//   id: number | string;
//   data: AccountTypeInputFormValues;
// }) => {
//   const response = await apiClient.put(
//     `${ACL_API_URL.accountType}/${id}`,
//     data,
//   );

//   if (response.data?.success === false) {
//     throw { data: response.data };
//   }
//   return response.data;
// };

// Delete AccountType
// const deleteAccountType = async (id: number | string) => {
//   const response = await apiClient.delete(`${ACL_API_URL.accountType}/${id}`);

//   if (response.data?.success === false) {
//     throw { data: response.data };
//   }
//   return response.data;
// };

// Get AccountTypes List

// ============= HOOKS =============

// Hook for all AccountType mutations
export const useCreatBookingMutations = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation<
    ExtractItemDataResponse,
    errorResponse,
    BookingFormValues
  >({
    mutationFn: createBook,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["Booking-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

//   const updateMutation = useMutation<
//     CreateResponseAttributes,
//     errorResponse,
//     { id: number | string; data: AccountTypeInputFormValues }
//   >({
//     mutationFn: updateAccountType,
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ["AccountType-list"] });
//       options?.onSuccess?.(data);
//     },
//     onError: (error) => {
//       options?.onError?.(error);
//     },
//   });

//   const deleteMutation = useMutation<
//     CreateResponseAttributes,
//     errorResponse,
//     number | string
//   >({
//     mutationFn: deleteAccountType,
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ["AccountType-list"] });
//       options?.onSuccess?.(data);
//     },
//     onError: (error) => {
//       options?.onError?.(error);
//     },
//   });

  return {
    createBook: createMutation.mutate,
    isCreating: createMutation.isPending,
    // updateCreateBook: updateMutation.mutate,
    // isUpdating: updateMutation.isPending,
    // deleteCreateBook: deleteMutation.mutate,
    // isDeleting: deleteMutation.isPending,
    isLoading:
      createMutation.isPending 
    //   ||
    //   updateMutation.isPending ||
    //   deleteMutation.isPending,
  };
};
