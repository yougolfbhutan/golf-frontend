/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ADMIN_API_URL from "@/app/connected-backend/route/admin/adim-route";
import apiClient from "@/app/connected-backend/api-client/api-client";
import type { errorResponse } from "@/app/universal-interface/error.interface";
import type { CarrySetAttributes, GetCarrySetsResponse } from "../interface/indec";
// import type { CarrySetAttributes, GetCarrySetsResponse } from "../interface";
// import type { GetCarrySetsResponse, CarrySetAttributes } from "../interface";

interface MutationOptions {
  onSuccess?: (data: GetCarrySetsResponse) => void;
  onError?: (error: errorResponse) => void;
}

// ============= API CALLS =============

// Create CarrySet
const createCarrySet = async (data: CarrySetAttributes) => {
  const response = await apiClient.post(ADMIN_API_URL.createCarrySet, data);

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Update CarrySet
const updateCarrySet = async ({
  id,
  data,
}: {
  id: number | string;
  data: CarrySetAttributes;
}) => {
  const response = await apiClient.put(
    `${ADMIN_API_URL.updateCarrySet}/${id}`,
    data
  );

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Delete CarrySet
const deleteCarrySet = async (id: number | string) => {
  const response = await apiClient.delete(`${ADMIN_API_URL.deleteCarrySet}/${id}`);

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Get CarrySets List
// const getCarrySets = async (): Promise<GetCarrySetsResponse> => {
//   const response = await apiClient.get(ADMIN_API_URL.getCaddies);

//   if (response.data?.success === false) {
//     throw { data: response.data };
//   }

//   return response.data;
// };

// ============= HOOKS =============

// Hook for all CarrySet mutations
export const useCarrySetMutations = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation<
    GetCarrySetsResponse,
    errorResponse,
    CarrySetAttributes
  >({
    mutationFn: createCarrySet,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["carryset-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const updateMutation = useMutation<
    GetCarrySetsResponse,
    errorResponse,
    { id: number | string; data: CarrySetAttributes }
  >({
    mutationFn: updateCarrySet,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["carryset-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const deleteMutation = useMutation<
    GetCarrySetsResponse,
    errorResponse,
    number | string
  >({
    mutationFn: deleteCarrySet,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["carryset-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.log(error, "Error last");
      options?.onError?.(error);
    },
  });

  return {
    createCarrySet: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateCarrySet: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteCarrySet: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};


export function useGetCarrySets(page: number, limit: number = 10) {
  return useQuery<GetCarrySetsResponse>({
    queryKey: ["carryset-list", page, limit],
    queryFn: async () => {
    const res = await  apiClient.get(`${ADMIN_API_URL.getCarrySets}?page=${page}&limit=${limit}`);
      return res.data;
    },
    // Keeps the previous page's rows visible while the next page loads,
    // instead of flashing an empty table.
    placeholderData: (previousData) => previousData,
  });
}

