"use client";
import { useActionState } from "react";
import { subscribeNewsletter } from "./action";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [state, action, pending] = useActionState(subscribeNewsletter, { success: false, message: "" });
  return <section className={`bg-black px-6 text-white ${compact ? "py-8" : "py-16"}`}>
    <form action={action} noValidate className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-[1fr_auto]">
      <h2 className="text-center text-2xl font-semibold uppercase tracking-wider sm:col-span-2">Want the latest night club news</h2>
      <p className="mb-6 text-center sm:col-span-2">Subscribe to our newsletter and never miss an <span className="text-pink-500">Event</span></p>
      <div>
        <label htmlFor="newsletter-email" className="sr-only">Email</label>
        <input id="newsletter-email" name="email" type="email" autoComplete="email" required placeholder="Your email address" className="h-12 w-full border border-white/50 bg-transparent px-4" />
      </div>
      <button disabled={pending} className="h-12 bg-pink-500 px-6 font-semibold uppercase hover:bg-pink-600 disabled:opacity-50">{pending ? "Subscribing…" : "Subscribe"}</button>
      {state.message && <p role={state.success ? "status" : "alert"} className={`sm:col-span-2 ${state.success ? "text-green-400" : "text-red-400"}`}>{state.message}</p>}
    </form>
  </section>;
}
