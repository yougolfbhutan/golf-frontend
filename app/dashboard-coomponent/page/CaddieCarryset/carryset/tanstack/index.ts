/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ADMIN_API_URL from "@/app/connected-backend/route/admin/adim-route";
import apiClient from "@/app/connected-backend/api-client/api-client";
import type { errorResponse } from "@/app/universal-interface/error.interface";
import type { GolfSetAttributes, GolfSetGetResponse } from "../interface/indec";


interface MutationOptions {
  onSuccess?: (data: GolfSetGetResponse) => void;
  onError?: (error: errorResponse) => void;
}

// ============= API CALLS =============

// Create Golfset
const createGolfSet = async (data: GolfSetAttributes) => {
  const response = await apiClient.post(ADMIN_API_URL.golfset, data);

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Update Golfset
const updateGolfSet = async ({
  id,
  data,
}: {
  id: number | string;
  data: GolfSetAttributes;
}) => {
  const response = await apiClient.patch(
    `${ADMIN_API_URL.golfset}/${id}`,
    data
  );

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Delete Golfset
const deleteGolfSet = async (id: number | string) => {
  const response = await apiClient.delete(`${ADMIN_API_URL.golfset}/${id}`);

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};
export const useGolfSetMutations = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation<
    GolfSetGetResponse,
    errorResponse,
    GolfSetAttributes
  >({
    mutationFn: createGolfSet,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["Golfset-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const updateMutation = useMutation<
    GolfSetGetResponse,
    errorResponse,
    { id: number | string; data: GolfSetAttributes }
  >({
    mutationFn: updateGolfSet,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["Golfset-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const deleteMutation = useMutation<
    GolfSetGetResponse,
    errorResponse,
    number | string
  >({
    mutationFn: deleteGolfSet,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["Golfset-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.log(error, "Error last");
      options?.onError?.(error);
    },
  });

  return {
    createGolfSet: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateGolfSet: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteGolfSet: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};


export function useGetGolfSet(page: number, limit: number = 10) {
  return useQuery<GolfSetGetResponse>({
    queryKey: ["Golfset-list", page, limit],
    queryFn: async () => {
    const res = await  apiClient.get(`${ADMIN_API_URL.golfset}?page=${page}&limit=${limit}`);
      return res.data;
    },
    // Keeps the previous page's rows visible while the next page loads,
    // instead of flashing an empty table.
    placeholderData: (previousData) => previousData,
  });
}

