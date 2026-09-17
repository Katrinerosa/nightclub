"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const [background, setBackground] = useState<string | null>(null);

  useEffect(() => {
    const images = [
      "/bg/header_bg_1.jpg",
      "/bg/header_bg_2.jpg",
    ];

	    const timer = window.setTimeout(() => {
	      const index = Math.floor(Math.random() * images.length);
	      setBackground(images[index]);
	    }, 0);

	    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[calc(100svh-80px)]">
      {background && (
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={background}
          alt=""
        />
      )}

      <div className="relative z-10 flex min-h-[calc(100svh-80px)] flex-col items-center justify-center px-6">
        <img
          src="/hero-logo.png"
          alt="Night Club"
          className="hero-logo w-full max-w-[772px]"
        />

        <div className="hero-tagline mt-3 text-center">
          <p className=" text-center text-base font-normal uppercase tracking-[0.35em] pl-[0.35em] sm:tracking-[1em] sm:pl-[1em] text-white md:text-[32px]">
            Have a good time
          </p>

          <img
            src="/bottom_line.png"
            alt=""
            className="mx-auto mt-3 h-auto w-full max-w-[772px]"
          />
        </div>
      </div>

    </section>
  );
}
