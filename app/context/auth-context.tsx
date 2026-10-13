"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
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
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

// Profile cache only. Tokens stay in the httpOnly cookies.
const USER_KEY = "authUser";

// Set these to your real endpoints, or null if you don't have them yet
const ME_URL: string | null = null;     // e.g. "/customers/me"
const LOGOUT_URL: string | null = null; // e.g. "/customers/logout"

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  refreshAuth: async () => {},
  logout: async () => {},
});

function readCachedUser(): User | null {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Saves to state and to the cache
  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    try {
      if (u) sessionStorage.setItem(USER_KEY, JSON.stringify(u));
      else sessionStorage.removeItem(USER_KEY);
    } catch {}
  }, []);

  // Asks the backend who is logged in (the browser sends the cookie automatically)
  const refreshAuth = useCallback(async () => {
    if (!ME_URL) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await apiClient.get(ME_URL);
      setUser(res.data?.data ?? null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  // On first load: restore the cached user, then confirm with the backend
  useEffect(() => {
    const cached = readCachedUser();
    if (cached) setUserState(cached);
    refreshAuth();
  }, [refreshAuth]);

  const logout = useCallback(async () => {
    if (LOGOUT_URL) {
      try {
        await apiClient.post(LOGOUT_URL); // backend clears the httpOnly cookies
      } catch {}
    }
    setUser(null);
  }, [setUser]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoading, refreshAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);