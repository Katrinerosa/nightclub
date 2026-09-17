"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type NightClubEvent = {
    id: number;
    title: string;
    description: string;
    date: string;
    asset: {
        url: string;
    };
    location: string;
};

type EventsSliderProps = {
    events: NightClubEvent[];
};

export default function EventsSlider({ events }: EventsSliderProps) {
    // Husk hvilket slide der vises.
    const [index, setIndex] = useState(0);

    // Hold pause, når brugeren interagerer med slideren.
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);


    // Del events op i grupper med to i hver.
    const slides: NightClubEvent[][] = [];

    for (let i = 0; i < events.length; i += 2) {
        slides.push(events.slice(i, i + 2));
    }

    const slideCount = slides.length;
    const activeIndex = slideCount > 0 ? index % slideCount : 0;

    useEffect(() => {
        if (hovered || focused || slideCount < 2) return;

        // Skift slide hvert femte sekund.
        const timer = setInterval(() => {
            setIndex((current) => (current + 1) % slideCount);
        }, 5000);

        // Stop den gamle timer, når effekten afsluttes.
        return () => clearInterval(timer);
    }, [hovered, focused, slideCount]);

    if (slideCount === 0) {
        return <p>Der er ingen events at vise lige nu.</p>;
    }

    return (
        <div
            role="region"
            aria-label="Event-slideshow"
            aria-roledescription="carousel"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocusCapture={() => setFocused(true)}
            onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                    setFocused(false);
                }
            }}

        >
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-700 ease-in-out motion-reduce:transition-none"
                    style={{
                        transform: `translateX(-${activeIndex * 100}%)`,
                    }}
                >
                    {slides.map((slide, slideIndex) => (
                        <div
                            key={slide[0].id}
                            role="group"
                            aria-label={`Slide ${slideIndex + 1} af ${slideCount}`}
                            aria-hidden={slideIndex !== activeIndex}
                            inert={slideIndex !== activeIndex}
                            className="grid w-full shrink-0 grid-cols-1 gap-[31.5px] md:grid-cols-2"
                        >
                            {slide.map((event) => (
                                <article key={event.id}>
                                    <div className="event-image group relative overflow-hidden">
                                        <img
                                            src={event.asset.url}
                                            alt={event.title}
                                            className="aspect-[708/497] w-full object-cover"
                                        />

                                        {/* Gør billedet mørkere ved hover. */}
                                        <div className="pointer-events-none absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                        

                                        {/* Viser titel og beskrivelse nederst på billedet. */}
                                        <div className="absolute inset-x-0 bottom-0 bg-black/90 p-4 text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                            <h3 className="mb-2 text-lg font-medium uppercase">
                                                {event.title}
                                            </h3>
                                            

                                            <p className="line-clamp-3 text-sm leading-relaxed">
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-3 bg-pink-500 px-4 py-3 text-sm text-white">
                                        <time dateTime={event.date}>
                                            {new Date(event.date).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "short",
                                                timeZone: "Europe/Copenhagen",
                                            })}
                                        </time>

                                        <span>
                                            {new Date(event.date).toLocaleTimeString("en-US", {
                                                hour: "numeric",
                                                minute: "2-digit",
                                                timeZone: "Europe/Copenhagen",
                                            })}
                                        </span>
                                        <span>{event.location}</span>
                                        <Link href="/book-table" className="ml-auto border border-white px-3 py-1 font-semibold uppercase hover:bg-black/30">Book Now</Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
                {slides.map((slide, slideIndex) => (
                    <button
                        key={slide[0].id}
                        type="button"
                        aria-label={`Vis slide ${slideIndex + 1}`}
                        aria-current={slideIndex === activeIndex ? "true" : undefined}
                        onClick={() => setIndex(slideIndex)}
                        className="flex h-10 w-10 items-center justify-center focus-visible:outline-2 focus-visible:outline-pink-500"
                    >
                        <span
                            className={`h-3 w-3 ${slideIndex === activeIndex ? "bg-pink-500" : "bg-white"
                                }`}
                        />
                    </button>
                ))}


            </div>
        </div>
    );
}
