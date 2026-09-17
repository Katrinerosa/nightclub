"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "../lib/dal/auth";

const reservationSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name."),
    email: z.email("Enter a valid email address."),
    table: z.coerce.number().int().min(1, "Choose a table.").max(15),
    guests: z.coerce
      .number()
      .int()
      .min(1, "Enter the number of guests.")
      .max(8, "A table can seat up to 8 guests."),
    date: z.iso.date("Choose a valid date."),
    phone: z.string().trim().min(8, "Enter a valid contact number.").max(30),
    comment: z.string().trim().max(500, "Your comment is too long."),
  })
  .superRefine((data, context) => {
    const selectedDate = new Date(`${data.date}T20:00:00`);
    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate < new Date(new Date().setHours(0, 0, 0, 0))
    ) {
      context.addIssue({
        code: "custom",
        path: ["date"],
        message: "Choose today or a future date.",
      });
    }
    const positionInRow = ((data.table - 1) % 5) + 1;
    const capacity = positionInRow === 5 ? 8 : positionInRow === 3 ? 6 : 4;
    if (data.guests > capacity) {
      context.addIssue({
        code: "custom",
        path: ["guests"],
        message: `Table ${data.table} seats a maximum of ${capacity} guests.`,
      });
    }
  });

type ReservationField =
  | "name"
  | "email"
  | "table"
  | "guests"
  | "date"
  | "phone"
  | "comment";

export type BookingState = {
  success: boolean;
  message?: string;
  errors?: Partial<Record<ReservationField, string[]>>;
  values?: Record<ReservationField, string>;
};

export async function createReservation(
  _previousState: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    table: String(formData.get("table") ?? ""),
    guests: String(formData.get("guests") ?? ""),
    date: String(formData.get("date") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    comment: String(formData.get("comment") ?? ""),
  };
  const result = reservationSchema.safeParse(values);
  if (!result.success)
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
      values,
    };

  const cookieStore = await cookies();
  const token = cookieStore.get("FD_AUTH_TOKEN")?.value;
  const user = await getCurrentUser();
  if (!token || !user)
    return {
      success: false,
      message: "You must be logged in to reserve a table.",
      values,
    };

  try {
    const response = await fetch(
      `${process.env.API_URL ?? "http://localhost:4000"}/reservations`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          name: result.data.name,
          email: result.data.email,
          table: String(result.data.table),
          guests: String(result.data.guests),
          date: new Date(`${result.data.date}T20:00:00`).toISOString(),
          phone: result.data.phone,
          comment: result.data.comment,
        }),
      },
    );
    if (response.status === 409) return {
      success: false, message: "This table is already booked for that evening. Choose another table or date.", values,
    };
    if (response.status === 401 || response.status === 403) return {
      success: false, message: "Please log in again before booking.", values,
    };
    if (!response.ok)
      return {
        success: false,
        message: "The reservation could not be saved.",
        values,
      };
    revalidatePath("/my-bookings");
    return {
      success: true,
      message: `Table ${result.data.table} has been reserved.`,
    };
  } catch {
    return {
      success: false,
      message: "The booking service is unavailable. Is the API running?",
      values,
    };
  }
}
