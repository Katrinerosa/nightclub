"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContactMessage, type ContactState } from "./action";

const initialState: ContactState = { success: false };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  const fieldClass = "w-full border border-white/30 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-pink-500";

  return (
    <form ref={formRef} action={formAction} noValidate className="grid gap-5">
      <div>
        <label htmlFor="contact-name" className="mb-2 block uppercase">Name</label>
        <input id="contact-name" name="name" type="text" autoComplete="name" defaultValue={state.values?.name} aria-invalid={Boolean(state.errors?.name)} aria-describedby={state.errors?.name ? "contact-name-error" : undefined} className={fieldClass} />
        {state.errors?.name && <p id="contact-name-error" role="alert" className="mt-2 text-sm text-red-400">{state.errors.name.join(" ")}</p>}
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-2 block uppercase">Email</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" defaultValue={state.values?.email} aria-invalid={Boolean(state.errors?.email)} aria-describedby={state.errors?.email ? "contact-email-error" : undefined} className={fieldClass} />
        {state.errors?.email && <p id="contact-email-error" role="alert" className="mt-2 text-sm text-red-400">{state.errors.email.join(" ")}</p>}
      </div>

      <div>
        <label htmlFor="contact-content" className="mb-2 block uppercase">Message</label>
        <textarea id="contact-content" name="content" rows={7} defaultValue={state.values?.content} aria-invalid={Boolean(state.errors?.content)} aria-describedby={state.errors?.content ? "contact-content-error" : undefined} className={`${fieldClass} resize-y`} />
        {state.errors?.content && <p id="contact-content-error" role="alert" className="mt-2 text-sm text-red-400">{state.errors.content.join(" ")}</p>}
      </div>

      <button type="submit" disabled={pending} className="mt-2 bg-pink-500 px-6 py-3 font-semibold uppercase text-white transition hover:bg-pink-600 disabled:cursor-wait disabled:opacity-60">
        {pending ? "Sending…" : "Send Message"}
      </button>

      {state.message && (
        <p role={state.success ? "status" : "alert"} className={state.success ? "text-green-400" : "text-red-400"}>
          {state.message}
        </p>
      )}
    </form>
  );
}
