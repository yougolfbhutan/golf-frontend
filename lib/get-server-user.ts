import { cookies } from "next/headers";
import type { User } from "@/app/context/auth-context";

export async function getServerUser(): Promise<User | null> {
  const store = await cookies(); // on Next 14, remove the `await`
  const token = store.get("access_token")?.value;
console.log("cookies seen:", store.getAll().map(c => c.name));
  if (!token) return null;

  try {
    // Decodes only. It does NOT verify the signature.
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf8")
    );

    // Expired? Treat as logged out.
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;

    return {
      id: payload.sub ?? payload.id,
      name: payload.name,
      email: payload.email,
      roles: payload.roles ?? [],
      permissions: payload.permissions ?? [],
    };
  } catch {
    return null;
  }
}