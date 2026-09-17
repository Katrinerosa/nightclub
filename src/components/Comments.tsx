

export type BlogComment = {
  id: number;
  name: string;
  content: string;
  date: string;
};
export default function Comments ({
  comments, }: 
  { comments: BlogComment[];

}) {
    return (
        <section className="mt-12 border-t border-gray700 pt8">
            
         <h2 className="mb-6 text-2xl font-bold">Kommentarer</h2>

      {comments.length === 0 && <p>No comment was made.</p>}

      {comments.map((comment) => (
        <article key={comment.id} className="mb-6 flex gap-4">
          <div
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-500 text-white"
          >
            {comment.name.charAt(0)}
          </div>

          <div>
            <h3 className="font-bold">{comment.name}</h3>
            <p className="text-sm text-gray-400">
              {comment.date.slice(0, 10)}
            </p>
            <p className="mt-2 whitespace-pre-line">{comment.content}</p>
          </div>
        </article>
      ))}
    </section>
    )
}
      