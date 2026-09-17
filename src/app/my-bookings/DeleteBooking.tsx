"use client";

import { useActionState, useState } from "react";
import { deleteBooking } from "./action";

export default function DeleteBooking({ id }: { id: string | number }) {
  const [confirming, setConfirming] = useState(false);
  const [state, action, pending] = useActionState(deleteBooking, { message: "" });
  return <div className="mt-5">
    {confirming ? <form action={action}>
      <input type="hidden" name="id" value={id} />
      <p className="mb-3 text-sm">Cancel this reservation?</p>
      <button disabled={pending} className="border border-pink-500 px-4 py-2 text-pink-400 disabled:opacity-50">{pending ? "Cancelling…" : "Yes, cancel booking"}</button>
      <button type="button" disabled={pending} onClick={() => setConfirming(false)} className="ml-4 px-3 py-2">Keep booking</button>
    </form> : <button type="button" onClick={() => setConfirming(true)} className="text-pink-400 underline underline-offset-4">Cancel booking</button>}
    {state.message && <p role="status" className="mt-3 text-sm">{state.message}</p>}
  </div>;
}
