"use server";
import { z } from "zod";

export async function subscribeNewsletter(_state: { success: boolean; message: string }, formData: FormData) {
  const email = z.email().safeParse(String(formData.get("email") ?? "").trim().toLowerCase());
  if (!email.success) return { success: false, message: "Please enter a valid email address." };
  try {
    const response = await fetch(`${process.env.API_URL ?? "http://localhost:4000"}/newsletters`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.data }),
    });
    if (!response.ok) return { success: false, message: "We could not subscribe you. Please try again." };
    return { success: true, message: "Thank you! You are now subscribed to our newsletter." };
  } catch { return { success: false, message: "The newsletter service is unavailable. Please try again shortly." }; }
}
