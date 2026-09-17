import Link from "next/link";
import { cookies } from "next/headers";
import { getCurrentUser } from "../lib/dal/auth";
import { deleteComment } from "./action";

type UserComment = {
  id: number;
  blogpostId: number;
  content: string;
  date: string;
};

export default async function MyCommentsPage() {
  const user = await getCurrentUser();
  const cookieStore = await cookies();
  const token = cookieStore.get("FD_AUTH_TOKEN")?.value;
  let comments: UserComment[] = [];
  let failed = false;

  if (user && token) {
    try {
      const response = await fetch(
        `${process.env.API_URL ?? "http://localhost:4000"}/comments?userId=${encodeURIComponent(user.id)}`,
        { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
      );
      if (response.ok) comments = await response.json();
      else failed = true;
    } catch {
      failed = true;
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <section className="mx-auto max-w-3xl">
        <h1 className="text-center text-4xl font-bold uppercase">My Comments</h1>
        <img src="/bottom_line2.png" alt="" className="mx-auto mb-12 mt-4" />

        {failed ? <p role="alert">Your comments could not be loaded. Please try again shortly.</p> : comments.length === 0 ? (
          <p>You have not written any comments yet.</p>
        ) : (
          <div className="grid gap-5">
            {comments.map((comment) => (
              <article key={comment.id} className="border border-white/20 p-5">
                <p className="text-sm text-white/60">{comment.date.slice(0, 10)}</p>
                <p className="mt-3 whitespace-pre-line">{comment.content}</p>
                <div className="mt-5 flex flex-wrap gap-4">
                  <Link href={`/blog/${comment.blogpostId}`} className="text-pink-500 underline">View blog post</Link>
                  <form action={deleteComment}>
                    <input type="hidden" name="commentId" value={comment.id} />
                    <button type="submit" className="text-red-400 underline">Delete</button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
