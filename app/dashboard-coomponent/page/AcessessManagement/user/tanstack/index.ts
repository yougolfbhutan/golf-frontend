/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ADMIN_API_URL from "@/app/connected-backend/route/admin/adim-route";
import apiClient from "@/app/connected-backend/api-client/api-client";
import type { errorResponse } from "@/app/universal-interface/error.interface";
import type { GetUsersResponse, UserFormAttributes } from "../interface";
// import type { GetUsersResponse, UserFormAttributes } from "../interface";

interface MutationOptions {
  onSuccess?: (data: GetUsersResponse) => void;
  onError?: (error: errorResponse) => void;
}

// ============= API CALLS =============

// Create User
const createUser = async (data: UserFormAttributes) => {
  const response = await apiClient.post(ADMIN_API_URL.createUser, data);

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Update User
const updateUser = async ({
  id,
  data,
}: {
  id: number | string;
  data: UserFormAttributes;
}) => {
  const response = await apiClient.put(
    `${ADMIN_API_URL.updateUser}/${id}`,
    data
  );

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Delete User
const deleteUser = async (id: number | string) => {
  const response = await apiClient.delete(`${ADMIN_API_URL.deleteUser}/${id}`);

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Get Users List
const getUsers = async (): Promise<GetUsersResponse> => {
  const response = await apiClient.get(ADMIN_API_URL.getUsers);

  if (response.data?.success === false) {
    throw { data: response.data };
  }

  return response.data;
};

// ============= HOOKS =============

// Hook for all User mutations
export const useUserMutations = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation<
    GetUsersResponse,
    errorResponse,
    UserFormAttributes
  >({
    mutationFn: createUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const updateMutation = useMutation<
    GetUsersResponse,
    errorResponse,
    { id: number | string; data: UserFormAttributes }
  >({
    mutationFn: updateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const deleteMutation = useMutation<
    GetUsersResponse,
    errorResponse,
    number | string
  >({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.log(error, "Eroor laso");
      options?.onError?.(error);
    },
  });

  return {
    createUser: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateUser: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteUser: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};

// Hook for getting users
export const useGetUsers = () => {
  return useQuery<GetUsersResponse, errorResponse>({
    queryKey: ["user-list"],
    queryFn: getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
