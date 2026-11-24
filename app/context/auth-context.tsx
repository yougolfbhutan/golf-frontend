"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

type Role = { id: number; name: string; description: string };
type Permission = { id: number; name: string; description: string };

export type User = {
  id: string; // "sub" from the token
  name: string;
  email: string;
  phone_no?: string;
  country_code?: string;
  is_active?: boolean;
  is_verified?: boolean;
  roles: Role[];
  permissions: Permission[];
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: false,
  refreshAuth: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: User | null;
}) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const router = useRouter();

  // Re-sync when the server layout passes a new user (after router.refresh())
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reads the cookie via our own Next.js route
  const loadUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        cache: "no-store",
        credentials: "include",
      });
      const data = await res.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    }
  }, []);

  // Fallback: if the server gave us nothing, ask the route once on mount
  useEffect(() => {
    if (!initialUser) loadUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Call this right after a successful login
  const refreshAuth = useCallback(async () => {
    await loadUser();
    router.refresh();
  }, [loadUser, router]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    setUser(null);
    router.refresh();
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoading: false, refreshAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);