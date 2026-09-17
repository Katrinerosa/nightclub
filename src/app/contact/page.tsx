import ContactForm from "./ContactForm";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <section className="mx-auto max-w-3xl">
        <p className="text-center text-sm uppercase tracking-[0.35em] text-pink-500">
          Get in touch
        </p>
        <h1 className="mt-3 text-center text-4xl font-bold uppercase">
          Contact Us
        </h1>
        <img src="/bottom_line2.png" alt="" className="mx-auto mb-12 mt-4" />
        <p className="mx-auto mb-10 max-w-xl text-center text-white/75">
          Questions about events, membership or your next night out? Send us a
          message and we will get back to you.
        </p>
        <ContactForm />
      </section>
    </main>
  );
}
