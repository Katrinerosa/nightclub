import Link from "next/link";

type BlogPost = {
  id: number;
  title: string;
  author: string;
  content: string;
  asset: { url: string };
  comments?: { id: number }[];
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const requestedPage = Number((await searchParams).page ?? "1");
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const pageSize = 3;
  let posts: BlogPost[] = [];

  try {
    const response = await fetch(
      `${process.env.API_URL ?? "http://localhost:4000"}/blogposts?embed=comments&sort=id&order=desc`,
      { cache: "no-store" },
    );
    if (!response.ok) throw new Error("API error");
    posts = await response.json();
  } catch {
    return (
      <main className="min-h-screen bg-black p-8 text-white">
        <p role="alert">Blog posts could not be loaded.</p>
      </main>
    );
  }

  const pageCount = Math.max(1, Math.ceil(posts.length / pageSize));
  const visiblePosts = posts.slice((page - 1) * pageSize, page * pageSize);

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-center text-4xl font-bold uppercase">Blog</h1>
        <img src="/bottom_line2.png" alt="" className="mx-auto mb-16 mt-4" />

        {visiblePosts.length === 0 ? (
          <p>No blog posts were found on this page.</p>
        ) : (
          <div className="grid gap-16">
            {visiblePosts.map((post, index) => (
              <article key={post.id} className="grid items-center gap-8 md:grid-cols-2">
                <img
                  src={post.asset.url}
                  alt={post.title}
                  className={`aspect-video w-full object-cover ${index % 2 ? "md:order-2" : ""}`}
                />
                <div>
                  <p className="text-sm uppercase text-pink-500">By {post.author}</p>
                  <p className="mt-2 text-sm text-white/50">{post.comments?.length ?? 0} comments</p>
                  <h2 className="mt-2 text-3xl font-bold uppercase">{post.title}</h2>
                  <p className="mt-5 line-clamp-6 leading-relaxed text-white/75">{post.content}</p>
                  <Link href={`/blog/${post.id}`} className="mt-6 inline-block border border-pink-500 px-5 py-3 uppercase text-pink-500 hover:bg-pink-500 hover:text-white">
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {pageCount > 1 && (
          <nav aria-label="Blog pages" className="mt-16 flex justify-center gap-3">
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
              <Link
                key={number}
                href={`/blog?page=${number}`}
                aria-current={number === page ? "page" : undefined}
                className={`grid h-10 w-10 place-items-center border ${number === page ? "border-pink-500 bg-pink-500" : "border-white/50"}`}
              >
                {number}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </main>
  );
}
