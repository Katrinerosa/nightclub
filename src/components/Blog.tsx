import BlogSlider from "./BlogSlider";

type BlogPost = {
    id: number;
    title: string;
    author: string;
    content: string;
    asset: {
        url: string;
    };
    comments?: { id: number }[];
};

export default async function Blog() {
    let blogposts: BlogPost[] = [];


    try {
        const response = await fetch(`${process.env.API_URL ?? "http://localhost:4000"}/blogposts?embed=comments&sort=id&order=desc&limit=3`, {
            method: "GET",
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error("Kunne ikke hente blogposts");
        }

       
        blogposts = await response.json();
    } catch {
        return <p role="alert">Blogindlæg kunne ikke indlæses.</p>;
    }

   return (
    <section id="blog" className="event-section scroll-mt-28 pt-28  bg-black bg-cover bg-center bg-no-repeat text-white">
      <div className="mx-auto w-full max-w-[1440px] md:w-3/4">
        <h2 className="text-center text-2xl font-semibold uppercase tracking-wider">
          Recent Blog
        </h2>

                <img
                    src="/bottom_line2.png"
                    alt=""
                    className="mx-auto mt-4 mb-20"
                />

    
        <BlogSlider blogposts={blogposts} />
      </div>
    </section>
  );
}
