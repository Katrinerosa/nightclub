import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "../../lib/dal/auth";
import CommentForm from "./CommentForm";
import CommentList, { type BlogComment } from "./CommentList";

type BlogPost = {
  comments?: BlogComment[];
  id: number;
  title: string;
  author: string;
  content: string;
  asset: {
    url: string;
  };
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  const response = await fetch(
    // [id] bruges til at hente og vise det blogindlæg, brugeren har klikket på
    `${process.env.API_URL ?? "http://localhost:4000"}/blogposts/${encodeURIComponent(id)}?embed=comments`,
    { cache: "no-store" },
  ).catch(() => null);

  if (response?.status === 404) {
    notFound();
  }

  if (!response?.ok) {
    return (
      <main className="bg-black px-6 py-16 text-white">
        <p>Blogindlægget kunne ikke hentes. Prøv igen senere.</p>
      </main>
    );
  }

  const post: BlogPost = await response.json();

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">

      
      <article className="mx-auto max-w-4xl">
        <img
          src={post.asset.url}
          alt={post.title}
          className="aspect-video w-full object-cover"
        />

        <h1 className="mt-8 text-3xl font-bold uppercase">
          {post.title}
        </h1>

        <p className="mt-3 text-pink-500">
          Af {post.author}
        </p>

        <p className="mt-2 text-sm text-white/60">{post.comments?.length ?? 0} comments</p>
        <p className="mt-6 whitespace-pre-line leading-relaxed">
          {post.content}
        </p>
        <CommentList comments={post.comments ?? []} blogpostId={post.id} canReply={Boolean(currentUser)} />
        {currentUser ? (
          <CommentForm blogpostId={post.id} />
        ) : (
          <p className="mt-10 border-t border-white/20 pt-8">
            NightClub is for members. <Link href={`/login?message=${encodeURIComponent("Log in to add a comment")}`} className="text-pink-500 underline">Log in to comment.</Link>
          </p>
        )}
      </article>
    </main>
  );
}
