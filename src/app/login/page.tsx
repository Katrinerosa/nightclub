import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "../../components/forms/login-form";



export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <h1 className="mb-8 text-center text-3xl font-bold">
        Log In
      </h1>

      <Suspense fallback={<p>Indlæser formular...</p>}>
        <LoginForm />
      </Suspense>

      <p className="mt-6 text-center">
        Har du ikke en konto?{" "}
        <Link href="/register" className="text-pink-500 underline">
          Opret bruger
        </Link>
      </p>
    </main>
  );
}