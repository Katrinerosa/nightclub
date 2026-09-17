"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CurrentUser } from "../lib/dal/auth";
import { createReservation, type BookingState } from "./action";

const tableSizes = [4, 4, 6, 4, 8, 4, 4, 6, 4, 8, 4, 4, 6, 4, 8];
const initialState: BookingState = { success: false };

export default function BookingForm({ user }: { user: CurrentUser }) {
  const [state, formAction, pending] = useActionState(createReservation, initialState);
  const [selectedTable, setSelectedTable] = useState(state.values?.table ?? "");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  const fieldClass = "h-14 w-full border border-white/45 bg-transparent px-4 text-sm text-white outline-none transition placeholder:text-white/70 focus:border-pink-500 [color-scheme:dark]";

  return (
    <form ref={formRef} action={formAction} noValidate>
      <div className="grid grid-cols-2 gap-x-2 gap-y-10 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-5 lg:gap-x-0 lg:gap-y-16">
        {tableSizes.map((seats, index) => {
          const table = index + 1;
          const selected = selectedTable === String(table);
          return <Table key={table} number={table} seats={seats} selected={selected} onSelect={() => setSelectedTable(String(table))} />;
        })}
      </div>

      <section className="mt-14 lg:mt-20">
        <h2 className="mb-8 text-2xl font-bold uppercase lg:text-3xl">Book a table</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="name" label="Your Name" defaultValue={state.values?.name ?? user.name ?? ""} error={state.errors?.name} className={fieldClass} />
          <Field name="email" type="email" label="Your Email" defaultValue={state.values?.email ?? user.email} error={state.errors?.email} className={fieldClass} />
          <div>
            <input name="table" aria-label="Table Number" placeholder="Table Number" value={selectedTable} readOnly className={`${fieldClass} cursor-pointer`} onClick={() => document.getElementById("table-plan")?.scrollIntoView({ behavior: "smooth" })} />
            {state.errors?.table && <ErrorText messages={state.errors.table} />}
          </div>
          <Field name="guests" type="number" label="Number Of Guests" defaultValue={state.values?.guests} error={state.errors?.guests} className={fieldClass} min="1" max="8" />
          <Field name="date" type="date" label="Select Date" defaultValue={state.values?.date} error={state.errors?.date} className={fieldClass} />
          <Field name="phone" type="tel" label="Your Contact Number" defaultValue={state.values?.phone} error={state.errors?.phone} className={fieldClass} />
          <div className="md:col-span-2">
            <textarea name="comment" aria-label="Your Comment" placeholder="Your Comment" defaultValue={state.values?.comment} rows={8} className={`${fieldClass} h-60 resize-y py-4`} />
            {state.errors?.comment && <ErrorText messages={state.errors.comment} />}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button type="submit" disabled={pending || !selectedTable} className="w-28 border-y border-white py-3 text-xs font-semibold uppercase transition hover:border-pink-500 hover:text-pink-500 disabled:cursor-not-allowed disabled:opacity-40">
            {pending ? "Booking…" : "Reserve"}
          </button>
        </div>
        {state.message && <p role={state.success ? "status" : "alert"} className={`mt-5 text-right ${state.success ? "text-green-400" : "text-red-400"}`}>{state.message}</p>}
        {state.success && <div className="mt-3 text-right"><Link href="/my-bookings" className="text-pink-400 underline underline-offset-4">View my bookings</Link></div>}
      </section>
    </form>
  );
}

function Table({ number, seats, selected, onSelect }: { number: number; seats: number; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect} aria-pressed={selected} aria-label={`Table ${number}, ${seats} seats`} className={`group relative mx-auto aspect-[230/150] w-full max-w-[230px] cursor-pointer transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500 ${selected ? "drop-shadow-[0_0_12px_rgba(236,72,153,.9)]" : "hover:brightness-150"}`}>
      <Image src={`/book-table/table-${seats}-seats.png`} alt="" width={230} height={150} sizes="(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 230px" className="h-full w-full object-contain" />
      <span className={`absolute left-1/2 top-1/2 grid h-8 min-w-8 -translate-x-1/2 -translate-y-1/2 place-items-center px-2 text-xl font-semibold transition ${selected ? "bg-pink-500" : "bg-[#171717] group-hover:bg-pink-500"}`}>{number}</span>
    </button>
  );
}

function Field({ name, label, type = "text", defaultValue, error, className, min, max }: { name: string; label: string; type?: string; defaultValue?: string; error?: string[]; className: string; min?: string; max?: string }) {
  return <div><input name={name} type={type} aria-label={label} placeholder={type === "date" ? undefined : label} defaultValue={defaultValue} aria-invalid={Boolean(error)} className={className} min={min} max={max} />{error && <ErrorText messages={error} />}</div>;
}

function ErrorText({ messages }: { messages: string[] }) {
  return <p role="alert" className="mt-1 text-sm text-red-400">{messages.join(" ")}</p>;
}
