/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ADMIN_API_URL from "@/app/connected-backend/route/admin/adim-route";
import apiClient from "@/app/connected-backend/api-client/api-client";
import type { errorResponse } from "@/app/universal-interface/error.interface";
import type { GetSouvenirsResponse, SouvenirAttributes } from "../interface";

interface MutationOptions {
  onSuccess?: (data: GetSouvenirsResponse) => void;
  onError?: (error: errorResponse) => void;
}

// ============= API CALLS =============

// Create Souvenir
const createSouvenir = async (data: SouvenirAttributes) => {
  const response = await apiClient.post(ADMIN_API_URL.createSouvenir, data);

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Update Souvenir
const updateSouvenir = async ({
  id,
  data,
}: {
  id: number | string;
  data: SouvenirAttributes;
}) => {
  const response = await apiClient.put(
    `${ADMIN_API_URL.updateSouvenir}/${id}`,
    data
  );

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Delete Souvenir
const deleteSouvenir = async (id: number | string) => {
  const response = await apiClient.delete(`${ADMIN_API_URL.deleteSouvenir}/${id}`);

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// // Get Souvenirs List
// const getSouvenirs = async (): Promise<GetSouvenirsResponse> => {
//   const response = await apiClient.get(ADMIN_API_URL.getSouvenirs);

//   if (response.data?.success === false) {
//     throw { data: response.data };
//   }

//   return response.data;
// };

// ============= HOOKS =============

// Hook for all Souvenir mutations
export const useSouvenirMutations = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation<
    GetSouvenirsResponse,
    errorResponse,
    SouvenirAttributes
  >({
    mutationFn: createSouvenir,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["souvenir-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const updateMutation = useMutation<
    GetSouvenirsResponse,
    errorResponse,
    { id: number | string; data: SouvenirAttributes }
  >({
    mutationFn: updateSouvenir,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["souvenir-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const deleteMutation = useMutation<
    GetSouvenirsResponse,
    errorResponse,
    number | string
  >({
    mutationFn: deleteSouvenir,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["souvenir-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.log(error, "Error last");
      options?.onError?.(error);
    },
  });

  return {
    createSouvenir: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateSouvenir: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteSouvenir: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};


export function useGetSouvenirs(page: number, limit: number = 10) {
  return useQuery<GetSouvenirsResponse>({
    queryKey: ["souvenir-list", page, limit],
    queryFn: async () => {
    const res = await  apiClient.get(`${ADMIN_API_URL.getSouvenirs}?page=${page}&limit=${limit}`);
      return res.data;
    },
    // Keeps the previous page's rows visible while the next page loads,
    // instead of flashing an empty table.
    placeholderData: (previousData) => previousData,
  });
}

export function useGetAllSouvenirs() {
  return useQuery<GetSouvenirsResponse>({
    queryKey: ["souvenir-list"],
    queryFn: async () => {
      const res = await apiClient.get(ADMIN_API_URL.getSouvenirs);
      return res.data;
    },
  });
}
