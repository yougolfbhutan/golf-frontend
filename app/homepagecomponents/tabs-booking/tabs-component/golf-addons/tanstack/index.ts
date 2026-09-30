/* eslint-disable @typescript-eslint/no-explicit-any */

import apiClient from "@/api-client/api-client";
import CUSTOMER_API_URL from "@/app/connected-backend/route/customer/customer-route";
import { useQuery } from "@tanstack/react-query";
import type { errorResponse } from "@/app/universal-interface/error.interface";
import type { ExtractItemDataResponse } from "../interface";

// import { errorResponse } from "@/app/error-interface";
// // import { CreateResponseAttributes } from "@/app/error-interface/successresponse";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// // import {
// //   AccountTypeGetResponseAttributes,
// //   AccountTypeInputFormValues,
// // } from "../interface";
// // import apiClient from "@/app/connect-backend/api-client";
// // import { ACL_API_URL } from "@/app/connect-backend/api";
// // import { AccountGroupGetResponseAttributes } from "../../account-group/interface";

// interface MutationOptions {
//   onSuccess?: (data: CreateResponseAttributes) => void;
//   onError?: (error: errorResponse) => void;
// }

// // ============= API CALLS =============

// // Create AccountGroup
// const createAccountType = async (data: AccountTypeInputFormValues) => {
//   const response = await apiClient.post(
//     `${ACL_API_URL.accountType}/create`,
//     data,
//   );

//   if (response.data?.success === false) {
//     throw { data: response.data };
//   }
//   return response.data;
// };

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

// // Delete AccountType
// const deleteAccountType = async (id: number | string) => {
//   const response = await apiClient.delete(`${ACL_API_URL.accountType}/${id}`);

//   if (response.data?.success === false) {
//     throw { data: response.data };
//   }
//   return response.data;
// };

// // Get AccountTypes List

// // ============= HOOKS =============

// // Hook for all AccountType mutations
// export const useAccountTypeMutations = (options?: MutationOptions) => {
//   const queryClient = useQueryClient();

//   const createMutation = useMutation<
//     CreateResponseAttributes,
//     errorResponse,
//     AccountTypeInputFormValues
//   >({
//     mutationFn: createAccountType,
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ["AccountType-list"] });
//       options?.onSuccess?.(data);
//     },
//     onError: (error) => {
//       options?.onError?.(error);
//     },
//   });

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

//   return {
//     createAccountType: createMutation.mutate,
//     isCreating: createMutation.isPending,
//     updateAccountType: updateMutation.mutate,
//     isUpdating: updateMutation.isPending,
//     deleteAccountType: deleteMutation.mutate,
//     isDeleting: deleteMutation.isPending,
//     isLoading:
//       createMutation.isPending ||
//       updateMutation.isPending ||
//       deleteMutation.isPending,
//   };
// };
// export const useGetAccountTypes = (
//   account_group_id?: string | null
// ) => {

//   return useQuery<AccountTypeGetResponseAttributes, errorResponse>({
//     queryKey: ["AccountType-list", account_group_id],

//     queryFn: () => getAccountTypes(account_group_id!),

//     // enabled: isValid,

//     staleTime: 5 * 60 * 1000,
//   });
// };

const getAccessories = async () //   account_group_id?: string
: Promise<ExtractItemDataResponse> => {
  const response = await apiClient.get(CUSTOMER_API_URL.getAccessories);

  if (response.data?.success === false) {
    throw { data: response.data };
  }

  return response.data;
};

//

export const useAccessories = () => {
  return useQuery<ExtractItemDataResponse, errorResponse>({
    queryKey: ["Accessories-list"],
    queryFn: () => getAccessories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    // keepPreviousData: true,    // ✅ keep old data while fetching new page
  });
};

// const getAccountGroups =
//   async (): Promise<AccountGroupGetResponseAttributes> => {
//     const response = await apiClient.get(`${ACL_API_URL.accountGroup}`);

//     if (response.data?.success === false) {
//       throw { data: response.data };
//     }

//     return response.data;
//   };
