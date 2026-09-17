import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DeleteBooking from "./DeleteBooking";

type Booking = { id: string | number; table: string; guests: string; date: string };

export default async function MyBookingsPage() {
  const token = (await cookies()).get("FD_AUTH_TOKEN")?.value;
  if (!token) redirect("/login?message=Log+in+to+see+your+bookings");

  let bookings: Booking[] = [];
  let failed = false;
  let expired = false;
  try {
    const response = await fetch(`${process.env.API_URL ?? "http://localhost:4000"}/reservations`, {
      headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
    });
    expired = response.status === 401;
    if (!response.ok) failed = true;
    else bookings = await response.json();
  } catch { failed = true; }
  if (expired) redirect("/login?message=Please+log+in+again");

  return <main className="flex-1 bg-[url('/book-table/background-pattern.jpg')] text-white">
    <div className="bg-[linear-gradient(rgb(0_0_0/85%),rgb(0_0_0/85%)),url('/footerbg.jpg')] bg-cover bg-center py-16 text-center">
      <h1 className="text-2xl font-semibold uppercase tracking-wider">My Bookings</h1>
    </div>
    <section className="mx-auto max-w-6xl px-6 py-16">
      {failed ? <p role="alert">Your bookings could not be loaded. Please try again shortly.</p>
        : bookings.length === 0 ? <p>You have no reservations yet.</p>
        : <ul className="grid gap-6 md:grid-cols-2">
          {[...bookings].sort((a, b) => b.date.localeCompare(a.date)).map(booking => <li key={booking.id} className="border border-white/25 bg-black/50 p-6">
            <h2 className="text-xl font-semibold">Table {booking.table}</h2>
            <p className="mt-3 text-white/75">{new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "Europe/Copenhagen" }).format(new Date(booking.date))} · {booking.guests} guests</p>
            <p className="mt-2 text-sm text-white/60">Reserved for the whole evening</p>
            <DeleteBooking id={booking.id} />
          </li>)}
        </ul>}
      <Link href="/book-table" className="mt-8 inline-block bg-pink-500 px-6 py-3 font-semibold uppercase hover:bg-pink-600">Book a table</Link>
    </section>
  </main>;
}
