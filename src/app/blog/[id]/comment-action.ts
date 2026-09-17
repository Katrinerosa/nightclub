"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "../../lib/dal/auth";

const commentSchema = z.object({
  blogpostId: z.coerce.number().int().positive(),
  parentCommentId: z.number().int().positive().optional(),
  content: z.string().trim().min(2, "Your comment must be at least 2 characters.").max(1000, "Your comment is too long."),
});

export type CommentState = {
  success: boolean;
  message?: string;
  errors?: { content?: string[] };
  value?: string;
};

export async function createComment(
  _previousState: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const value = String(formData.get("content") ?? "");
  const result = commentSchema.safeParse({
    blogpostId: formData.get("blogpostId"),
    parentCommentId: formData.get("parentCommentId")
      ? Number(formData.get("parentCommentId"))
      : undefined,
    content: value,
  });

  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
      value,
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("FD_AUTH_TOKEN")?.value;
  const user = await getCurrentUser();

  if (!token || !user) {
    return { success: false, message: "You must be logged in to comment.", value };
  }

  try {
    const response = await fetch(
      `${process.env.API_URL ?? "http://localhost:4000"}/comments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogpostId: result.data.blogpostId,
          userId: user.id,
          name: user.name ?? user.email,
          content: result.data.content,
          date: new Date().toISOString(),
          ...(result.data.parentCommentId
            ? { parentId: result.data.parentCommentId }
            : {}),
        }),
      },
    );

    if (!response.ok) {
      return { success: false, message: "Your comment could not be saved.", value };
    }

    revalidatePath(`/blog/${result.data.blogpostId}`);
    return { success: true, message: "Your comment has been added." };
  } catch {
    return { success: false, message: "The comment service is unavailable.", value };
  }
}
