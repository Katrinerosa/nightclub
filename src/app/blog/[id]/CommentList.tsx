import CommentForm from "./CommentForm";

export type BlogComment = {
  id: number;
  name: string;
  content: string;
  date: string;
  parentId?: number;
};

export default function CommentList({
  comments,
  blogpostId,
  canReply,
}: {
  comments: BlogComment[];
  blogpostId: number;
  canReply: boolean;
}) {
  const rootComments = comments.filter((comment) => !comment.parentId);

  return (
    <section className="mt-12 border-t border-white/20 pt-8">
      <h2 className="mb-6 text-2xl font-bold">Comments ({comments.length})</h2>
      {comments.length === 0 && <p>No comments have been made.</p>}
      <div className="grid gap-8">
        {rootComments.map((comment) => {
          const replies = comments.filter((reply) => reply.parentId === comment.id);
          return (
            <article key={comment.id}>
              <div className="flex gap-4">
                <div aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-500 font-bold">
                  {comment.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold">{comment.name}</h3>
                  <time className="text-sm text-white/50" dateTime={comment.date}>{comment.date.slice(0, 10)}</time>
                  <p className="mt-2 whitespace-pre-line">{comment.content}</p>
                  {canReply && <CommentForm blogpostId={blogpostId} parentCommentId={comment.id} />}
                </div>
              </div>
              {replies.length > 0 && (
                <div className="ml-8 mt-6 grid gap-5 border-l border-pink-500/50 pl-6 sm:ml-16">
                  {replies.map((reply) => (
                    <div key={reply.id}>
                      <h4 className="font-bold">{reply.name}</h4>
                      <time className="text-sm text-white/50" dateTime={reply.date}>{reply.date.slice(0, 10)}</time>
                      <p className="mt-2 whitespace-pre-line">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
