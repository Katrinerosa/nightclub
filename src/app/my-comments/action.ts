"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "../lib/dal/auth";

export async function deleteComment(formData: FormData) {
  const parsedId = z.coerce.number().int().positive().safeParse(formData.get("commentId"));
  if (!parsedId.success) return;

  const cookieStore = await cookies();
  const token = cookieStore.get("FD_AUTH_TOKEN")?.value;
  const user = await getCurrentUser();
  if (!token || !user) return;

  const apiUrl = process.env.API_URL ?? "http://localhost:4000";
  const existingResponse = await fetch(`${apiUrl}/comments/${parsedId.data}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!existingResponse.ok) return;
  const existingComment: { userId: string | number } = await existingResponse.json();

  if (String(existingComment.userId) !== String(user.id)) return;

  const deleteResponse = await fetch(`${apiUrl}/comments/${parsedId.data}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (deleteResponse.ok) revalidatePath("/my-comments");
}
