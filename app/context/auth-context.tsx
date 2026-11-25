"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import apiClient from "@/app/connected-backend/api-client/api-client";
import { PROFILE_KEY, useProfile, type SessionUser } from "@/lib/tanstack-funtion";
import CUSTOMER_API_URL from "../connected-backend/route/customer/customer-route";

export type User = SessionUser; // { id, name, email, ... }

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  refreshAuth: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user = null, isLoading } = useProfile();

  // Call right after a successful login
  const refreshAuth = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
    router.refresh();
  }, [queryClient, router]);

  const logout = useCallback(async () => {
    await queryClient.cancelQueries({ queryKey: PROFILE_KEY });

    try {
      // Backend clears access_token and refresh_token via Set-Cookie
      await apiClient.post(`${CUSTOMER_API_URL.logout}`);
    } catch {
      // continue so the UI still logs out if the request fails
    }

    // Drop all cached data so nothing from the old session lingers
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo(
    () => ({ user, isLoading, refreshAuth, logout }),
    [user, isLoading, refreshAuth, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);