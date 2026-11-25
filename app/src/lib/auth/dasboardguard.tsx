"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { hasAnyRole } from "./auth-roles";
// import { hasAnyRole } from "@/app/src/lib/auth/auth-roles";

const LOGIN_HREF = "/signin";

type RoleGuardProps = {
  /** Roles allowed in (case-insensitive). Leave empty to allow any logged-in user. */
  allow?: string[];
  /** Where to send a logged-in user who does not have the role. */
  redirectTo?: string;
  children: React.ReactNode;
};

/**
 * Protects a whole route/section. Use it in a layout.tsx.
 * - Not logged in  -> /signin
 * - Wrong role     -> redirectTo (default "/")
 */
export function RoleGuard({
  allow,
  redirectTo = "/",
  children,
}: RoleGuardProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const allowed = !!user && (!allow || allow.length === 0 || hasAnyRole(user, allow));
  useEffect(() => {
    if (isLoading) return;
    if (!user) router.replace(LOGIN_HREF);
    else if (!allowed) router.replace(redirectTo);
  }, [isLoading, user, allowed, redirectTo, router]);

  // Never render protected content until we know the user is allowed
  if (isLoading || !allowed) {
    return <div className="min-h-screen bg-[#0F3D2E]" aria-busy="true" />;
  }

  return <>{children}</>;
}

type RoleGateProps = {
  /** Roles that can see the children. */
  allow: string[];
  /** Optional content for everyone else. */
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Shows or hides part of a page (a link, a button, a section).
 * Does not redirect. Use RoleGuard for whole pages.
 */
export function RoleGate({ allow, fallback = null, children }: RoleGateProps) {
  const { user } = useAuth();
  return <>{hasAnyRole(user, allow) ? children : fallback}</>;
}