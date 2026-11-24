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

// Set this only if your backend has a real logout endpoint, otherwise leave null
const LOGOUT_URL: string | null = null;

const COOKIE_NAME = "access_token";

// Browser-side decode. Only works if the cookie is NOT HttpOnly
// and is set on the same domain as the site.
function readUserFromCookie(): User | null {
  try {
    if (typeof document === "undefined") return null;

    const match = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${COOKIE_NAME}=`));
    if (!match) return null;

    let token = decodeURIComponent(match.split("=").slice(1).join("="));
    if (token.startsWith("Bearer ")) token = token.slice(7);

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // base64url -> bytes -> UTF-8 (safe for non-ASCII names)
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
    const payload = JSON.parse(new TextDecoder().decode(bytes));

    if (payload.exp && payload.exp * 1000 < Date.now()) return null;

    return {
      id: String(payload.sub ?? payload.id ?? ""),
      name: payload.name ?? payload.email?.split("@")[0] ?? "Guest",
      email: payload.email ?? "",
      is_verified: payload.is_verified,
      is_active: payload.is_active,
      roles: Array.isArray(payload.roles) ? payload.roles : [],
      permissions: Array.isArray(payload.permissions) ? payload.permissions : [],
    };
  } catch {
    return null;
  }
}

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

  // Server value first; if the server saw nothing, try the browser cookie.
  useEffect(() => {
    setUser(initialUser ?? readUserFromCookie());
  }, [initialUser?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Call this right after a successful login
  const refreshAuth = useCallback(async () => {
    setUser(readUserFromCookie());
    router.refresh(); // re-runs the server layout, which re-reads the cookie
  }, [router]);

  const logout = useCallback(async () => {
    if (LOGOUT_URL) {
      try {
        await fetch(LOGOUT_URL, { method: "POST", credentials: "include" });
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