/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ADMIN_API_URL from "@/app/connected-backend/route/admin/adim-route";
import apiClient from "@/app/connected-backend/api-client/api-client";
import type { errorResponse } from "@/app/universal-interface/error.interface";
import type { GlovesGetResponse, GlovesPayloadAttribes } from "../interface";
// import type { GlovesGetResponse, GlovesPayloadAttribes } from "../interface";

interface MutationOptions {
  onSuccess?: (data: GlovesGetResponse) => void;
  onError?: (error: errorResponse) => void;
}

// ============= API CALLS =============

// Create Gloves
const createGloves = async (data: GlovesPayloadAttribes) => {
  const response = await apiClient.post(ADMIN_API_URL.gloves, data);

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Update Gloves
const updateGloves = async ({
  id,
  data,
}: {
  id: number | string;
  data: GlovesPayloadAttribes;
}) => {
  const response = await apiClient.patch(
    `${ADMIN_API_URL.gloves}/${id}`,
    data
  );

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Delete Gloves
const deleteGloves = async (id: number | string) => {
  const response = await apiClient.delete(`${ADMIN_API_URL.gloves}/${id}`);

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Get Glovess List
const getGloves = async (): Promise<GlovesGetResponse> => {
  const response = await apiClient.get(ADMIN_API_URL.gloves);

  if (response.data?.success === false) {
    throw { data: response.data };
  }

  return response.data;
};

// ============= HOOKS =============

// Hook for all Gloves mutations
export const useGlovesMutations = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation<
    GlovesGetResponse,
    errorResponse,
    GlovesPayloadAttribes
  >({
    mutationFn: createGloves,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["Gloves-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const updateMutation = useMutation<
    GlovesGetResponse,
    errorResponse,
    { id: number | string; data: GlovesPayloadAttribes }
  >({
    mutationFn: updateGloves,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["Gloves-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const deleteMutation = useMutation<
    GlovesGetResponse,
    errorResponse,
    number | string
  >({
    mutationFn: deleteGloves,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["Gloves-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.log(error, "Error last");
      options?.onError?.(error);
    },
  });

  return {
    createGloves: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateGloves: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteGloves: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};


export function useGetGloves(page: number, limit: number = 10) {
  return useQuery<GlovesGetResponse>({
    queryKey: ["Gloves-list", page, limit],
    queryFn: async () => {
    const res = await  apiClient.get(`${ADMIN_API_URL.gloves}?page=${page}&limit=${limit}`);
      return res.data;
    },
    // Keeps the previous page's rows visible while the next page loads,
    // instead of flashing an empty table.
    placeholderData: (previousData) => previousData,
  });
}


export const useGetGlovesList = () => {
  return useQuery<GlovesGetResponse, errorResponse>({
    queryKey: ["Gloves-list"],
    queryFn: getGloves,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
