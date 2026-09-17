import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";

export type CurrentUser = { id: string | number; email: string; name?: string };

// The payload supplies only a lookup ID; the API verifies the signed token.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = (await cookies()).get("FD_AUTH_TOKEN")?.value;
  if (!token) return null;
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
    if (!payload.sub) return null;
    const response = await fetch(`${process.env.API_URL ?? "http://localhost:4000"}/users/${encodeURIComponent(payload.sub)}`, {
      headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
    });
    if (!response.ok) return null;
    const user = await response.json();
    return { id: user.id, email: user.email, name: user.name };
  } catch { return null; }
});
