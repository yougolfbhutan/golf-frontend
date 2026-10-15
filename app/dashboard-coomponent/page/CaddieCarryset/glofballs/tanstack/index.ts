/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ADMIN_API_URL from "@/app/connected-backend/route/admin/adim-route";
import apiClient from "@/app/connected-backend/api-client/api-client";
import type { errorResponse } from "@/app/universal-interface/error.interface";
import type { BallsGetResponse, BallsPayloadAttribes } from "../interface";
// import type { BallsGetResponse, BallsPayloadAttribes } from "../interface";

interface MutationOptions {
  onSuccess?: (data: BallsGetResponse) => void;
  onError?: (error: errorResponse) => void;
}

// ============= API CALLS =============

// Create Balls
const createBalls = async (data: BallsPayloadAttribes) => {
  const response = await apiClient.post(ADMIN_API_URL.balls, data);

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Update Balls
const updateBalls = async ({
  id,
  data,
}: {
  id: number | string;
  data: BallsPayloadAttribes;
}) => {
  const response = await apiClient.patch(
    `${ADMIN_API_URL.balls}/${id}`,
    data
  );

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Delete Balls
const deleteBalls = async (id: number | string) => {
  const response = await apiClient.delete(`${ADMIN_API_URL.balls}/${id}`);

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Get Ballss List
const getBalls = async (): Promise<BallsGetResponse> => {
  const response = await apiClient.get(ADMIN_API_URL.balls);

  if (response.data?.success === false) {
    throw { data: response.data };
  }

  return response.data;
};

// ============= HOOKS =============

// Hook for all Balls mutations
export const useBallsMutations = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation<
    BallsGetResponse,
    errorResponse,
    BallsPayloadAttribes
  >({
    mutationFn: createBalls,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["Balls-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const updateMutation = useMutation<
    BallsGetResponse,
    errorResponse,
    { id: number | string; data: BallsPayloadAttribes }
  >({
    mutationFn: updateBalls,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["Balls-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const deleteMutation = useMutation<
    BallsGetResponse,
    errorResponse,
    number | string
  >({
    mutationFn: deleteBalls,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["Balls-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.log(error, "Error last");
      options?.onError?.(error);
    },
  });

  return {
    createBalls: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateBalls: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteBalls: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};


export function useGetBalls(page: number, limit: number = 10) {
  return useQuery<BallsGetResponse>({
    queryKey: ["Balls-list", page, limit],
    queryFn: async () => {
    const res = await  apiClient.get(`${ADMIN_API_URL.balls}?page=${page}&limit=${limit}`);
      return res.data;
    },
    // Keeps the previous page's rows visible while the next page loads,
    // instead of flashing an empty table.
    placeholderData: (previousData) => previousData,
  });
}


export const useGetBallsList = () => {
  return useQuery<BallsGetResponse, errorResponse>({
    queryKey: ["Balls-list"],
    queryFn: getBalls,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
