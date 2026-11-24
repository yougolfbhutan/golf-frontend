/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/app/connected-backend/api-client/api-client";
import CUSTOMER_API_URL from "@/app/connected-backend/route/customer/customer-route";
import { useQuery } from "@tanstack/react-query";
export type SessionRole = { id: string; name: string };
export type SessionPermission = { id: string; name: string };

export type SessionUser = {
  id: string;
  name: string;
  phone_no:string
  email:string
  roles: SessionRole[];
  is_verified:boolean
  permissions: SessionPermission[];
};

export const PROFILE_KEY = ["profile"] as const;

export function useProfile() {
  return useQuery<any, Error, SessionUser | null>({
    queryKey: PROFILE_KEY,
    queryFn: async () => {
      const res = await apiClient.get(CUSTOMER_API_URL.getUserProfile);
      return res.data;
    },
    // Whitelist only what the UI needs. The password hash etc. are dropped here.
    select: (raw) => {
      const p = raw?.data ?? raw;
      if (!p?.id) return null;
      return {
        id: String(p.id),
        email:p.email,
        phone_no:p.phone_no,
        name: p.name ?? p.email?.split("@")[0] ?? "Guest",
        roles: Array.isArray(p.roles)
          ? p.roles.map((r: any) => ({ id: String(r.id), name: r.name }))
          : [],
        permissions: Array.isArray(p.permissions)
          ? p.permissions.map((x: any) => ({ id: String(x.id), name: x.name }))
          : [],
                is_verified:raw.p.is_verified

      };
    },
    retry: false,
    staleTime: 5 * 60_000,
  });
}