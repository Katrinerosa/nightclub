import Image from "next/image";
import Link from "next/link";
import CookieSettingsButton from "./CookieSettingsButton";

type FooterPost = { id: string | number; title: string; content: string; asset?: { url: string } };

export default async function Footer() {
  let posts: FooterPost[] = [];
  let failed = false;
  try {
    const response = await fetch(`${process.env.API_URL ?? "http://localhost:4000"}/blogposts?sort=id&order=desc&limit=2`, { cache: "no-store" });
    if (!response.ok) throw new Error("Posts unavailable");
    posts = await response.json();
  } catch { failed = true; }

  return (
    <footer className="relative isolate overflow-hidden bg-black px-6 pb-8 pt-14 text-white md:pt-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden bg-cover bg-center md:block" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,.88),rgba(0,0,0,.88)),url('/footerbg.jpg')" }} />
      <div className="mx-auto grid max-w-6xl gap-12 text-center md:grid-cols-3 md:text-left">
        <div>
          <Link href="/" aria-label="NightClub home" className="relative mx-auto block h-16 w-48 md:mx-0">
            <Image src="/footer/Logo.png" alt="NightClub — Have a good time" fill sizes="192px" className="object-contain" />
          </Link>
          <section className="mt-7" aria-labelledby="footer-location">
            <h2 id="footer-location" className="text-sm font-semibold uppercase text-pink-500">Location</h2>
            <address className="mt-3 text-sm not-italic leading-7 text-white/80">Kompagnistræde 278<br />1265 København K</address>
          </section>
          <section className="mt-7" aria-labelledby="footer-hours">
            <h2 id="footer-hours" className="text-sm font-semibold uppercase text-pink-500">Opening Hours</h2>
            <p className="mt-3 text-sm uppercase leading-7 text-white/80">Wed – Thu: 10:30 pm to 3 am<br />Sat – Sun: 11 pm to 5 am</p>
          </section>
        </div>
        <section aria-labelledby="footer-posts" className="hidden pt-4 md:block">
          <h2 id="footer-posts" className="text-sm font-semibold uppercase text-pink-500">Recent Posts</h2>
          <div className="mt-8 grid gap-7">
            {posts.map(post => <Link key={post.id} href={`/blog/${post.id}`} className="group grid grid-cols-[80px_1fr] gap-4 rounded-sm focus-visible:outline-2 focus-visible:outline-pink-500">
              {post.asset?.url && <img src={post.asset.url} alt="" width={80} height={80} className="h-20 w-20 object-cover" />}
              <div>
                <h3 className="text-sm font-semibold leading-6 transition group-hover:text-pink-400">{post.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/70">{post.content}</p>
              </div>
            </Link>)}
            {posts.length === 0 && <p className="text-sm text-white/65">{failed ? "Recent posts are unavailable right now." : "No posts yet."}</p>}
          </div>
        </section>
        <section aria-labelledby="footer-tweets" className="hidden pt-4 md:block">
          <h2 id="footer-tweets" className="text-sm font-semibold uppercase text-pink-500">Recent Tweets</h2>
          <p className="mt-8 text-sm leading-6 text-white/65">No updates yet.</p>
        </section>
      </div>
      <div className="mx-auto mt-9 grid max-w-6xl items-end gap-7 text-center text-xs text-white/75 md:mt-24 md:grid-cols-3 md:text-left">
        <div className="order-2 md:order-1">Night Club – All Rights Reserved</div>
        <div className="order-1 md:order-2 md:text-center">
          <p className="mb-5 text-sm font-semibold tracking-wide text-white">Stay Connected With Us</p>
          <div className="flex justify-center gap-5 text-white" aria-label="Social media">
            {[{ name: "Facebook", image: "/footer/facebook.png" }, { name: "Twitter", image: "/footer/twitter.png" }, { name: "Snapchat", image: "/footer/snapchat.png" }].map(social => <span key={social.name} className="block h-10 w-10"><Image src={social.image} alt={social.name} width={40} height={40} className="h-10 w-10" /></span>)}
            <span role="img" aria-label="Instagram" className="grid h-10 w-10 place-items-center border-2 border-white"><svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></svg></span>
          </div>
        </div>
        <div className="order-3 md:text-right">Copyright © 2026 NightClub</div>
      </div>
      <div className="mt-5 text-center text-xs text-white/50"><CookieSettingsButton /></div>
    </footer>
  );
}
