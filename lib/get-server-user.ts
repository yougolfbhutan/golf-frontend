/* eslint-disable react-hooks/rules-of-hooks */
import { cookies } from "next/headers";
import type { User } from "@/app/context/auth-context";
import { useProfile } from "./tanstack-funtion";

export async function getServerUser(): Promise<User | null> {
  const store = await cookies();
  const raw = store.get("access_token")?.value;
  if (!raw) return null;
  const {data}= useProfile()
  try {
  
    // Handle URL-encoding and a possible "Bearer " prefix
    let token = decodeURIComponent(raw);
    if (token.startsWith("Bearer ")) token = token.slice(7);

    const parts = token.split(".");
    if (parts.length !== 3) return null; // not a JWT

    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8"),
    );

    // Expired? Treat as logged out.
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;

    return {
      id: String(payload.sub ?? payload.id ?? ""),
      name: payload.name ?? payload.email?.split("@")[0] ?? "Guest",
      email: payload.email ?? "",
      is_verified: payload.is_verified,
      phone_no:payload.phone_no,
      // is_active: payload.is_active,
      roles: Array.isArray(payload.roles) ? payload.roles : [],
      permissions: Array.isArray(payload.permissions) ? payload.permissions : [],
    };
  } catch (err) {
    console.error("getServerUser decode failed:", err);
    return null;
  }
}

