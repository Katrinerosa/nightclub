import Link from "next/link";
import { getCurrentUser } from "../lib/dal/auth";
import BookingForm from "./BookingForm";

export default async function BookTablePage() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <section className="relative grid h-48 place-items-center overflow-hidden bg-[url('/footerbg.jpg')] bg-cover bg-center text-center lg:h-56">
        <div className="absolute inset-0 bg-black/85" />
        <div className="relative">
          <h1 className="text-2xl font-semibold uppercase tracking-wider">Book Table</h1>
          <img src="/bottom_line2.png" alt="" className="mx-auto mt-3" />
        </div>
      </section>

      <section id="table-plan" className="scroll-mt-24 bg-[linear-gradient(rgb(0_0_0/45%),rgb(0_0_0/45%)),url('/book-table/background-pattern.jpg')] bg-repeat">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
          {user ? (
            <BookingForm user={user} />
          ) : (
            <div className="mx-auto max-w-xl border border-white/15 bg-white/[0.04] p-8 text-center">
              <h2 className="text-2xl font-semibold uppercase">Log in to book</h2>
              <p className="mt-4 text-white/65">A reservation is connected to your NightClub account, so you need to log in before choosing a table.</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link href={`/login?message=${encodeURIComponent("Log in to reserve a table")}`} className="bg-pink-500 px-6 py-3 font-semibold uppercase transition hover:bg-pink-600">Log in</Link>
                <Link href="/register" className="border border-white/40 px-6 py-3 font-semibold uppercase transition hover:border-pink-500 hover:text-pink-400">Create account</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
