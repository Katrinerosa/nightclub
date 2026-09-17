"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteBooking(_state: { message: string }, formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) return { message: "Invalid booking." };
  const token = (await cookies()).get("FD_AUTH_TOKEN")?.value;
  if (!token) return { message: "Please log in again." };
  try {
    // The API verifies the token and ownership before deleting.
    const response = await fetch(`${process.env.API_URL ?? "http://localhost:4000"}/reservations/${encodeURIComponent(id)}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return { message: "The booking could not be cancelled. Please try again." };
    revalidatePath("/my-bookings");
    return { message: "Booking cancelled." };
  } catch { return { message: "The booking service is unavailable. Please try again shortly." }; }
}
