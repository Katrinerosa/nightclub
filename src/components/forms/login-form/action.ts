"use server";

import { authorizeUser } from "../../../app/lib/dal/token";
import type {
  AuthResponse,
  LoginData,
  LoginFormState,
} from "../../../app/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

const loginSchema = z.object({
	email: z.email("Indtast en gyldig email"),
	password: z.string().min(4, "Din adgangskode skal være større end 3 tegn"),
});

export async function createTokenCookie(response: AuthResponse) {
	if (!response.success) return;
	const cookieStore = await cookies();

	cookieStore.set("FD_AUTH_TOKEN", response.result.accessToken,
		{
			
			httpOnly: true,
			path: "/",
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		}
	);
	cookieStore.set("FD_AUTH_USER", JSON.stringify(response.result.user), {
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
	});
}

export default async function loginAction(_previousState: LoginFormState, formData: FormData) {
	const { email, password } = Object.fromEntries(formData) as LoginData;

	const validated = loginSchema.safeParse({ email, password });

	if (!validated.success) return {
		data: {
			email: email,
			password: password,
		},
		error: z.treeifyError(validated.error).properties,
	};


	const isUserAuthorized = await authorizeUser({ email: validated.data.email, password: validated.data.password });

	if (!isUserAuthorized.success) return {
		data: {
			email: validated.data.email,
			password: validated.data.password,
		},
		error: {
			general: {
				errors: [isUserAuthorized.message]
			}
		}
	}

	await createTokenCookie(isUserAuthorized);
	redirect("/");
}
