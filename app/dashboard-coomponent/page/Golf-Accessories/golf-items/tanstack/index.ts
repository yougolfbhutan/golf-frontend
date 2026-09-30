/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ADMIN_API_URL from "@/app/connected-backend/route/admin/adim-route";
import apiClient from "@/app/connected-backend/api-client/api-client";
import type { errorResponse } from "@/app/universal-interface/error.interface";
import type { GetItemVariantsResponse, ItemVariantUpdateBySkuAttributes } from "../interface";


interface MutationOptions {
  onSuccess?: (data: GetItemVariantsResponse) => void;
  onError?: (error: errorResponse) => void;
}

// ============= API CALLS =============

// Create ItemVariant
const createItemVariant = async (data: ItemVariantUpdateBySkuAttributes) => {
  const response = await apiClient.post(ADMIN_API_URL.createItemVariant, data);

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Update ItemVariant
const updateItemVariant = async ({
  id,
  data,
}: {
  id: number | string;
  data: ItemVariantUpdateBySkuAttributes;
}) => {
  const response = await apiClient.put(
    `${ADMIN_API_URL.updateItemVariant}/${id}`,
    data
  );

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Delete ItemVariant
const deleteItemVariant = async (id: number | string) => {
  const response = await apiClient.delete(`${ADMIN_API_URL.deleteItemVariant}/${id}`);

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Get ItemVariants List
// const getItemVariants = async (): Promise<GetItemVariantsResponse> => {
//   const response = await apiClient.get(ADMIN_API_URL.getItemVariants);

//   if (response.data?.success === false) {
//     throw { data: response.data };
//   }

//   return response.data;
// };

// ============= HOOKS =============

// Hook for all ItemVariant mutations
export const useItemVariantMutations = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation<
    GetItemVariantsResponse,
    errorResponse,
    ItemVariantUpdateBySkuAttributes
  >({
    mutationFn: createItemVariant,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["itemvariant-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const updateMutation = useMutation<
    GetItemVariantsResponse,
    errorResponse,
    { id: number | string; data: ItemVariantUpdateBySkuAttributes }
  >({
    mutationFn: updateItemVariant,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["itemvariant-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const deleteMutation = useMutation<
    GetItemVariantsResponse,
    errorResponse,
    number | string
  >({
    mutationFn: deleteItemVariant,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["itemvariant-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.log(error, "Error last");
      options?.onError?.(error);
    },
  });

  return {
    createItemVariant: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateItemVariant: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteItemVariant: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};


export function useGetItemVariants(page: number, limit: number = 10) {
  return useQuery<GetItemVariantsResponse>({
    queryKey: ["itemvariant-list", page, limit],
    queryFn: async () => {
    const res = await  apiClient.get(`${ADMIN_API_URL.getItemVariants}?page=${page}&limit=${limit}`);
      return res.data;
    },
    // Keeps the previous page's rows visible while the next page loads,
    // instead of flashing an empty table.
    placeholderData: (previousData) => previousData,
  });
}

