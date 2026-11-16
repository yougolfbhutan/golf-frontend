// app/src/lib/auth/auth-roles.ts

/** Lowercase role names that belong to the admin dashboard */
export const SYSTEM_ROLES = ["Admin", "super admin", "staff", "system"];

/** Accepts any role with a name, whether its id is a number or a string */
type WithRoles =
  | { roles?: ReadonlyArray<{ name: string }> | null }
  | null
  | undefined;

export function getRoleNames(user: WithRoles): string[] {
  return (user?.roles ?? []).map((r) => r.name.trim().toLowerCase());
}

/** True if the user has at least one of the given roles (case-insensitive) */
export function hasAnyRole(user: WithRoles, roles: string[]): boolean {
  const wanted = roles.map((r) => r.trim().toLowerCase());
  return getRoleNames(user).some((name) => wanted.includes(name));
}

export function isSystemUser(user: WithRoles): boolean {
  
  return hasAnyRole(user, SYSTEM_ROLES);
}

/** Where to send a user right after login */
export function homeFor(user: WithRoles): string {
  if (isSystemUser(user)) return "/dashboard";
  // Add more role homes here, e.g.:
  // if (hasAnyRole(user, ["tourism"])) return "/tourism";
  return "/";
}