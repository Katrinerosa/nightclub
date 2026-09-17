"use client";

import { useActionState } from "react";
import registerAction from "./register-action";

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    { success: false },
  );

  return (
    <form
      action={formAction}
      className="mx-auto grid max-w-md gap-4"
    >
      <label htmlFor="register-name">Navn</label>
      <input
        id="register-name"
        name="name"
        type="text"
        autoComplete="name"
        minLength={2}
        required
        className="border border-white/50 bg-transparent p-3"
      />

      <label htmlFor="register-email">Email</label>
      <input
        id="register-email"
        name="email"
        type="email"
        autoComplete="email"
        required
        className="border border-white/50 bg-transparent p-3"
      />

      <label htmlFor="register-password">Adgangskode</label>
      <input
        id="register-password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
        className="border border-white/50 bg-transparent p-3"
      />

      <button
        type="submit"
        disabled={pending}
        className="bg-pink-500 p-3 font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Opretter…" : "Opret bruger"}
      </button>

      {state.errors && (
        <div role="alert" className="text-red-400">
          {Object.entries(state.errors).map(([field, messages]) => (
            <p key={field}>{messages?.join(" ")}</p>
          ))}
        </div>
      )}

      {state.success && (
        <p role="status">Din bruger er oprettet.</p>
      )}
    </form>
  );
}