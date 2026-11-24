import { cookies } from "next/headers";
import type { User } from "@/app/context/auth-context";

export async function getServerUser(): Promise<User | null> {
  const store = await cookies();
  const raw = store.get("access_token")?.value;
  console.log("raw token exists:", !!raw, "| length:", raw?.length);
  console.log("raw token start:", raw?.slice(0, 20)); // don't log the whole thing
  if (!raw) return null;

  try {
    // Handle URL-encoding and a possible "Bearer " prefix
    let token = decodeURIComponent(raw);
    if (token.startsWith("Bearer ")) token = token.slice(7);

    const parts = token.split(".");
    console.log("token parts:", parts.length); // should be 3 for a JWT
    if (parts.length !== 3) {
      console.log("Not a JWT, can't decode on the server");
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8"),
    );
    console.log("payload:", payload);

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.log("token expired at", new Date(payload.exp * 1000));
      return null;
    }

    return {
      id: payload.sub ?? payload.id,
      name: payload.name,
      email: payload.email,
      roles: payload.roles ?? [],
      permissions: payload.permissions ?? [],
    };
  } catch (err) {
    console.error("getServerUser decode failed:", err);
    return null;
  }
}