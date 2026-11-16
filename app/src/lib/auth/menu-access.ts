// app/src/lib/auth/menu-access.ts
//
// ONE place that decides which role can open which dashboard menu item.
// To change who sees what, edit MENU_ACCESS below. Role names are case-insensitive.

import { hasAnyRole, SYSTEM_ROLES } from "./auth-roles";

type UserLike = Parameters<typeof hasAnyRole>[0];

const ADMINS = ["admin", "super admin"];

/**
 * Key = the menu item name used in `menuContent` (item.tsx).
 * Value = roles that may see and open it.
 * A menu item that is NOT listed here is hidden from everyone (safe default).
 */
export const MENU_ACCESS: Record<string, string[]> = {
  Dashboard: SYSTEM_ROLES, // every dashboard role (admin, super admin, staff, system)

  // Access management: admins only
  User: ADMINS,
  Role: ADMINS,
  Permission: ADMINS,

  // Golf kits: admins only. To let managers in, use e.g. [...ADMINS, "manager"]
  Gloves: ADMINS,
  GolfSet: ADMINS,
  "Golf Balls": ADMINS,
};

export function canAccess(user: UserLike, menuKey: string): boolean {
  const allowed = MENU_ACCESS[menuKey];
  if (!allowed) return false;
  return hasAnyRole(user, allowed);
}