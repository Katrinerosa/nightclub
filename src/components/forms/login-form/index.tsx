"use client";
import { useActionState } from "react";
import InputField from "../../ui/input-field";
import loginAction from "./action";
import { useSearchParams } from "next/navigation";
import type { LoginFormState } from "../../../app/lib/types";



export default function LoginForm() {
		const searchParams = useSearchParams();
		const message = searchParams.get("message");
		const initialState: LoginFormState = {
			data: { email: "", password: "" },
			...(message ? { error: { general: { errors: [message] } } } : {}),
		};
	const [formState, formAction, pending] = useActionState<LoginFormState, FormData>(loginAction, initialState);



	return (
		<form action={formAction} noValidate>
			<InputField
				type="email"
				name="email"
				label="Email"
				value={formState.data?.email}
				status={formState.error?.email?.errors}
			/>
			<InputField type="password" name="password" label="Adgangskode" value={formState.data?.password} status={formState.error?.password?.errors} />
			{formState.error?.general && (
				<p role="alert">
					{formState.error.general.errors.map((message, index) => (
						<span key={message + index} className="text-red-500">{message}</span>
					))}
				</p>
			)}
			<button
				type="submit"
				disabled={pending}
				className={`border bg-blue-900 text-white px-4 py-2 rounded-md disabled:cursor-not-allowed cursor-pointer disabled:bg-gray-300 disabled:text-black transition-bg transition-text duration-200`}
			>
				Log ind
			</button>
		</form>
	);
}
