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
import { PROFILE_KEY, useProfile, type SessionUser } from "@/lib/tanstack-funtion";

export type User = SessionUser; // { id: string; name: string }

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

// Set this only if your backend has a real logout endpoint, otherwise leave null
const LOGOUT_URL: string | null = null;

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
  console.log("navbar data",user?.name)

  // Call right after a successful login
  const refreshAuth = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
    router.refresh();
  }, [queryClient, router]);

  const logout = useCallback(async () => {
    if (LOGOUT_URL) {
      try {
        await fetch(LOGOUT_URL, { method: "POST", credentials: "include" });
      } catch {}
    }
    // Clear the cached profile so the navbar updates instantly
    queryClient.setQueryData(PROFILE_KEY, null);
    router.refresh();
  }, [queryClient, router]);

  const value = useMemo(
    () => ({ user, isLoading, refreshAuth, logout }),
    [user, isLoading, refreshAuth, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);