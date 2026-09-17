import "server-only";
import { AuthResponse, LoginData } from "../types";

export async function authorizeUser({
  email,
  password,
}: LoginData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${process.env.API_URL ?? "http://localhost:4000"}/login`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    
    
    switch (response.status) {
			case 400:
            case 401:
				throw new Error("AUTH_FAILED");
			case 500:
				throw new Error("API_ERROR");
			case 200:
				return { success: true, result: await response.json() };
			default:
				throw new Error("UNEXPECTED_ERROR");
		}
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "UNEXPECTED_ERROR";

			switch (message) {
			case "AUTH_FAILED":
				return { success: false, message: "Email eller adgangskode er forkert. Prøv igen." };
			case "API_ERROR":
				return { success: false, message: "Login er midlertidigt utilgængeligt. Prøv igen senere." };
			default:
				return { success: false, message: "Der kunne ikke oprettes forbindelse. Prøv igen senere." };
		}
	}
}
