// app/src/lib/auth/auth-roles.ts

/** Lowercase role names that belong to the admin dashboard */
export const SYSTEM_ROLES = ["admin", "super admin", "staff", "system"];

/** Accepts any role with a name, whether its id is a number or a string */
type WithRoles =
  | { roles?: ReadonlyArray<{ name: string }> | null }
  | null
  | undefined;

export function getRoleNames(user: WithRoles): string[] {
  return (user?.roles ?? []).map((r) => r.name.trim().toLowerCase());
}

export function isSystemUser(user: WithRoles): boolean {
  return getRoleNames(user).some((name) => SYSTEM_ROLES.includes(name));
}

export function homeFor(user: WithRoles): string {
  console.log("user", user);
  return isSystemUser(user) ? "/dashboard" : "/";
}
