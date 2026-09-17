"use server";

import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter at least 2 characters."),
  email: z.email("Please enter a valid email address."),
  content: z.string().trim().min(10, "Your message must be at least 10 characters."),
});

export type ContactState = {
  success: boolean;
  message?: string;
  errors?: Partial<Record<"name" | "email" | "content", string[]>>;
  values?: { name: string; email: string; content: string };
};

export async function submitContactMessage(
  _previousState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    content: String(formData.get("content") ?? ""),
  };
  const result = contactSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
      values,
    };
  }

  try {
    const response = await fetch(
      `${process.env.API_URL ?? "http://localhost:4000"}/contact_messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, date: new Date().toISOString() }),
      },
    );

    if (!response.ok) {
      return { success: false, message: "We could not send your message. Please try again.", values };
    }

    return { success: true, message: "Thank you. Your message has been sent." };
  } catch {
    return {
      success: false,
      message: "The service is unavailable right now. Please try again later.",
      values,
    };
  }
}
