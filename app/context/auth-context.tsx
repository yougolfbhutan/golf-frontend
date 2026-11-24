"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/app/connected-backend/api-client/api-client";

type Role = { id: number; name: string; description: string };
type Permission = { id: number; name: string; description: string };

export type User = {
  id: string; // UUID from the backend
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
  isLoading: boolean; // always false now: the user is known on first render
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

// Set to your real endpoint, or null if you don't have one yet
const LOGOUT_URL: string | null = null; // e.g. "/customers/logout"

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

  // Re-runs the server layout, which re-reads the cookie.
  // Call this after login. (Note: it won't update `user` by itself
  // unless the provider is re-seeded, see the note below.)
  const refreshAuth = useCallback(async () => {
    router.refresh();
  }, [router]);

  const logout = useCallback(async () => {
    if (LOGOUT_URL) {
      try {
        await apiClient.post(LOGOUT_URL); // backend clears the httpOnly cookies
      } catch {}
    }
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