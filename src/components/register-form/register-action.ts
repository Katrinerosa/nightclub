"use server";

import z from "zod";
import { redirect } from "next/navigation";
import { createTokenCookie } from "../forms/login-form/action";
import type { AuthResponse } from "../../app/lib/types";

export type RegisterActionState = {
  success: boolean;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    form?: string[];
  };
};

const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
});

export default async function registerAction(
  _prevState: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const { name, email, password } = Object.fromEntries(formData);

  const validated = schema.safeParse({ name, email, password });

  if (!validated.success) {
    const fields = z.treeifyError(validated.error).properties;

    return {
      success: false,
      errors: {
        name: fields?.name?.errors,
        email: fields?.email?.errors,
        password: fields?.password?.errors,
      },
    };
  }

  let authResult: Extract<AuthResponse, { success: true }> ["result"];

  try {
    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validated.data),
    });

    if (!response.ok) {
      const message = await response.text();
      console.error("Registrering fejlede:", response.status, message);

      return {
        success: false,
        errors: {
          form: ["Kunne ikke oprette bruger"],
        },
      };
    }

    authResult = await response.json();
  } catch {
    return {
      success: false,
      errors: {
        form: ["Netværksfejl under oprettelse"],
      },
    };
  }

  await createTokenCookie({ success: true, result: authResult });
  redirect("/");
}
