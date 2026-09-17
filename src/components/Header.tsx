import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navigation from "./Navigation";

export default async function Header() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("FD_AUTH_TOKEN");

  async function logout() {
    "use server";

		const cookieStore = await cookies();
		cookieStore.delete("FD_AUTH_TOKEN");
		cookieStore.delete("FD_AUTH_USER");
    redirect("/");
  }

  return (
    <header className="site-header sticky top-0 z-50 border-y border-pink-500 bg-black text-white">
      <Navigation isLoggedIn={isLoggedIn} logoutAction={logout} />
    </header>
  );
}
