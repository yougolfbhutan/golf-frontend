/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type Role = {
  id: number;
  name: string;
  description: string;
};

type Permission = {
  id: number;
  name: string;
  description: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: Role[];
  permission: Permission[];
};

type DecodedToken = {
  userId: number;
  id: number;
  name: string;
  email: string;
  role: Role[];
  permission: Permission[];
  exp?: number;
  iat?: number;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  refreshAuth: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  refreshAuth: () => {},
  logout: () => {},
});

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (!decoded.exp) return false;
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeAuth = async () => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("accessToken");


    if (!token) {
      setIsLoading(false);
      setUser(null);
      return;
    }

    try {
      // Check if token is expired
      if (isTokenExpired(token)) {
        localStorage.removeItem("accessToken");
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Decode the token to get user data
      const decoded = jwtDecode<DecodedToken>(token);

      // Extract user data from the decoded token
      const userData: User = {
        id: decoded.id || decoded.userId,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role || [],
        permission: decoded.permission || [],
      };

      setUser(userData);
    } catch (error) {
      localStorage.removeItem("accessToken");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // ✅ Listen for storage changes (when token is added/removed in another tab or after login)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      
      if (e.key === "accessToken") {
        // Token was added, removed, or changed
        initializeAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ Listen for custom auth events (for same-tab updates)
  useEffect(() => {
    const handleAuthChange = () => {
      initializeAuth();
    };

    window.addEventListener("auth-changed", handleAuthChange);
    return () => window.removeEventListener("auth-changed", handleAuthChange);
  }, []);

  const refreshAuth = () => {
    setIsLoading(true);
    initializeAuth();
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setUser(null);
    setIsLoading(false);

    // ✅ Dispatch custom event so other tabs/components know
    window.dispatchEvent(new Event("auth-changed"));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, refreshAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};