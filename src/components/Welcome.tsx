"use client";

import { useState } from "react";

const offers = [
  { title: "Night Club", image: "/content-img/thumb1.jpg", text: "Enjoy music, dancing and unforgettable nights at NightClub." },
  { title: "Restaurant", image: "/content-img/reastaurant_1.jpg", text: "Start your evening with good food and good company." },
  { title: "Bar", image: "/content-img/thumb2.jpg", text: "Meet your friends at the bar and enjoy a drink before the dance floor." },
];

export default function Welcome() {
  const [selected, setSelected] = useState<number | null>(null);
  return <section className="bg-black px-6 py-16 text-white">
    <div className="mx-auto w-full max-w-[1440px] md:w-3/4">
      <h2 className="pt-12 text-center text-2xl font-semibold uppercase tracking-wider">Welcome to Night<span className="text-pink-500">Club</span></h2>
      <img src="/bottom_line2.png" alt="" className="mx-auto mb-20 mt-4" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {offers.map((offer, index) => <button key={offer.title} type="button" aria-pressed={selected === index} onClick={() => setSelected(selected === index ? null : index)} className={`welcome-card relative isolate cursor-pointer overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-pink-500 ${selected === index ? "is-open" : ""}`}>
          <img src={offer.image} alt={offer.title} className="aspect-[459/573] w-full object-cover" />
          <span className="welcome-shade pointer-events-none absolute inset-0 z-10 bg-black/85" />
          <span className="welcome-border welcome-border-top pointer-events-none absolute inset-x-3 top-3 z-20 h-[calc(50%-0.75rem)] border-x-2 border-t-2 border-pink-500" />
          <span className="welcome-border welcome-border-bottom pointer-events-none absolute inset-x-3 bottom-3 z-20 h-[calc(50%-0.75rem)] border-x-2 border-b-2 border-pink-500" />
          <span className="welcome-copy pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <span className="text-xl font-semibold uppercase text-pink-500">{offer.title}</span>
            <span className="text-sm leading-relaxed">{offer.text}</span>
          </span>
        </button>)}
      </div>
    </div>
  </section>;
}
