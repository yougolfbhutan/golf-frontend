import { useQuery } from "@tanstack/react-query";
import ADMIN_API_URL from "@/app/connected-backend/route/admin/adim-route";
import apiClient from "@/app/connected-backend/api-client/api-client";
import type { BookingGetResponse } from "../interface";




const approveBooking = async ({ id }: { id: number | string }) => {
  const response = await apiClient.patch(
    `${ADMIN_API_URL.booking}/${id}`,
  );

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};

const cancelBooking = async ({ id }: { id: number | string }) => {
  const response = await apiClient.patch(
    `${ADMIN_API_URL.booking}/${id}`,
  );

  if (response.data?.success === false) {
    throw { data: response.data };
  }
  return response.data;
};
// // Hook for all ItemVariant mutations
// export const useUpdateBookingMutations = (options?: MutationOptions) => {
//   const queryClient = useQueryClient();

//   const updateMutation = useMutation<
//     BookingAndOrderResponse,
//     errorResponse,
//     { id: number | string }
//   >({
//     mutationFn: approveBooking,
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ["booking-list"] });
//       options?.onSuccess?.(data);
//     },
//     onError: (error) => {
//       options?.onError?.(error);
//     },
//   });

//   const cancelMutation = useMutation<
//     BookingAndOrderResponse,
//     errorResponse,
//     { id: number | string }
//   >({
//     mutationFn: cancelBooking,
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ["booking-list"] });
//       options?.onSuccess?.(data);
//     },
//     onError: (error) => {
//       options?.onError?.(error);
//     },
//   });

//   return {
//     approveBooking: updateMutation.mutate,
//     isApproving: updateMutation.isPending,
//     cancelBooking: cancelMutation.mutate,
//     isCanceling: cancelMutation.isPending,
//     isLoading: updateMutation.isPending || cancelMutation.isPending,
//   };
// };
