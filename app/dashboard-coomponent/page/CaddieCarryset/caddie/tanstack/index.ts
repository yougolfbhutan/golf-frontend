/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ADMIN_API_URL from "@/app/connected-backend/route/admin/adim-route";
import apiClient from "@/app/connected-backend/api-client/api-client";
import type { errorResponse } from "@/app/universal-interface/error.interface";
import type { CaddieFormAttributes, GetCaddiesResponse } from "../interface";
// import type { GetCaddiesResponse, CaddieFormAttributes } from "../interface";

interface MutationOptions {
  onSuccess?: (data: GetCaddiesResponse) => void;
  onError?: (error: errorResponse) => void;
}

// ============= API CALLS =============

// Create Caddie
const createCaddie = async (data: CaddieFormAttributes) => {
  const response = await apiClient.post(ADMIN_API_URL.createCaddie, data);

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Update Caddie
const updateCaddie = async ({
  id,
  data,
}: {
  id: number | string;
  data: CaddieFormAttributes;
}) => {
  const response = await apiClient.put(
    `${ADMIN_API_URL.updateCaddie}/${id}`,
    data
  );

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Delete Caddie
const deleteCaddie = async (id: number | string) => {
  const response = await apiClient.delete(`${ADMIN_API_URL.deleteCaddie}/${id}`);

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Get Caddies List
const getCaddies = async (): Promise<GetCaddiesResponse> => {
  const response = await apiClient.get(ADMIN_API_URL.getCaddies);

  if (response.data?.success === false) {
    throw { data: response.data };
  }

  return response.data;
};

// ============= HOOKS =============

// Hook for all Caddie mutations
export const useCaddieMutations = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation<
    GetCaddiesResponse,
    errorResponse,
    CaddieFormAttributes
  >({
    mutationFn: createCaddie,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["caddie-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const updateMutation = useMutation<
    GetCaddiesResponse,
    errorResponse,
    { id: number | string; data: CaddieFormAttributes }
  >({
    mutationFn: updateCaddie,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["caddie-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const deleteMutation = useMutation<
    GetCaddiesResponse,
    errorResponse,
    number | string
  >({
    mutationFn: deleteCaddie,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["caddie-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.log(error, "Error last");
      options?.onError?.(error);
    },
  });

  return {
    createCaddie: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateCaddie: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteCaddie: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};


export function useGetCaddies(page: number, limit: number = 10) {
  return useQuery<GetCaddiesResponse>({
    queryKey: ["caddie-list", page, limit],
    queryFn: async () => {
    const res = await  apiClient.get(`${ADMIN_API_URL.getCaddies}?page=${page}&limit=${limit}`);
      return res.data;
    },
    // Keeps the previous page's rows visible while the next page loads,
    // instead of flashing an empty table.
    placeholderData: (previousData) => previousData,
  });
}


export const useGetCaddiesList = () => {
  return useQuery<GetCaddiesResponse, errorResponse>({
    queryKey: ["caddie-list"],
    queryFn: getCaddies,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
