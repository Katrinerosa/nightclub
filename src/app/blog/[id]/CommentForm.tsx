"use client";

import { useActionState, useEffect, useRef } from "react";
import { createComment, type CommentState } from "./comment-action";

const initialState: CommentState = { success: false };

export default function CommentForm({
  blogpostId,
  parentCommentId,
}: {
  blogpostId: number;
  parentCommentId?: number;
}) {
  const [state, formAction, pending] = useActionState(createComment, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} noValidate className="mt-10 grid gap-4 border-t border-white/20 pt-8">
      <input type="hidden" name="blogpostId" value={blogpostId} />
      {parentCommentId && <input type="hidden" name="parentCommentId" value={parentCommentId} />}
      <label htmlFor={`comment-content-${parentCommentId ?? "new"}`} className={parentCommentId ? "font-semibold uppercase" : "text-xl font-bold uppercase"}>
        {parentCommentId ? "Reply" : "Add a comment"}
      </label>
      <textarea
        id={`comment-content-${parentCommentId ?? "new"}`}
        name="content"
        rows={5}
        defaultValue={state.value}
        aria-invalid={Boolean(state.errors?.content)}
        aria-describedby={state.errors?.content ? "comment-content-error" : undefined}
        className="w-full resize-y border border-white/30 bg-white/5 p-4 outline-none focus:border-pink-500"
      />
      {state.errors?.content && (
        <p id="comment-content-error" role="alert" className="text-red-400">
          {state.errors.content.join(" ")}
        </p>
      )}
      <button type="submit" disabled={pending} className="w-fit bg-pink-500 px-6 py-3 font-semibold uppercase disabled:opacity-60">
        {pending ? "Posting…" : parentCommentId ? "Post Reply" : "Post Comment"}
      </button>
      {state.message && (
        <p role={state.success ? "status" : "alert"} className={state.success ? "text-green-400" : "text-red-400"}>
          {state.message}
        </p>
      )}
    </form>
  );
}
