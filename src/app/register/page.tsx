import RegisterForm from "../../components/register-form/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="bg-black px-6 py-16 text-white">
      <h1 className="mb-8 text-center text-3xl font-bold">
        Opret bruger
      </h1>

      <RegisterForm />
    </main>
  );
}