/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ADMIN_API_URL from "@/app/connected-backend/route/admin/adim-route";
import apiClient from "@/app/connected-backend/api-client/api-client";
import type { errorResponse } from "@/app/universal-interface/error.interface";
import type {  RoleFormValues, RolesGetResponse } from "../interface";

interface MutationOptions {
  onSuccess?: (data: RolesGetResponse) => void;
  onError?: (error: errorResponse) => void;
}

// ============= API CALLS =============

// Create Role
const createRole = async (data: RoleFormValues) => {
  const response = await apiClient.post(ADMIN_API_URL.roles, data);

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Update Role
const updateRole = async ({
  id,
  data,
}: {
  id: number | string;
  data: RoleFormValues;
}) => {
  const response = await apiClient.put(
    `${ADMIN_API_URL.roles}/${id}`,
    data
  );

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Delete Role
const deleteRole = async (id: number | string) => {
  const response = await apiClient.delete(`${ADMIN_API_URL.roles}/${id}`);

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Get Roles List
const getRoles = async (): Promise<RolesGetResponse> => {
  const response = await apiClient.get(ADMIN_API_URL.roles);

  if (response.data?.success === false) {
    throw { data: response.data };
  }

  return response.data;
};

// ============= HOOKS =============

// Hook for all Role mutations
export const useRoleMutations = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation<
    RolesGetResponse,
    errorResponse,
    RoleFormValues
  >({
    mutationFn: createRole,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["role-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const updateMutation = useMutation<
    RolesGetResponse,
    errorResponse,
    { id: number | string; data: RoleFormValues }
  >({
    mutationFn: updateRole,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["role-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const deleteMutation = useMutation<
    RolesGetResponse,
    errorResponse,
    number | string
  >({
    mutationFn: deleteRole,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["role-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  return {
    createRole: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateRole: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteRole: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};

// Hook for getting roles
export const useGetRoles = () => {
  return useQuery<RolesGetResponse, errorResponse>({
    queryKey: ["role-list"],
    queryFn: getRoles,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
