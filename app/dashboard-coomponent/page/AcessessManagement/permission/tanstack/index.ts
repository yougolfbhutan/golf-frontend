/* eslint-disable @typescript-eslint/no-explicit-any */
// import API_RADDHA_URL from "@/api-folder/api";
// import apiClient from "@/api-folder/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import type { PermissionFormValues, PermissionResponse } from "../interface";
import type { errorResponse } from "@/app/universal-interface/error.interface";
import type { GetPermissionResponse, PermissionFormValues } from "../interface";
// import apiClient from "@/api-client/api-client";
import ADMIN_API_URL from "@/app/connected-backend/route/admin/adim-route";
import apiClient from "@/app/connected-backend/api-client/api-client";
// import {
//   errorResponse,
//   GetPermissionsListResponse,
//   PermissionFormValues,
//   PermissionResponse,
// } from "../interface";

interface MutationOptions {
  onSuccess?: (data: GetPermissionResponse) => void;
  onError?: (error: errorResponse) => void;
}

// ============= API CALLS =============

// Create Permission
const createPermission = async (data: PermissionFormValues) => {
  const response = await apiClient.post(ADMIN_API_URL.createPermission, data);

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Update Permission
const updatePermission = async ({
  id,
  data,
}: {
  id: number | string;
  data: PermissionFormValues;
}) => {
  const response = await apiClient.put(
    `${ADMIN_API_URL.updatePermission}/${id}`,
    data
  );

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Delete Permission
const deletePermission = async (id: number | string) => {
  const response = await apiClient.delete(`${ADMIN_API_URL.deletePermission}/${id}`);

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

// Get Permissions List
const getPermissions = async (): Promise<GetPermissionResponse> => {
  const response = await apiClient.get(ADMIN_API_URL.getPermission);

  if (response.data?.success === false) {
    throw { data: response.data };
  }

  return response.data;
};

// ============= HOOKS =============

// Hook for all Permission mutations
export const usePermissionMutations = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation<
    GetPermissionResponse,
    errorResponse,
    PermissionFormValues
  >({
    mutationFn: createPermission,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["permission-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const updateMutation = useMutation<
    GetPermissionResponse,
    errorResponse,
    { id: number | string; data: PermissionFormValues }
  >({
    mutationFn: updatePermission,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["permission-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  const deleteMutation = useMutation<
    GetPermissionResponse ,
    errorResponse,
    number | string
  >({
    mutationFn: deletePermission,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["permission-list"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.log(error, "Eroor laso");
      options?.onError?.(error);
    },
  });

  return {
    createPermission: createMutation.mutate,
    isCreating: createMutation.isPending,
    updatePermission: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deletePermission: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};

// Hook for getting permissions
export const useGetPermissions = () => {
  return useQuery<GetPermissionResponse, errorResponse>({
    queryKey: ["permission-list"],
    queryFn: getPermissions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
